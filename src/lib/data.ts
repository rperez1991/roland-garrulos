import { prisma } from "./prisma";
import type { Player, Match } from "@prisma/client";

// ---- Pair helpers ----
export function pairNumber(playerId: number): number {
  return Math.ceil(playerId / 2);
}

export function pairPlayers(pairNum: number): [number, number] {
  return [pairNum * 2 - 1, pairNum * 2];
}

// ---- Player cache ----
let playerCache: Map<number, Player> = new Map();

export async function loadPlayers() {
  const players = await prisma.player.findMany({ where: { active: true } });
  playerCache = new Map(players.map((p) => [p.id, p]));
  return players;
}

export function getPlayer(id: number): Player {
  return playerCache.get(id) ?? { id: 0, name: "?", surname: "", nick: "", group: "", active: true, createdAt: new Date(), updatedAt: new Date() };
}

// ---- Formatting ----
export function fullName(id: number): string {
  if (id === 0) return "—";
  const p = getPlayer(id);
  return p ? `${p.name} ${p.surname}` : "—";
}

export function shortName(id: number): string {
  if (id === 0) return "—";
  const p = getPlayer(id);
  return p ? `${p.name[0]}. ${p.surname}` : "—";
}

export function pairName(ids: number[]): string {
  return ids.map((i) => fullName(i)).join(" / ");
}

export function pairShort(ids: number[]): string {
  return ids.map((i) => shortName(i)).join(" / ");
}

export function fullPairName(pairNum: number): string {
  const [a, b] = pairPlayers(pairNum);
  return `${getPlayer(a).surname} / ${getPlayer(b).surname}`;
}

export function shortPairName(pairNum: number): string {
  const [a, b] = pairPlayers(pairNum);
  return `${shortName(a)} / ${shortName(b)}`;
}

// ---- Parsing ----
function parseSets(sets: string | null): string[][] {
  if (!sets) return [];
  try { return JSON.parse(sets); } catch { return []; }
}

// ---- Match display type ----
export type MatchDisplay = {
  id: number;
  phase: string;
  round: number;
  group: string | null;
  pair1: number[];
  pair2: number[];
  sets: string[][];
  winner: string | null;
  live: boolean;
  completed: boolean;
};

// ---- Match queries ----
export async function getGroupMatches(group: string): Promise<MatchDisplay[]> {
  const matches = await prisma.match.findMany({
    where: { phase: "group", group },
    orderBy: { round: "asc" },
  });
  return matches.map(toDisplay);
}

export async function getFinalMatches(): Promise<MatchDisplay[]> {
  const matches = await prisma.match.findMany({
    where: { phase: "final" },
    orderBy: { round: "asc" },
  });
  return matches.map(toDisplay);
}

export async function getPlayerMatches(playerId: number): Promise<MatchDisplay[]> {
  const matches = await prisma.match.findMany({
    where: {
      OR: [
        { playerA1: playerId }, { playerA2: playerId },
        { playerB1: playerId }, { playerB2: playerId },
      ],
      completed: true,
    },
    orderBy: [{ phase: "asc" }, { round: "asc" }],
  });
  return matches.map((m) => {
    const isA = m.playerA1 === playerId || m.playerA2 === playerId;
    const myPair = isA ? [m.playerA1, m.playerA2] : [m.playerB1, m.playerB2];
    const vsPair = isA ? [m.playerB1, m.playerB2] : [m.playerA1, m.playerA2];
    const won = (isA && m.winner === "A") || (!isA && m.winner === "B");
    return {
      id: m.id,
      phase: m.phase,
      round: m.round,
      group: m.group,
      pair1: myPair,
      pair2: vsPair,
      sets: parseSets(m.sets),
      winner: won ? "W" : "L",
      live: m.live,
      completed: m.completed,
    };
  });
}

function toDisplay(m: Match): MatchDisplay {
  return {
    id: m.id,
    phase: m.phase,
    round: m.round,
    group: m.group,
    pair1: [m.playerA1, m.playerA2],
    pair2: [m.playerB1, m.playerB2],
    sets: parseSets(m.sets),
    winner: m.winner,
    live: m.live,
    completed: m.completed,
  };
}

// ---- Pair Standings (per group) ----
export type PairStanding = {
  pairNum: number;
  pj: number;
  pg: number;
  jf: number;
  jc: number;
  pts: number;
  position: number;
};

export async function getGroupStandings(group: string): Promise<PairStanding[]> {
  const matches = await prisma.match.findMany({
    where: { phase: "group", group, completed: true },
  });

  const map = new Map<number, { pj: number; pg: number; jf: number; jc: number }>();
  for (const m of matches) {
    const pA = pairNumber(m.playerA1); // same as pairNumber(m.playerA2)
    const pB = pairNumber(m.playerB1);
    if (!map.has(pA)) map.set(pA, { pj: 0, pg: 0, jf: 0, jc: 0 });
    if (!map.has(pB)) map.set(pB, { pj: 0, pg: 0, jf: 0, jc: 0 });

    const setsArr = parseSets(m.sets);
    let aGames = 0, bGames = 0;
    for (const set of setsArr) {
      aGames += parseInt(set[0]) || 0;
      bGames += parseInt(set[1]) || 0;
    }

    const sA = map.get(pA)!;
    sA.pj++; sA.jf += aGames; sA.jc += bGames;
    if (m.winner === "A") sA.pg++;

    const sB = map.get(pB)!;
    sB.pj++; sB.jf += bGames; sB.jc += aGames;
    if (m.winner === "B") sB.pg++;
  }

  const standings: PairStanding[] = [];
  for (const [pn, d] of map) {
    standings.push({
      pairNum: pn,
      pj: d.pj,
      pg: d.pg,
      jf: d.jf,
      jc: d.jc,
      pts: d.pj * 10 + d.pg * 20 + (d.jf - d.jc) * 2,
      position: 0,
    });
  }
  standings.sort((a, b) => b.pts - a.pts);
  standings.forEach((s, i) => (s.position = i + 1));
  return standings;
}

// ---- Cross final matches ----
export type FinalMatch = {
  id: number;
  round: number;
  label: string;
  pair1: { num: number; players: number[] };
  pair2: { num: number; players: number[] };
  sets: string[][];
  winner: string | null;
  completed: boolean;
};

export async function getFinals(): Promise<FinalMatch[]> {
  const matches = await prisma.match.findMany({
    where: { phase: "final" },
    orderBy: { round: "asc" },
  });

  const labels = ["🥇 Final", "🥈 3º / 4º puesto", "5º / 6º puesto", "7º / 8º puesto"];
  return matches.map((m) => ({
    id: m.id,
    round: m.round,
    label: labels[m.round - 1] ?? `Puesto ${m.round}`,
    pair1: { num: pairNumber(m.playerA1), players: [m.playerA1, m.playerA2] },
    pair2: { num: pairNumber(m.playerB1), players: [m.playerB1, m.playerB2] },
    sets: parseSets(m.sets),
    winner: m.winner,
    completed: m.completed,
  }));
}

// ---- Stats per pair ----
export type PairStat = {
  pairNum: number;
  wins: number;
  losses: number;
  jf: number;
  jc: number;
};

export async function getPairStats(): Promise<PairStat[]> {
  const matches = await prisma.match.findMany({ where: { completed: true } });
  const map = new Map<number, PairStat>();

  for (const m of matches) {
    const pA = pairNumber(m.playerA1);
    const pB = pairNumber(m.playerB1);
    if (!map.has(pA)) map.set(pA, { pairNum: pA, wins: 0, losses: 0, jf: 0, jc: 0 });
    if (!map.has(pB)) map.set(pB, { pairNum: pB, wins: 0, losses: 0, jf: 0, jc: 0 });

    const setsArr = parseSets(m.sets);
    let ag = 0, bg = 0;
    for (const set of setsArr) { ag += parseInt(set[0]) || 0; bg += parseInt(set[1]) || 0; }

    const sa = map.get(pA)!;
    sa.jf += ag; sa.jc += bg;
    if (m.winner === "A") sa.wins++; else if (m.winner === "B") sa.losses++;

    const sb = map.get(pB)!;
    sb.jf += bg; sb.jc += ag;
    if (m.winner === "B") sb.wins++; else if (m.winner === "A") sb.losses++;
  }

  return Array.from(map.values());
}
