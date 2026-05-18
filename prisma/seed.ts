import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSQL({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

const prisma = new PrismaClient({ adapter });

// 8 parejas fijas, 16 jugadores. Grupo A (parejas 1-4), Grupo B (parejas 5-8)
const PLAYERS = [
  // Grupo A
  { id: 1,  name: "Pepe",   surname: "Saca-Planos",  nick: "El Misilero",    group: "A", pair: 1 },
  { id: 2,  name: "Lola",   surname: "Vidal",        nick: "La Smasher",     group: "A", pair: 1 },
  { id: 3,  name: "Berto",  surname: "Ribera",       nick: "Bandeja",        group: "A", pair: 2 },
  { id: 4,  name: "Marta",  surname: "Vega",         nick: "La Víbora",      group: "A", pair: 2 },
  { id: 5,  name: "Quique", surname: "Cristal",      nick: "El Pegapelo",    group: "A", pair: 3 },
  { id: 6,  name: "Sara",   surname: "Globera",      nick: "Stratosfera",    group: "A", pair: 3 },
  { id: 7,  name: "Iván",   surname: "Ruiz",         nick: "Lobito",         group: "A", pair: 4 },
  { id: 8,  name: "Manu",   surname: "Chiquita",     nick: "El Bote",        group: "A", pair: 4 },
  // Grupo B
  { id: 9,  name: "Toño",   surname: "Remates",      nick: "Cabeza Hot",     group: "B", pair: 5 },
  { id: 10, name: "Lucía",  surname: "Paredes",      nick: "La Muralla",     group: "B", pair: 5 },
  { id: 11, name: "Dani",   surname: "Contrapared",  nick: "Doble-Pared",    group: "B", pair: 6 },
  { id: 12, name: "Cris",   surname: "Equis",        nick: "La X",           group: "B", pair: 6 },
  { id: 13, name: "Javi",   surname: "Doble",        nick: "Sin Red",        group: "B", pair: 7 },
  { id: 14, name: "Nuria",  surname: "Voleas",       nick: "La Pinza",       group: "B", pair: 7 },
  { id: 15, name: "Rafa",   surname: "Reverso",      nick: "Zurditis",       group: "B", pair: 8 },
  { id: 16, name: "Bea",    surname: "Boleadora",    nick: "Bea-Bomba",      group: "B", pair: 8 },
];

// Liguilla: todos contra todos dentro de cada grupo
// Grupo A: parejas 1,2,3,4 → 3 rondas × 2 partidos
// Grupo B: parejas 5,6,7,8 → 3 rondas × 2 partidos
function pairPlayers(pairNum: number): [number, number] {
  const p1 = PLAYERS.find((p) => p.pair === pairNum && p.id % 2 === 1)!.id;
  const p2 = PLAYERS.find((p) => p.pair === pairNum && p.id % 2 === 0)!.id;
  return [p1, p2];
}

type Rounds = [number, number, number, number][];
const GROUP_A_ROUNDS: Rounds = [
  [1, 2, 3, 4],  // R1: pareja1 vs pareja2, pareja3 vs pareja4
  [1, 3, 2, 4],  // R2: pareja1 vs pareja3, pareja2 vs pareja4
  [1, 4, 2, 3],  // R3: pareja1 vs pareja4, pareja2 vs pareja3
];
const GROUP_B_ROUNDS: Rounds = [
  [5, 6, 7, 8],
  [5, 7, 6, 8],
  [5, 8, 6, 7],
];

// Scores mock: [pairA_games, pairB_games]
const GROUP_SCORES: Record<string, [number, number]> = {
  "A-1-1v2": [9, 6],  "A-1-3v4": [8, 9],
  "A-2-1v3": [9, 4],  "A-2-2v4": [7, 9],
  "A-3-1v4": [9, 7],  "A-3-2v3": [9, 5],
  "B-1-5v6": [9, 3],  "B-1-7v8": [9, 8],
  "B-2-5v7": [6, 9],  "B-2-6v8": [9, 7],
  "B-3-5v8": [9, 4],  "B-3-6v7": [8, 9],
};

async function main() {
  await prisma.match.deleteMany();
  await prisma.player.deleteMany();

  for (const p of PLAYERS) {
    await prisma.player.create({
      data: { id: p.id, name: p.name, surname: p.surname, nick: p.nick, group: p.group },
    });
  }

  function createMatch(phase: string, round: number, group: string | null, pA: number, pB: number, sets: string | null, winner: string | null, completed: boolean, live: boolean = false) {
    const [a1, a2] = pairPlayers(pA);
    const [b1, b2] = pairPlayers(pB);
    return prisma.match.create({
      data: { phase, round, group, playerA1: a1, playerA2: a2, playerB1: b1, playerB2: b2, sets, winner, completed, live },
    });
  }

  // Grupo A
  for (let i = 0; i < GROUP_A_ROUNDS.length; i++) {
    const [pA1, pB1, pA2, pB2] = GROUP_A_ROUNDS[i];
    const k1 = `A-${i + 1}-${pA1}v${pB1}`;
    const k2 = `A-${i + 1}-${pA2}v${pB2}`;
    const s1 = GROUP_SCORES[k1];
    const s2 = GROUP_SCORES[k2];
    await createMatch("group", i + 1, "A", pA1, pB1, s1 ? JSON.stringify([[String(s1[0]), String(s1[1])]]) : null, s1 ? (s1[0] > s1[1] ? "A" : "B") : null, !!s1);
    await createMatch("group", i + 1, "A", pA2, pB2, s2 ? JSON.stringify([[String(s2[0]), String(s2[1])]]) : null, s2 ? (s2[0] > s2[1] ? "A" : "B") : null, !!s2);
  }

  // Grupo B
  for (let i = 0; i < GROUP_B_ROUNDS.length; i++) {
    const [pA1, pB1, pA2, pB2] = GROUP_B_ROUNDS[i];
    const k1 = `B-${i + 1}-${pA1}v${pB1}`;
    const k2 = `B-${i + 1}-${pA2}v${pB2}`;
    const s1 = GROUP_SCORES[k1];
    const s2 = GROUP_SCORES[k2];
    await createMatch("group", i + 1, "B", pA1, pB1, s1 ? JSON.stringify([[String(s1[0]), String(s1[1])]]) : null, s1 ? (s1[0] > s1[1] ? "A" : "B") : null, !!s1);
    await createMatch("group", i + 1, "B", pA2, pB2, s2 ? JSON.stringify([[String(s2[0]), String(s2[1])]]) : null, s2 ? (s2[0] > s2[1] ? "A" : "B") : null, !!s2);
  }

  // Fase final: cruces 1v1, 2v2, 3v3, 4v4 (se generan después al calcular standings)
  // Placeholders: se rellenan con la API /api/bracket
  await createMatch("final", 1, null, 1, 5, null, null, false);     // 1ºA vs 1ºB
  await createMatch("final", 2, null, 2, 6, null, null, false);     // 2ºA vs 2ºB
  await createMatch("final", 3, null, 3, 7, null, null, false);     // 3ºA vs 3ºB
  await createMatch("final", 4, null, 4, 8, null, null, false);     // 4ºA vs 4ºB

  console.log("Seed: 16 jugadores, 8 parejas, 2 grupos, liguilla + fase final.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
