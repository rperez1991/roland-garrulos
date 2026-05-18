import { loadPlayers, getFinalMatches, pairShort } from "@/lib/data";
import styles from "./page.module.css";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  await loadPlayers();
  const finals = await getFinalMatches();

  const upcoming = finals.map((m) => ({
    ...m,
    label: m.phase === "final" ? `Final · Puesto ${m.round}` : `R${m.round}`
  }));

  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>RG</div>
        <div className={styles.heroGrid}>
          <div>
            <div className="h-eyebrow" style={{ color: "var(--ball)" }}>
              Torneo de pádel · Liguilla + Fase Final
            </div>
            <h2>
              Roland<br /><em>Garrulos</em> &apos;26
            </h2>
            <div className={styles.meta}>
              <span><b>8</b> parejas</span>
              <span><b>2</b> grupos</span>
              <span><b>4</b> pistas</span>
              <span><b>13</b> Junio</span>
            </div>
            <div className={styles.actions}>
              <Link href="/cuadro" className="btn ball">
                Ver fase final →
              </Link>
              <Link
                href="/grupos"
                className="btn ghost"
                style={{ borderColor: "rgba(244,239,226,.3)", color: "var(--cream)" }}
              >
                Clasificación
              </Link>
            </div>
          </div>
          <div>
            <div className={styles.court}>
              <div className={styles.courtLine} />
              <div className={styles.ballDot} />
            </div>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <div className={styles.homeGrid}>
        <div className={`${styles.kpi} ${styles.accent}`}>
          <div className={styles.label}>Fase actual</div>
          <div className={styles.value}>FINAL</div>
          <div className={styles.sub}>Cruces por puesto · 4 partidos</div>
        </div>
        <div className={`${styles.kpi} ${styles.green}`}>
          <div className={styles.label}>Formato</div>
          <div className={styles.value}>Liguilla</div>
          <div className={styles.sub}>Grupos A y B · 3 rondas cada uno</div>
        </div>
        <div className={styles.kpi}>
          <div className={styles.label}>Pistas en juego</div>
          <div className={styles.value}>4</div>
          <div className={styles.sub}>2 por grupo · simultáneas</div>
        </div>
      </div>

      {/* Fase Final */}
      <div className={styles.nextMatches}>
        <div>
          <div className="row" style={{ marginBottom: 14 }}>
            <div className="h-eyebrow">Fase Final · 13 Junio</div>
            <div className="spacer" />
            <span className="mono muted" style={{ fontSize: 12 }}>
              4 pistas · cruces por clasificación
            </span>
          </div>
          <div className={styles.matchList}>
            {upcoming.map((m, i) => {
              const labels = ["🥇 Gran Final", "🥈 3º/4º puesto", "5º/6º puesto", "7º/8º puesto"];
              const courts = ["Pista 1", "Pista 2", "Pista 3", "Pista 4"];
              return (
                <div key={m.id} className={`${styles.matchRow} ${i === 0 && !m.completed ? styles.live : ""}`}>
                  <div className={styles.time}>{labels[i]}</div>
                  <div className={styles.team}>
                    <div className={styles.name}>{pairShort(m.pair1)}</div>
                  </div>
                  <div className={styles.vs}>{m.completed ? m.sets[0]?.join("–") : "VS"}</div>
                  <div className={`${styles.team} ${styles.right}`}>
                    <div className={styles.name}>{pairShort(m.pair2)}</div>
                  </div>
                  <div className={styles.court}>{courts[i]}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h3>Estado del torneo</h3>
            <span className="tag green">En curso</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <div className="h-eyebrow" style={{ marginBottom: 4 }}>Progreso</div>
              <div style={{ height: 8, background: "var(--cream-2)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: "75%", background: "var(--green)", borderRadius: 4 }} />
              </div>
              <div className="row" style={{ marginTop: 6, justifyContent: "space-between", fontSize: 12, color: "var(--ink-3)" }}>
                <span className="mono">12 / 16 partidos</span>
                <span className="mono">75%</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <span>Grupo A</span><b className="mono">6 / 6 ✓</b>
              </div>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <span>Grupo B</span><b className="mono">6 / 6 ✓</b>
              </div>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <span>Fase Final</span><b className="mono">0 / 4 ⚡</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
