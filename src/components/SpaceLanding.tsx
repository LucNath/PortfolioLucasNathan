"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import BlurText from "./BlurText";
import FadingVideo from "./FadingVideo";
import { spaceLanding } from "@/lib/portfolio-data";

const iconPaths = {
  image: "M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21H5Zm1-4h12l-3.75-5-3 4L9 13l-3 4Z",
  movie: "M4 6.47 5.76 10H20v8H4V6.47M22 4h-4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.89-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4Z",
  lightbulb: "M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1Zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7Z",
} as const;

const reveal = (delay: number, reduced: boolean | null): Variants => ({
  hidden: reduced ? { opacity: 1 } : { filter: "blur(10px)", opacity: 0, y: 20 },
  visible: {
    filter: "blur(0px)",
    opacity: 1,
    y: 0,
    transition: { duration: reduced ? 0 : 0.7, delay: reduced ? 0 : delay, ease: "easeOut" },
  },
});

export default function SpaceLanding() {
  const reduced = useReducedMotion();
  const { hero, capabilities, navigation } = spaceLanding;

  return (
    <main className="space-landing h-screen snap-y snap-mandatory overflow-y-auto bg-black text-white">
      <nav className="fixed inset-x-0 top-4 z-50 flex items-center justify-between px-8 lg:px-16">
        <a
          href="#home"
          aria-label="Home"
          className="liquid-glass flex h-12 w-12 items-center justify-center rounded-full font-space-heading text-3xl italic"
        >
          a
        </a>

        <div className="liquid-glass hidden items-center rounded-full p-1.5 md:flex">
          {navigation.map((item, index) => (
            <a
              key={item}
              href={index === 0 ? "#home" : index === navigation.length - 1 ? "#capabilities" : "#capabilities"}
              className="whitespace-nowrap px-3 py-2 font-space-body text-sm font-medium text-white/90"
            >
              {item}
            </a>
          ))}
          <a
            href="#capabilities"
            className="flex items-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-2 font-space-body text-sm font-medium text-black"
          >
            Claim a Spot <ArrowUpRight />
          </a>
        </div>

        <span className="h-12 w-12" aria-hidden="true" />
      </nav>

      <section id="home" className="relative flex min-h-screen snap-start snap-always overflow-hidden bg-black">
        <FadingVideo
          src={hero.video}
          className="absolute left-1/2 top-0 z-0 -translate-x-1/2 object-cover object-top"
          style={{ width: "120%", height: "120%" }}
        />

        <div className="relative z-10 flex min-h-screen w-full flex-col">
          <div className="flex flex-1 flex-col items-center justify-center px-4 pt-24 text-center">
            <motion.div
              variants={reveal(0.4, reduced)}
              initial="hidden"
              animate="visible"
              className="liquid-glass flex items-center gap-2 rounded-full p-1"
            >
              <span className="rounded-full bg-white px-3 py-1 font-space-body text-xs font-semibold text-black">New</span>
              <span className="pr-3 font-space-body text-sm text-white/90">{hero.badge}</span>
            </motion.div>

            <BlurText
              text={hero.headline}
              centered
              className="mt-7 max-w-2xl font-space-heading text-6xl leading-[0.8] tracking-[-4px] text-white italic md:text-7xl lg:text-[5.5rem]"
            />

            <motion.p
              variants={reveal(0.8, reduced)}
              initial="hidden"
              animate="visible"
              className="mt-4 max-w-2xl font-space-body text-sm font-light leading-tight text-white md:text-base"
            >
              {hero.description}
            </motion.p>

            <motion.div
              variants={reveal(1.1, reduced)}
              initial="hidden"
              animate="visible"
              className="mt-6 flex items-center gap-6"
            >
              <a href="#capabilities" className="liquid-glass-strong flex items-center gap-2 rounded-full px-5 py-2.5 font-space-body text-sm font-medium text-white">
                {hero.primaryCta} <ArrowUpRight />
              </a>
              <a href="#capabilities" className="flex items-center gap-2 font-space-body text-sm font-medium text-white">
                {hero.secondaryCta} <PlayIcon />
              </a>
            </motion.div>

            <motion.div
              variants={reveal(1.3, reduced)}
              initial="hidden"
              animate="visible"
              className="mt-8 flex flex-wrap items-stretch justify-center gap-4"
            >
              {hero.stats.map((stat) => (
                <div key={stat.label} className="liquid-glass flex w-[220px] flex-col rounded-[1.25rem] p-5 text-left">
                  {stat.icon === "clock" ? <ClockIcon /> : <GlobeIcon />}
                  <div className="mt-8 font-space-heading text-4xl leading-none tracking-[-1px] italic">{stat.value}</div>
                  <div className="mt-2 font-space-body text-xs font-light">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            variants={reveal(1.4, reduced)}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center gap-4 px-4 pb-8"
          >
            <span className="liquid-glass rounded-full px-3.5 py-1 font-space-body text-xs font-medium">{hero.partnerLabel}</span>
            <div className="flex flex-wrap justify-center gap-8 font-space-heading text-2xl tracking-tight italic md:gap-16 md:text-3xl">
              {hero.partners.map((partner) => <span key={partner}>{partner}</span>)}
            </div>
          </motion.div>
        </div>
      </section>

      <section id="capabilities" className="relative min-h-screen snap-start snap-always overflow-hidden bg-black">
        <FadingVideo src={capabilities.video} className="absolute inset-0 z-0 h-full w-full object-cover" />

        <div className="relative z-10 flex min-h-screen flex-col px-8 pb-10 pt-24 md:px-16 lg:px-20">
          <motion.header
            initial={reduced ? false : { filter: "blur(10px)", opacity: 0, y: 20 }}
            whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: reduced ? 0 : 0.7, ease: "easeOut" }}
            className="mb-auto"
          >
            <p className="mb-6 font-space-body text-sm text-white/80">{capabilities.kicker}</p>
            <h2 className="font-space-heading text-6xl leading-[0.9] tracking-[-3px] italic md:text-7xl lg:text-[6rem]">
              Production<br />evolved
            </h2>
          </motion.header>

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
            {capabilities.cards.map((card, index) => (
              <motion.article
                key={card.title}
                initial={reduced ? false : { filter: "blur(10px)", opacity: 0, y: 20 }}
                whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: reduced ? 0 : 0.7, delay: reduced ? 0 : index * 0.12, ease: "easeOut" }}
                className="liquid-glass flex min-h-[360px] flex-col rounded-[1.25rem] p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="liquid-glass flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.75rem]">
                    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
                      <path d={iconPaths[card.icon]} />
                    </svg>
                  </div>
                  <div className="flex max-w-[70%] flex-wrap justify-end gap-1.5">
                    {card.tags.map((tag) => (
                      <span key={tag} className="liquid-glass whitespace-nowrap rounded-full px-3 py-1 font-space-body text-[11px] text-white/90">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="flex-1" />
                <div className="mt-6">
                  <h3 className="font-space-heading text-3xl leading-none tracking-[-1px] italic md:text-4xl">{card.title}</h3>
                  <p className="mt-3 max-w-[32ch] font-space-body text-sm font-light leading-snug text-white/90">{card.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function ArrowUpRight() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" /></svg>;
}

function PlayIcon() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true"><path d="M6 4 20 12 6 20Z" /></svg>;
}

function ClockIcon() {
  return <svg viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-current" strokeWidth="1.7" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
}

function GlobeIcon() {
  return <svg viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-current" strokeWidth="1.7" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></svg>;
}
