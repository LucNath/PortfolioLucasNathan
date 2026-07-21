"use client";

import { motion } from "framer-motion";
import { contactCta, profile } from "@/lib/portfolio-data";
import SignalTrace from "./SignalTrace";

export default function Contact() {
  return (
    <section
      id="contato"
      className="flex min-h-screen snap-start snap-always flex-col justify-center bg-[color:var(--bg-elevated)] px-6 py-24"
    >
      <div className="mx-auto w-full max-w-6xl text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-xs uppercase tracking-[0.3em] text-data mb-4"
        >
          {contactCta.eyebrow}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-display text-3xl sm:text-5xl tracking-tight text-[color:var(--ink)] max-w-3xl mx-auto"
        >
          {contactCta.title}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <a
            href={`mailto:${profile.email}?subject=Quero%20criar%20um%20projeto`}
            className="font-display text-sm uppercase tracking-widest px-6 py-3 rounded-sm bg-[color:var(--signal)] text-[color:var(--bg)] hover:opacity-90 transition-opacity"
          >
            {contactCta.emailLabel}
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="font-display text-sm uppercase tracking-widest px-6 py-3 rounded-sm border border-[color:var(--border)] hover:border-[color:var(--ink-faint)] transition-colors"
          >
            LinkedIn
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="font-display text-sm uppercase tracking-widest px-6 py-3 rounded-sm border border-[color:var(--border)] hover:border-[color:var(--ink-faint)] transition-colors"
          >
            GitHub
          </a>
        </motion.div>

        <div className="mt-16">
          <SignalTrace className="w-full max-w-3xl mx-auto" color="var(--data-dim)" height={70} />
        </div>
      </div>

      <footer className="mx-auto mt-16 flex w-full max-w-6xl flex-col items-center justify-between gap-4 border-t border-[color:var(--border)] pt-8 font-display text-xs text-[color:var(--ink-faint)] sm:flex-row">
        <span>
          © {new Date().getFullYear()} {profile.fullName}
        </span>
        <span>{profile.location}</span>
      </footer>
    </section>
  );
}
