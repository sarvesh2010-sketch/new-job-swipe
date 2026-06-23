'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/shared/Navbar';
import BottomTabBar from '@/components/shared/BottomTabBar';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Award, Info } from 'lucide-react';

/* ─── Animated SVG ring with draw-in on mount ─────────── */
function AchievementRing({
  name, progress, target, color, delay = 0
}: {
  name: string; progress: number; target: string; color: string; delay?: number;
}) {
  const ref = useRef<SVGCircleElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: '-40px' });

  const r = 20;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        {/* SVG progress ring */}
        <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 50 50">
            {/* Track */}
            <circle cx="25" cy="25" r={r} fill="transparent" strokeWidth="3" className="stroke-white/[0.05]" />
            {/* Progress — animates in with stroke-dashoffset */}
            <motion.circle
              ref={ref}
              cx="25" cy="25" r={r}
              fill="transparent"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circ}
              className={color}
              initial={{ strokeDashoffset: circ }}
              animate={inView ? { strokeDashoffset: offset } : {}}
              transition={{ duration: 1.2, delay: delay + 0.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
          <span className="absolute text-[11px] font-black text-gray-300">{progress}%</span>
        </div>

        <div>
          <h5 className="text-[13px] font-bold text-gray-200 leading-tight">{name}</h5>
          <p className="text-[10px] text-gray-600 mt-0.5">Unlocks higher base payouts</p>
        </div>
      </div>

      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full whitespace-nowrap">
        {target}
      </span>
    </motion.div>
  );
}

/* ─── Animated sparkline that draws in on scroll ──────── */
function SparkLine() {
  const ref = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: '-40px' });

  const pathD = "M 10 70 Q 100 65 180 40 T 360 15";

  return (
    <div ref={containerRef} className="h-[80px] w-full relative">
      <svg className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="sparkGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#2DD4BF" stopOpacity="1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Area fill */}
        <motion.path
          d={`${pathD} L 360 80 L 10 80 Z`}
          fill="url(#sparkGrad)"
          opacity="0.08"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.08 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
        />

        {/* Animated stroke path */}
        <motion.path
          ref={ref}
          d={pathD}
          fill="none"
          stroke="url(#sparkGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#glow)"
          pathLength={1}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Data points */}
        <motion.circle
          cx="10" cy="70" r="4" fill="#6366F1"
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.3 }}
        />
        <motion.circle
          cx="180" cy="40" r="4" fill="#8B5CF6"
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.8 }}
        />
        {/* Live dot */}
        <motion.circle
          cx="360" cy="15" r="4" fill="#2DD4BF"
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 1, scale: [1, 1.6, 1] } : {}}
          transition={{ duration: 0.6, delay: 1.4, repeat: Infinity, repeatDelay: 2 }}
        />
      </svg>

      <span className="absolute bottom-0 left-1.5 text-[9px] font-bold text-gray-600">4.0 Baseline</span>
      <span className="absolute top-0 right-1.5 text-[9px] font-bold text-teal-400">4.8 Current ↑</span>
    </div>
  );
}

/* ─── Main page ─────────────────────────────────────────── */
export default function StudentTrustScorePage() {
  const [profile, setProfile] = useState<any>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const inView = useInView(heroRef, { once: true });

  useEffect(() => {
    const saved = localStorage.getItem('jobswipe_student_profile');
    setProfile(saved ? JSON.parse(saved) : { name: 'Rohan Sharma', trustScore: 4.8 });
  }, []);

  const trustScore = profile?.trustScore || 4.8;

  const planets = [
    { id: 'p1', name: 'Punctuality',  value: '5.0', radius: 85,  duration: 12, color: 'teal'   },
    { id: 'p2', name: 'Work Quality', value: '4.7', radius: 125, duration: 18, color: 'indigo' },
    { id: 'p3', name: 'Completions',  value: '12',  radius: 160, duration: 25, color: 'purple' },
  ];

  const colorBg: Record<string, string> = {
    teal:   'bg-teal-500/20 border-teal-500/40 text-teal-300',
    indigo: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300',
    purple: 'bg-purple-500/20 border-purple-500/40 text-purple-300',
  };
  const colorGlow: Record<string, string> = {
    teal:   'blur-[6px] bg-teal-400 opacity-30',
    indigo: 'blur-[6px] bg-indigo-400 opacity-30',
    purple: 'blur-[6px] bg-purple-400 opacity-30',
  };
  const colorStroke: Record<string, string> = {
    teal:   'stroke-teal-500',
    indigo: 'stroke-indigo-500',
    purple: 'stroke-purple-500',
  };

  const achievements = [
    { name: 'Punctuality Star',      progress: 100, target: '5.0 Avg',   color: 'stroke-teal-500'   },
    { name: '10 Gigs Club',          progress: 100, target: '12 / 10',   color: 'stroke-indigo-500' },
    { name: 'Anti No-Show Shield',   progress: 90,  target: '0 No-Shows', color: 'stroke-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-void text-gray-100 flex flex-col justify-between pb-28">
      <Navbar title="My Trust Score" />

      <main className="flex-1 max-w-md mx-auto w-full p-4 space-y-5">

        {/* ── ORBIT VISUALIZATION ───────────────────────── */}
        <div
          ref={heroRef}
          className="p-6 rounded-[36px] bg-[#0b0f19]/80 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden flex flex-col items-center"
        >
          {/* Background glow */}
          <div className="absolute w-[240px] h-[240px] bg-indigo-500/8 blur-[80px] rounded-full -z-10" />

          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-1">Platform Trust Orbit</span>
          <p className="text-[11.5px] text-gray-500 text-center max-w-xs mb-8">
            Your metrics orbit your central reputation index in real time.
          </p>

          {/* Orbit Container */}
          <div className="relative w-[340px] h-[340px] flex items-center justify-center mb-4">

            {/* Core */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="w-[100px] h-[100px] rounded-full bg-[#050814]/90 border border-indigo-500/30 flex flex-col items-center justify-center z-30 shadow-[0_0_40px_rgba(99,102,241,0.3),inset_0_1px_1px_rgba(255,255,255,0.06)]"
            >
              <span className="text-[9.5px] font-bold text-gray-600 uppercase tracking-widest">Score</span>
              <span className="text-[34px] font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400 font-heading leading-none mt-1">
                {trustScore.toFixed(1)}
              </span>
              <span className="text-[9px] font-bold text-emerald-400 mt-1">Excellent</span>
            </motion.div>

            {/* Orbit rings + planets */}
            {planets.map((planet, pi) => {
              const size = planet.radius * 2;
              return (
                <motion.div
                  key={planet.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + pi * 0.12 }}
                  className="absolute rounded-full border border-dashed border-white/[0.05]"
                  style={{ width: `${size}px`, height: `${size}px`, zIndex: 10 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: planet.duration, ease: 'linear' }}
                    className="w-full h-full relative"
                  >
                    <div
                      className={`absolute w-9 h-9 rounded-full border flex flex-col items-center justify-center ${colorBg[planet.color]}`}
                      style={{ top: 0, left: '50%', transform: 'translate(-50%, -50%)' }}
                    >
                      <div className={`absolute -inset-1 rounded-full ${colorGlow[planet.color]}`} />
                      <span className="relative z-10 text-[11px] font-black">{planet.value}</span>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="w-full grid grid-cols-3 gap-2 mt-4 pt-5 border-t border-white/[0.05] text-center">
            {planets.map((p) => (
              <div key={p.id}>
                <span className="text-[9.5px] text-gray-600 font-semibold block">{p.name}</span>
                <span className="text-[14px] font-extrabold text-gray-200 mt-0.5 block">{p.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── ACHIEVEMENT RINGS ─────────────────────────── */}
        <div className="p-5 rounded-[28px] bg-white/[0.01] border border-white/[0.05] space-y-4">
          <h4 className="text-[12.5px] font-bold text-gray-400 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-indigo-400" /> Reputation Achievements
          </h4>
          {achievements.map((ach, i) => (
            <AchievementRing key={ach.name} {...ach} delay={i * 0.1} />
          ))}
        </div>

        {/* ── SPARKLINE GROWTH ──────────────────────────── */}
        <div className="p-5 rounded-[28px] bg-white/[0.01] border border-white/[0.05] space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-[12.5px] font-bold text-gray-400">Growth Projection</h4>
            <span className="text-[11px] font-bold text-indigo-400">+0.8 vs Starting</span>
          </div>
          <SparkLine />
        </div>

      </main>

      <BottomTabBar />
    </div>
  );
}
