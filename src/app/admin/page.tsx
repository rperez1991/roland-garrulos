"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = e.currentTarget;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const res = await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify({ password }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();

    if (data.ok) {
      router.push("/admin/participantes");
    } else {
      setError(data.error || "Contraseña incorrecta");
    }
    setLoading(false);
  }

  return (
    <div className={styles.loginScreen}>
      <form className={styles.loginCard} onSubmit={handleSubmit}>
        <div className={styles.lock}>🔒</div>
        <h2>Zona Admin</h2>
        <p>Acceso restringido al comité organizador.</p>
        <div className="field">
          <label htmlFor="admin-user">Usuario</label>
          <input id="admin-user" type="text" name="username" defaultValue="admin" autoComplete="off" />
        </div>
        <div className="field">
          <label htmlFor="admin-pass">Contraseña</label>
          <input id="admin-pass" type="password" name="password" autoComplete="off" />
        </div>
        {error && <div style={{ color: "var(--rust)", fontSize: 13, marginBottom: 12 }}>{error}</div>}
        <button type="submit" className="btn ball" style={{ width: "100%", justifyContent: "center", padding: "12px 16px" }} disabled={loading}>
          {loading ? "Entrando..." : "Entrar al panel →"}
        </button>
      </form>
    </div>
  );
}
