"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { pairNumber } from "@/lib/data";

type Player = { id: number; name: string; surname: string; group: string };

export default function PlayerSelect({
  players,
  current,
}: {
  players: Player[];
  current: number;
}) {
  const router = useRouter();
  return (
    <select
      className={styles.playerSelect}
      defaultValue={current}
      onChange={(e) => router.push(`/perfil?id=${e.target.value}`)}
    >
      {players.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name} {p.surname} · Pareja {pairNumber(p.id)} · Grupo {p.group}
        </option>
      ))}
    </select>
  );
}
