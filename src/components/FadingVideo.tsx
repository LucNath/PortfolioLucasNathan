"use client";

import { useEffect, useRef } from "react";

const FADE_MS = 500;
const FADE_OUT_LEAD = 0.55;

type FadingVideoProps = {
  src: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function FadingVideo({ src, className = "", style }: FadingVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadingOutRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const fadeTo = (target: number, duration: number) => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      const startOpacity = Number.parseFloat(video.style.opacity || "0");
      const startedAt = performance.now();

      const frame = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        video.style.opacity = String(startOpacity + (target - startOpacity) * progress);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(frame);
        } else {
          animationFrameRef.current = null;
        }
      };

      animationFrameRef.current = requestAnimationFrame(frame);
    };

    const handleLoadedData = () => {
      video.style.opacity = "0";
      void video.play().then(() => fadeTo(1, FADE_MS)).catch(() => undefined);
    };

    const handleTimeUpdate = () => {
      const remaining = video.duration - video.currentTime;
      if (!fadingOutRef.current && remaining > 0 && remaining <= FADE_OUT_LEAD) {
        fadingOutRef.current = true;
        fadeTo(0, FADE_MS);
      }
    };

    const handleEnded = () => {
      video.style.opacity = "0";
      restartTimerRef.current = setTimeout(() => {
        video.currentTime = 0;
        fadingOutRef.current = false;
        void video.play().then(() => fadeTo(1, FADE_MS)).catch(() => undefined);
      }, 100);
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
      if (restartTimerRef.current !== null) clearTimeout(restartTimerRef.current);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      muted
      playsInline
      preload="auto"
      className={className}
      style={{ ...style, opacity: 0 }}
      aria-hidden="true"
    />
  );
}
