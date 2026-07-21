"use client";

import { motion, type Variants } from "framer-motion";
import { education, focusAreas } from "@/lib/portfolio-data";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function About() {
  return (
    <motion.section
      id="sobre"
      className="flex min-h-screen snap-start snap-always items-center px-6 py-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={sectionVariants}
    >
      <div className="mx-auto w-full max-w-6xl">
        <SectionEyebrow index="01" title="Sobre & áreas de atuação" />

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {focusAreas.map((area, i) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="p-6 rounded-md bg-[color:var(--surface)] border border-[color:var(--border)] hover:border-[color:var(--signal-dim)] transition-colors"
            >
              <div className="font-display text-signal text-sm mb-3">0{i + 1}</div>
              <h3 className="font-display text-lg text-[color:var(--ink)]">{area.title}</h3>
              <p className="mt-2 text-sm text-[color:var(--ink-muted)] leading-relaxed">
                {area.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="mt-6 p-6 rounded-md border border-dashed border-[color:var(--border)]"
        >
          <p className="font-display text-xs uppercase tracking-widest text-data mb-2">
            {education.status}
          </p>
          <h3 className="text-[color:var(--ink)] font-medium">{education.course}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {education.subjects.map((subject) => (
              <span
                key={subject}
                className="text-xs font-display px-3 py-1 rounded-full border border-[color:var(--border)] text-[color:var(--ink-muted)]"
              >
                {subject}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export function SectionEyebrow({ index, title }: { index: string; title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.45 }}
      className="flex items-center gap-4"
    >
      <span className="font-display text-signal text-sm">{index}</span>
      <span className="h-px flex-1 max-w-12 bg-[color:var(--border)]" />
      <h2 className="font-display text-xl sm:text-2xl tracking-tight text-[color:var(--ink)]">
        {title}
      </h2>
    </motion.div>
  );
}
