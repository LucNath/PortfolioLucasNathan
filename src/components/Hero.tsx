"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import SignalTrace from "./SignalTrace";
import { profile } from "@/lib/portfolio-data";

const roles = [
  "engenharia de computação",
  "inteligência artificial",
  "desenvolvimento full stack",
  "sistemas embarcados & IoT",
];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setRoleIndex((i) => (i + 1) % roles.length), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="top" className="relative pt-40 pb-28 px-6 overflow-hidden grain">
      <div className="max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-display text-xs uppercase tracking-[0.3em] text-data mb-6"
        >
          {profile.location} · disponível para novos projetos
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-4xl sm:text-6xl md:text-7xl leading-[1.05] tracking-tight text-[color:var(--ink)]"
        >
          {profile.name}
          <br />
          <span className="text-signal">constrói sistemas</span>
        </motion.h1>

        <div className="mt-6 h-8 font-display text-lg sm:text-xl text-[color:var(--ink-muted)]">
          <span className="text-[color:var(--ink-faint)]">$ atuação --em </span>
          <motion.span
            key={roleIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-signal"
          >
            {roles[roleIndex]}
          </motion.span>
          <span className="animate-pulse text-signal">▍</span>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 max-w-2xl text-base sm:text-lg text-[color:var(--ink-muted)] leading-relaxed"
        >
          {profile.about}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <a
            href="#projetos"
            className="font-display text-sm uppercase tracking-widest px-6 py-3 rounded-sm bg-[color:var(--signal)] text-[#0a0b0f] hover:opacity-90 transition-opacity"
          >
            Ver projetos
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="font-display text-sm uppercase tracking-widest px-6 py-3 rounded-sm border border-[color:var(--border)] hover:border-[color:var(--ink-faint)] transition-colors"
          >
            GitHub
          </a>
        </motion.div>

        <div className="mt-16 opacity-80">
          <SignalTrace className="w-full" color="var(--signal-dim)" height={90} />
        </div>
      </div>
    </section>
  );
}
