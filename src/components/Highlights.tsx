"use client";

import { motion } from "framer-motion";
import { highlights } from "@/lib/portfolio-data";

export default function Highlights() {
  return (
    <section className="px-6 border-y border-[color:var(--border)]">
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 divide-x divide-[color:var(--border)]">
        {highlights.map((h, i) => (
          <motion.div
            key={h.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="py-10 px-4 text-center"
          >
            <div className="font-display text-3xl sm:text-4xl text-signal">{h.value}</div>
            <div className="mt-1 text-xs uppercase tracking-widest text-[color:var(--ink-muted)]">
              {h.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
