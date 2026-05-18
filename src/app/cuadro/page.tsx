import { loadPlayers, getFinals, fullPairName } from "@/lib/data";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function CuadroPage() {
  await loadPlayers();
  const finals = await getFinals();

  if (finals.length === 0) {
    return (
      <div style={{ padding: "60px 0", textAlign: "center" }}>
        <div className="h-eyebrow">Fase Final</div>
        <h1 style={{ fontFamily: "var(--font-display)" }}>Pendiente de generar</h1>
        <p className="muted">Usa el panel admin para generar los cruces desde la clasificación de grupos.</p>
      </div>
    );
  }

  return (
    <>
      <div className="screen-head">
        <div>
          <div className="h-eyebrow">Fase Final</div>
          <h1>El camino al trofeo</h1>
        </div>
        <div className="row wrap-flex">
          <span className="tag green">Cruces por puesto</span>
          <span className="tag blue">1 set a 9 juegos</span>
          <span className="tag rust">Bola de oro</span>
        </div>
      </div>

      <div className={styles.grid}>
        {finals.map((m, i) => {
          const isWinner = (side: string) => m.winner === side;
          const courts = ["Pista 1", "Pista 2", "Pista 3", "Pista 4"];

          return (
            <div key={m.id} className={`${styles.card} ${i === 0 ? styles.final : ""}`}>
              <div className={styles.cardHead}>
                <div className={styles.label}>{m.label}</div>
                <span className="mono muted" style={{ fontSize: 11 }}>{courts[i]}</span>
              </div>
              <div className={styles.matchBody}>
                <div className={`${styles.team} ${isWinner("A") ? styles.winTeam : ""}`}>
                  <div className={styles.teamName}>{fullPairName(m.pair1.num)}</div>
                  <div className={styles.teamGroup}>Grupo A · {m.pair1.num}ª</div>
                </div>
                <div className={styles.score}>
                  {m.completed && m.sets.length > 0
                    ? <div className={styles.scoreNum}>{m.sets[0].join(" – ")}</div>
                    : <div className={styles.scoreVs}>VS</div>}
                </div>
                <div className={`${styles.team} ${isWinner("B") ? styles.winTeam : ""}`}>
                  <div className={styles.teamName}>{fullPairName(m.pair2.num)}</div>
                  <div className={styles.teamGroup}>Grupo B · {m.pair2.num}ª</div>
                </div>
              </div>
              {!m.completed && i === 0 && (
                <div className={styles.liveBadge}>⚡ Pendiente</div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
