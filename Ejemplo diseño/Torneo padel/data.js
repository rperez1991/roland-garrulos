/* ============================================================
   ROLAND GARRULOS — Tournament data (mock)
   Formato Americano · 16 jugadores · 4 grupos
   ============================================================ */

window.TOURNAMENT = {
  name: "Roland Garrulos",
  edition: "Edición 2026",
  dates: "20–24 Mayo",
  venue: "Club Pádel La Boleadora",
  courts: 2,
  format: "Americano por grupos + Cuadro Eliminatorio",

  // 16 jugadores con motes padeleros
  players: [
    { id:1,  name:"Pepe",   surname:"Saca-Planos",  nick:"El Misilero", group:"A" },
    { id:2,  name:"Lola",   surname:"Vidal",        nick:"La Smasher",  group:"A" },
    { id:3,  name:"Berto",  surname:"Ribera",       nick:"Bandeja",     group:"A" },
    { id:4,  name:"Marta",  surname:"Vega",         nick:"La Víbora",   group:"A" },

    { id:5,  name:"Quique", surname:"Cristal",      nick:"El Pegapelo", group:"B" },
    { id:6,  name:"Sara",   surname:"Globera",      nick:"Stratosfera", group:"B" },
    { id:7,  name:"Iván",   surname:"Ruiz",         nick:"Lobito",      group:"B" },
    { id:8,  name:"Manu",   surname:"Chiquita",     nick:"El Bote",     group:"B" },

    { id:9,  name:"Toño",   surname:"Remates",      nick:"Cabeza Hot",  group:"C" },
    { id:10, name:"Lucía",  surname:"Paredes",      nick:"La Muralla",  group:"C" },
    { id:11, name:"Dani",   surname:"Contrapared",  nick:"Doble-Pared", group:"C" },
    { id:12, name:"Cris",   surname:"Equis",        nick:"La X",        group:"C" },

    { id:13, name:"Javi",   surname:"Doble",        nick:"Sin Red",     group:"D" },
    { id:14, name:"Nuria",  surname:"Voleas",       nick:"La Pinza",    group:"D" },
    { id:15, name:"Rafa",   surname:"Reverso",      nick:"Zurditis",    group:"D" },
    { id:16, name:"Bea",    surname:"Boleadora",    nick:"Bea-Bomba",   group:"D" },
  ],

  // Clasificación por grupos (resultado tras 3 rondas americano)
  // pts = puntos individuales · pj = partidos jugados · pg = ganados · jf/jc = juegos a favor/contra
  standings: {
    A: [
      { id:2,  pts:48, pj:3, pg:3, jf:48, jc:32 },
      { id:1,  pts:42, pj:3, pg:2, jf:44, jc:36 },
      { id:4,  pts:36, pj:3, pg:1, jf:38, jc:40 },
      { id:3,  pts:28, pj:3, pg:0, jf:30, jc:52 },
    ],
    B: [
      { id:5,  pts:45, pj:3, pg:3, jf:45, jc:33 },
      { id:8,  pts:41, pj:3, pg:2, jf:41, jc:35 },
      { id:6,  pts:34, pj:3, pg:1, jf:34, jc:40 },
      { id:7,  pts:32, pj:3, pg:0, jf:32, jc:44 },
    ],
    C: [
      { id:10, pts:47, pj:3, pg:3, jf:47, jc:31 },
      { id:11, pts:40, pj:3, pg:2, jf:40, jc:35 },
      { id:9,  pts:35, pj:3, pg:1, jf:37, jc:39 },
      { id:12, pts:30, pj:3, pg:0, jf:30, jc:49 },
    ],
    D: [
      { id:14, pts:46, pj:3, pg:3, jf:46, jc:30 },
      { id:16, pts:39, pj:3, pg:2, jf:39, jc:36 },
      { id:13, pts:36, pj:3, pg:1, jf:36, jc:40 },
      { id:15, pts:31, pj:3, pg:0, jf:31, jc:46 },
    ],
  },

  // Rotaciones Americano — Grupo A (ejemplo mostrado)
  rotations: {
    A: [
      {
        round: 1,
        matches: [
          { pair1:[1,2], pair2:[3,4], score:"16-12" },
          { pair1:[1,3], pair2:[2,4], score:null, hint:"(siguiente ronda)" },
        ],
      },
      {
        round: 2,
        matches: [
          { pair1:[1,3], pair2:[2,4], score:"14-16" },
          { pair1:[1,4], pair2:[2,3], score:null, hint:"(siguiente ronda)" },
        ],
      },
      {
        round: 3,
        matches: [
          { pair1:[1,4], pair2:[2,3], score:"16-14" },
          { pair1:[2,4], pair2:[1,3], score:"16-10" },
        ],
      },
    ],
  },

  // Cuadro eliminatorio: top 2 de cada grupo
  // Pairings: ganadores de grupo con segundos cruzados
  bracket: {
    quarters: [
      { id:"qf1", pair1:{ players:[2,1],  fromGroup:"A", seed:1 },
                  pair2:{ players:[14,16],fromGroup:"D", seed:8 },
                  sets:["6-3","6-4"], winner:"pair1" },
      { id:"qf2", pair1:{ players:[10,11],fromGroup:"C", seed:4 },
                  pair2:{ players:[5,8],  fromGroup:"B", seed:5 },
                  sets:["7-5","4-6","6-3"], winner:"pair1" },
      { id:"qf3", pair1:{ players:[5,8],  fromGroup:"B", seed:2 },
                  pair2:{ players:[14,16],fromGroup:"D", seed:7 },
                  sets:["6-2","6-1"], winner:"pair1" },
      { id:"qf4", pair1:{ players:[10,11],fromGroup:"C", seed:3 },
                  pair2:{ players:[2,1],  fromGroup:"A", seed:6 },
                  sets:["3-6","6-4","6-7"], winner:"pair2" },
    ],
    // Recalculado: usemos pairings limpios.
  },
};

// Pairings limpios del cuadro (sobreescribo bracket arriba con un cuadro coherente)
window.TOURNAMENT.bracket = {
  quarters: [
    { id:"qf1",
      pair1:{ players:[2,1],   fromGroup:"A", label:"1º A + 2º A" },
      pair2:{ players:[14,16], fromGroup:"D", label:"1º D + 2º D" },
      sets:["6-3","6-2"], winner:"pair1" },
    { id:"qf2",
      pair1:{ players:[5,8],   fromGroup:"B", label:"1º B + 2º B" },
      pair2:{ players:[10,11], fromGroup:"C", label:"1º C + 2º C" },
      sets:["4-6","6-7"], winner:"pair2" },
    { id:"qf3", playoff:true,
      pair1:{ players:[4,3],   fromGroup:"A", label:"3º A + 4º A" },
      pair2:{ players:[13,15], fromGroup:"D", label:"3º D + 4º D" },
      sets:["7-5","6-4"], winner:"pair1", consolation:true },
    { id:"qf4", playoff:true,
      pair1:{ players:[6,7],   fromGroup:"B", label:"3º B + 4º B" },
      pair2:{ players:[9,12],  fromGroup:"C", label:"3º C + 4º C" },
      sets:["6-3","3-6","10-8"], winner:"pair2", consolation:true },
  ],
  semis: [
    { id:"sf1",
      pair1:{ players:[2,1], fromGroup:"A" },
      pair2:{ players:[10,11], fromGroup:"C" },
      sets:["6-4","6-3"], winner:"pair1" },
    { id:"sf2",
      pair1:{ players:[5,8], fromGroup:"B" },
      pair2:{ players:[14,16], fromGroup:"D" },
      sets:["7-6","4-6","6-2"], winner:"pair2", current:true },
  ],
  final: {
    pair1:{ players:[2,1], fromGroup:"A" },
    pair2:{ players:[14,16], fromGroup:"D" },
    sets: null, winner: null, upcoming:true,
  },
};

// Próximos partidos / partido en juego
window.TOURNAMENT.upcoming = [
  { time:"19:00", court:"Pista 1", live:true,
    pair1:{ players:[5,8] }, pair2:{ players:[14,16] }, label:"Semifinal · 3er set" },
  { time:"20:00", court:"Pista 1",
    pair1:{ players:[6,7] }, pair2:{ players:[9,12] }, label:"Consolación SF" },
  { time:"21:30", court:"Pista 1",
    pair1:{ players:[2,1] }, pair2:{ players:["?","?"] }, label:"GRAN FINAL" },
];

// Para perfil de jugador (ejemplo: Lola Vidal, líder Grupo A)
window.TOURNAMENT.playerHistory = {
  2: [
    { result:"W", round:"R1 Grupo A", partner:1,  vs:[3,4],   score:"16-12" },
    { result:"W", round:"R2 Grupo A", partner:4,  vs:[1,3],   score:"16-14" },
    { result:"W", round:"R3 Grupo A", partner:3,  vs:[1,4],   score:"16-10" },
    { result:"W", round:"Cuartos",   partner:1,  vs:[14,16], score:"6-3 · 6-2" },
    { result:"W", round:"Semifinal", partner:1,  vs:[10,11], score:"6-4 · 6-3" },
    { result:"·", round:"Final",     partner:1,  vs:["?","?"], score:"21:30h" },
  ],
};

// Helpers
window.getPlayer = (id) => window.TOURNAMENT.players.find(p => p.id === id) || { name:"?", surname:"", nick:"" };
window.fullName = (id) => {
  if (id === "?") return "—";
  const p = window.getPlayer(id);
  return `${p.name} ${p.surname}`;
};
window.shortName = (id) => {
  if (id === "?") return "—";
  const p = window.getPlayer(id);
  return `${p.name[0]}. ${p.surname}`;
};
window.pairName = (ids) => ids.map(i => window.fullName(i)).join(" + ");
window.pairShort = (ids) => ids.map(i => window.shortName(i)).join(" / ");
