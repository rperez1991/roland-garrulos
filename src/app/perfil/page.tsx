import { loadPlayers, getPlayerMatches, pairNumber, getPlayer } from "@/lib/data";
import styles from "./page.module.css";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PerfilPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; pair?: string }>;
}) {
  const { id } = await searchParams;
  const players = await loadPlayers();
  const playerId = parseInt(id || "1");
  const player = getPlayer(playerId);

  if (!player || player.id === 0) {
    return (
      <div style={{ padding: "40px 0", textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--font-display)" }}>Jugador no encontrado</h1>
        <Link href="/" className="btn">Volver</Link>
      </div>
    );
  }

  const pn = pairNumber(playerId);
  const matches = await getPlayerMatches(playerId);
  const wins = matches.filter((m) => m.winner === "W").length;
  const losses = matches.filter((m) => m.winner === "L").length;
  const total = wins + losses;
  let jf = 0, jc = 0;
  for (const m of matches) {
    for (const set of m.sets) {
      jf += parseInt(set[0]) || 0;
      jc += parseInt(set[1]) || 0;
    }
  }

  const partner = playerId % 2 === 1 ? playerId + 1 : playerId - 1;
  const partnerP = getPlayer(partner);

  return (
    <>
      <div className="screen-head">
        <div>
          <div className="h-eyebrow">Perfil de jugador</div>
          <h1>{player.name} {player.surname}</h1>
        </div>
        <div className="row wrap-flex">
          <select
            className={styles.playerSelect}
            defaultValue={playerId}
            onChange={(e) => {
              if (typeof window !== "undefined") {
                window.location.href = `/perfil?id=${e.target.value}`;
              }
            }}
          >
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} {p.surname} · Pareja {pairNumber(p.id)} · Grupo {p.group}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.profile}>
        <aside className={styles.profileCard}>
          <div className={styles.avatar}>{player.name[0]}{player.surname[0]}</div>
          <h2>{player.name} {player.surname}</h2>
          <div className={styles.nick}>&quot;{player.nick}&quot; · Grupo {player.group}</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
            <span className="tag ball">Pareja {pn}</span>
            {partnerP && (
              <span className="tag" style={{ background: "rgba(244,239,226,.15)", color: "var(--cream)" }}>
                + {partnerP.name} {partnerP.surname}
              </span>
            )}
          </div>
          <div className={styles.quickStats}>
            <div className={styles.qs}>
              <div className={styles.qsV}>{wins}/{total}</div>
              <div className={styles.qsL}>Partidos</div>
            </div>
            <div className={styles.qs}>
              <div className={styles.qsV}>{jf - jc > 0 ? "+" : ""}{jf - jc}</div>
              <div className={styles.qsL}>Dif. juegos</div>
            </div>
            <div className={styles.qs}>
              <div className={styles.qsV}>P{pn}</div>
              <div className={styles.qsL}>Pareja</div>
            </div>
          </div>
        </aside>

        <div className={styles.profileDetail}>
          <div className={styles.matchHistory}>
            <div className={styles.mhHead}>
              <h3>Historial del torneo</h3>
              <span className="tag green">
                {total > 0 ? `${Math.round((wins / total) * 100)}% victorias` : "Sin partidos"}
              </span>
            </div>
            {matches.length === 0 && (
              <div style={{ padding: 20, color: "var(--ink-3)", fontSize: 13 }}>
                Este jugador aún no ha disputado partidos.
              </div>
            )}
            {matches.map((m) => {
              const isWin = m.winner === "W";
              const roundLabel = m.phase === "group"
                ? `R${m.round} Grupo ${m.group}`
                : m.phase === "final" ? `Final · Puesto ${m.round}`
                : m.phase;
              const scoreText = m.sets.length > 0
                ? m.sets[0].join("–")
                : "—";
              return (
                <div key={m.id} className={styles.historyRow}>
                  <div className={`${styles.badge} ${isWin ? styles.win : styles.loss}`}>
                    {isWin ? "W" : "L"}
                  </div>
                  <div className={styles.hPartner}>
                    <small>{roundLabel}</small>
                    <b>Pareja {pairNumber(m.pair1[0])}</b>
                  </div>
                  <div className={styles.hVs}>
                    <small>vs</small>
                    Pareja {pairNumber(m.pair2[0])}
                  </div>
                  <div className={styles.hScore}>{scoreText}</div>
                </div>
              );
            })}
          </div>

          <div className="card">
            <div className="card-head">
              <h3>Pareja fija</h3>
              <span className="mono muted" style={{ fontSize: 11 }}>Liguilla</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ padding: 14, background: "var(--cream)", borderRadius: "var(--r)", border: "1px solid var(--line)" }}>
                <div className="h-eyebrow" style={{ marginBottom: 6 }}>Compañero/a 🤝</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                  {partnerP ? `${partnerP.name} ${partnerP.surname}` : "—"}
                </div>
                <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>Pareja fija durante todo el torneo</div>
              </div>
              <div style={{ padding: 14, background: "var(--cream)", borderRadius: "var(--r)", border: "1px solid var(--line)" }}>
                <div className="h-eyebrow" style={{ marginBottom: 6 }}>Grupo {player.group}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                  {total} partidos
                </div>
                <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>Liguilla · todos contra todos</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
