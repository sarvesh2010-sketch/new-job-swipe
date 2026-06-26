'use client';

import React, { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowRight, X, Check } from 'lucide-react';

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

interface SwipeCardProps {
  job: JobData;
  active: boolean;
  onSwipeRight: (jobId: string) => void;
  onSwipeLeft: (jobId: string) => void;
  onTapDetails: (jobId: string) => void;
}

export default function SwipeCard({ job, active, onSwipeRight, onSwipeLeft, onTapDetails }: SwipeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const rotate   = useTransform(x, [-220, 220], [-16, 16]);
  const cardOpacity  = useTransform(x, [-220, -150, 0, 150, 220], [0.6, 0.9, 1, 0.9, 0.6]);

  // Badge opacities
  const applyOpacity = useTransform(x, [0, 80],   [0, 1]);
  const skipOpacity  = useTransform(x, [-80, 0],  [1, 0]);

  // Background tint on drag
  const bgTintRight = useTransform(x, [0, 120], ['rgba(16,185,129,0)', 'rgba(16,185,129,0.06)']);
  const bgTintLeft  = useTransform(x, [-120, 0], ['rgba(244,63,94,0.06)', 'rgba(244,63,94,0)']);

  // 3D tilt state
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [swipeDir, setSwipeDir] = useState<'left' | 'right' | null>(null);

  const rectRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      rectRef.current = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      };
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!rectRef.current || !active) return;
    const rect = rectRef.current;
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;
    setTiltX(-normY * 10);
    setTiltY(normX * 10);
    setGlowPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, [active]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTiltX(0);
    setTiltY(0);
    rectRef.current = null;
  }, []);

  const handleDragEnd = useCallback((_: any, info: any) => {
    if (!active) return;
    const threshold = 120;
    const velThreshold = 600;

    if (info.offset.x > threshold || info.velocity.x > velThreshold) {
      setSwipeDir('right');
      setTimeout(() => onSwipeRight(job.id), 120);
    } else if (info.offset.x < -threshold || info.velocity.x < -velThreshold) {
      setSwipeDir('left');
      setTimeout(() => onSwipeLeft(job.id), 120);
    } else {
      // Spring back
      x.set(0);
    }
  }, [active, job.id, onSwipeRight, onSwipeLeft, x]);

  const tiltStyle = isHovered && active
    ? `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.015, 1.015, 1.015)`
    : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';

  return (
    <motion.div
      ref={cardRef}
      drag={active ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.55}
      dragMomentum={true}
      onDragEnd={handleDragEnd}
      style={{
        x,
        rotate,
        opacity: active ? cardOpacity : 0.35,
        cursor: active ? 'grab' : 'default',
        willChange: 'transform',
        transition: isHovered ? 'none' : 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        transform: tiltStyle,
      }}
      whileDrag={{ cursor: 'grabbing', scale: 1.01 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        absolute w-full rounded-2xl p-6 select-none overflow-hidden
        border transition-shadow duration-300
        ${active
          ? `z-20 pointer-events-auto h-[530px]
             ${swipeDir === 'right' ? 'border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.15)]' :
               swipeDir === 'left'  ? 'border-rose-500/50 shadow-[0_0_40px_rgba(244,63,94,0.15)]' :
               'border-white/[0.08] shadow-[0_16px_50px_rgba(0,0,0,0.45)]'}`
          : 'z-10 pointer-events-none h-[530px] scale-95 translate-y-5 border-white/[0.04]'
        }
        bg-deep/90 backdrop-blur-2xl
      `}
    >
      {/* Background tint on drag direction */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ background: bgTintRight }} />
      <motion.div className="absolute inset-0 pointer-events-none" style={{ background: bgTintLeft }} />
 
      {/* Cursor spotlight */}
      {isHovered && active && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none z-0"
          style={{
            background: `radial-gradient(circle 280px at ${glowPos.x}px ${glowPos.y}px, rgba(99,102,241,0.1) 0%, transparent 75%)`,
          }}
        />
      )}
 
      {/* Top highlight line */}
      <div className="absolute top-0 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
 
      {/* Swipe intent badges */}
      {active && (
        <>
          <motion.div
            style={{ opacity: applyOpacity }}
            className="absolute top-7 left-7 z-30 flex items-center gap-1.5 px-4 py-1.5 rounded-xl border-2 border-emerald-500 text-emerald-500 font-extrabold uppercase text-[13px] rotate-[-12deg] bg-emerald-500/5"
          >
            <Check className="w-4 h-4 strokeWidth={3}" /> Apply
          </motion.div>
          <motion.div
            style={{ opacity: skipOpacity }}
            className="absolute top-7 right-7 z-30 flex items-center gap-1.5 px-4 py-1.5 rounded-xl border-2 border-rose-500 text-rose-500 font-extrabold uppercase text-[13px] rotate-[12deg] bg-rose-500/5"
          >
            Skip <X className="w-4 h-4" />
          </motion.div>
        </>
      )}
 
      {/* Card content */}
      <div className="relative z-10 h-full flex flex-col justify-between" style={{ transform: 'translateZ(30px)' }}>
        
        {/* Header */}
        <div>
          <div className="flex justify-between items-start mb-4">
            <span className="text-[9.5px] font-extrabold tracking-[0.18em] px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-full uppercase">
              Hyperlocal Gig
            </span>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-teal-400 bg-white/[0.04] border border-white/[0.08] px-3 py-1 rounded-full">
              <MapPin className="w-3 h-3" />
              {job.distance} km away
            </div>
          </div>
 
          <h2 className="text-[23px] font-extrabold text-gray-100 font-heading leading-tight tracking-tight">
            {job.title}
          </h2>
          <p className="text-[12.5px] font-semibold text-gray-500 mt-1">{job.provider}</p>
        </div>
 
        {/* Description + skills */}
        <div className="my-4">
          <p className="text-[12.5px] text-gray-400 leading-relaxed line-clamp-4">
            {job.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-4">
            {job.skills.map((skill) => (
              <span
                key={skill}
                className="text-[10px] font-medium text-gray-400 bg-white/[0.04] border border-white/[0.06] px-2.5 py-0.5 rounded-md"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
 
        {/* Footer */}
        <div className="border-t border-white/[0.06] pt-5">
          <div className="flex justify-between items-end mb-5">
            <div>
              <span className="text-[9.5px] font-bold text-gray-600 uppercase tracking-wider block mb-1">Estimated Payout</span>
              <span className="text-[26px] font-black text-emerald-400 tracking-tight font-heading leading-none">
                {job.pay}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[9.5px] font-bold text-gray-600 uppercase tracking-wider block mb-1">Duration</span>
              <span className="text-[15px] font-bold text-gray-300">{job.duration}</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01, borderColor: 'rgba(255,255,255,0.18)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTapDetails(job.id)}
            className="w-full py-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] text-[12.5px] font-bold text-gray-300 transition-all flex items-center justify-center gap-2 group"
          >
            View Full Details
            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:translate-x-1 group-hover:text-indigo-400 transition-all" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
