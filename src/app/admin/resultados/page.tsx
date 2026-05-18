import { loadPlayers, getGroupStandings, getGroupMatches, fullPairName, pairNumber } from "@/lib/data";
import AdminShell from "@/components/AdminShell";
import styles from "./page.module.css";

export default async function AdminResultadosPage() {
  const players = await loadPlayers();
  const groups = ["A", "B"];
  const matchesData: Record<string, Awaited<ReturnType<typeof getGroupMatches>>> = {};
  for (const g of groups) {
    matchesData[g] = await getGroupMatches(g);
  }
  const allMatches = Object.entries(matchesData).flatMap(([group, matches]) =>
    matches.map((m) => ({ ...m, group }))
  );

  return (
    <AdminShell>
      <div className={styles.sectionHead}>
        <h2>Editar resultados</h2>
        <div className="row wrap-flex">
          <span className="tag green">Grupos A y B</span>
          <button className="btn ball" disabled>⇡ Publicar resultados</button>
        </div>
      </div>

      <div className={styles.editor}>
        {allMatches.map((m) => {
          const isSaved = m.completed;
          const pA = pairNumber(m.pair1[0]);
          const pB = pairNumber(m.pair2[0]);
          const [s1 = "", s2 = ""] = m.sets.length > 0 ? m.sets[0] : ["", ""];
          return (
            <div key={m.id} className={styles.resultRow}>
              <div className={styles.roundTag}>
                {m.group} · R{m.round}
              </div>
              <div className={styles.pair}>
                <small>Pareja {pA}</small>
                {fullPairName(pA)}
              </div>
              <div className={styles.scoreInput}>
                <input type="number" defaultValue={s1} placeholder="-" />
                <span className="mono muted">:</span>
                <input type="number" defaultValue={s2} placeholder="-" />
              </div>
              <div className={`${styles.pair} ${styles.pairRight}`}>
                <small>Pareja {pB}</small>
                {fullPairName(pB)}
              </div>
              <div className={styles.saved}>
                {isSaved ? "✓ guardado" : "pendiente"}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.syncBanner}>
        <span style={{ fontSize: 18 }}>✓</span>
        Resultados sincronizados · La clasificación se actualiza automáticamente al guardar.
      </div>
    </AdminShell>
  );
}
