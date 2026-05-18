"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./TopBar.module.css";

const NAV_ITEMS = [
  { href: "/", label: "Inicio", exact: true },
  { href: "/grupos", label: "Grupos" },
  { href: "/cuadro", label: "Cuadro" },
  { href: "/stats", label: "Estadísticas" },
  { href: "/perfil", label: "Perfil" },
  { href: "/reglamento", label: "Reglamento" },
  { href: "/admin", label: "Admin", admin: true },
];

export default function TopBar() {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    if (href === "/admin") return pathname.startsWith("/admin");
    return pathname.startsWith(href);
  }

  return (
    <header className={styles.topbar}>
      <div className={`wrap ${styles.inner}`}>
        <Link href="/" className={styles.brand}>
          <div className={styles.logo}>RG</div>
          <div>
            Roland Garrulos
            <small>Edición &apos;26</small>
          </div>
        </Link>
        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${isActive(item.href, item.exact) ? styles.active : ""} ${item.admin ? styles.navAdmin : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
