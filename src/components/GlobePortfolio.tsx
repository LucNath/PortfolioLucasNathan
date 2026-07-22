"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUp, ExternalLink, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode, type WheelEvent } from "react";
import {
  education,
  featuredProjects,
  globePortfolio,
  portfolioStats,
  profile,
  skillGroups,
} from "@/lib/portfolio-data";

const LAST_SECTION = globePortfolio.navigation.length - 1;
const transitionEase = [0.22, 1, 0.36, 1] as const;

export default function GlobePortfolio() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const wheelTotal = useRef(0);
  const wheelReset = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartY = useRef(0);
  const lockedUntil = useRef(0);
  const reducedMotion = useReducedMotion() ?? false;

  const goTo = useCallback(
    (nextIndex: number) => {
      const boundedIndex = Math.max(0, Math.min(LAST_SECTION, nextIndex));
      if (boundedIndex === activeIndex || Date.now() < lockedUntil.current) return;
      setDirection(boundedIndex > activeIndex ? 1 : -1);
      setActiveIndex(boundedIndex);
      lockedUntil.current = Date.now() + (reducedMotion ? 80 : 650);
      setMenuOpen(false);
    },
    [activeIndex, reducedMotion],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (["ArrowDown", "PageDown"].includes(event.key)) goTo(activeIndex + 1);
      if (["ArrowUp", "PageUp"].includes(event.key)) goTo(activeIndex - 1);
      if (event.key === "Home") goTo(0);
      if (event.key === "End") goTo(LAST_SECTION);
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, goTo]);

  useEffect(() => {
    const sectionSlug = globePortfolio.navigation[activeIndex]
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    window.history.replaceState(null, "", `#${sectionSlug}`);
  }, [activeIndex]);

  const handleWheel = (event: WheelEvent<HTMLElement>) => {
    const scrollArea = (event.target as Element).closest<HTMLElement>("[data-section-scroll]");
    if (scrollArea) {
      const atTop = scrollArea.scrollTop <= 1;
      const atBottom = scrollArea.scrollTop + scrollArea.clientHeight >= scrollArea.scrollHeight - 1;
      if ((event.deltaY < 0 && !atTop) || (event.deltaY > 0 && !atBottom)) return;
    }

    wheelTotal.current += event.deltaY;
    if (wheelReset.current) clearTimeout(wheelReset.current);
    wheelReset.current = setTimeout(() => {
      wheelTotal.current = 0;
    }, 140);

    if (Math.abs(wheelTotal.current) < 70) return;
    goTo(activeIndex + (wheelTotal.current > 0 ? 1 : -1));
    wheelTotal.current = 0;
  };

  const handleTouchEnd = (endY: number) => {
    const distance = touchStartY.current - endY;
    if (Math.abs(distance) > 55) goTo(activeIndex + (distance > 0 ? 1 : -1));
  };

  return (
    <main
      className="relative h-[100dvh] overflow-hidden bg-[var(--bg)] text-[var(--ink)]"
      onWheel={handleWheel}
      onTouchStart={(event) => {
        touchStartY.current = event.touches[0]?.clientY ?? 0;
      }}
      onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0]?.clientY ?? 0)}
    >
      <video
        className="pointer-events-none fixed inset-0 h-full w-full object-cover"
        src={globePortfolio.backgroundVideo}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--bg) 35%, transparent), color-mix(in srgb, var(--bg) 58%, transparent))",
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 50% 55%, transparent 0%, color-mix(in srgb, var(--bg) 72%, transparent) 100%)",
        }}
      />

      <PortfolioNavigation
        activeIndex={activeIndex}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        goTo={goTo}
      />

      <div className="absolute inset-x-0 bottom-16 top-20 z-20 overflow-hidden sm:bottom-20 sm:top-24">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.section
            key={activeIndex}
            custom={direction}
            variants={slideVariants}
            initial={reducedMotion ? false : "enter"}
            animate="center"
            exit={reducedMotion ? undefined : "exit"}
            transition={{ duration: reducedMotion ? 0 : 0.65, ease: transitionEase }}
            aria-live="polite"
            className="h-full"
          >
            <div
              data-section-scroll
              className="scrollbar-hide flex h-full items-center overflow-y-auto overscroll-contain px-5 py-6 sm:px-10 lg:px-16"
            >
              <div className="mx-auto w-full max-w-7xl">
                <SectionContent index={activeIndex} goTo={goTo} />
              </div>
            </div>
          </motion.section>
        </AnimatePresence>
      </div>

      <SectionControls activeIndex={activeIndex} goTo={goTo} />
    </main>
  );
}

const slideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? "12vh" : "-12vh",
    scale: 0.985,
    filter: "blur(12px)",
  }),
  center: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  exit: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? "-10vh" : "10vh",
    scale: 0.99,
    filter: "blur(8px)",
  }),
};

function PortfolioNavigation({
  activeIndex,
  menuOpen,
  setMenuOpen,
  goTo,
}: {
  activeIndex: number;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  goTo: (index: number) => void;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-5 py-4 sm:px-10 sm:py-5 lg:px-16">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <button type="button" onClick={() => goTo(0)} className="font-display text-sm tracking-tight">
          <span className="text-[var(--signal)]">&gt;</span> lucas.nathan
        </button>

        <nav className="signal-glass hidden items-center rounded-full p-1.5 md:flex">
          {globePortfolio.navigation.map((label, index) => (
            <button
              key={label}
              type="button"
              aria-current={activeIndex === index ? "page" : undefined}
              onClick={() => goTo(index)}
              className={`rounded-full px-4 py-2 font-display text-xs uppercase tracking-[0.12em] transition-all ${
                activeIndex === index
                  ? "bg-[var(--signal)] text-[var(--bg)]"
                  : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="globe-mobile-menu"
          aria-label={menuOpen ? "Fechar navegação" : "Abrir navegação"}
          className="signal-glass flex h-11 w-11 items-center justify-center rounded-full md:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <a
          href={`mailto:${profile.email}`}
          className="hidden rounded-full border border-[var(--border)] px-5 py-2.5 font-display text-xs uppercase tracking-wider transition-colors hover:border-[var(--signal-dim)] hover:text-[var(--signal)] md:block"
        >
          {globePortfolio.home.secondaryCta}
        </a>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="globe-mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="signal-glass mx-auto mt-4 flex max-w-7xl flex-col rounded-2xl p-2 md:hidden"
          >
            {globePortfolio.navigation.map((label, index) => (
              <button
                key={label}
                type="button"
                onClick={() => goTo(index)}
                className={`rounded-xl px-4 py-3 text-left font-display text-sm ${
                  activeIndex === index ? "bg-[var(--signal)] text-[var(--bg)]" : "text-[var(--ink)]"
                }`}
              >
                {label}
              </button>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function SectionContent({ index, goTo }: { index: number; goTo: (index: number) => void }) {
  if (index === 0) return <HomeSection goTo={goTo} />;
  if (index === 1) return <AboutSection />;
  if (index === 2) return <SkillsSection />;
  if (index === 3) return <ProjectsSection />;
  return <ContactSection />;
}

function HomeSection({ goTo }: { goTo: (index: number) => void }) {
  return (
    <div className="max-w-4xl">
      <Eyebrow>{profile.availability}</Eyebrow>
      <h1 className="mt-5 text-5xl font-medium leading-[0.92] tracking-[-0.06em] sm:text-7xl lg:text-[110px]">
        {profile.name}
      </h1>
      <p className="mt-4 font-display text-sm uppercase tracking-[0.18em] text-[var(--signal)] sm:text-base">
        {profile.role}
      </p>
      <p className="mt-7 max-w-2xl text-base leading-7 text-[var(--ink-muted)] sm:text-lg">
        {profile.clientPitch}
      </p>
      <div className="mt-9 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => goTo(1)}
          className="rounded-full bg-[var(--signal)] px-7 py-3.5 font-display text-xs uppercase tracking-wider text-[var(--bg)] transition-transform hover:scale-[1.03]"
        >
          {globePortfolio.home.primaryCta}
        </button>
        <a
          href={`mailto:${profile.email}`}
          className="rounded-full border border-[var(--border)] px-7 py-3.5 font-display text-xs uppercase tracking-wider hover:border-[var(--data-dim)] hover:text-[var(--data)]"
        >
          {globePortfolio.home.secondaryCta}
        </a>
      </div>
    </div>
  );
}

function AboutSection() {
  return (
    <div className="grid items-end gap-10 lg:grid-cols-[1.2fr_0.8fr]">
      <div>
        <Eyebrow>{globePortfolio.about.eyebrow}</Eyebrow>
        <h2 className="mt-5 max-w-3xl text-4xl leading-tight tracking-[-0.04em] sm:text-6xl">
          {globePortfolio.about.title}
        </h2>
        <p className="mt-7 max-w-3xl text-base leading-8 text-[var(--ink-muted)] sm:text-lg">
          {profile.about}
        </p>
      </div>
      <div className="signal-glass rounded-3xl p-6 sm:p-8">
        <p className="font-display text-xs uppercase tracking-[0.18em] text-[var(--data)]">
          {globePortfolio.about.educationLabel} · {education.status}
        </p>
        <h3 className="mt-4 text-xl leading-snug">{education.course}</h3>
        <div className="mt-6 flex flex-wrap gap-2">
          {education.subjects.map((subject) => <Tag key={subject}>{subject}</Tag>)}
        </div>
        <div className="mt-7 grid grid-cols-2 gap-3">
          {portfolioStats.map((stat) => (
            <div key={stat.label} className="border-t border-[var(--border)] pt-3">
              <strong className="text-xl text-[var(--signal)]">{stat.value}</strong>
              <span className="mt-1 block text-xs text-[var(--ink-muted)]">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SkillsSection() {
  return (
    <div>
      <Eyebrow>{globePortfolio.skills.eyebrow}</Eyebrow>
      <h2 className="mt-5 max-w-4xl text-4xl leading-tight tracking-[-0.04em] sm:text-6xl">
        {globePortfolio.skills.title}
      </h2>
      <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {skillGroups.map((group, index) => (
          <motion.article
            key={group.title}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07, duration: 0.45 }}
            className="signal-glass rounded-3xl p-5 sm:p-6"
          >
            <span className="font-display text-xs text-[var(--signal)]">0{index + 1}</span>
            <h3 className="mt-3 text-xl">{group.title}</h3>
            <div className="mt-5 flex flex-wrap gap-2">
              {group.items.map((item) => <Tag key={item}>{item}</Tag>)}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function ProjectsSection() {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <Eyebrow>{globePortfolio.projects.eyebrow}</Eyebrow>
          <h2 className="mt-5 text-4xl tracking-[-0.04em] sm:text-6xl">{globePortfolio.projects.title}</h2>
        </div>
        <a href={profile.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-[var(--data)]">
          {globePortfolio.projects.repositoryCta} <ExternalLink className="h-4 w-4" />
        </a>
      </div>
      <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {featuredProjects.map((project, index) => (
          <motion.article
            key={project.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.055, duration: 0.4 }}
            className="signal-glass rounded-3xl p-5"
          >
            <p className="font-display text-[10px] uppercase tracking-[0.15em] text-[var(--data)]">{project.tag}</p>
            <h3 className="mt-3 text-lg leading-snug">{project.title}</h3>
            <p className="mt-3 text-sm leading-6 text-[var(--ink-muted)]">{project.description}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.stack.slice(0, 4).map((item) => <Tag key={item}>{item}</Tag>)}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function ContactSection() {
  const details = [
    { label: globePortfolio.contact.emailLabel, value: profile.email, href: `mailto:${profile.email}`, icon: Mail },
    { label: globePortfolio.contact.phoneLabel, value: profile.phone, href: `tel:${profile.phone.replace(/\D/g, "")}`, icon: Phone },
    { label: globePortfolio.contact.locationLabel, value: profile.location, icon: MapPin },
    { label: globePortfolio.contact.linkedinLabel, value: "linkedin.com/in/lucas-nathan", href: profile.linkedin, icon: ExternalLink },
    { label: globePortfolio.contact.githubLabel, value: "github.com/LucNath", href: profile.github, icon: ExternalLink },
  ];

  return (
    <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <Eyebrow>{globePortfolio.contact.eyebrow}</Eyebrow>
        <h2 className="mt-5 max-w-3xl text-5xl leading-[1.02] tracking-[-0.05em] sm:text-7xl">
          {globePortfolio.contact.title}
        </h2>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--ink-muted)]">{globePortfolio.contact.description}</p>
      </div>
      <div className="signal-glass rounded-3xl p-5 sm:p-7">
        {details.map(({ label, value, href, icon: Icon }) => {
          const content = (
            <div className="flex items-center gap-4 border-b border-[var(--border)] py-4 last:border-0">
              <Icon className="h-4 w-4 shrink-0 text-[var(--signal)]" />
              <div className="min-w-0">
                <span className="font-display text-[10px] uppercase tracking-wider text-[var(--ink-muted)]">{label}</span>
                <span className="block truncate text-sm sm:text-base">{value}</span>
              </div>
            </div>
          );
          return href ? <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{content}</a> : <div key={label}>{content}</div>;
        })}
      </div>
    </div>
  );
}

function SectionControls({ activeIndex, goTo }: { activeIndex: number; goTo: (index: number) => void }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-5 pb-4 sm:px-10 sm:pb-6 lg:px-16">
      <div className="mx-auto flex max-w-7xl items-end justify-between">
        <div>
          <p className="font-display text-[10px] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
            {globePortfolio.controls.scrollHint}
          </p>
          <div className="mt-2 h-px w-36 bg-[var(--border)] sm:w-52">
            <motion.div
              className="h-full bg-[var(--signal)]"
              animate={{ width: `${((activeIndex + 1) / globePortfolio.navigation.length) * 100}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-display text-xs text-[var(--ink-muted)]">
            0{activeIndex + 1} / 0{globePortfolio.navigation.length}
          </span>
          <button type="button" disabled={activeIndex === 0} onClick={() => goTo(activeIndex - 1)} aria-label={globePortfolio.controls.previous} className="signal-glass flex h-10 w-10 items-center justify-center rounded-full disabled:opacity-30">
            <ArrowUp className="h-4 w-4" />
          </button>
          <button type="button" disabled={activeIndex === LAST_SECTION} onClick={() => goTo(activeIndex + 1)} aria-label={globePortfolio.controls.next} className="signal-glass flex h-10 w-10 items-center justify-center rounded-full disabled:opacity-30">
            <ArrowDown className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="font-display text-xs uppercase tracking-[0.2em] text-[var(--data)]">{children}</p>;
}

function Tag({ children }: { children: ReactNode }) {
  return <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[10px] text-[var(--ink-muted)]">{children}</span>;
}
