"use client";

import { motion } from "framer-motion";
import { productivitySection } from "@/lib/portfolio-data";

export default function Services() {
  return (
    <section
      id="entregas"
      className="relative overflow-hidden border-y border-[color:var(--border)] bg-[color:var(--ink)] px-6 py-24 text-[color:var(--bg)]"
    >
      <BlueprintGrid />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_0.95fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65 }}
          className="flex min-h-[620px] flex-col justify-between border-r border-[color:var(--border)] pr-8"
        >
          <div>
            <span className="inline-flex h-2 w-2 bg-[color:var(--data)]" />
            <p className="mt-8 font-display text-xs uppercase tracking-[0.28em] text-[color:var(--ink-faint)]">
              {productivitySection.eyebrow}
            </p>
            <h2 className="mt-8 font-display text-5xl leading-[0.95] tracking-[-0.08em] sm:text-6xl xl:text-7xl">
              {productivitySection.title}
            </h2>
          </div>

          <p className="max-w-md text-lg leading-relaxed text-[color:var(--surface-hover)]">
            {productivitySection.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative min-h-[620px] overflow-hidden bg-[color:var(--data-dim)] p-8 text-[color:var(--ink)]"
        >
          <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--bg)_0%,transparent_58%,var(--ink)_100%)] opacity-70" />
          <motion.div
            aria-hidden
            animate={{ backgroundPosition: ["0px 0px", "0px 56px"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 opacity-25 [background-image:linear-gradient(var(--ink-faint)_1px,transparent_1px)] [background-size:100%_56px]"
          />

          <div className="relative z-10">
            <div className="flex items-start justify-between gap-6 border-b border-[color:var(--data-dim)] pb-8">
              <div>
                <h3 className="font-display text-sm uppercase tracking-[0.16em]">
                  {productivitySection.panelTitle}
                </h3>
                <p className="mt-16 font-display text-sm uppercase tracking-[0.16em] text-[color:var(--ink-muted)]">
                  {productivitySection.panelMetricLabel}
                </p>
              </div>
              <div className="text-right font-display">
                <p className="text-2xl">{productivitySection.panelMetricValue}</p>
                <p className="mt-16 text-2xl">{productivitySection.panelSecondaryValue}</p>
              </div>
            </div>

            <div className="relative mt-12 h-80">
              <div className="absolute inset-0 border-l border-b border-dashed border-[color:var(--ink-faint)] opacity-60" />
              {Array.from({ length: 12 }).map((_, index) => (
                <span
                  key={index}
                  className="absolute bottom-0 top-0 border-l border-dashed border-[color:var(--ink-faint)] opacity-35"
                  style={{ left: `${8 + index * 7.5}%` }}
                />
              ))}
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <motion.path
                  d="M3 88 C12 85, 14 86, 23 75 S38 56, 48 48 S66 29, 78 18 S90 8, 97 4"
                  fill="none"
                  stroke="var(--ink)"
                  strokeWidth="0.7"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 1.5, delay: 0.35 }}
                />
                <motion.circle
                  cx="97"
                  cy="4"
                  r="1.4"
                  fill="var(--ink)"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 1.6 }}
                />
              </svg>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-px bg-[color:var(--border)]">
          {productivitySection.modules.map((module, index) => (
            <motion.article
              key={module.title}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.55, delay: index * 0.12 }}
              className="relative min-h-[200px] overflow-hidden bg-[color:var(--ink)] p-8"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <span className="font-display bg-[color:var(--bg)] px-2 py-1 text-xs text-[color:var(--ink)]">
                    · {module.index}
                  </span>
                  <h3 className="mt-6 font-display text-xl">{module.title}</h3>
                  <p className="mt-4 max-w-sm leading-relaxed text-[color:var(--surface-hover)]">
                    {module.description}
                  </p>
                </div>
                <DashedGlyph index={index} />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlueprintGrid() {
  return (
    <div aria-hidden className="absolute inset-0">
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="absolute inset-x-0 top-1/3 border-t border-dashed border-[color:var(--border)]" />
      <div className="absolute inset-x-0 bottom-20 border-t border-dashed border-[color:var(--border)]" />
    </div>
  );
}

function DashedGlyph({ index }: { index: number }) {
  const paths = [
    "M28 2 L54 48 L28 94 L2 48 Z M28 18 L42 48 L28 78 L14 48 Z",
    "M8 88 C24 50, 40 50, 56 12 M18 74 C38 88, 60 80, 74 56 M40 62 C54 54, 68 66, 82 44",
    "M8 24 L72 8 L90 72 L24 88 Z M26 36 L64 28 L72 62 L34 70 Z",
  ];

  return (
    <svg className="h-32 w-32 shrink-0 opacity-25" viewBox="0 0 96 96">
      <path
        d={paths[index % paths.length]}
        fill="none"
        stroke="var(--bg)"
        strokeWidth="1"
        strokeDasharray="2 2"
      />
    </svg>
  );
}
