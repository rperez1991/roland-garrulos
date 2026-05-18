"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./AdminShell.module.css";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href ? styles.active : "";
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.side}>
        <div className={styles.sideHead}>Panel admin</div>
        <Link href="/admin/participantes" className={isActive("/admin/participantes")}>
          Participantes <span className={styles.arrow}>›</span>
        </Link>
        <Link href="/admin/resultados" className={isActive("/admin/resultados")}>
          Resultados <span className={styles.arrow}>›</span>
        </Link>
        <Link href="/admin/cuadro" className={isActive("/admin/cuadro")}>
          Generar cuadro <span className={styles.arrow}>›</span>
        </Link>
        <Link href="/" style={{ marginTop: 12, borderTop: "1px solid var(--line)", paddingTop: 14 }}>
          ↩ Salir
        </Link>
      </aside>
      <div className={styles.main}>{children}</div>
    </div>
  );
}
