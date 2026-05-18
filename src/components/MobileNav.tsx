"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./MobileNav.module.css";

const NAV_ITEMS = [
  { href: "/", label: "Inicio" },
  { href: "/grupos", label: "Grupos" },
  { href: "/cuadro", label: "Cuadro" },
  { href: "/stats", label: "Stats" },
  { href: "/admin", label: "Admin" },
];

export default function MobileNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    if (href === "/admin") return pathname.startsWith("/admin");
    return pathname.startsWith(href);
  }

  return (
    <nav className={styles.navMobile}>
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={isActive(item.href) ? styles.active : ""}
        >
          <span className={styles.icon}>
            <span className={styles.dot} />
          </span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
