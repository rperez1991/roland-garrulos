import { loadPlayers, getPairStats, fullPairName } from "@/lib/data";
import styles from "./page.module.css";

export default async function StatsPage() {
  await loadPlayers();
  const stats = await getPairStats();

  const byWins = [...stats].sort((a, b) => b.wins - a.wins);
  const byDiff = [...stats].sort((a, b) => (b.jf - b.jc) - (a.jf - a.jc));

  return (
    <>
      <div className="screen-head">
        <div>
          <div className="h-eyebrow">Estadísticas por parejas</div>
          <h1>Quién manda en la pista</h1>
        </div>
        <div className="row wrap-flex">
          <span className="tag">Tras 12 partidos de grupo</span>
        </div>
      </div>

      <div className={styles.statsGrid}>
        {/* Partidos ganados */}
        <div className={styles.leaderboard}>
          <div className={styles.lbHead}>
            <h3>Partidos ganados</h3>
            <span className="tag green">PG</span>
          </div>
          <ol>
            {byWins.slice(0, 8).map((s, i) => (
              <li key={s.pairNum} className={i === 0 ? styles.top1 : i === 1 ? styles.top2 : i === 2 ? styles.top3 : ""}>
                <span className={styles.rank}>{i + 1}</span>
                <div className={styles.who}>
                  {fullPairName(s.pairNum)}
                  <small>{s.wins}V · {s.losses}D</small>
                </div>
                <div className={styles.stat}>{s.wins}</div>
              </li>
            ))}
          </ol>
        </div>

        {/* Juegos a favor / contra */}
        <div className={styles.leaderboard}>
          <div className={styles.lbHead}>
            <h3>Juegos a favor / contra</h3>
            <span className="tag blue">JF–JC</span>
          </div>
          <ol>
            {byDiff.slice(0, 8).map((s, i) => {
              const diff = s.jf - s.jc;
              return (
                <li key={s.pairNum} className={i === 0 ? styles.top1 : i === 1 ? styles.top2 : i === 2 ? styles.top3 : ""}>
                  <span className={styles.rank}>{i + 1}</span>
                  <div className={styles.who}>
                    {fullPairName(s.pairNum)}
                    <small>{diff > 0 ? "+" : ""}{diff} · {s.jf} / {s.jc}</small>
                  </div>
                  <div className={styles.stat}>{diff > 0 ? "+" : ""}{diff}</div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Diferencia */}
        <div className={styles.leaderboard}>
          <div className={styles.lbHead}>
            <h3>Ranking combinado</h3>
            <span className="tag ball">📊</span>
          </div>
          <ol>
            {byWins.slice(0, 8).map((s, i) => {
              const total = s.wins + s.losses || 1;
              const pct = Math.round((s.wins / total) * 100);
              return (
                <li key={s.pairNum} className={i === 0 ? styles.top1 : i === 1 ? styles.top2 : i === 2 ? styles.top3 : ""}>
                  <span className={styles.rank}>{i + 1}</span>
                  <div className={styles.who}>
                    {fullPairName(s.pairNum)}
                    <small>{pct}% victorias</small>
                  </div>
                  <div className={styles.stat}>{pct}%</div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </>
  );
}
