import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

function pairNumber(playerId: number): number {
  return Math.ceil(playerId / 2);
}

export async function POST() {
  const groups = ["A", "B"];

  const standings: Record<string, { pairNum: number; pts: number }[]> = {};

  for (const g of groups) {
    const players = await prisma.player.findMany({ where: { group: g, active: true } });
    const matches = await prisma.match.findMany({
      where: { phase: "group", group: g, completed: true },
    });

    // Compute per-pair standings
    const map = new Map<number, { pj: number; pg: number; jf: number; jc: number }>();
    for (const p of players) {
      const pn = pairNumber(p.id);
      if (!map.has(pn)) map.set(pn, { pj: 0, pg: 0, jf: 0, jc: 0 });
    }

    for (const m of matches) {
      const pA = pairNumber(m.playerA1);
      const pB = pairNumber(m.playerB1);
      const setsArr = m.sets ? JSON.parse(m.sets) : [];
      let ag = 0, bg = 0;
      for (const set of setsArr) { ag += parseInt(set[0]) || 0; bg += parseInt(set[1]) || 0; }

      const sA = map.get(pA)!;
      sA.pj++; sA.jf += ag; sA.jc += bg;
      if (m.winner === "A") sA.pg++;

      const sB = map.get(pB)!;
      sB.pj++; sB.jf += bg; sB.jc += ag;
      if (m.winner === "B") sB.pg++;
    }

    standings[g] = [];
    for (const [pn, d] of map) {
      standings[g].push({
        pairNum: pn,
        pts: d.pj * 10 + d.pg * 20 + (d.jf - d.jc) * 2,
      });
    }
    standings[g].sort((a, b) => b.pts - a.pts);
  }

  // Delete old final matches
  await prisma.match.deleteMany({ where: { phase: "final" } });

  function pairPlayers(pairNum: number): [number, number] {
    return [pairNum * 2 - 1, pairNum * 2];
  }

  // Create 4 cross matches: 1v1, 2v2, 3v3, 4v4
  const pairs: { rank: number; pairA: number; pairB: number }[] = [];
  for (let i = 0; i < 4; i++) {
    const pairA = standings["A"][i].pairNum;
    const pairB = standings["B"][i].pairNum;
    const [a1, a2] = pairPlayers(pairA);
    const [b1, b2] = pairPlayers(pairB);

    await prisma.match.create({
      data: {
        phase: "final",
        round: i + 1,
        playerA1: a1, playerA2: a2,
        playerB1: b1, playerB2: b2,
        completed: false,
      },
    });
    pairs.push({ rank: i + 1, pairA, pairB });
  }

  revalidatePath("/");
  revalidatePath("/cuadro");
  revalidatePath("/admin/cuadro");

  return NextResponse.json({ ok: true, pairs });
}
