"use client";

import { motion } from "framer-motion";
import { featuredProjects } from "@/lib/portfolio-data";
import { SectionEyebrow } from "./About";

export default function Projects() {
  return (
    <section id="projetos" className="min-h-screen snap-start snap-always overflow-y-auto px-6 py-24">
      <div className="mx-auto w-full max-w-6xl">
        <SectionEyebrow index="03" title="Projetos em destaque" />

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredProjects.map((project, i) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              whileHover={{ y: -4 }}
              className="group flex min-h-[230px] flex-col p-5 rounded-md bg-[color:var(--surface)] border border-[color:var(--border)] hover:border-[color:var(--signal-dim)] transition-colors"
            >
              <span className="self-start text-[10px] font-display uppercase tracking-widest px-2 py-1 rounded-full border border-[color:var(--data-dim)] text-data mb-4">
                {project.tag}
              </span>
              <h3 className="font-display text-base text-[color:var(--ink)] group-hover:text-signal transition-colors">
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
        </div>
      </div>
    </section>
  );
}
