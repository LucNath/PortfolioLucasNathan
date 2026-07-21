"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

type BlurTextProps = {
  text: string;
  className?: string;
  centered?: boolean;
};

export default function BlurText({ text, className = "", centered = false }: BlurTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <span
      ref={containerRef}
      aria-label={text}
      className={`flex flex-wrap gap-y-[0.1em] ${centered ? "justify-center" : ""} ${className}`}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          aria-hidden="true"
          initial={
            shouldReduceMotion
              ? false
              : { filter: "blur(10px)", opacity: 0, y: 50 }
          }
          animate={
            shouldReduceMotion || isInView
              ? {
                  filter: ["blur(10px)", "blur(5px)", "blur(0px)"],
                  opacity: [0, 0.5, 1],
                  y: [50, -5, 0],
                }
              : { filter: "blur(10px)", opacity: 0, y: 50 }
          }
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  duration: 0.7,
                  times: [0, 0.5, 1],
                  ease: "easeOut",
                  delay: index * 0.1,
                }
          }
          style={{ display: "inline-block", marginRight: "0.28em" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
