'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [hasLoadedBefore] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!sessionStorage.getItem('jobswipe_loaded');
    }
    return false;
  });

  useEffect(() => {
    if (hasLoadedBefore) {
      onComplete();
      return;
    }

    // Only show once per session
    const key = 'jobswipe_loaded';
    sessionStorage.setItem(key, '1');

    // Simple counter: 0 → 100 over ~1.2s
    let frame: number;
    let start: number | null = null;
    const duration = 1200;

    function tick(ts: number) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      setCount(Math.round(eased * 100));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        // Hold at 100 briefly, then exit
        setTimeout(() => {
          setExiting(true);
          setTimeout(onComplete, 700);
        }, 200);
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [hasLoadedBefore, onComplete]);

  if (hasLoadedBefore) {
    return null;
  }

  return (
    <motion.div
      ref={containerRef}
      animate={exiting ? { y: '-100%' } : { y: 0 }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[99999] bg-void flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Noise grain */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Radial glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[120px]" />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center mb-16"
      >
        <h1 className="text-[42px] font-black tracking-[-0.04em] font-heading text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-teal-400">
          JOBSWIPE
        </h1>
        <p className="text-[11px] font-semibold text-gray-500 tracking-[0.3em] uppercase mt-1">
          Hyperlocal Gig Platform
        </p>
      </motion.div>

      {/* Progress bar */}
      <div className="relative z-10 w-48">
        <div className="h-[1px] bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-500 origin-left transition-transform duration-100"
            style={{ transform: `scaleX(${count / 100})` }}
          />
        </div>
        <div className="flex justify-between items-center mt-3">
          <span className="text-[10px] text-gray-600 font-mono tracking-wider">LOADING</span>
          <span className="text-[10px] text-gray-400 font-mono tabular-nums">
            {count}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
