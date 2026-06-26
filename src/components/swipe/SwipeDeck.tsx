'use client';

import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Check, RotateCcw, MapPin, ArrowRight, Search, Zap, Clock, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobData {
  id: string;
  title: string;
  provider: string;
  pay: string;
  duration: string;
  distance: string;
  skills: string[];
  description: string;
}

interface SwipeDeckProps {
  jobs: JobData[];
  onApply: (jobId: string) => void;
  onSkip: (jobId: string) => void;
  onTapDetails: (jobId: string) => void;
  onResetDeck: () => void;
}

export default function SwipeDeck({
  jobs = [],
  onApply,
  onSkip,
  onTapDetails,
  onResetDeck,
}: SwipeDeckProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swipedStates, setSwipedStates] = useState<Record<string, 'apply' | 'skip' | null>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync activeIndex if jobs reset
  useEffect(() => {
    setActiveIndex(0);
    setSwipedStates({});
  }, [jobs]);

  // Spring transition config from StylishCarousel
  const spring = {
    type: "spring" as const,
    bounce: 0.15,
    duration: 0.8,
  };

  const handleSwipeLeft = useCallback((idx: number) => {
    if (idx >= jobs.length) return;
    const job = jobs[idx];
    setSwipedStates(prev => ({ ...prev, [job.id]: 'skip' }));
    onSkip(job.id);
    if (idx < jobs.length - 1) {
      setActiveIndex(idx + 1);
    } else {
      setActiveIndex(jobs.length);
    }
  }, [jobs, onSkip]);

  const handleSwipeRight = useCallback((idx: number) => {
    if (idx >= jobs.length) return;
    const job = jobs[idx];
    setSwipedStates(prev => ({ ...prev, [job.id]: 'apply' }));
    onApply(job.id);
    if (idx < jobs.length - 1) {
      setActiveIndex(idx + 1);
    } else {
      setActiveIndex(jobs.length);
    }
  }, [jobs, onApply]);

  const handleUndo = useCallback(() => {
    if (activeIndex > 0) {
      const prevIdx = activeIndex - 1;
      const prevJob = jobs[prevIdx];
      setSwipedStates(prev => ({ ...prev, [prevJob.id]: null }));
      setActiveIndex(prevIdx);
    }
  }, [activeIndex, jobs]);

  if (!jobs.length || activeIndex >= jobs.length) {
    return (
      <div className="relative w-full flex flex-col items-center max-w-md mx-auto">
        <motion.div
          key="empty"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-[500px] rounded-2xl p-8 flex flex-col justify-center items-center text-center bg-deep/50 backdrop-blur-xl border border-white/[0.06] shadow-[0_16px_50px_rgba(0,0,0,0.45)]"
        >
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6"
          >
            <Search className="w-6 h-6" />
          </motion.div>

          <h3 className="text-[20px] font-bold text-gray-100 font-heading mb-2">All Caught Up</h3>
          <p className="text-[12.5px] text-gray-500 leading-relaxed max-w-xs mb-8">
            You've swiped through all gigs in your radius. Expand your filters or check back soon — new listings appear daily.
          </p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              onResetDeck();
              setActiveIndex(0);
              setSwipedStates({});
            }}
            className="px-7 py-3.5 rounded-xl bg-indigo-500 hover:bg-[#ff7343] text-[12.5px] font-bold text-white transition-all cursor-pointer shadow-md shadow-indigo-900/10"
          >
            Reset Deck
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const slideSize = "330px";
  const rotationDegrees = 26;
  const inactiveScale = 0.65;
  const yOffsetPercent = 38;

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center select-none w-full max-w-lg mx-auto"
      role="region"
      aria-label="Job Swipe Deck"
    >
      {/* ── SLIDES CONTAINER ─────────────────────────────────────────────── */}
      <div
        style={{ width: slideSize, height: "500px" }}
        className="relative mt-2 overflow-visible"
      >
        {/* Horizontal sliding strip */}
        <motion.div
          className="flex w-fit h-full items-start overflow-visible"
          animate={{ x: `${(-activeIndex * 100) / jobs.length}%` }}
          transition={spring}
        >
          {jobs.map((job, i) => {
            const offset = i - activeIndex;
            const isActive = offset === 0;

            return (
              <CarouselCard
                key={job.id}
                job={job}
                index={i}
                offset={offset}
                isActive={isActive}
                slideSize={slideSize}
                rotationDegrees={rotationDegrees}
                inactiveScale={inactiveScale}
                yOffsetPercent={yOffsetPercent}
                spring={spring}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
                onTapDetails={onTapDetails}
              />
            );
          })}
        </motion.div>
      </div>

      {/* ── CONTROLS (Floating Action Bar) ───────────────────────────────── */}
      <div className="mt-8 flex items-center gap-5 px-4 py-2.5 rounded-full bg-background/50 border border-white/[0.06] backdrop-blur-md shadow-xl">
        {/* Skip Button */}
        <button
          aria-label="Skip gig"
          onClick={() => handleSwipeLeft(activeIndex)}
          className="p-3.5 rounded-full border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 hover:border-rose-500/40 text-rose-400 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Undo Button */}
        <button
          aria-label="Undo last swipe"
          onClick={handleUndo}
          disabled={activeIndex === 0}
          className="p-2.5 rounded-full border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] text-gray-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Apply Button */}
        <button
          aria-label="Apply gig"
          onClick={() => handleSwipeRight(activeIndex)}
          className="p-3.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/40 text-emerald-400 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
        >
          <Check className="w-5 h-5" />
        </button>
      </div>
      
      {/* Counter */}
      <p className="mt-3 text-xs text-gray-500 font-medium tabular-nums">
        {activeIndex + 1} / {jobs.length} Gigs Available
      </p>
    </div>
  );
}

// Inner Carousel Card Component to isolate motion values and styles
interface CarouselCardProps {
  job: JobData;
  index: number;
  offset: number;
  isActive: boolean;
  slideSize: string;
  rotationDegrees: number;
  inactiveScale: number;
  yOffsetPercent: number;
  spring: any;
  onSwipeLeft: (idx: number) => void;
  onSwipeRight: (idx: number) => void;
  onTapDetails: (jobId: string) => void;
}

function CarouselCard({
  job,
  index,
  offset,
  isActive,
  slideSize,
  rotationDegrees,
  inactiveScale,
  yOffsetPercent,
  spring,
  onSwipeLeft,
  onSwipeRight,
  onTapDetails,
}: CarouselCardProps) {
  const cardX = useMotionValue(0);
  const cardRotate = useTransform(cardX, [-150, 150], [-10, 10]);

  // Badge opacities based on drag X
  const applyOpacity = useTransform(cardX, [0, 80], [0, 1]);
  const skipOpacity = useTransform(cardX, [-80, 0], [1, 0]);

  // Background tint based on drag X
  const bgTintRight = useTransform(cardX, [0, 120], ['rgba(16,185,129,0)', 'rgba(16,185,129,0.05)']);
  const bgTintLeft = useTransform(cardX, [-120, 0], ['rgba(244,63,94,0.05)', 'rgba(244,63,94,0)']);

  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isActive) return;
    const rect = cardRef.current.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;
    setTiltX(-normY * 8);
    setTiltY(normX * 8);
    setGlowPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, [isActive]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTiltX(0);
    setTiltY(0);
  }, []);

  const handleDragEnd = useCallback((_: any, info: any) => {
    if (!isActive) return;
    const threshold = 120;
    const velThreshold = 500;

    if (info.offset.x > threshold || info.velocity.x > velThreshold) {
      onSwipeRight(index);
    } else if (info.offset.x < -threshold || info.velocity.x < -velThreshold) {
      onSwipeLeft(index);
    } else {
      cardX.set(0);
    }
  }, [isActive, index, onSwipeRight, onSwipeLeft, cardX]);

  const tiltStyle = isHovered && isActive
    ? `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.01, 1.01, 1.01)`
    : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';

  return (
    <motion.div
      ref={cardRef}
      style={{ 
        width: slideSize, 
        height: "500px",
        x: isActive ? cardX : 0,
        rotate: isActive ? cardRotate : offset * rotationDegrees,
        scale: isActive ? 1 : inactiveScale,
        y: isActive ? 0 : `${offset * yOffsetPercent}%`,
        cursor: isActive ? 'grab' : 'default',
        willChange: 'transform',
        transform: tiltStyle,
      }}
      animate={{
        rotate: isActive ? undefined : offset * rotationDegrees,
        scale: isActive ? 1 : inactiveScale,
        y: isActive ? 0 : `${offset * yOffsetPercent}%`,
      }}
      transition={spring}
      drag={isActive ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.6}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: 'grabbing', scale: 1.01 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => isActive && setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "flex-shrink-0 flex flex-col overflow-hidden select-none relative rounded-2xl border bg-deep/95 backdrop-blur-2xl p-6 transition-shadow duration-300",
        isActive 
          ? "z-30 border-white/[0.08] shadow-[0_16px_50px_rgba(0,0,0,0.45)]"
          : "z-10 border-white/[0.03] opacity-45 pointer-events-none"
      )}
    >
      {isActive && (
        <>
          <motion.div className="absolute inset-0 pointer-events-none z-0" style={{ background: bgTintRight }} />
          <motion.div className="absolute inset-0 pointer-events-none z-0" style={{ background: bgTintLeft }} />
        </>
      )}

      {isHovered && isActive && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none z-0"
          style={{
            background: `radial-gradient(circle 260px at ${glowPos.x}px ${glowPos.y}px, rgba(99,102,241,0.08) 0%, transparent 75%)`,
          }}
        />
      )}

      <div className="absolute top-0 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {isActive && (
        <>
          <motion.div
            style={{ opacity: applyOpacity }}
            className="absolute top-7 left-7 z-30 flex items-center gap-1.5 px-4 py-1.5 rounded-xl border-2 border-emerald-500 text-emerald-500 font-extrabold uppercase text-[12px] rotate-[-12deg] bg-emerald-500/5"
          >
            <Check className="w-4 h-4 stroke-2" /> Apply
          </motion.div>
          <motion.div
            style={{ opacity: skipOpacity }}
            className="absolute top-7 right-7 z-30 flex items-center gap-1.5 px-4 py-1.5 rounded-xl border-2 border-rose-500 text-rose-500 font-extrabold uppercase text-[12px] rotate-[12deg] bg-rose-500/5"
          >
            Skip <X className="w-4 h-4" />
          </motion.div>
        </>
      )}

      <div className="relative z-10 h-full flex flex-col justify-between" style={{ transform: 'translateZ(30px)' }}>
        
        <div>
          <div className="flex justify-between items-start mb-4">
            <span className="text-[9px] font-extrabold tracking-[0.18em] px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-[#ff7343] rounded-full uppercase">
              Hyperlocal Gig
            </span>
            <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-teal-400 bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 rounded-full">
              <MapPin className="w-3.5 h-3.5" />
              {job.distance} km away
            </div>
          </div>

          <h2 className="text-[22px] font-extrabold text-gray-100 font-heading leading-tight tracking-tight">
            {job.title}
          </h2>
          <p className="text-[12px] font-semibold text-gray-500 mt-1">{job.provider}</p>
        </div>

        <div className="my-3">
          <p className="text-[12px] text-gray-400 leading-relaxed line-clamp-4">
            {job.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-4">
            {job.skills.map((skill) => (
              <span
                key={skill}
                className="text-[9.5px] font-medium text-gray-400 bg-white/[0.04] border border-white/[0.06] px-2.5 py-0.5 rounded-md"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-4 mt-auto">
          <div className="flex justify-between items-end mb-4">
            <div>
              <span className="text-[9px] font-bold text-gray-600 uppercase tracking-wider block mb-1">Estimated Payout</span>
              <span className="text-[24px] font-black text-emerald-400 tracking-tight font-heading leading-none">
                {job.pay}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-bold text-gray-600 uppercase tracking-wider block mb-1">Duration</span>
              <span className="text-[14px] font-bold text-gray-300">{job.duration}</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01, borderColor: 'rgba(255,255,255,0.18)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTapDetails(job.id)}
            className="w-full py-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] text-[12px] font-bold text-gray-300 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            View Full Details
            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:translate-x-1 group-hover:text-[#ff5005] transition-all" />
          </motion.button>
        </div>

      </div>
    </motion.div>
  );
}

