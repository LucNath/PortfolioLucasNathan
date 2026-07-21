"use client";

import { motion } from "framer-motion";
import { featuredProjects, additionalProjects } from "@/lib/portfolio-data";
import { SectionEyebrow } from "./About";

export default function Projects() {
  return (
    <section id="projetos" className="px-6 py-28">
      <div className="max-w-6xl mx-auto">
        <SectionEyebrow index="03" title="Projetos em destaque" />

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredProjects.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              whileHover={{ y: -4 }}
              className="group flex flex-col p-6 rounded-md bg-[color:var(--surface)] border border-[color:var(--border)] hover:border-[color:var(--signal-dim)] transition-colors"
            >
              <span className="self-start text-[10px] font-display uppercase tracking-widest px-2 py-1 rounded-full border border-[color:var(--data-dim)] text-data mb-4">
                {p.tag}
              </span>
              <h3 className="font-display text-base text-[color:var(--ink)] group-hover:text-signal transition-colors">
                {p.title}
              </h3>
              <p className="mt-3 text-sm text-[color:var(--ink-muted)] leading-relaxed flex-1">
                {p.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="text-[11px] font-display px-2 py-0.5 rounded-sm bg-[color:var(--bg-elevated)] text-[color:var(--ink-muted)]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-16 grid sm:grid-cols-2 gap-10">
          {Object.entries(additionalProjects).map(([group, items], gi) => (
            <motion.div
              key={group}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: gi * 0.1 }}
            >
              <h4 className="font-display text-xs uppercase tracking-widest text-[color:var(--ink-faint)] mb-4">
                {group}
              </h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li
                    key={item}
                    className="text-sm text-[color:var(--ink-muted)] flex items-center gap-2 before:content-['·'] before:text-signal"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
