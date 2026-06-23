'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from 'framer-motion';
import { gsap } from 'gsap';
import {
  ArrowRight,
  Sparkles,
  ShieldAlert,
  MapPin,
  Star,
  CheckCircle2,
  ChevronRight,
  Zap,
  Users,
  TrendingUp,
} from 'lucide-react';
import LenisProvider from '@/components/shared/LenisProvider';

const OpportunityGalaxy = dynamic(
  () => import('@/components/landing/OpportunityGalaxy'),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    ),
  }
);

/* ─── Reusable animated section header ─────────────────── */
function SectionLabel({ children, color = 'text-indigo-400' }: { children: React.ReactNode; color?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`text-[11px] font-bold tracking-[0.18em] uppercase ${color}`}
    >
      {children}
    </motion.span>
  );
}

/* ─── Animated number counter ───────────────────────────── */
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const count = useMotionValue(0);
  const rounded = useSpring(count, { stiffness: 80, damping: 20 });

  useEffect(() => {
    if (inView) {
      count.set(target);
    }
  }, [inView, count, target]);

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{rounded.get().toFixed(1)}</motion.span>
      {suffix}
    </span>
  );
}

/* ─── Staggered fade-in children ───────────────────────── */
function StaggerChildren({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
} as const satisfies import('framer-motion').Variants;

/* ─── Main landing page ─────────────────────────────────── */
export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSkill, setActiveSkill] = useState('Serving');
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    const unsub = scrollYProgress.on('change', setScrollProgress);
    return unsub;
  }, [scrollYProgress]);

  // GSAP hero title character entrance
  useEffect(() => {
    const el = heroTitleRef.current;
    if (!el) return;
    const words = el.querySelectorAll('.hero-word');
    gsap.fromTo(
      words,
      { opacity: 0, y: 40, skewY: 3 },
      {
        opacity: 1,
        y: 0,
        skewY: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.3,
      }
    );
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const SKILLS_MAP = {
    Serving:      { jobs: ['DU Cafe Barista', 'South Campus Bistro Host', 'Satya Niketan Event Server'], pay: '₹150 – ₹180/hr' },
    'Social Media': { jobs: ['Gym Promo Handler', 'Cafe Feed Designer', 'Student Hub Coordinator'], pay: '₹200 – ₹250/hr' },
    'Event Staff':  { jobs: ['Nexus Fest Assistant', 'TEDx Ticket Counter', 'DU Concert Usher'], pay: '₹500 – ₹800/day' },
    'Data Entry':   { jobs: ['Research Tabulation', 'E-Commerce Excel Helper', 'Exam Entry Assistant'], pay: '₹170 – ₹200/hr' },
    'Flyer Promo':  { jobs: ['Satya Flyer Distribution', 'Campus Promoter', 'Coaching Center Leaflet'], pay: '₹300/job' },
  };

  const TESTIMONIALS = [
    {
      role: 'Student',
      name: 'Rohan Sharma',
      detail: '20, B.Com · Delhi University',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200&h=200',
      text: 'I had a 3-hour gap between lectures. I saw a cafe listing 400m away, swiped right with my roommate, and we got approved in 10 minutes. We cleared tables, earned ₹450 each, and were back in class by 3 PM.',
      score: '4.9 Trust Score',
    },
    {
      role: 'Host',
      name: 'Priya Nair',
      detail: 'Owner · The Daily Grind Cafe',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200',
      text: 'My weekend helper called in sick at 11 AM during the rush. I posted a 4-hour gig. By 11:15 AM, I had two students with 4.8+ Trust Scores approved and on their way. They were punctual and worked incredibly hard.',
      score: 'Verified Host',
    },
  ];

  const STEPS = [
    { n: '01', color: 'indigo', title: 'Swipe Right', desc: 'Browse gigs filtered by radius and duration. Swipe right to apply — 3-second undo if you change your mind.' },
    { n: '02', color: 'purple', title: 'Host Reviews', desc: 'The business reviews your Trust Score and rating history. No-shows and scammers are automatically filtered out.' },
    { n: '03', color: 'teal',   title: 'Buddy Apply', desc: 'Safety first. Invite a campus friend to apply alongside you. You both get approved as a pair.' },
    { n: '04', color: 'emerald', title: 'Earn Instantly', desc: 'Work the 2–4 hour gig. The host marks it complete, pays you directly, and rates your work to grow your score.' },
  ];

  const colorMap: Record<string, string> = {
    indigo: 'from-indigo-500/10 border-indigo-500/20 text-indigo-400',
    purple: 'from-purple-500/10 border-purple-500/20 text-purple-400',
    teal:   'from-teal-500/10 border-teal-500/20 text-teal-400',
    emerald: 'from-emerald-500/10 border-emerald-500/20 text-emerald-400',
  };

  return (
    <LenisProvider>
      <div ref={containerRef} className="relative w-full min-h-screen bg-void text-gray-100 antialiased overflow-hidden">

        {/* Global background layers */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-spatial-glow opacity-70" />
          <div className="absolute inset-0 bg-purple-radial-glow opacity-60" />
          <div className="absolute inset-0 bg-teal-radial-glow opacity-50" />
          {/* Noise grain */}
          <div
            className="absolute inset-0 opacity-[0.022]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* ── NAVIGATION ────────────────────────────────────── */}
        <motion.header
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-0 left-0 right-0 z-50 px-4 pt-5"
        >
          <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3.5 rounded-full bg-[#050814]/50 backdrop-blur-xl border border-white/[0.07] shadow-[0_4px_30px_rgba(0,0,0,0.25)]">
            <div className="flex items-center gap-2.5">
              <span className="text-[19px] font-black tracking-[-0.04em] font-heading text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-teal-400">
                JOBSWIPE
              </span>
              <span className="hidden sm:inline text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                BETA
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8 text-[12.5px] font-medium text-gray-400">
              {['#problem', '#how', '#trust', '#galaxy', '#stories'].map((href, i) => (
                <a
                  key={href}
                  href={href}
                  className="hover:text-white transition-colors duration-200 relative group"
                >
                  {['The Problem', 'How It Works', 'Trust Score', 'Gig Network', 'Reviews'][i]}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-indigo-400 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/analytics"
                className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-rose-400 hover:text-rose-300 transition-colors uppercase px-3.5 py-2 rounded-full border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10"
              >
                Admin
              </a>
              <a
                href="/provider-onboarding"
                className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-purple-400 hover:text-purple-300 transition-colors uppercase px-3.5 py-2 rounded-full border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10"
              >
                Host Portal
              </a>
              <motion.a
                href="#cta"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-5 py-2.5 rounded-full bg-white text-[#050814] text-[12px] font-bold tracking-wide transition-all duration-300 hover:shadow-[0_0_24px_rgba(255,255,255,0.35)] flex items-center gap-1.5 btn-magnetic"
              >
                Get Early Access <ArrowRight className="w-3.5 h-3.5" />
              </motion.a>
            </div>
          </nav>
        </motion.header>

        {/* ── HERO ──────────────────────────────────────────── */}
        <section className="relative w-full min-h-screen flex flex-col justify-center items-center px-4 pt-24 z-10 select-none">
          <div className="absolute inset-0 z-0">
            <OpportunityGalaxy scrollOffset={scrollProgress} />
          </div>

          <div className="relative z-10 max-w-4xl text-center pointer-events-none">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-semibold text-indigo-300 tracking-widest uppercase mb-8"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Micro-gigs · Campus Perimeters · Instant Pay
            </motion.div>

            {/* Main headline — GSAP animated */}
            <h1
              ref={heroTitleRef}
              className="text-[42px] sm:text-[68px] md:text-[82px] font-extrabold tracking-[-0.03em] leading-[1.03] font-heading overflow-hidden"
            >
              {['Hyperlocal', 'Micro-Jobs,'].map((w, i) => (
                <span key={i} className="hero-word inline-block opacity-0 mr-[0.2em] text-white">{w}</span>
              ))}
              <br />
              {['Swiped', 'In'].map((w, i) => (
                <span key={i} className="hero-word inline-block opacity-0 mr-[0.2em] text-white">{w}</span>
              ))}
              <span className="hero-word inline-block opacity-0 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-teal-400">
                Seconds.
              </span>
            </h1>

            {/* Sub copy */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-gray-400 text-[15px] sm:text-[18px] max-w-xl mx-auto mt-7 leading-relaxed"
            >
              No commitments. No scams. Swipe on 2–4 hour paid gigs within walking distance of your campus. Work with friends. Earn immediately.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10 pointer-events-auto"
            >
              <motion.a
                href="#cta"
                whileHover={{ scale: 1.03, boxShadow: '0 12px 40px rgba(99,102,241,0.45)' }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-[14px] font-bold text-white shadow-[0_8px_30px_rgba(99,102,241,0.3)] transition-all duration-300 flex items-center justify-center gap-2 btn-magnetic"
              >
                Find Gigs Near Me <ArrowRight className="w-4 h-4" />
              </motion.a>
              <motion.a
                href="#how"
                whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.2)' }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/[0.03] border border-white/[0.08] text-[14px] font-bold text-gray-300 transition-all duration-300 flex items-center justify-center gap-2"
              >
                How It Works
              </motion.a>
            </motion.div>

            {/* Social proof tickers */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="flex justify-center gap-8 mt-12 text-[11px] text-gray-600 font-medium pointer-events-none"
            >
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                2,400+ students registered
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
                180+ verified hosts
              </span>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
          >
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.25em]">Scroll</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="w-px h-8 bg-gradient-to-b from-gray-500 to-transparent"
            />
          </motion.div>
        </section>

        {/* ── PROBLEM SECTION ───────────────────────────────── */}
        <section id="problem" className="relative max-w-6xl mx-auto px-4 py-28 sm:py-36 z-10 border-t border-white/[0.04]">
          <div className="grid md:grid-cols-5 gap-16 items-center">

            <div className="md:col-span-2">
              <SectionLabel>The Market Reality</SectionLabel>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-[30px] sm:text-[40px] font-bold tracking-tight mt-4 mb-6 font-heading leading-[1.1]"
              >
                Why student work is{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400">broken</span>{' '}
                in India.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-gray-400 leading-relaxed text-[14px] mb-8"
              >
                Students looking for pocket money face a landscape built for career workers or plagued by scammers. Flexible, local, and safe earnings shouldn't feel like a hazard.
              </motion.p>

              {/* Stat callout */}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex gap-4 items-start p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10"
              >
                <ShieldAlert className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />
                <p className="text-[12.5px] text-gray-400 leading-relaxed">
                  <strong className="text-gray-200">Anti-Scam Alert:</strong> 84% of student WhatsApp gig groups contain fake postings demanding upfront "security deposits."
                </p>
              </motion.div>
            </div>

            <StaggerChildren className="md:col-span-3 grid sm:grid-cols-3 gap-4" delay={0.1}>
              {[
                { n: '01', title: 'Apna / WorkIndia', label: 'Too Rigid', desc: 'Built for full-time blue-collar workers. Requires 6-month commitments and hours incompatible with lectures.' },
                { n: '02', title: 'Internshala', label: 'Too Professional', desc: 'Corporate internships with long cycles. Often unpaid or requires weeks-long project commitment.' },
                { n: '03', title: 'WhatsApp Gigs', label: 'Too Dangerous', desc: 'Completely unvetted. High probability of scam recruiters, safety risks, and payment default after work is done.' },
              ].map((item) => (
                <motion.div
                  key={item.n}
                  variants={fadeUp}
                  className="glass-card p-6 rounded-[24px] flex flex-col justify-between h-[260px] cursor-default"
                >
                  <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[12px] font-bold text-gray-500">
                    {item.n}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-gray-200 tracking-tight font-heading mb-2">{item.title}</h3>
                    <p className="text-[12px] text-gray-500 leading-relaxed">{item.desc}</p>
                    <span className="inline-block mt-4 text-[9.5px] font-bold text-rose-400 uppercase tracking-widest">{item.label}</span>
                  </div>
                </motion.div>
              ))}
            </StaggerChildren>
          </div>
        </section>

        {/* ── HOW IT WORKS ──────────────────────────────────── */}
        <section id="how" className="relative max-w-6xl mx-auto px-4 py-28 sm:py-36 z-10 border-t border-white/[0.04]">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <SectionLabel color="text-purple-400">Zero Friction</SectionLabel>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[30px] sm:text-[42px] font-bold tracking-tight mt-4 mb-5 font-heading"
            >
              Four steps to swipe & earn.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-gray-400 text-[14px]"
            >
              No resumes. No long applications. No payment gateways. Just swipe, get approved, and earn.
            </motion.p>
          </div>

          <StaggerChildren className="grid sm:grid-cols-4 gap-5" delay={0.05}>
            {STEPS.map((step) => {
              const cls = colorMap[step.color];
              return (
                <motion.div
                  key={step.n}
                  variants={fadeUp}
                  className="glass-card p-7 rounded-[28px] relative group cursor-default"
                >
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${cls.split(' ')[0]} border ${cls.split(' ')[1]} flex items-center justify-center font-bold text-[16px] ${cls.split(' ')[2]} mb-6`}>
                    {step.n.replace('0', '')}
                  </div>
                  <h3 className="text-[17px] font-bold text-gray-100 tracking-tight font-heading mb-3">{step.title}</h3>
                  <p className="text-[12.5px] text-gray-400 leading-relaxed">{step.desc}</p>
                </motion.div>
              );
            })}
          </StaggerChildren>
        </section>

        {/* ── TRUST SCORE ───────────────────────────────────── */}
        <section id="trust" className="relative max-w-6xl mx-auto px-4 py-28 sm:py-36 z-10 border-t border-white/[0.04]">
          <div className="grid md:grid-cols-12 gap-14 items-center">
            <div className="md:col-span-5">
              <SectionLabel color="text-teal-400">Reputation Ledger</SectionLabel>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-[30px] sm:text-[42px] font-bold tracking-tight mt-4 mb-6 font-heading leading-tight"
              >
                Introducing the<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">Trust Score.</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-gray-400 leading-relaxed mb-8 text-[14px]"
              >
                A portable credit-like rating that follows every student. Every student starts with a 4.0 baseline. Punctual completions boost it; no-shows penalize it.
              </motion.p>

              <StaggerChildren className="space-y-5" delay={0.15}>
                {[
                  { color: 'emerald', title: 'The 4.0 Starting Baseline', desc: 'Every student gets a fair baseline rating, bypassing the cold-start block.' },
                  { color: 'indigo',  title: 'No-Show Penalties',          desc: 'Failing to show for approved shifts deducts 0.5 points. Only reliable students progress.' },
                  { color: 'purple',  title: 'Double-Sided Verification',  desc: 'Hosts are manually verified by admins, and students rate hosts post-gig.' },
                ].map((item) => (
                  <motion.div key={item.title} variants={fadeUp} className="flex gap-4">
                    <div className={`w-6 h-6 rounded-full bg-${item.color}-500/10 border border-${item.color}-500/30 flex items-center justify-center text-${item.color}-400 text-[11px] font-bold shrink-0 mt-0.5`}>
                      ✓
                    </div>
                    <div>
                      <h4 className="text-[13.5px] font-bold text-gray-200">{item.title}</h4>
                      <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </StaggerChildren>
            </div>

            {/* Profile card mockup */}
            <div className="md:col-span-7 flex justify-center">
              <div className="absolute w-[380px] h-[380px] bg-indigo-500/8 blur-[100px] -z-10 rounded-full" />
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[360px] p-6 rounded-[32px] bg-[#0b0f19]/60 border border-white/[0.08] backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200&h=200"
                    alt="Student"
                    className="w-13 h-13 rounded-full border-2 border-indigo-500/40 object-cover w-12 h-12"
                    loading="lazy"
                    decoding="async"
                  />
                  <div>
                    <h3 className="text-[15px] font-bold text-gray-100 font-heading">Rohan Sharma</h3>
                    <p className="text-[11.5px] text-gray-500">Delhi University · B.Com</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.05] text-center mb-5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Trust Score</span>
                  <div className="flex items-center justify-center gap-2.5 mt-2">
                    <span className="text-[46px] font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-indigo-400 to-purple-400 tracking-tighter font-heading leading-none">
                      4.8
                    </span>
                    <div>
                      <div className="flex text-amber-400 text-xs gap-0.5">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold mt-0.5 block">Top 5% Student</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-[12px]">
                  {[
                    { label: 'Punctuality', val: '5.0 / 5.0' },
                    { label: 'Work Quality', val: '4.7 / 5.0' },
                    { label: 'Completed Gigs', val: '12 Shifts' },
                    { label: 'No-Shows', val: '0 Incidents', red: true },
                  ].map((row) => (
                    <div key={row.label} className={`flex justify-between items-center py-2 border-b border-white/[0.04] last:border-0 ${row.red ? 'text-rose-400' : ''}`}>
                      <span className="text-gray-500 flex items-center gap-1.5">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${row.red ? 'text-rose-400' : 'text-indigo-400'}`} />
                        {row.label}
                      </span>
                      <span className={`font-bold ${row.red ? '' : 'text-gray-200'}`}>{row.val}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── CAREER GALAXY ─────────────────────────────────── */}
        <section id="galaxy" className="relative max-w-6xl mx-auto px-4 py-28 sm:py-36 z-10 border-t border-white/[0.04]">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <SectionLabel color="text-purple-400">Intelligent Routing</SectionLabel>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[30px] sm:text-[42px] font-bold tracking-tight mt-4 mb-5 font-heading"
            >
              Map your skills to campus gigs.
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-12 gap-8 items-stretch">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-5 flex flex-col justify-center gap-2"
            >
              {Object.keys(SKILLS_MAP).map((skill) => (
                <motion.button
                  key={skill}
                  onClick={() => setActiveSkill(skill)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full px-6 py-4 rounded-2xl text-left border transition-all duration-300 flex justify-between items-center ${
                    activeSkill === skill
                      ? 'bg-indigo-500/10 border-indigo-500/35 text-gray-100 shadow-[0_0_24px_rgba(99,102,241,0.12)]'
                      : 'bg-white/[0.01] border-white/[0.05] text-gray-400 hover:bg-white/[0.03] hover:border-white/[0.1]'
                  }`}
                >
                  <span className="text-[13.5px] font-bold">{skill}</span>
                  <ChevronRight className={`w-4 h-4 transition-all duration-200 ${activeSkill === skill ? 'translate-x-1 text-indigo-400' : ''}`} />
                </motion.button>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-7"
            >
              <div className="h-full p-8 rounded-[28px] bg-white/[0.02] border border-white/[0.07] backdrop-blur-md flex flex-col justify-between relative overflow-hidden min-h-[320px]">
                <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-purple-500/5 blur-[60px] -z-10 rounded-full" />

                <div>
                  <div className="flex justify-between items-center pb-4 border-b border-white/[0.06] mb-6">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active Gig Connections</span>
                    <span className="text-[13px] font-bold text-teal-400">
                      {SKILLS_MAP[activeSkill as keyof typeof SKILLS_MAP].pay}
                    </span>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeSkill}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="space-y-3"
                    >
                      {SKILLS_MAP[activeSkill as keyof typeof SKILLS_MAP].jobs.map((job, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.04] transition-all flex items-center gap-3 group cursor-default"
                        >
                          <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 group-hover:scale-125 transition-transform" />
                          <span className="text-[13px] font-semibold text-gray-300">{job}</span>
                        </div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="mt-8 pt-5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-gray-600">
                  <span>Avg matching latency</span>
                  <span className="font-mono text-teal-400 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 fill-current" /> ~10 min
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── SUCCESS STORIES ───────────────────────────────── */}
        <section id="stories" className="relative max-w-6xl mx-auto px-4 py-28 sm:py-36 z-10 border-t border-white/[0.04]">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <SectionLabel>Campus Trust</SectionLabel>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[30px] sm:text-[42px] font-bold tracking-tight mt-4 mb-5 font-heading"
            >
              Proven in the pilot market.
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl mx-auto"
          >
            <div className="p-8 sm:p-10 rounded-[32px] bg-white/[0.02] border border-white/[0.08] backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center text-center"
                >
                  <img
                    src={TESTIMONIALS[activeTestimonial].avatar}
                    alt={TESTIMONIALS[activeTestimonial].name}
                    className="w-14 h-14 rounded-full border-2 border-indigo-500/40 object-cover mb-5"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="text-[9.5px] font-bold tracking-widest px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-indigo-400 uppercase mb-5">
                    {TESTIMONIALS[activeTestimonial].role}
                  </span>
                  <blockquote className="text-[15px] sm:text-[17px] text-gray-200 leading-relaxed font-medium mb-6 max-w-xl">
                    "{TESTIMONIALS[activeTestimonial].text}"
                  </blockquote>
                  <p className="text-[13.5px] font-bold text-gray-100">{TESTIMONIALS[activeTestimonial].name}</p>
                  <p className="text-[11.5px] text-gray-500 mt-1">{TESTIMONIALS[activeTestimonial].detail}</p>
                  <span className="text-[11px] font-bold text-emerald-400 mt-2">{TESTIMONIALS[activeTestimonial].score}</span>
                </motion.div>
              </AnimatePresence>

              {/* Progress + dots */}
              <div className="mt-8 space-y-3">
                <div className="h-[2px] bg-white/[0.05] rounded-full overflow-hidden">
                  <motion.div
                    key={activeTestimonial}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 6, ease: 'linear' }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 origin-left"
                  />
                </div>
                <div className="flex justify-center gap-2">
                  {TESTIMONIALS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTestimonial(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeTestimonial === idx ? 'bg-indigo-500 w-6' : 'bg-white/20 w-1.5 hover:bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── FINAL CTA ─────────────────────────────────────── */}
        <section id="cta" className="relative max-w-5xl mx-auto px-4 py-24 sm:py-32 z-10">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="p-8 sm:p-16 rounded-[40px] relative overflow-hidden border border-white/[0.08] shadow-[0_20px_80px_rgba(0,0,0,0.6)] text-center"
          >
            {/* Aurora animated bg */}
            <div className="absolute inset-0 aurora-bg opacity-80" />
            {/* Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />
            {/* Top line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

            <div className="relative z-10">
              <SectionLabel color="text-teal-400">Beta Launch · Delhi NCR</SectionLabel>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-[34px] sm:text-[54px] font-extrabold tracking-[-0.03em] leading-none mt-5 mb-6 font-heading text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400"
              >
                Ready to find gigs nearby?
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-gray-400 text-[14px] sm:text-[16px] max-w-xl mx-auto mb-10 leading-relaxed"
              >
                Join the campus beta. Sign up with your phone, set your location radius, and claim micro-gigs within walking distance.
              </motion.p>

              {/* CTA input */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 p-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] backdrop-blur-md"
              >
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="+91 · Enter your phone number"
                  className="flex-1 bg-transparent px-5 py-3 outline-none text-[13px] text-gray-200 placeholder-gray-600 border-none w-full"
                />
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(99,102,241,0.45)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => window.location.href = '/onboarding'}
                  className="px-7 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-[12.5px] font-bold text-white transition-all flex items-center justify-center gap-1.5 btn-magnetic whitespace-nowrap"
                >
                  Get Invite <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </motion.div>

              <div className="mt-8 flex flex-wrap justify-center gap-6 text-[11px] text-gray-500 font-semibold uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Students Free Forever</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 2-Min Job Postings</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Zero Platform Fees</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── FOOTER ────────────────────────────────────────── */}
        <footer className="relative z-10 max-w-6xl mx-auto px-4 py-10 border-t border-white/[0.04]">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-[15px] font-black tracking-[-0.03em] font-heading text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                JOBSWIPE
              </span>
              <span className="text-[10px] text-gray-700">© 2026</span>
            </div>
            <div className="flex gap-6 text-[12px] text-gray-600">
              <a href="#how" className="hover:text-gray-400 transition-colors">How it works</a>
              <a href="#trust" className="hover:text-gray-400 transition-colors">Trust Score</a>
              <a href="/provider-onboarding" className="hover:text-purple-400 transition-colors">Host Portal</a>
              <a href="/analytics" className="hover:text-rose-400 transition-colors">Admin Command</a>
              <a href="mailto:support@jobswipe.app" className="hover:text-gray-400 transition-colors">Support</a>
            </div>
          </div>
          <p className="text-[10.5px] text-gray-700 max-w-2xl mt-6 leading-relaxed">
            Disclaimer: JobSwipe is an experimental hyperlocal marketplace. All agreements, compliance, labor law, and payments happen directly between hosts and students.
          </p>
        </footer>

      </div>
    </LenisProvider>
  );
}
