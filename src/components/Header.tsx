"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const links = [
  { id: "sobre", href: "#sobre", label: "Sobre" },
  { id: "stack", href: "#stack", label: "Stack" },
  { id: "projetos", href: "#projetos", label: "Projetos" },
  { id: "contato", href: "#contato", label: "Contato" },
];

export default function Header() {
  const [activeSection, setActiveSection] = useState(links[0].id);

  useEffect(() => {
    const sections = links
      .map((link) => document.getElementById(link.id))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-35% 0px -50% 0px",
        threshold: [0.12, 0.35, 0.65],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 inset-x-0 z-50 bg-[color:var(--bg)]/55 backdrop-blur-xl border-b border-[color:var(--border)]"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#top" className="font-display text-sm tracking-tight text-[color:var(--ink)]">
          <span className="text-signal">&gt;</span> lucas.nathan
        </a>
        <nav className="hidden sm:flex items-center font-display text-xs uppercase tracking-widest border border-[color:var(--border)] bg-[color:var(--surface)]/70">
          {links.map((link) => {
            const isActive = activeSection === link.id;

            return (
              <a
                aria-current={isActive ? "true" : undefined}
                className={`group relative border-r border-[color:var(--border)] px-4 py-3 transition-colors last:border-r-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--data)] ${
                  isActive
                    ? "bg-[color:var(--signal)] text-[color:var(--bg)]"
                    : "text-[color:var(--ink-muted)] hover:bg-[color:var(--surface-hover)] hover:text-[color:var(--ink)]"
                }`}
                href={link.href}
                key={link.href}
                onClick={() => setActiveSection(link.id)}
              >
                <span
                  className={`mr-1 transition-opacity ${
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                  aria-hidden="true"
                >
                  /
                </span>
                {link.label}
              </a>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            className="hidden font-display text-[0.68rem] uppercase tracking-widest text-[color:var(--ink-muted)] transition-colors hover:text-[color:var(--data)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--data)] md:inline-flex"
            href="/admin/dashboard"
          >
            Admin
          </Link>
          <a
            href="#contato"
            onClick={() => setActiveSection("contato")}
            className="font-display text-xs uppercase tracking-widest px-4 py-3 border border-[color:var(--signal-dim)] text-signal hover:bg-[color:var(--signal)] hover:text-[color:var(--bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--data)] transition-colors"
          >
            Falar comigo
          </a>
        </div>
      </div>
    </motion.header>
  );
}
