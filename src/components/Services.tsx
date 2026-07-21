"use client";

import { motion } from "framer-motion";
import { processSteps, services, servicesIntro } from "@/lib/portfolio-data";

export default function Services() {
  return (
    <section className="px-6 py-24 border-y border-[color:var(--border)] bg-[color:var(--bg-elevated)]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[360px_minmax(0,1fr)] gap-10 lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55 }}
          >
            <p className="font-display text-xs uppercase tracking-[0.3em] text-data">
              {servicesIntro.eyebrow}
            </p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl text-[color:var(--ink)] tracking-tight">
              {servicesIntro.title}
            </h2>
            <p className="mt-5 text-[color:var(--ink-muted)] leading-relaxed">
              {servicesIntro.description}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4">
            {services.map((service, index) => (
              <motion.article
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-6"
              >
                <motion.span
                  aria-hidden
                  animate={{ x: ["-35%", "115%"] }}
                  transition={{ duration: 5 + index, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 h-px w-1/2 bg-[color:var(--signal)] opacity-70"
                />
                <span className="font-display text-[10px] uppercase tracking-[0.25em] text-data">
                  {service.tag}
                </span>
                <h3 className="mt-5 font-display text-lg text-[color:var(--ink)] group-hover:text-signal transition-colors">
                  {service.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[color:var(--ink-muted)]">
                  {service.description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-px rounded-lg border border-[color:var(--border)] bg-[color:var(--border)] overflow-hidden">
          {processSteps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="bg-[color:var(--bg-elevated)] p-5"
            >
              <span className="font-display text-sm text-signal">{step.step}</span>
              <h3 className="mt-3 font-display text-base text-[color:var(--ink)]">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--ink-muted)]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
