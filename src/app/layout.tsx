import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/TopBar";
import MobileNav from "@/components/MobileNav";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const body = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Roland Garrulos · Torneo de Pádel",
  description: "Torneo de pádel · Liguilla + Fase Final. 8 parejas, 2 grupos, 4 pistas, 1 día.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <div className="app">
          <TopBar />
          <main className="wrap">
            {children}
          </main>
          <footer className="footer wrap">
            <div>ROLAND GARRULOS &apos;26 · Club Pádel La Boleadora</div>
            <div>Organiza: Comité Tertulia &amp; Tortilla</div>
          </footer>
          <MobileNav />
        </div>
      </body>
    </html>
  );
}
