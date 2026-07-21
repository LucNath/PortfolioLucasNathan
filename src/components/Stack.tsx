"use client";

import { motion, type Variants } from "framer-motion";
import { skillGroups } from "@/lib/portfolio-data";
import { SectionEyebrow } from "./About";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const groupVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const skillListVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const skillItemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: "easeOut" },
  },
};

export default function Stack() {
  return (
    <motion.section
      id="stack"
      className="flex min-h-screen snap-start snap-always items-center bg-[color:var(--bg-elevated)] px-6 py-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={sectionVariants}
    >
      <div className="mx-auto w-full max-w-6xl">
        <SectionEyebrow index="02" title="Stack técnica" />

        <motion.div
          className="mt-12 grid sm:grid-cols-2 gap-px bg-[color:var(--border)] border border-[color:var(--border)] rounded-md overflow-hidden"
          variants={gridVariants}
        >
          {skillGroups.map((group) => (
            <motion.div
              key={group.title}
              variants={groupVariants}
              className="bg-[color:var(--bg-elevated)] p-6"
            >
              <h3 className="font-display text-xs uppercase tracking-widest text-data mb-4">
                {group.title}
              </h3>
              <motion.div className="flex flex-wrap gap-2" variants={skillListVariants}>
                {group.items.map((item) => (
                  <motion.span
                    key={item}
                    variants={skillItemVariants}
                    className="text-sm px-3 py-1.5 rounded-sm bg-[color:var(--surface)] border border-[color:var(--border)] text-[color:var(--ink)]"
                  >
                    {item}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
