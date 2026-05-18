import { loadPlayers, getGroupStandings, getGroupMatches, fullPairName } from "@/lib/data";
import styles from "./page.module.css";
import { GroupRounds } from "./GroupRounds";

export const dynamic = "force-dynamic";

export default async function GruposPage() {
  await loadPlayers();
  const groups = ["A", "B"];

  const standingsData: Record<string, Awaited<ReturnType<typeof getGroupStandings>>> = {};
  const matchesData: Record<string, Awaited<ReturnType<typeof getGroupMatches>>> = {};
  for (const g of groups) {
    standingsData[g] = await getGroupStandings(g);
    matchesData[g] = await getGroupMatches(g);
  }

  return (
    <>
      <div className="screen-head">
        <div>
          <div className="h-eyebrow">Fase de grupos · finalizada</div>
          <h1>Grupos &amp; clasificación</h1>
        </div>
        <div className="row wrap-flex">
          <span className="tag green">Top 1 a la Gran Final</span>
          <span className="tag">Liguilla · todos contra todos</span>
        </div>
      </div>

      <div className={styles.groupsGrid}>
        {groups.map((g) => {
          const rows = standingsData[g];
          const headVariant = g === "B" ? styles.blue : "";
          return (
            <div key={g} className={styles.group}>
              <div className={`${styles.groupHead} ${headVariant}`}>
                <h3>Grupo {g}</h3>
                <div className={styles.subhead}>4 parejas · 3 rondas</div>
              </div>
              <table className={styles.standings}>
                <thead>
                  <tr>
                    <th>Pareja</th>
                    <th className={styles.hideSm} style={{ textAlign: "center" }}>PJ</th>
                    <th style={{ textAlign: "center" }}>PG</th>
                    <th className={styles.hideSm} style={{ textAlign: "center" }}>JF/JC</th>
                    <th style={{ textAlign: "center" }}>PTS</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, idx) => {
                    const qual = idx === 0;
                    return (
                      <tr key={r.pairNum} className={`${qual ? styles.qualified : ""} ${idx === 1 ? styles.last : ""}`}>
                        <td className={styles.player}>
                          <span className={styles.pos}>{idx + 1}</span>
                          {fullPairName(r.pairNum)}
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-3)", marginTop: 2 }}>
                            Pareja {r.pairNum}
                          </div>
                        </td>
                        <td className={`${styles.num} ${styles.hideSm}`}>{r.pj}</td>
                        <td className={styles.num}>{r.pg}</td>
                        <td className={`${styles.num} ${styles.hideSm}`}>{r.jf}/{r.jc}</td>
                        <td className={`${styles.num} ${styles.pts}`}>{r.pts}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>

      <GroupRounds matchesData={matchesData} groups={groups} />
    </>
  );
}
