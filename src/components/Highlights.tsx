"use client";

import { motion, type Variants } from "framer-motion";
import { highlights } from "@/lib/portfolio-data";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.07,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: "easeOut" },
  },
};

export default function Highlights() {
  return (
    <motion.section
      className="px-6 border-y border-[color:var(--border)]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={sectionVariants}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 divide-x divide-[color:var(--border)]">
        {highlights.map((highlight) => (
          <motion.div
            key={highlight.label}
            variants={itemVariants}
            className="signal-glass py-10 px-4 text-center"
          >
            <div className="font-display text-3xl sm:text-4xl text-signal">{highlight.value}</div>
            <div className="mt-1 text-xs uppercase tracking-widest text-[color:var(--ink-muted)]">
              {highlight.label}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
