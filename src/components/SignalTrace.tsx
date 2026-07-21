"use client";

import { motion } from "framer-motion";

/**
 * Elemento de assinatura do site: uma trilha de sinal que se desenha,
 * remetendo a osciloscópio / telemetria — o mundo do Lucas (IoT, embarcados,
 * geofencing). Reaparece em variações menores como divisor de seções.
 */
export default function SignalTrace({
  className = "",
  color = "var(--signal)",
  height = 120,
}: {
  className?: string;
  color?: string;
  height?: number;
}) {
  const path =
    "M0,60 C 40,60 40,20 80,20 C 120,20 120,100 160,100 C 200,100 200,10 240,10 C 280,10 280,90 320,90 C 360,90 360,50 400,50 C 440,50 440,70 480,70 C 520,70 520,30 560,30 C 600,30 600,60 640,60 C 680,60 680,45 720,45 C 760,45 760,60 800,60";

  return (
    <svg
      viewBox="0 0 800 120"
      preserveAspectRatio="none"
      className={className}
      style={{ height }}
      aria-hidden="true"
    >
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: "easeInOut" }}
      />
    </svg>
  );
}
