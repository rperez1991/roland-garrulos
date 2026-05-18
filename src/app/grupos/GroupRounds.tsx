"use client";

import { useState } from "react";
import type { MatchDisplay } from "@/lib/data";
import { pairNumber, fullPairName } from "@/lib/data";
import styles from "./page.module.css";

type Props = {
  matchesData: Record<string, MatchDisplay[]>;
  groups: string[];
};

export function GroupRounds({ matchesData, groups }: Props) {
  const [selectedGroup, setSelectedGroup] = useState("A");
  const [selectedRound, setSelectedRound] = useState(0);

  const groupMatches = matchesData[selectedGroup] || [];
  const byRound = groupBy(groupMatches, "round");
  const roundKeys = Object.keys(byRound).sort();
  const currentMatches = byRound[roundKeys[selectedRound]] || [];

  return (
    <div className={styles.americano}>
      <div className="row" style={{ marginBottom: 14 }}>
        <h3>Liguilla · Grupo {selectedGroup}</h3>
        <div className="spacer" />
        <span className="mono muted hide-mobile" style={{ fontSize: 12 }}>
          4 parejas · todos contra todos
        </span>
      </div>
      <div className={styles.tabs}>
        {groups.map((g) => (
          <button
            key={g}
            className={`${styles.tab} ${selectedGroup === g ? styles.tabActive : ""}`}
            onClick={() => { setSelectedGroup(g); setSelectedRound(0); }}
          >
            Grupo {g}
          </button>
        ))}
      </div>
      <div className={styles.tabs} style={{ borderBottom: "none", marginBottom: 16 }}>
        {roundKeys.map((r, i) => (
          <button
            key={r}
            className={`${styles.tab} ${selectedRound === i ? styles.tabActive : ""}`}
            onClick={() => setSelectedRound(i)}
          >
            Ronda {r}
          </button>
        ))}
      </div>
      <div className={styles.rotationMatches}>
        {currentMatches.map((m) => {
          const pA = pairNumber(m.pair1[0]);
          const pB = pairNumber(m.pair2[0]);
          const scoreText = m.sets.length > 0 ? m.sets[0].join("–") : "—";
          return (
            <div key={m.id} className={`${styles.rmatch} ${!m.completed ? styles.unplayed : ""}`}>
              <div className={styles.pair}>
                <span className={styles.pairSmall}>Pareja {pA}</span>
                {fullPairName(pA)}
              </div>
              <div className={styles.score}>{scoreText}</div>
              <div className={`${styles.pair} ${styles.pairRight}`}>
                <span className={styles.pairSmall}>Pareja {pB}</span>
                {fullPairName(pB)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const k = String(item[key]);
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}
