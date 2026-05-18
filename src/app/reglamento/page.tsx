import styles from "./page.module.css";

export default function ReglamentoPage() {
  return (
    <div className={styles.wrapper}>
      <div className="screen-head">
        <div>
          <div className="h-eyebrow">Normativa del torneo</div>
          <h1>Reglamento</h1>
        </div>
        <div className="row wrap-flex">
          <span className="tag green">Liguilla + Fase Final</span>
          <span className="tag blue">8 parejas</span>
        </div>
      </div>

      <div className={styles.grid}>
        {/* FORMATO */}
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.number}>01</span>
            <h2>Formato de competición</h2>
          </div>
          <div className={styles.body}>
            <p>
              <strong>Roland Garrulos</strong> se disputa en formato <strong>Liguilla con Fase Final</strong>.
              Participan <strong>8 parejas</strong> divididas en <strong>2 grupos de 4</strong> (A y B).
            </p>
            <ul>
              <li><strong>Fase de grupos:</strong> Liguilla todos contra todos en cada grupo (3 partidos por pareja).</li>
              <li><strong>Fase final:</strong> Las 4 parejas de cada grupo se cruzan por clasificación con las del otro grupo.</li>
              <li><strong>Todas las parejas juegan la fase final</strong>, disputando cada puesto del 1º al 8º.</li>
            </ul>
          </div>
        </div>

        {/* LIGUILLA */}
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.number}>02</span>
            <h2>Liguilla · Todos contra todos</h2>
          </div>
          <div className={styles.body}>
            <p>
              En cada grupo de 4 parejas se juega una <strong>liguilla a una vuelta</strong>.
              Cada pareja disputa <strong>3 partidos</strong> (uno contra cada rival del grupo).
            </p>
            <div className={styles.rotTable}>
              <div className={styles.rotHeader}>
                <span>Ronda</span><span>Pista 1 (o 3)</span><span>Pista 2 (o 4)</span>
              </div>
              <div className={styles.rotRow}><span className="mono">R1</span><span>P1 vs P2</span><span>P3 vs P4</span></div>
              <div className={styles.rotRow}><span className="mono">R2</span><span>P1 vs P3</span><span>P2 vs P4</span></div>
              <div className={styles.rotRow}><span className="mono">R3</span><span>P1 vs P4</span><span>P2 vs P3</span></div>
            </div>
            <p className="muted" style={{ fontSize: 13, marginTop: 12 }}>
              Cada grupo ocupa 2 pistas en paralelo. 3 rondas × 2 partidos = 6 partidos por grupo.
              Tiempo máximo por partido: <strong>40 minutos</strong>.
            </p>
          </div>
        </div>

        {/* PUNTUACIÓN */}
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.number}>03</span>
            <h2>Sistema de puntuación</h2>
          </div>
          <div className={styles.body}>
            <p>La clasificación de cada grupo se determina por <strong>puntos por pareja</strong>:</p>
            <div className={styles.formula}>
              <code>PTS = PJ × 10 + PG × 20 + (JF − JC) × 2</code>
            </div>
            <table className={styles.ptsTable}>
              <thead>
                <tr><th>Factor</th><th>Peso</th><th>Descripción</th></tr>
              </thead>
              <tbody>
                <tr><td>Partidos Jugados (PJ)</td><td className="mono">× 10</td><td>Premia la participación</td></tr>
                <tr><td>Partidos Ganados (PG)</td><td className="mono">× 20</td><td>Lo más importante: ganar</td></tr>
                <tr><td>Diferencia de juegos (JF − JC)</td><td className="mono">× 2</td><td>Desempate por rendimiento</td></tr>
              </tbody>
            </table>
            <p className="muted" style={{ fontSize: 13, marginTop: 12 }}>
              Desempates: 1º) enfrentamiento directo, 2º) diferencia de juegos, 3º) juegos a favor.
            </p>
          </div>
        </div>

        {/* FASE FINAL */}
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.number}>04</span>
            <h2>Fase Final · Cruces por puesto</h2>
          </div>
          <div className={styles.body}>
            <p>
              Al terminar la liguilla, las parejas se ordenan del 1º al 4º en cada grupo y
              se cruzan <strong>por el mismo puesto</strong> con el otro grupo:
            </p>
            <div className={styles.crossTable}>
              <div className={styles.crossRow}>
                <div className={styles.crossCol}><strong>🥇 Pista 1:</strong> 1º Grupo A vs 1º Grupo B</div>
                <div className={styles.crossCol}><strong>🥈 Pista 2:</strong> 2º Grupo A vs 2º Grupo B</div>
              </div>
              <div className={styles.crossRow}>
                <div className={styles.crossCol}><strong>Pista 3:</strong> 3º Grupo A vs 3º Grupo B</div>
                <div className={styles.crossCol}><strong>Pista 4:</strong> 4º Grupo A vs 4º Grupo B</div>
              </div>
            </div>
            <ul>
              <li><strong>4 partidos simultáneos</strong> en las 4 pistas.</li>
              <li>Todas las parejas juegan 1 partido más, para un total de <strong>4 partidos</strong> en el torneo.</li>
              <li>El ganador de la Pista 1 se corona <strong>campeón de Roland Garrulos</strong> 🏆.</li>
            </ul>
          </div>
        </div>

        {/* PARTIDOS */}
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.number}>05</span>
            <h2>Formato de los partidos</h2>
          </div>
          <div className={styles.body}>
            <div className={styles.bolaOro}>
              <div className={styles.bolaOroIcon}>🎾</div>
              <div className={styles.bolaOroText}>
                <strong>Bola de oro</strong> — Cuando un juego llega a 40–40, la pareja restadora elige
                quién recibe el saque. El siguiente punto decide el juego. Sin ventaja.
              </div>
            </div>
            <div className="row wrap-flex" style={{ gap: 16, marginTop: 16 }}>
              <div className={styles.matchType}>
                <div className="h-eyebrow">Fase de grupos</div>
                <div className={styles.matchTypeTitle}>1 set a 9 juegos</div>
                <div className="muted" style={{ fontSize: 13 }}>
                  Bola de oro en todos los juegos.<br />
                  Máximo 40 minutos por partido.
                </div>
              </div>
              <div className={styles.matchType}>
                <div className="h-eyebrow">Fase Final</div>
                <div className={styles.matchTypeTitle}>1 set a 9 juegos</div>
                <div className="muted" style={{ fontSize: 13 }}>
                  Bola de oro en todos los juegos.<br />
                  Partidos simultáneos en las 4 pistas.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PISTAS */}
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.number}>06</span>
            <h2>Instalaciones y calendario</h2>
          </div>
          <div className={styles.body}>
            <div className={styles.bolaOro} style={{ background: "var(--court-soft)", border: "1px solid var(--court-2)" }}>
              <div className={styles.bolaOroIcon}>📅</div>
              <div className={styles.bolaOroText} style={{ fontSize: 15, fontWeight: 600, color: "var(--court-2)" }}>
                <strong>Torneo de 1 día</strong> — Todos los partidos se disputan el <strong>13 de Junio</strong>.
              </div>
            </div>
            <p style={{ marginTop: 16 }}>
              <strong>Fase de grupos (2h):</strong> Grupo A en pistas 1 y 2, Grupo B en pistas 3 y 4.
              3 rondas de 40 minutos en paralelo.
            </p>
            <p>
              <strong>Fase Final (45-60 min):</strong> Cruces simultáneos en las 4 pistas por clasificación.
            </p>
            <table className={styles.ptsTable}>
              <thead>
                <tr><th>Fase</th><th>Partidos</th><th>Duración</th></tr>
              </thead>
              <tbody>
                <tr><td>Liguilla Grupo A</td><td className="mono">6</td><td>120 min</td></tr>
                <tr><td>Liguilla Grupo B</td><td className="mono">6</td><td>120 min (simultáneo)</td></tr>
                <tr><td>Fase Final</td><td className="mono">4</td><td>45–60 min</td></tr>
              </tbody>
            </table>
            <p className="muted" style={{ fontSize: 13, marginTop: 12 }}>
              <strong>Sede:</strong> Club Pádel La Boleadora · 4 pistas.<br />
              <strong>Organiza:</strong> Comité Tertulia &amp; Tortilla.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
