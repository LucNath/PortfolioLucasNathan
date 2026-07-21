"use client";

import { motion } from "framer-motion";
import { skillGroups } from "@/lib/portfolio-data";
import { SectionEyebrow } from "./About";

export default function Stack() {
  return (
    <section id="stack" className="px-6 py-28 bg-[color:var(--bg-elevated)]">
      <div className="max-w-6xl mx-auto">
        <SectionEyebrow index="02" title="Stack técnica" />

        <div className="mt-12 grid sm:grid-cols-2 gap-px bg-[color:var(--border)] border border-[color:var(--border)] rounded-md overflow-hidden">
          {skillGroups.map((group, i) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-[color:var(--bg-elevated)] p-6"
            >
              <h3 className="font-display text-xs uppercase tracking-widest text-data mb-4">
                {group.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="text-sm px-3 py-1.5 rounded-sm bg-[color:var(--surface)] border border-[color:var(--border)] text-[color:var(--ink)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
