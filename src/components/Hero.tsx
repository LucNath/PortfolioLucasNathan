"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import SignalTrace from "./SignalTrace";
import {
  deliveryHighlights,
  heroCta,
  heroPanel,
  heroRoles,
  profile,
  services,
} from "@/lib/portfolio-data";

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setRoleIndex((i) => (i + 1) % heroRoles.length), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="top" className="relative px-6 pt-36 pb-20 overflow-hidden grain">
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-x-0 top-24 h-px bg-[color:var(--data-dim)]"
      />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-[minmax(0,1fr)_430px] gap-12 xl:gap-16 items-center">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-xs uppercase tracking-[0.3em] text-data mb-6"
          >
            {profile.location} · {profile.availability}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl md:text-7xl leading-[1.05] tracking-tight text-[color:var(--ink)]"
          >
            {profile.name}
            <br />
            <span className="text-signal">constrói sistemas sob medida</span>
          </motion.h1>

          <div className="mt-6 min-h-8 font-display text-lg sm:text-xl text-[color:var(--ink-muted)]">
            <span className="text-[color:var(--ink-faint)]">$ posso entregar -- </span>
            <motion.span
              key={roleIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-signal"
            >
              {heroRoles[roleIndex]}
            </motion.span>
            <span className="animate-pulse text-signal">▍</span>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 max-w-2xl text-base sm:text-lg text-[color:var(--ink-muted)] leading-relaxed"
          >
            {profile.clientPitch}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <a
              href={`mailto:${profile.email}?subject=Quero%20criar%20um%20projeto`}
              className="font-display text-sm uppercase tracking-widest px-6 py-3 rounded-sm bg-[color:var(--signal)] text-[color:var(--bg)] hover:opacity-90 transition-opacity"
            >
              {heroCta.primary}
            </a>
            <a
              href="#projetos"
              className="font-display text-sm uppercase tracking-widest px-6 py-3 rounded-sm border border-[color:var(--border)] hover:border-[color:var(--data)] hover:text-data transition-colors"
            >
              {heroCta.secondary}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-10 grid sm:grid-cols-3 gap-3 max-w-3xl"
          >
            {deliveryHighlights.map((item, index) => (
              <div
                key={item.title}
                className="rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] p-4"
              >
                <span className="font-display text-xs text-signal">0{index + 1}</span>
                <p className="mt-2 font-display text-sm text-[color:var(--ink)]">{item.title}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.aside
          initial={{ opacity: 0, x: 24, rotate: 1 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="relative rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-2xl shadow-[color:var(--bg-elevated)] overflow-hidden"
        >
          <motion.div
            aria-hidden
            animate={{ y: ["-15%", "115%"] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-x-0 h-16 bg-[linear-gradient(180deg,transparent,var(--data-dim),transparent)]"
          />

          <div className="relative">
            <div className="flex items-center justify-between border-b border-[color:var(--border)] pb-4">
              <div>
                <p className="font-display text-[10px] uppercase tracking-[0.28em] text-data">
                  {heroPanel.eyebrow}
                </p>
                <h2 className="mt-2 font-display text-xl text-[color:var(--ink)]">
                  {heroPanel.title}
                </h2>
              </div>
              <span className="font-display text-xs text-signal">{heroPanel.status}</span>
            </div>

            <div className="py-5">
              <SignalTrace className="w-full" color="var(--signal-dim)" height={76} />
            </div>

            <div className="space-y-3">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: 0.5 + index * 0.12 }}
                  className="rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-display text-[10px] uppercase tracking-[0.22em] text-data">
                      {service.tag}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--signal)]" />
                  </div>
                  <h3 className="mt-2 font-display text-sm text-[color:var(--ink)]">
                    {service.title}
                  </h3>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
