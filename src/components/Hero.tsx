"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import SignalTrace from "./SignalTrace";
import { heroCta, heroHeadline, heroPanel, heroRoles, profile } from "@/lib/portfolio-data";

const nodePositions = [
  { x: 62, y: 18, size: 46 },
  { x: 78, y: 30, size: 28 },
  { x: 55, y: 46, size: 72 },
  { x: 84, y: 58, size: 52 },
  { x: 68, y: 72, size: 34 },
  { x: 91, y: 42, size: 22 },
];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setRoleIndex((i) => (i + 1) % heroRoles.length), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="top" className="relative min-h-screen snap-start snap-always overflow-hidden px-6 pt-28 pb-10 grain">
      <IndustrialBackdrop />

      <div className="relative z-10 max-w-7xl mx-auto min-h-[calc(100vh-9.5rem)] flex flex-col">
        <div className="grid flex-1 items-center gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(420px,1fr)]">
          <div className="relative">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-display text-xs uppercase tracking-[0.3em] text-data"
            >
              {profile.location} · {profile.availability}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-10 max-w-4xl font-display text-5xl sm:text-7xl lg:text-8xl leading-[0.92] tracking-[-0.08em] text-[color:var(--ink)]"
            >
              {heroHeadline.lineOne}
              <br />
              <span className="text-signal">{heroHeadline.lineTwo}</span>
            </motion.h1>

            <div className="mt-8 min-h-8 font-display text-base sm:text-lg text-[color:var(--ink-muted)]">
              <span className="text-[color:var(--ink-faint)]">{heroHeadline.commandLabel}</span>
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
              className="mt-8 max-w-2xl text-base sm:text-lg leading-relaxed text-[color:var(--ink-muted)]"
            >
              {profile.clientPitch}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-10 flex flex-wrap"
            >
              <a
                href={`mailto:${profile.email}?subject=Quero%20iniciar%20um%20briefing`}
                className="font-display text-sm uppercase tracking-widest bg-[color:var(--ink)] px-6 py-3 text-[color:var(--bg)] transition-opacity hover:opacity-90"
              >
                {heroCta.primary}
              </a>
              <a
                href="#entregas"
                className="font-display text-sm uppercase tracking-widest border border-[color:var(--border)] bg-[color:var(--surface)]/80 px-6 py-3 text-[color:var(--ink)] transition-colors hover:border-[color:var(--data)] hover:text-data"
              >
                {heroCta.secondary}
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative min-h-[540px] hidden lg:block"
            aria-hidden="true"
          >
            <TechNetwork />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="grid gap-5 pb-2 lg:grid-cols-[minmax(0,0.9fr)_minmax(380px,0.7fr)]"
        >
          <div className="hidden items-end gap-4 font-display text-xs uppercase tracking-widest text-[color:var(--ink-muted)] lg:flex">
            <span className="text-data">{heroHeadline.sourceLabel}</span>
            <span className="h-px flex-1 bg-[color:var(--border)]" />
            <span>{heroPanel.label}</span>
          </div>

          <a
            href={`mailto:${profile.email}?subject=Quero%20criar%20um%20projeto`}
            className="group relative border border-[color:var(--border)] bg-[color:var(--surface)]/85 p-5 transition-colors hover:border-[color:var(--data)]"
          >
            <span className="absolute left-0 top-0 h-2 w-2 bg-[color:var(--data)]" />
            <div className="flex items-center justify-between gap-4">
              <span className="font-display text-xs uppercase tracking-[0.18em] text-[color:var(--ink-muted)]">
                {heroPanel.newsEyebrow}
              </span>
              <span className="font-display text-xs text-signal">{heroPanel.status}</span>
            </div>
            <p className="mt-5 font-display text-lg leading-snug text-[color:var(--ink)]">
              {heroPanel.newsTitle}
            </p>
            <span className="mt-5 inline-flex font-display text-data transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function IndustrialBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,var(--data-dim),transparent_34%),radial-gradient(circle_at_25%_60%,var(--signal-dim),transparent_30%),linear-gradient(120deg,var(--bg),var(--bg-elevated)_48%,var(--bg))] opacity-80" />
      <motion.div
        animate={{ backgroundPosition: ["0px 0px", "80px 80px"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 opacity-25 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:80px_80px]"
      />
      <div className="absolute inset-y-0 right-0 w-2/3 opacity-30 [background:repeating-linear-gradient(135deg,transparent_0_22px,var(--ink-faint)_23px_24px)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--bg)_0%,transparent_45%,var(--bg)_100%)]" />
    </div>
  );
}

function TechNetwork() {
  return (
    <div className="absolute inset-0">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.path
          d="M18 72 C34 55, 40 52, 55 46 S78 29, 94 38"
          fill="none"
          stroke="var(--signal)"
          strokeWidth="0.18"
          strokeDasharray="1.2 1.2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.65 }}
          transition={{ duration: 2.4, delay: 0.4 }}
        />
        <motion.path
          d="M12 26 L45 48 L72 22 L94 66 M35 84 L55 46 L87 77"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="0.12"
          strokeDasharray="0.8 1.1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.45 }}
          transition={{ duration: 2.8, delay: 0.65 }}
        />
      </svg>

      {nodePositions.map((node, index) => (
        <motion.div
          key={`${node.x}-${node.y}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 + index * 0.08 }}
          className="absolute border border-[color:var(--ink-faint)] bg-[color:var(--surface)]/25 backdrop-blur-sm"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            width: node.size,
            height: node.size,
          }}
        />
      ))}

      <motion.div
        animate={{ y: [0, -12, 0], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[22%] top-[20%] w-[62%] border border-[color:var(--data-dim)] bg-[color:var(--surface)]/50 p-5 backdrop-blur-md"
      >
        <div className="flex items-center justify-between border-b border-[color:var(--border)] pb-4">
          <div>
            <p className="font-display text-[10px] uppercase tracking-[0.3em] text-data">
              {heroPanel.eyebrow}
            </p>
            <h2 className="mt-2 font-display text-2xl text-[color:var(--ink)]">
              {heroPanel.title}
            </h2>
          </div>
          <span className="font-display text-xs text-signal">{heroPanel.status}</span>
        </div>
        <div className="py-5">
          <SignalTrace className="w-full" color="var(--signal-dim)" height={84} />
        </div>
      </motion.div>
    </div>
  );
}
