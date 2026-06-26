'use client';

import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { X, Check, RotateCcw, MapPin, ArrowRight, Search } from "lucide-react";
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
  onUndo?: () => void;
  lastSwiped?: { job: JobData; direction: 'LEFT' | 'RIGHT' } | null;
}

export default function SwipeDeck({
  jobs = [],
  onApply,
  onSkip,
  onTapDetails,
  onResetDeck,
  onUndo,
  lastSwiped,
}: SwipeDeckProps) {
  const hasLastSwiped = !!lastSwiped;
  const containerRef = useRef<HTMLDivElement>(null);

  const dragX = useMotionValue(0);
  const cardRotate = useTransform(dragX, [-200, 200], [-12, 12]);

  // Index 1 (Middle Card) transforms:
  const nextScale = useTransform(dragX, [-150, 0, 150], [1, 0.94, 1]);
  const nextRotate = useTransform(dragX, [-150, 0, 150], [0, 2, 0]);
  const nextX = useTransform(dragX, [-150, 0, 150], [0, -6, 0]);
  const nextY = useTransform(dragX, [-150, 0, 150], [0, 16, 0]);
  const nextOpacity = useTransform(dragX, [-150, 0, 150], [1, 0.85, 1]);

  // Index 2 (Bottom Card) transforms:
  const bottomScale = useTransform(dragX, [-150, 0, 150], [0.94, 0.88, 0.94]);
  const bottomRotate = useTransform(dragX, [-150, 0, 150], [2, -2, 2]);
  const bottomX = useTransform(dragX, [-150, 0, 150], [-6, 6, -6]);
  const bottomY = useTransform(dragX, [-150, 0, 150], [16, 32, 16]);
  const bottomOpacity = useTransform(dragX, [-150, 0, 150], [0.85, 0.5, 0.85]);

  const activeJobId = jobs[0]?.id;
  useEffect(() => {
    if (activeJobId && lastSwiped && activeJobId === lastSwiped.job.id) {
      // This is an undo operation, slide card back in from swiped direction
      const startX = lastSwiped.direction === "LEFT" ? -500 : 500;
      dragX.set(startX);
      animate(dragX, 0, { type: "spring", stiffness: 120, damping: 20 });
    } else {
      dragX.set(0);
    }
  }, [activeJobId, dragX, lastSwiped]);

  const handleSwipeLeft = useCallback((jobId: string) => {
    animate(dragX, -500, { duration: 0.2 }).then(() => {
      onSkip(jobId);
    });
  }, [dragX, onSkip]);

  const handleSwipeRight = useCallback((jobId: string) => {
    animate(dragX, 500, { duration: 0.2 }).then(() => {
      onApply(jobId);
    });
  }, [dragX, onApply]);

  if (!jobs.length) {
    return (
      <div className="relative w-full flex flex-col items-center max-w-md mx-auto">
        <motion.div
          key="empty"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
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
            onClick={onResetDeck}
            className="px-7 py-3.5 rounded-xl bg-indigo-500 hover:bg-[#ff7343] text-[12.5px] font-bold text-white transition-all cursor-pointer shadow-md shadow-indigo-900/10"
          >
            Reset Deck
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center select-none w-full max-w-md mx-auto"
      role="region"
      aria-label="Job Swipe Deck"
    >
      <div className="relative w-full h-[500px] overflow-visible">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-indigo-500/5 blur-[80px]" />
        </div>

        <AnimatePresence mode="popLayout">
          {jobs.slice(0, 3).map((job, idx) => {
            const isActive = idx === 0;

            return (
              <CarouselCard
                key={job.id}
                job={job}
                isActive={isActive}
                index={idx}
                dragX={dragX}
                cardRotate={cardRotate}
                nextScale={nextScale}
                nextRotate={nextRotate}
                nextX={nextX}
                nextY={nextY}
                nextOpacity={nextOpacity}
                bottomScale={bottomScale}
                bottomRotate={bottomRotate}
                bottomX={bottomX}
                bottomY={bottomY}
                bottomOpacity={bottomOpacity}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
                onTapDetails={onTapDetails}
              />
            );
          }).reverse()}
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center gap-5 px-4 py-2.5 rounded-full bg-background/50 border border-white/[0.06] backdrop-blur-md shadow-xl">
        <button
          aria-label="Skip gig"
          onClick={() => handleSwipeLeft(jobs[0].id)}
          className="p-3.5 rounded-full border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 hover:border-rose-500/40 text-rose-400 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <button
          aria-label="Undo last swipe"
          onClick={onUndo}
          disabled={!hasLastSwiped}
          className="p-2.5 rounded-full border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] text-gray-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          aria-label="Apply gig"
          onClick={() => handleSwipeRight(jobs[0].id)}
          className="p-3.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/40 text-emerald-400 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
        >
          <Check className="w-5 h-5" />
        </button>
      </div>
      
      <p className="mt-3 text-xs text-gray-500 font-medium tabular-nums">
        {jobs.length} Gigs Available
      </p>
    </div>
  );
}

interface CarouselCardProps {
  job: JobData;
  isActive: boolean;
  index: number;
  dragX: any;
  cardRotate: any;
  nextScale: any;
  nextRotate: any;
  nextX: any;
  nextY: any;
  nextOpacity: any;
  bottomScale: any;
  bottomRotate: any;
  bottomX: any;
  bottomY: any;
  bottomOpacity: any;
  onSwipeLeft: (jobId: string) => void;
  onSwipeRight: (jobId: string) => void;
  onTapDetails: (jobId: string) => void;
}

function CarouselCard({
  job,
  isActive,
  index,
  dragX,
  cardRotate,
  nextScale,
  nextRotate,
  nextX,
  nextY,
  nextOpacity,
  bottomScale,
  bottomRotate,
  bottomX,
  bottomY,
  bottomOpacity,
  onSwipeLeft,
  onSwipeRight,
  onTapDetails,
}: CarouselCardProps) {
  const applyOpacity = useTransform(dragX, [0, 80], [0, 1]);
  const skipOpacity = useTransform(dragX, [-80, 0], [1, 0]);
  const bgTintRight = useTransform(dragX, [0, 120], ['rgba(16,185,129,0)', 'rgba(16,185,129,0.05)']);
  const bgTintLeft = useTransform(dragX, [-120, 0], ['rgba(244,63,94,0.05)', 'rgba(244,63,94,0)']);

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
      onSwipeRight(job.id);
    } else if (info.offset.x < -threshold || info.velocity.x < -velThreshold) {
      onSwipeLeft(job.id);
    } else {
      animate(dragX, 0, { type: 'spring', bounce: 0.2 });
    }
  }, [isActive, job.id, onSwipeRight, onSwipeLeft, dragX]);

  const tiltStyle = isHovered && isActive
    ? `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.015, 1.015, 1.015)`
    : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';

  let xStyle: any = 0;
  let rotateStyle: any = 0;
  let scaleStyle: any = 1;
  let yStyle: any = 0;
  let opacityStyle: any = 1;

  if (index === 0) {
    xStyle = dragX;
    rotateStyle = cardRotate;
    scaleStyle = 1;
    yStyle = 0;
    opacityStyle = 1;
  } else if (index === 1) {
    xStyle = nextX;
    rotateStyle = nextRotate;
    scaleStyle = nextScale;
    yStyle = nextY;
    opacityStyle = nextOpacity;
  } else {
    xStyle = bottomX;
    rotateStyle = bottomRotate;
    scaleStyle = bottomScale;
    yStyle = bottomY;
    opacityStyle = bottomOpacity;
  }

  return (
    <motion.div
      ref={cardRef}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        x: xStyle,
        rotate: rotateStyle,
        scale: scaleStyle,
        y: yStyle,
        opacity: opacityStyle,
        cursor: isActive ? 'grab' : 'default',
        willChange: 'transform',
      }}
      drag={isActive ? "x" : false}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: 'grabbing' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => isActive && setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "select-none touch-none",
        isActive 
          ? "z-30 pointer-events-auto"
          : "z-10 pointer-events-none"
      )}
    >
      <div
        style={{
          transform: tiltStyle,
          transition: isHovered ? "none" : "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
          willChange: 'transform',
        }}
        className={cn(
          "w-full h-full flex flex-col overflow-hidden relative rounded-2xl border bg-deep/95 backdrop-blur-2xl p-6 transition-all duration-300",
          isActive 
            ? "border-white/[0.08] shadow-[0_16px_50px_rgba(0,0,0,0.45)]"
            : "border-white/[0.03]"
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
    </div>
    </motion.div>
  );
}
