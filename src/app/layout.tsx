import type { Metadata } from "next";
import { Barlow, Instrument_Serif, JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Lucas Nathan — Desenvolvedor full stack e estudante de Engenharia de Computação",
  description:
    "Portfólio de Lucas Nathan De Moraes Gomes: desenvolvimento full stack, inteligência artificial, sistemas web e projetos sob medida.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${jetbrainsMono.variable} ${manrope.variable} ${instrumentSerif.variable} ${barlow.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
