"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/AdminShell";
import styles from "./page.module.css";

type Player = {
  id: number;
  name: string;
  surname: string;
  nick: string;
  group: string;
  active: boolean;
};

export default function AdminParticipantesPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Player | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", surname: "", nick: "", group: "A" });
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/players")
      .then((r) => r.json())
      .then(setPlayers)
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    if (!form.name || !form.surname) return;
    if (editing) {
      await fetch(`/api/players/${editing.id}`, {
        method: "PUT",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      });
    } else {
      await fetch("/api/players", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      });
    }
    const res = await fetch("/api/players");
    setPlayers(await res.json());
    setEditing(null);
    setAdding(false);
    setForm({ name: "", surname: "", nick: "", group: "A" });
  }

  async function handleDelete(id: number) {
    if (!confirm("¿Eliminar este jugador?")) return;
    await fetch(`/api/players/${id}`, { method: "DELETE" });
    const res = await fetch("/api/players");
    setPlayers(await res.json());
  }

  function startEdit(p: Player) {
    setEditing(p);
    setAdding(false);
    setForm({ name: p.name, surname: p.surname, nick: p.nick, group: p.group });
  }

  const filtered = players.filter((p) => {
    const q = search.toLowerCase();
    return `${p.name} ${p.surname} ${p.nick}`.toLowerCase().includes(q);
  });

  if (loading) return <AdminShell><p>Cargando...</p></AdminShell>;

  return (
    <AdminShell>
      <div className={styles.sectionHead}>
        <h2>Participantes &amp; grupos</h2>
        <div className="row wrap-flex">
          <div className={styles.searchInput}>
            <span className="muted">⌕</span>
            <input type="text" placeholder="Buscar jugador..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button className="btn" onClick={() => { setAdding(true); setEditing(null); setForm({ name: "", surname: "", nick: "", group: "A" }); }}>
            + Añadir jugador
          </button>
        </div>
      </div>

      {(editing || adding) && (
        <div style={{ marginBottom: 20, padding: 20, background: "var(--cream)", borderRadius: "var(--r)", border: "1px solid var(--line)" }}>
          <h3 style={{ margin: "0 0 16px", fontFamily: "var(--font-display)", fontSize: 20 }}>
            {editing ? "Editar jugador" : "Nuevo jugador"}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Nombre</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Apellido</label>
              <input value={form.surname} onChange={(e) => setForm({ ...form, surname: e.target.value })} />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Mote</label>
              <input value={form.nick} onChange={(e) => setForm({ ...form, nick: e.target.value })} />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Grupo</label>
              <select value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value })}>
                <option>A</option><option>B</option>
              </select>
            </div>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <button className="btn ball" onClick={handleSave}>✓ Guardar</button>
            <button className="btn ghost" onClick={() => { setEditing(null); setAdding(false); }}>Cancelar</button>
          </div>
        </div>
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{ width: 40 }}>#</th>
            <th>Jugador</th>
            <th className={styles.hideSm}>Mote</th>
            <th>Grupo</th>
            <th className={styles.hideSm}>Estado</th>
            <th style={{ textAlign: "right" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p, idx) => {
            const initials = (p.name[0] + p.surname[0]).toUpperCase();
            return (
              <tr key={p.id}>
                <td className="mono muted">{String(idx + 1).padStart(2, "0")}</td>
                <td>
                  <div className={styles.playerCell}>
                    <div className={styles.avatar}>{initials}</div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{p.name} {p.surname}</div>
                      <div className="mono muted" style={{ fontSize: 11 }}>id #{p.id}</div>
                    </div>
                  </div>
                </td>
                <td className={`${styles.hideSm} muted`}>&quot;{p.nick}&quot;</td>
                <td>
                  <span className={`tag ${p.group === "A" ? "green" : p.group === "B" ? "blue" : p.group === "C" ? "ball" : ""}`}>
                    Grupo {p.group}
                  </span>
                </td>
                <td className={styles.hideSm}>
                  <span className="muted" style={{ fontSize: 13 }}>Activo</span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.iconBtn} title="Editar" onClick={() => startEdit(p)}>✎</button>
                    <button className={`${styles.iconBtn} ${styles.danger}`} title="Eliminar" onClick={() => handleDelete(p.id)}>🗑</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ marginTop: 20 }} className="row wrap-flex">
        <button className="btn ghost">⇣ Exportar CSV</button>
        <div className="spacer" />
        <span className="mono muted" style={{ fontSize: 12 }}>
          {players.length} jugadores · 8 parejas · 2 grupos
        </span>
      </div>
    </AdminShell>
  );
}
