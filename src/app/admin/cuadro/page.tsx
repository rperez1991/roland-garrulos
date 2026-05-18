"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/AdminShell";
import styles from "./page.module.css";

type FinalMatch = {
  id: number;
  round: number;
  playerA1: number;
  playerA2: number;
  playerB1: number;
  playerB2: number;
};

export const dynamic = "force-dynamic";

export default function AdminCuadroPage() {
  const [finals, setFinals] = useState<FinalMatch[]>([]);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/matches?phase=final")
      .then((r) => r.json())
      .then(setFinals);
  }, []);

  async function handleGenerate() {
    setGenerating(true);
    setMessage("");
    setError("");
    const res = await fetch("/api/bracket", { method: "POST" });
    const data = await res.json();
    if (data.ok) {
      setMessage(`Cruces generados: ${data.pairs?.length ?? 0} partidos creados.`);
      const res2 = await fetch("/api/matches?phase=final");
      setFinals(await res2.json());
    } else {
      setError(data.error || "Error generando cruces.");
    }
    setGenerating(false);
  }

  const labels = ["🥇 Final", "🥈 3º / 4º", "5º / 6º", "7º / 8º"];
  const courts = ["Pista 1", "Pista 2", "Pista 3", "Pista 4"];

  return (
    <AdminShell>
      <div className={styles.sectionHead}>
        <h2>Generar fase final</h2>
        <div className="row wrap-flex">
          <span className="tag green">1º vs 1º · 2º vs 2º</span>
          <button className="btn" onClick={handleGenerate} disabled={generating}>
            {generating ? "Generando..." : "⚡ Generar cruces"}
          </button>
        </div>
      </div>

      {message && (
        <div style={{ marginBottom: 16, padding: 12, background: "var(--green-soft)", borderRadius: "var(--r)", border: "1px solid var(--green)", fontSize: 13, color: "var(--green-2)" }}>
          ✓ {message}
        </div>
      )}

      {error && (
        <div style={{ marginBottom: 16, padding: 12, background: "rgba(200,80,40,.08)", borderRadius: "var(--r)", border: "1px solid var(--rust)", fontSize: 13, color: "var(--rust)" }}>
          ⚠ {error}
        </div>
      )}

      <div className={styles.qualifiersList}>
        <h4>Partidos de la fase final</h4>
        {finals.length === 0 && (
          <p className="muted" style={{ fontSize: 13 }}>
            Pulsa &quot;Generar cruces&quot; para crear los partidos de la fase final según la clasificación.
          </p>
        )}
        <div className={styles.pairings}>
          {finals.map((m) => (
            <div key={m.id} className={styles.pairing}>
              <div className={styles.pn}>{labels[m.round - 1]}</div>
              <div>
                <span className="muted">{courts[m.round - 1]} · </span>
                <strong>Pareja {Math.ceil(m.playerA1 / 2)} (A)</strong>
                <span className="mono muted" style={{ fontSize: 11 }}> vs </span>
                <strong>Pareja {Math.ceil(m.playerB1 / 2)} (B)</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 16, padding: 12, background: "var(--cream-2)", borderRadius: "var(--r)", fontSize: 12, color: "var(--ink-2)", display: "flex", gap: 10 }}>
        <span style={{ fontSize: 16 }}>💡</span>
        <span>La fase final cruza a las parejas por su puesto en el grupo: 1ºA vs 1ºB en la Gran Final, 2ºA vs 2ºB, 3ºA vs 3ºB, 4ºA vs 4ºB. Las 4 pistas juegan en paralelo.</span>
      </div>
    </AdminShell>
  );
}
