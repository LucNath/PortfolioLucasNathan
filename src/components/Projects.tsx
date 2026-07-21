"use client";

import { motion, type Variants } from "framer-motion";
import { featuredProjects } from "@/lib/portfolio-data";
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

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: "easeOut" },
  },
  hover: {
    y: -4,
    transition: {
      type: "spring",
      stiffness: 320,
      damping: 24,
      mass: 0.7,
    },
  },
};

const badgeVariants: Variants = {
  hover: {
    scale: 1.04,
    transition: {
      type: "spring",
      stiffness: 420,
      damping: 20,
    },
  },
};

export default function Projects() {
  return (
    <motion.section
      id="projetos"
      className="min-h-screen snap-start snap-always overflow-y-auto px-6 py-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={sectionVariants}
    >
      <div className="mx-auto w-full max-w-6xl">
        <SectionEyebrow index="03" title="Projetos em destaque" />

        <motion.div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4" variants={gridVariants}>
          {featuredProjects.map((project) => (
            <motion.article
              key={project.title}
              variants={cardVariants}
              whileHover="hover"
              className="signal-glass group flex min-h-[230px] flex-col p-5 rounded-md hover:border-[color:var(--signal-dim)] transition-colors duration-300"
            >
              <motion.span
                variants={badgeVariants}
                className="self-start text-[10px] font-display uppercase tracking-widest px-2 py-1 rounded-full border border-[color:var(--data-dim)] text-data mb-4"
              >
                {project.tag}
              </motion.span>
              <h3 className="font-display text-base text-[color:var(--ink)] group-hover:text-signal transition-colors duration-300">
                {project.title}
              </h3>
              <p className="mt-3 text-sm text-[color:var(--ink-muted)] leading-relaxed flex-1">
                {project.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.stack.slice(0, 4).map((item) => (
                  <span
                    key={item}
                    className="text-[11px] font-display px-2 py-0.5 rounded-sm bg-[color:var(--bg-elevated)] text-[color:var(--ink-muted)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
