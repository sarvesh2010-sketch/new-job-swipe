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
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollConnectingLines from '@/components/landing/ScrollConnectingLines';
import InteractiveGrid from '@/components/landing/InteractiveGrid';
import TextPressure from '@/components/landing/TextPressure';
import TestimonialStack from '@/components/landing/TestimonialStack';
import { LetterSwapPingPong } from '@/components/ui/letter-swap';
import {
  ArrowRight,
  Sparkles,
  ShieldAlert,
  MapPin,
  Clock,
  Star,
  CheckCircle2,
  ChevronRight,
  Zap,
  Users,
  TrendingUp,
  History,
  Shield,
  Lock,
} from 'lucide-react';
import LenisProvider from '@/components/shared/LenisProvider';

const CrowdCanvas = dynamic(
  () => import('@/components/landing/CrowdCanvas'),
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
  const [activeSkill, setActiveSkill] = useState('Serving & Cafe');
  const [ledgerTab, setLedgerTab] = useState<'profile' | 'ledger'>('profile');
  const [trustScore, setTrustScore] = useState(4.0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    const unsub = scrollYProgress.on('change', setScrollProgress);
    return unsub;
  }, [scrollYProgress]);

  // Dynamic count-up animation for the Trust Score rating
  useEffect(() => {
    if (ledgerTab === 'profile') {
      let startVal = 4.0;
      const endVal = 4.8;
      const duration = 1000;
      const startTime = performance.now();

      const animateScore = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const current = startVal + (endVal - startVal) * easeOutCubic;
        setTrustScore(parseFloat(current.toFixed(1)));

        if (progress < 1) {
          requestAnimationFrame(animateScore);
        }
      };

      requestAnimationFrame(animateScore);
    }
  }, [ledgerTab]);

  // GSAP hero title character entrance (replaced by TextPressure animation)
  useEffect(() => {
    // Replaced with interactive TextPressure component
  }, []);

  // GSAP ScrollTrigger Animations for cards (Anime.js style)
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Problem section cards (3D rotation + slide)
      gsap.fromTo(
        '.problem-card',
        { y: 90, opacity: 0, rotationX: 12, transformOrigin: 'bottom center' },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          stagger: 0.15,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#problem',
            start: 'top 80%',
            end: 'top 40%',
            scrub: 1,
          },
        }
      );

      // 2. How it works steps (stagger scale-up + lift)
      gsap.fromTo(
        '.step-card',
        { y: 70, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.12,
          duration: 1,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: '#how',
            start: 'top 75%',
            end: 'top 30%',
            scrub: 1,
          },
        }
      );

      // 3. Trust Score card mockup (3D rotate reveal)
      gsap.fromTo(
        '.trust-card',
        { y: 100, rotationY: -15, rotationX: 10, opacity: 0 },
        {
          y: 0,
          rotationY: 0,
          rotationX: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#trust',
            start: 'top 75%',
            end: 'top 25%',
            scrub: 1.2,
          },
        }
      );

      // 4. Staggered Heading reveals (Word by word lift)
      const headings = gsap.utils.toArray('.reveal-heading');
      headings.forEach((heading: any) => {
        const words = heading.querySelectorAll('.reveal-word');
        gsap.fromTo(
          words,
          { yPercent: 100, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            stagger: 0.05,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: heading,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, containerRef);

    // 5. Interactive 3D mouse hover tilt on cards
    const cardElements = document.querySelectorAll('.problem-card, .step-card');
    const mouseMoveHandlers = new Map();
    const mouseLeaveHandlers = new Map();

    cardElements.forEach((card: any) => {
      const onMouseMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const tiltX = (y / (rect.height / 2)) * -10;
        const tiltY = (x / (rect.width / 2)) * 10;
        
        gsap.to(card, {
          rotationX: tiltX,
          rotationY: tiltY,
          transformPerspective: 800,
          scale: 1.025,
          borderColor: 'rgba(99, 102, 241, 0.4)',
          ease: 'power2.out',
          duration: 0.3
        });
      };

      const onMouseLeave = () => {
        gsap.to(card, {
          rotationX: 0,
          rotationY: 0,
          scale: 1,
          borderColor: 'rgba(255, 255, 255, 0.08)',
          ease: 'power2.out',
          duration: 0.5
        });
      };

      card.addEventListener('mousemove', onMouseMove);
      card.addEventListener('mouseleave', onMouseLeave);

      mouseMoveHandlers.set(card, onMouseMove);
      mouseLeaveHandlers.set(card, onMouseLeave);
    });

    return () => {
      ctx.revert();
      cardElements.forEach((card: any) => {
        const onMouseMove = mouseMoveHandlers.get(card);
        const onMouseLeave = mouseLeaveHandlers.get(card);
        if (onMouseMove) card.removeEventListener('mousemove', onMouseMove);
        if (onMouseLeave) card.removeEventListener('mouseleave', onMouseLeave);
      });
    };
  }, []);



  const SKILLS_MAP = {
    'Serving & Cafe': {
      icon: '☕',
      pay: '₹150 – ₹180 / hr',
      fillTime: '14 min avg.',
      desc: 'Cafes, canteens, and bistros within 600 m of DU, JNU, and Jamia campuses need serving help during peak hours — exactly when students have gaps.',
      demand: 'High demand • 40+ open listings',
      accent: 'indigo',
      jobs: [
        { title: 'DU Cafe Barista', dist: '320 m', pay: '₹165/hr', dur: '3 hrs', host: 'The Daily Grind' },
        { title: 'South Campus Bistro Host', dist: '550 m', pay: '₹150/hr', dur: '2 hrs', host: 'Satya Bistro' },
        { title: 'Satya Niketan Event Server', dist: '800 m', pay: '₹180/hr', dur: '4 hrs', host: 'Campus Events Co.' },
      ],
    },
    'Social Media': {
      icon: '📱',
      pay: '₹200 – ₹250 / hr',
      fillTime: '22 min avg.',
      desc: 'Local gyms, cafes, and coaching centres need students who can shoot reels, write captions, or run Instagram pages for a few hours per week.',
      demand: 'Growing • 18 open listings',
      accent: 'purple',
      jobs: [
        { title: 'Gym Promo Content Creator', dist: '400 m', pay: '₹220/hr', dur: '2 hrs', host: 'FitZone Lajpat' },
        { title: 'Cafe Feed Designer', dist: '650 m', pay: '₹200/hr', dur: '3 hrs', host: 'Brew & Co.' },
        { title: 'Student Hub Coordinator', dist: '1.1 km', pay: '₹250/hr', dur: '2 hrs', host: 'The Hub, Hudson Lane' },
      ],
    },
    'Event Staff': {
      icon: '🎪',
      pay: '₹500 – ₹800 / day',
      fillTime: '18 min avg.',
      desc: 'Fests, TEDx events, and private college parties always need crowd management, registration, or usher support — great for groups.',
      demand: 'Seasonal spikes • 12 open listings',
      accent: 'teal',
      jobs: [
        { title: 'Nexus Fest Assistant', dist: '200 m', pay: '₹700/day', dur: '8 hrs', host: 'Nexus Events DU' },
        { title: 'TEDx Ticket Counter', dist: '1.2 km', pay: '₹600/day', dur: '6 hrs', host: 'TEDx Kamla Nagar' },
        { title: 'DU Concert Usher', dist: '900 m', pay: '₹500/day', dur: '5 hrs', host: 'DUSU Productions' },
      ],
    },
    'Data Entry': {
      icon: '📊',
      pay: '₹170 – ₹200 / hr',
      fillTime: '30 min avg.',
      desc: 'Research labs, coaching centres, and small e-commerce businesses near campus regularly outsource spreadsheet and tabulation tasks.',
      demand: 'Steady • 24 open listings',
      accent: 'amber',
      jobs: [
        { title: 'Research Tabulation Assistant', dist: '500 m', pay: '₹200/hr', dur: '2 hrs', host: 'DU Sociology Dept.' },
        { title: 'E-Commerce Excel Helper', dist: '1.4 km', pay: '₹170/hr', dur: '3 hrs', host: 'ShopLocal Delhi' },
        { title: 'Exam Entry Assistant', dist: '600 m', pay: '₹180/hr', dur: '4 hrs', host: 'IMS Coaching' },
      ],
    },
    'Flyer & Promo': {
      icon: '📣',
      pay: '₹300 / job',
      fillTime: '10 min avg.',
      desc: 'Coaching centres and new businesses pay per-job for flyer distribution on campus. Fast, flexible, and easy to do between classes.',
      demand: 'Always on • 35 open listings',
      accent: 'emerald',
      jobs: [
        { title: 'Satya Flyer Distribution', dist: '100 m', pay: '₹300/job', dur: '1 hr', host: 'Vision IAS' },
        { title: 'Campus Promoter', dist: '350 m', pay: '₹300/job', dur: '1.5 hrs', host: 'Allen Coaching' },
        { title: 'Coaching Center Leaflet', dist: '700 m', pay: '₹300/job', dur: '1 hr', host: 'Navodaya Tutorials' },
      ],
    },
  };

  type SkillKey = keyof typeof SKILLS_MAP;
  const accentMap: Record<string, { ring: string; bg: string; border: string; text: string; chip: string; glow: string }> = {
    indigo:  { ring: 'ring-indigo-500/40',  bg: 'bg-indigo-500/10',  border: 'border-indigo-500/30',  text: 'text-indigo-400',  chip: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25', glow: 'shadow-[0_0_30px_rgba(99,102,241,0.15)]' },
    purple:  { ring: 'ring-purple-500/40',  bg: 'bg-purple-500/10',  border: 'border-purple-500/30',  text: 'text-purple-400',  chip: 'bg-purple-500/15 text-purple-300 border-purple-500/25', glow: 'shadow-[0_0_30px_rgba(168,85,247,0.15)]' },
    teal:    { ring: 'ring-teal-500/40',    bg: 'bg-teal-500/10',    border: 'border-teal-500/30',    text: 'text-teal-400',    chip: 'bg-teal-500/15 text-teal-300 border-teal-500/25', glow: 'shadow-[0_0_30px_rgba(20,184,166,0.15)]' },
    amber:   { ring: 'ring-amber-500/40',   bg: 'bg-amber-500/10',   border: 'border-amber-500/30',   text: 'text-amber-400',   chip: 'bg-amber-500/15 text-amber-300 border-amber-500/25', glow: 'shadow-[0_0_30px_rgba(245,158,11,0.15)]' },
    emerald: { ring: 'ring-emerald-500/40', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', chip: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25', glow: 'shadow-[0_0_30px_rgba(16,185,129,0.15)]' },
  };






  return (
    <LenisProvider>
      <div ref={containerRef} className="relative w-full min-h-screen bg-void text-gray-100 antialiased overflow-hidden">
        {/* Scroll connecting lines & Interactive grids */}
        <ScrollConnectingLines />
        <InteractiveGrid />


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
                href="/admin/login"
                className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-rose-400 hover:text-rose-300 transition-colors uppercase px-3.5 py-2 rounded-full border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10"
              >
                Admin
              </a>
              <a
                href="/login"
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
          <div className="absolute inset-0 z-0 pointer-events-none">
            <CrowdCanvas src="/images/peeps/all-peeps.png" rows={15} cols={7} />
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

            {/* Main headline with TextPressure using MangoGrotesque */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="w-full flex flex-col items-center gap-1 my-6 pointer-events-auto"
            >
              {/* Line 1 */}
              <div className="w-full" style={{ height: '5rem' }}>
                <TextPressure
                  text="EARN BETWEEN CLASSES"
                  textColor="#FFFFFF"
                  fontFamily="Roboto Flex"
                  fontUrl="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght,GRAD@8..144,25..151,100..1000,-200..150&display=swap"
                  minFontSize={36}
                  scaleFactor={1.8}
                  italic={false}
                />
              </div>
              {/* Line 2 */}
              <div className="w-full" style={{ height: '4rem' }}>
                <TextPressure
                  text="SWIPE. WORK. GET PAID."
                  textColor="#ff5005"
                  fontFamily="Roboto Flex"
                  fontUrl="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght,GRAD@8..144,25..151,100..1000,-200..150&display=swap"
                  minFontSize={30}
                  scaleFactor={1.6}
                  italic={false}
                />
              </div>
            </motion.div>

            {/* Sub copy */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-gray-400 text-[15px] sm:text-[18px] max-w-xl mx-auto mt-7 leading-relaxed pointer-events-auto"
            >
              Skip the corporate resume filters. Swipe on short-duration, paid gigs at verified local cafes, events, and campus spots. Apply with a college friend for safety, and get paid instantly the moment you finish.
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

        {/* ── PROBLEM SECTION ─────────────────────────────────── */}
        <section id="problem" className="relative max-w-6xl mx-auto px-4 py-28 sm:py-36 z-10 border-t border-white/[0.04]">

          {/* Header */}
          <div className="max-w-3xl mb-20">
            <SectionLabel>The Market Reality</SectionLabel>
            <h2 className="text-[30px] sm:text-[44px] font-bold tracking-tight mt-4 mb-6 font-heading leading-[1.1] flex flex-wrap justify-start gap-x-[0.25em] reveal-heading">
              <LetterSwapPingPong label="Why" className="reveal-word" />
              <LetterSwapPingPong label="student" className="reveal-word" />
              <LetterSwapPingPong label="work" className="reveal-word" />
              <LetterSwapPingPong label="is" className="reveal-word" />
              <LetterSwapPingPong label="broken" className="reveal-word text-rose-400" />
              <LetterSwapPingPong label="in" className="reveal-word" />
              <LetterSwapPingPong label="India." className="reveal-word" />
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-gray-400 leading-relaxed text-[15px] max-w-2xl"
            >
              India has <strong className="text-gray-200">40 million college students</strong>. Most are cash-strapped, living within 1–2 km of small businesses desperately short on part-time help. Yet no platform connects them — because every existing solution was built for someone else.
            </motion.p>
          </div>

          {/* Stat strip */}
          <StaggerChildren className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-20" delay={0.05}>
            {[
              { value: '₹2,400', sub: 'avg. monthly pocket money gap', color: 'text-rose-400', border: 'border-rose-500/15', bg: 'bg-rose-500/5' },
              { value: '84%', sub: 'of WhatsApp gig groups contain scam postings', color: 'text-orange-400', border: 'border-orange-500/15', bg: 'bg-orange-500/5' },
              { value: '3.2 km', sub: 'avg. distance students travel for unsafe gigs', color: 'text-amber-400', border: 'border-amber-500/15', bg: 'bg-amber-500/5' },
              { value: '6 wks', sub: 'avg. Internshala application-to-stipend time', color: 'text-purple-400', border: 'border-purple-500/15', bg: 'bg-purple-500/5' },
            ].map((s) => (
              <motion.div key={s.sub} variants={fadeUp} className={`p-5 rounded-2xl border ${s.border} ${s.bg}`}>
                <p className={`text-[28px] font-black tracking-tight ${s.color}`}>{s.value}</p>
                <p className="text-[11.5px] text-gray-500 mt-1.5 leading-snug">{s.sub}</p>
              </motion.div>
            ))}
          </StaggerChildren>

          {/* Competitor cards */}
          <div className="mb-16">
            <p className="text-[11px] font-bold tracking-widest uppercase text-gray-600 mb-6">What exists today — and why it fails students</p>
            <div className="grid sm:grid-cols-3 gap-5" style={{ perspective: '1000px' }}>
              {[
                {
                  n: '01',
                  title: 'Apna / WorkIndia',
                  label: 'Too Rigid',
                  labelColor: 'text-rose-400 border-rose-500/20 bg-rose-500/5',
                  icon: '🏗️',
                  desc: 'Engineered for permanent blue-collar placement. Minimum shift lengths of 8 hours clash directly with 3-hour lecture gaps. Verification takes 48+ hours — by then the gig is gone.',
                  bullets: ['Full-day shifts only', '2–3 day approval cycle', 'No buddy / co-apply system'],
                },
                {
                  n: '02',
                  title: 'Internshala / LinkedIn',
                  label: 'Too Corporate',
                  labelColor: 'text-orange-400 border-orange-500/20 bg-orange-500/5',
                  icon: '💼',
                  desc: 'Designed for resume-building, not rent money. Most listings are unpaid "exposure" roles or multi-month commitments that collide with exam season and class schedules.',
                  bullets: ['Often unpaid or ₹0–₹2k/month', 'Needs polished CV + cover letter', '4–8 week hiring pipeline'],
                },
                {
                  n: '03',
                  title: 'WhatsApp Groups',
                  label: 'Too Dangerous',
                  labelColor: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
                  icon: '⚠️',
                  desc: 'The default fallback for millions of students — completely unvetted. Fake recruiters demand ₹500–₹2,000 "security deposits" before work begins. Payment after shift is verbal-only and often withheld.',
                  bullets: ['84% groups have fake listings', 'Zero payment protection', 'No safety guarantee or buddy system'],
                },
              ].map((item) => (
                <div
                  key={item.n}
                  className="problem-card glass-card p-7 rounded-[24px] flex flex-col gap-5 cursor-default group"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[18px]">
                      {item.icon}
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${item.labelColor}`}>
                      {item.label}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-[16px] font-bold text-gray-100 tracking-tight font-heading mb-2">{item.title}</h3>
                    <p className="text-[12.5px] text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>

                  <ul className="space-y-2 mt-auto">
                    {item.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-[11.5px] text-gray-500">
                        <span className="w-1 h-1 rounded-full bg-rose-500/60 shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Cost of no-action callout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-[28px] overflow-hidden border border-rose-500/15 bg-rose-500/[0.04] p-8 sm:p-10"
          >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-rose-500/30 to-transparent" />
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span className="text-[10px] font-bold tracking-widest uppercase text-rose-400">The Real Cost of No Safe Option</span>
                </div>
                <p className="text-[15px] text-gray-200 leading-relaxed font-medium mb-4">
                  A 2023 survey of 1,200 Delhi-NCR college students found that <strong className="text-white">1 in 3 had been cheated at least once</strong> by a WhatsApp gig recruiter — losing an average of <strong className="text-rose-300">₹850 in upfront deposits</strong> that were never returned.
                </p>
                <p className="text-[13px] text-gray-500 leading-relaxed">
                  Beyond money, <strong className="text-gray-400">67% of female students</strong> surveyed said they had declined a gig they needed because they could not verify whether the location or employer was safe. The demand is real. The infrastructure to safely act on it does not exist.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { stat: '1 in 3', detail: 'students cheated by fake gig recruiters' },
                  { stat: '₹850', detail: 'avg. lost per scam incident' },
                  { stat: '67%', detail: 'female students avoided gigs due to safety concerns' },
                ].map((item) => (
                  <div key={item.stat} className="flex items-center gap-4 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <span className="text-[18px] font-black text-rose-300 shrink-0 w-16 text-right">{item.stat}</span>
                    <span className="text-[11.5px] text-gray-400 leading-snug">{item.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────── */}
        <section id="how" className="relative max-w-6xl mx-auto px-4 py-28 sm:py-36 z-10 border-t border-white/[0.04]">

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-20">
            <SectionLabel color="text-purple-400">Zero Friction</SectionLabel>
            <h2 className="text-[30px] sm:text-[42px] font-bold tracking-tight mt-4 mb-5 font-heading flex flex-wrap justify-center gap-x-[0.25em] reveal-heading">
              <LetterSwapPingPong label="From" className="reveal-word" />
              <LetterSwapPingPong label="lecture" className="reveal-word" />
              <LetterSwapPingPong label="gap" className="reveal-word" />
              <LetterSwapPingPong label="to" className="reveal-word" />
              <LetterSwapPingPong label="paid," className="reveal-word" />
              <LetterSwapPingPong label="in" className="reveal-word" />
              <LetterSwapPingPong label="4 steps." className="reveal-word text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400" />
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-gray-400 text-[14px] leading-relaxed"
            >
              No resume. No HR round. No waiting weeks. A student can go from scrolling JobSwipe to earning cash in under 30 minutes — here&apos;s exactly how.
            </motion.p>
          </div>

          {/* ── Main flowchart ─────────────────────────────────── */}
          <div className="relative mb-24">

            {/* Vertical connector line (desktop) */}
            <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-px bg-gradient-to-b from-indigo-500/40 via-purple-500/30 via-teal-500/30 to-emerald-500/40 -translate-x-1/2 z-0" />

            <div className="flex flex-col gap-6 relative z-10">
              {[
                {
                  n: '01',
                  side: 'left' as const,
                  accent: { ring: 'ring-indigo-500/40', bg: 'bg-indigo-500/10', border: 'border-indigo-500/25', num: 'text-indigo-400', tag: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300' },
                  icon: '👆',
                  title: 'Browse & Swipe',
                  time: '~2 min',
                  what: 'Open the app. Set your radius (e.g., 500 m). See real-time gig listings from verified local hosts — cafes, events, study centres — near your campus.',
                  howTo: 'Swipe right on a gig you like. Swipe left to skip. A 3-second undo button appears so you never misfire.',
                  youNeed: 'Nothing. Just your location.',
                  youGet: 'A shortlist of radius-matched, time-compatible gigs.',
                  bullets: ['Filter by: duration, pay, distance, skill', 'Each listing shows: host rating, exact location pin, shift duration, pay per hour', '3-sec undo — no accidental locks'],
                },
                {
                  n: '02',
                  side: 'right' as const,
                  accent: { ring: 'ring-purple-500/40', bg: 'bg-purple-500/10', border: 'border-purple-500/25', num: 'text-purple-400', tag: 'bg-purple-500/10 border-purple-500/20 text-purple-300' },
                  icon: '🤝',
                  title: 'Buddy Apply',
                  time: '~3 min',
                  what: 'Before submitting your application, you can (and we strongly recommend) tagging a college friend to co-apply. You both apply as a verified pair.',
                  howTo: 'Tap “Apply with a Buddy” → search by phone/name → send request. When they accept, a joint application goes to the host. If you go solo, you apply individually.',
                  youNeed: 'Optional: a friend’s phone number or JobSwipe handle.',
                  youGet: 'A joint application with a safety layer — both of you know the location, host, and shift details.',
                  bullets: ['Buddy system reduces safety risk dramatically', 'Host sees both Trust Scores before approving', 'If one buddy cancels, the other gets notified instantly'],
                },
                {
                  n: '03',
                  side: 'left' as const,
                  accent: { ring: 'ring-teal-500/40', bg: 'bg-teal-500/10', border: 'border-teal-500/25', num: 'text-teal-400', tag: 'bg-teal-500/10 border-teal-500/20 text-teal-300' },
                  icon: '✅',
                  title: 'Host Approves',
                  time: '~10–20 min',
                  what: 'The host sees your Trust Score, past ratings, punctuality record, and number of completed gigs. They tap Approve or pass. No negotiation, no interview.',
                  howTo: 'You receive a push notification the moment you’re approved. The notification includes: confirmed location pin, exact shift time, host contact number, and what to wear/bring.',
                  youNeed: 'A Trust Score ≥ 3.5 for most gigs. New students start at 4.0.',
                  youGet: 'Confirmed booking with full shift details — no ambiguity.',
                  bullets: ['Hosts must be admin-verified before posting', 'Average approval time: 18 minutes', 'You can decline post-approval with a 1-hr notice without penalty'],
                },
                {
                  n: '04',
                  side: 'right' as const,
                  accent: { ring: 'ring-emerald-500/40', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', num: 'text-emerald-400', tag: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' },
                  icon: '💸',
                  title: 'Work & Get Paid',
                  time: '2–5 hrs',
                  what: 'Show up, do the work. At shift end, the host opens the app and marks the gig complete. Your payment is logged immediately — no delays, no chasing.',
                  howTo: 'Host taps “Mark Complete” → enters hours worked → pays directly (UPI/cash). Both parties then rate each other. Ratings are permanent and public.',
                  youNeed: 'A UPI ID or cash preference set in your profile.',
                  youGet: '₹150–₹800 in hand + Trust Score update within 5 minutes of completion.',
                  bullets: ['Payment happens before you leave the premises', 'Both parties rate each other (1–5 stars)', 'Trust Score updates in real-time after rating'],
                },
              ].map((step, idx) => (
                <motion.div
                  key={step.n}
                  initial={{ opacity: 0, x: step.side === 'left' ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: idx * 0.08 }}
                  className={`flex ${
                    step.side === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'
                  } flex-col gap-6 items-start md:items-center`}
                >
                  {/* Card */}
                  <div className={`flex-1 p-7 rounded-[28px] border ${step.accent.border} ${step.accent.bg} backdrop-blur-sm`}>
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <span className="text-[22px]">{step.icon}</span>
                        <div>
                          <p className={`text-[10px] font-bold tracking-widest uppercase ${step.accent.num} mb-0.5`}>Step {step.n}</p>
                          <h3 className="text-[18px] font-bold text-gray-100 tracking-tight font-heading">{step.title}</h3>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${step.accent.tag} shrink-0`}>
                        ⏱ {step.time}
                      </span>
                    </div>

                    <p className="text-[13.5px] text-gray-300 leading-relaxed mb-4">{step.what}</p>

                    {/* How-to detail */}
                    <div className="mb-4 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                      <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1.5">How it works</p>
                      <p className="text-[12.5px] text-gray-400 leading-relaxed">{step.howTo}</p>
                    </div>

                    {/* Need / Get row */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-white/[0.025] border border-white/[0.05]">
                        <p className="text-[9.5px] font-bold text-gray-600 uppercase tracking-widest mb-1">You need</p>
                        <p className="text-[12px] text-gray-400">{step.youNeed}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-white/[0.025] border border-white/[0.05]">
                        <p className="text-[9.5px] font-bold text-gray-600 uppercase tracking-widest mb-1">You get</p>
                        <p className="text-[12px] text-gray-400">{step.youGet}</p>
                      </div>
                    </div>

                    {/* Bullets */}
                    <ul className="space-y-1.5">
                      {step.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-[11.5px] text-gray-500">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Center node */}
                  <div className={`shrink-0 w-14 h-14 rounded-full ring-2 ${step.accent.ring} ${step.accent.bg} flex items-center justify-center text-[20px] shadow-lg`}>
                    {step.icon}
                  </div>

                  {/* Spacer (mirrors card on opposite side) */}
                  <div className="hidden md:block flex-1" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Dual perspective: Student vs Host ─────────────── */}
          <div className="mb-20">
            <p className="text-[11px] font-bold tracking-widest uppercase text-gray-600 text-center mb-8">Same platform, two perspectives</p>
            <div className="grid md:grid-cols-2 gap-5">

              {/* Student view */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7 }}
                className="p-7 rounded-[28px] bg-indigo-500/[0.05] border border-indigo-500/20"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[22px]">🎓</span>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-indigo-400">For Students</p>
                    <h4 className="text-[16px] font-bold text-gray-100">Your earning timeline</h4>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { time: '0:00', label: 'Open app between lectures' },
                    { time: '0:02', label: 'Swipe right on a cafe gig 300m away' },
                    { time: '0:05', label: 'Tag your roommate as buddy' },
                    { time: '0:22', label: 'Get push notification: ✅ Approved' },
                    { time: '0:30', label: 'Walk to the host location' },
                    { time: '3:30', label: 'Shift ends. Host marks complete' },
                    { time: '3:31', label: '₹450 paid. Trust Score updated.' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <span className="text-[11px] font-mono text-indigo-400 w-10 shrink-0">{item.time}</span>
                      <div className="w-px h-5 bg-indigo-500/30" />
                      <span className="text-[12.5px] text-gray-300">{item.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Host view */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="p-7 rounded-[28px] bg-teal-500/[0.05] border border-teal-500/20"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[22px]">🏪</span>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-teal-400">For Hosts</p>
                    <h4 className="text-[16px] font-bold text-gray-100">Your hiring timeline</h4>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { time: '0:00', label: 'Helper calls in sick — panic sets in' },
                    { time: '0:02', label: 'Post a 3-hr gig (takes 2 min to fill form)' },
                    { time: '0:04', label: 'Applications arrive from nearby students' },
                    { time: '0:18', label: 'Review Trust Scores. Approve best pair.' },
                    { time: '0:30', label: 'Students arrive, confirmed and briefed' },
                    { time: '3:30', label: 'Tap \"Mark Complete\". Rate the pair.' },
                    { time: '3:31', label: 'Shift logged. Zero platform fee.' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <span className="text-[11px] font-mono text-teal-400 w-10 shrink-0">{item.time}</span>
                      <div className="w-px h-5 bg-teal-500/30" />
                      <span className="text-[12.5px] text-gray-300">{item.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

            </div>
          </div>

          {/* ── vs. traditional job search ─────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="rounded-[28px] overflow-hidden border border-white/[0.06]"
          >
            <div className="grid grid-cols-3 text-center text-[11px] font-bold uppercase tracking-widest">
              <div className="p-4 bg-white/[0.03] text-gray-500">Metric</div>
              <div className="p-4 bg-rose-500/[0.08] text-rose-400 border-x border-white/[0.06]">Traditional Search</div>
              <div className="p-4 bg-indigo-500/[0.08] text-indigo-400">JobSwipe</div>
            </div>
            {[
              { metric: 'Time to first earning', old: '3–6 weeks', newVal: '< 30 minutes' },
              { metric: 'Resume required', old: 'Yes', newVal: 'No' },
              { metric: 'Minimum shift', old: '8 hours', newVal: '2 hours' },
              { metric: 'Payment timeline', old: '15–30 days', newVal: 'Same day' },
              { metric: 'Safety verification', old: 'None', newVal: 'Admin-verified hosts + Buddy system' },
              { metric: 'Platform fee', old: '10–30%', newVal: '0% for students' },
            ].map((row, i) => (
              <div key={row.metric} className={`grid grid-cols-3 text-center border-t border-white/[0.04] ${
                i % 2 === 0 ? 'bg-white/[0.01]' : ''
              }`}>
                <div className="p-4 text-[12px] text-gray-500 text-left px-6">{row.metric}</div>
                <div className="p-4 text-[12px] text-rose-400 border-x border-white/[0.04]">{row.old}</div>
                <div className="p-4 text-[12.5px] text-emerald-400 font-semibold">{row.newVal}</div>
              </div>
            ))}
          </motion.div>

        </section>

        {/* ── TRUST SCORE ───────────────────────────────────── */}
        <section id="trust" className="relative max-w-6xl mx-auto px-4 py-28 sm:py-36 z-10 border-t border-white/[0.04]">
          <div className="grid md:grid-cols-12 gap-14 items-center">
            <div className="md:col-span-5">
              <SectionLabel color="text-teal-400">Reputation Ledger</SectionLabel>
              <h2 className="text-[30px] sm:text-[42px] font-bold tracking-tight mt-4 mb-6 font-heading leading-tight flex flex-wrap justify-start gap-x-[0.25em] reveal-heading">
                <LetterSwapPingPong label="Introducing" className="reveal-word" />
                <LetterSwapPingPong label="the" className="reveal-word" />
                <div className="w-full" />
                <LetterSwapPingPong label="Trust" className="reveal-word text-teal-400" />
                <LetterSwapPingPong label="Score." className="reveal-word text-teal-400" />
              </h2>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-gray-400 leading-relaxed mb-8 text-[14px]"
              >
                A portable credit-like rating that follows every student. Every student starts with a 4.0 baseline. Punctual completions boost it; no-shows penalize it.
              </motion.p>

              <StaggerChildren className="space-y-4" delay={0.15}>
                {[
                  { 
                    title: 'The 4.0 Starting Baseline', 
                    desc: 'Every student gets a fair baseline rating, bypassing the cold-start block.',
                    icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
                    bg: 'hover:border-emerald-500/20 hover:bg-emerald-500/[0.02]',
                    border: 'border-white/[0.04]'
                  },
                  { 
                    title: 'No-Show Penalties', 
                    desc: 'Failing to show for approved shifts deducts 0.5 points. Only reliable students progress.',
                    icon: <ShieldAlert className="w-4 h-4 text-indigo-400" />,
                    bg: 'hover:border-indigo-500/20 hover:bg-indigo-500/[0.02]',
                    border: 'border-white/[0.04]'
                  },
                  { 
                    title: 'Double-Sided Verification', 
                    desc: 'Hosts are manually verified by admins, and students rate hosts post-gig.',
                    icon: <Shield className="w-4 h-4 text-purple-400" />,
                    bg: 'hover:border-purple-500/20 hover:bg-purple-500/[0.02]',
                    border: 'border-white/[0.04]'
                  },
                ].map((item) => (
                  <motion.div 
                    key={item.title} 
                    variants={fadeUp} 
                    className={`flex gap-4 p-4 rounded-2xl border ${item.border} ${item.bg} bg-white/[0.01] transition-all duration-300 group`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-[13.5px] font-bold text-gray-200">{item.title}</h4>
                      <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </StaggerChildren>
            </div>

            {/* Profile / Ledger card mockup */}
            <div className="md:col-span-7 flex justify-center" style={{ perspective: '1000px' }}>
              <div className="absolute w-[380px] h-[380px] bg-indigo-500/8 blur-[100px] -z-10 rounded-full" />
              <motion.div
                whileHover={{ y: -6, rotateY: 4, rotateX: 2, scale: 1.015 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                className="trust-card w-full max-w-[370px] p-6 rounded-[32px] bg-[#0b0f19]/70 border border-white/[0.08] backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.55),inset_0_1px_0_0_rgba(255,255,255,0.05)] select-none cursor-default"
              >
                {/* Ledger Header Tabs */}
                <div className="flex gap-1.5 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl mb-6">
                  <button
                    onClick={() => setLedgerTab('profile')}
                    className={`flex-1 py-2 text-[10.5px] font-bold rounded-lg transition-all ${
                      ledgerTab === 'profile'
                        ? 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 shadow-[0_2px_10px_rgba(99,102,241,0.15)]'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    Reputation Profile
                  </button>
                  <button
                    onClick={() => setLedgerTab('ledger')}
                    className={`flex-1 py-2 text-[10.5px] font-bold rounded-lg transition-all ${
                      ledgerTab === 'ledger'
                        ? 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 shadow-[0_2px_10px_rgba(99,102,241,0.15)]'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    Audit Ledger
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {ledgerTab === 'profile' ? (
                    <motion.div
                      key="profile-tab"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <img
                          src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200&h=200"
                          alt="Student"
                          className="w-12 h-12 rounded-full border-2 border-indigo-500/40 object-cover shrink-0 w-12 h-12"
                          loading="lazy"
                          decoding="async"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-[15px] font-bold text-gray-100 font-heading">Rohan Sharma</h3>
                            <span className="text-[8px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded uppercase">VERIFIED</span>
                          </div>
                          <p className="text-[11.5px] text-gray-500">Delhi University · B.Com</p>
                        </div>
                      </div>

                      <div className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.05] text-center mb-5 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent" />
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Reputation Score</span>
                        <div className="flex items-center justify-center gap-3 mt-2">
                          <span className="text-[48px] font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-indigo-400 to-purple-400 tracking-tighter font-heading leading-none">
                            {trustScore.toFixed(1)}
                          </span>
                          <div className="text-left">
                            <div className="flex text-amber-400 text-xs gap-0.5">
                              {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                            </div>
                            <span className="text-[9.5px] text-emerald-400 font-bold mt-1 block">Top 5% Student</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2.5 text-[12px]">
                        {[
                          { label: 'Punctuality', val: '5.0 / 5.0' },
                          { label: 'Work Quality', val: '4.7 / 5.0' },
                          { label: 'Completed Gigs', val: '12 Shifts' },
                          { label: 'No-Shows', val: '0 Incidents', red: true },
                        ].map((row) => (
                          <div key={row.label} className={`flex justify-between items-center py-2 border-b border-white/[0.04] last:border-0 ${row.red ? 'text-rose-400' : ''}`}>
                            <span className="text-gray-500 flex items-center gap-2">
                              <CheckCircle2 className={`w-3.5 h-3.5 ${row.red ? 'text-rose-400' : 'text-indigo-400'}`} />
                              {row.label}
                            </span>
                            <span className={`font-bold ${row.red ? '' : 'text-gray-200'}`}>{row.val}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="ledger-tab"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-4"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[9.5px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                          <History className="w-3 h-3 text-indigo-400" />
                          Reputation History Log
                        </span>
                        <span className="text-[8.5px] text-teal-400 font-bold bg-teal-400/5 px-2 py-0.5 rounded border border-teal-400/10 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" /> SECURE AUDIT
                        </span>
                      </div>

                      <div className="space-y-2 max-h-[290px] overflow-y-auto pr-0.5">
                        {[
                          { id: 'TXN-9024', event: 'Shift Completed · Satya Bistro', time: '2 hours ago', impact: '+0.05', type: 'gain', status: 'SUCCESS' },
                          { id: 'TXN-8991', event: 'Host Feedback (5/5 Stars)', time: '1 day ago', impact: '+0.08', type: 'gain', status: 'SUCCESS' },
                          { id: 'TXN-8840', event: 'Buddy Gig Completion Bonus', time: '3 days ago', impact: '+0.02', type: 'gain', status: 'SUCCESS' },
                          { id: 'TXN-8762', event: 'Admin Verification Approved', time: '1 week ago', impact: '+0.15', type: 'gain', status: 'VERIFIED' },
                          { id: 'TXN-8610', event: 'Shift Cancellation (24h Notice)', time: '2 weeks ago', impact: '0.00', type: 'neutral', status: 'NEUTRAL' }
                        ].map((log) => (
                          <div key={log.id} className="p-2.5 bg-white/[0.015] border border-white/[0.03] rounded-xl flex justify-between items-center text-[12px]">
                            <div className="min-w-0 flex-1 pr-2">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[9px] font-mono text-gray-600 shrink-0">{log.id}</span>
                                <span className="font-bold text-gray-300 truncate leading-none mt-0.5">{log.event}</span>
                              </div>
                              <span className="text-[9.5px] text-gray-500 block mt-1">{log.time}</span>
                            </div>
                            <div className="text-right shrink-0">
                              <span className={`text-[11.5px] font-black font-mono block ${
                                log.type === 'gain' ? 'text-emerald-400' : 'text-gray-400'
                              }`}>
                                {log.impact}
                              </span>
                              <span className="text-[8px] text-gray-500 uppercase tracking-wider block leading-none mt-0.5">{log.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── CAREER GALAXY / INTELLIGENT ROUTING ──────────── */}
        <section id="galaxy" className="relative max-w-6xl mx-auto px-4 py-28 sm:py-36 z-10 border-t border-white/[0.04]">

          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-20">
            <SectionLabel color="text-purple-400">Intelligent Routing</SectionLabel>
            <h2 className="text-[30px] sm:text-[44px] font-bold tracking-tight mt-4 mb-5 font-heading flex flex-wrap justify-center gap-x-[0.25em] reveal-heading">
              <LetterSwapPingPong label="Your" className="reveal-word" />
              <LetterSwapPingPong label="skills" className="reveal-word" />
              <LetterSwapPingPong label="unlock" className="reveal-word" />
              <LetterSwapPingPong label="the" className="reveal-word" />
              <LetterSwapPingPong label="right" className="reveal-word" />
              <LetterSwapPingPong label="gigs." className="reveal-word text-purple-400" />
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-gray-400 text-[14.5px] leading-relaxed max-w-xl mx-auto"
            >
              JobSwipe doesn&apos;t show you every gig in the city. It shows you gigs within your skill set, within walking distance of your campus, and within the hours you&apos;re free — automatically.
            </motion.p>
          </div>

          {/* ── Interactive Skill Explorer ───────────────────── */}
          <div className="grid md:grid-cols-12 gap-6 items-start mb-20">

            {/* Left: skill selector */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-4 flex flex-col gap-2"
            >
              <p className="text-[10px] font-bold tracking-widest uppercase text-gray-600 mb-3 px-1">Select a skill category</p>
              {(Object.keys(SKILLS_MAP) as SkillKey[]).map((skill) => {
                const s = SKILLS_MAP[skill];
                const ac = accentMap[s.accent];
                const isActive = activeSkill === skill;
                return (
                  <motion.button
                    key={skill}
                    onClick={() => setActiveSkill(skill)}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full px-5 py-4 rounded-2xl text-left border transition-all duration-300 flex items-center gap-3 ${
                      isActive
                        ? `${ac.bg} ${ac.border} ${ac.glow}`
                        : 'bg-white/[0.01] border-white/[0.05] hover:bg-white/[0.03] hover:border-white/[0.1]'
                    }`}
                  >
                    <span className="text-[18px] shrink-0">{s.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[13px] font-bold leading-tight ${ isActive ? 'text-gray-100' : 'text-gray-400' }`}>{skill}</p>
                      <p className={`text-[10.5px] mt-0.5 truncate ${ isActive ? ac.text : 'text-gray-600' }`}>{s.pay}</p>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 transition-all duration-200 ${ isActive ? `${ac.text} translate-x-0.5` : 'text-gray-700' }`} />
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Right: gig listings panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-8"
            >
              {(() => {
                const s = SKILLS_MAP[activeSkill as SkillKey];
                const ac = accentMap[s.accent];
                return (
                  <div className={`h-full p-7 rounded-[28px] border ${ac.border} ${ac.bg} backdrop-blur-md relative overflow-hidden ${ac.glow}`}>
                    <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${ac.text.replace('text-', 'via-')}/40 to-transparent`} />
                    <div className="absolute top-0 right-0 w-[200px] h-[200px] opacity-20 blur-[80px] rounded-full bg-purple-500/30 -z-10" />

                    {/* Panel header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <span className="text-[28px]">{s.icon}</span>
                        <div>
                          <h3 className="text-[17px] font-bold text-gray-100 font-heading">{activeSkill}</h3>
                          <p className="text-[11.5px] text-gray-500 mt-0.5">{s.desc}</p>
                        </div>
                      </div>
                    </div>

                    {/* Meta row */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className={`text-[10.5px] font-bold px-3 py-1.5 rounded-full border ${ac.chip}`}>
                        💰 {s.pay}
                      </span>
                      <span className={`text-[10.5px] font-bold px-3 py-1.5 rounded-full border ${ac.chip}`}>
                        ⚡ {s.fillTime}
                      </span>
                      <span className="text-[10.5px] font-bold px-3 py-1.5 rounded-full border bg-white/[0.04] border-white/[0.08] text-gray-400">
                        📍 {s.demand}
                      </span>
                    </div>

                    <p className="text-[10px] font-bold tracking-widest uppercase text-gray-600 mb-4">Live gigs matching this skill</p>

                    {/* Gig cards */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeSkill}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-3"
                      >
                        {s.jobs.map((job, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.14] hover:bg-white/[0.05] transition-all group cursor-default"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                  <div className={`w-1.5 h-1.5 rounded-full ${ac.text.replace('text-', 'bg-')} shrink-0 animate-pulse`} />
                                  <span className="text-[13.5px] font-bold text-gray-200 leading-tight">{job.title}</span>
                                </div>
                                <p className="text-[11px] text-gray-600">by {job.host}</p>
                              </div>
                              <div className="flex flex-col items-end gap-1.5 shrink-0">
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${ac.chip}`}>{job.pay}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 mt-3">
                              <span className="text-[10.5px] text-gray-600 flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {job.dist}
                              </span>
                              <span className="text-[10.5px] text-gray-600 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {job.dur}
                              </span>
                              <span className={`text-[10px] font-bold ml-auto ${ac.text} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                                Swipe to apply →
                              </span>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    </AnimatePresence>

                    {/* Footer */}
                    <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center justify-between">
                      <span className="text-[11px] text-gray-600">Gigs update in real-time as hosts post</span>
                      <span className={`text-[11px] font-mono font-bold flex items-center gap-1.5 ${ac.text}`}>
                        <Zap className="w-3.5 h-3.5 fill-current" /> {s.fillTime}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </div>

          {/* ── How routing works ───────────────────────────── */}
          <div className="mb-16">
            <p className="text-[11px] font-bold tracking-widest uppercase text-gray-600 text-center mb-8">How intelligent routing works behind the scenes</p>
            <div className="grid sm:grid-cols-4 gap-4">
              {[
                { n: '01', icon: '📍', title: 'Location Layer', desc: 'On signup you set your campus pin. The engine only surfaces gigs within your chosen radius — 500 m to 3 km.' },
                { n: '02', icon: '🎨', title: 'Skill Matching', desc: 'You tag yourself with skills (serving, social media, data entry…). Only hosts who need those skills see your profile.' },
                { n: '03', icon: '📅', title: 'Schedule Sync', desc: 'Add your timetable. The engine hides gigs that clash with your lectures, exams, or already-booked shifts.' },
                { n: '04', icon: '⭐', title: 'Trust Boost', desc: 'Higher Trust Score students appear first in the host’s applicant queue — your record earns you better gigs over time.' },
              ].map((item, idx) => (
                <motion.div
                  key={item.n}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: idx * 0.08 }}
                  className="p-5 rounded-[22px] bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-all"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[20px]">{item.icon}</span>
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{item.n}</span>
                  </div>
                  <h4 className="text-[14px] font-bold text-gray-200 mb-2">{item.title}</h4>
                  <p className="text-[12px] text-gray-500 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Routing facts strip ────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {[
              { val: '< 1 km', label: 'median gig distance from campus', color: 'text-indigo-400' },
              { val: '14 min', label: 'fastest skill-to-approval match', color: 'text-purple-400' },
              { val: '5 cats', label: 'skill categories at launch', color: 'text-teal-400' },
              { val: '100%', label: 'gig listings from admin-verified hosts', color: 'text-emerald-400' },
            ].map((s) => (
              <div key={s.label} className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-center">
                <p className={`text-[24px] font-black tracking-tight ${s.color}`}>{s.val}</p>
                <p className="text-[11px] text-gray-600 mt-1.5 leading-snug">{s.label}</p>
              </div>
            ))}
          </motion.div>

        </section>

        {/* ── CAMPUS TRUST ───────────────────────────────────── */}
        <section id="stories" className="relative max-w-6xl mx-auto px-4 py-28 sm:py-36 z-10 border-t border-white/[0.04]">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* Left: heading + social proof stats */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <SectionLabel>Campus Trust</SectionLabel>
              <h2 className="text-[30px] sm:text-[42px] font-bold tracking-tight mt-4 mb-5 font-heading flex flex-wrap gap-x-[0.25em] reveal-heading">
                <LetterSwapPingPong label="Proven" className="reveal-word" />
                <LetterSwapPingPong label="in" className="reveal-word" />
                <LetterSwapPingPong label="the" className="reveal-word" />
                <LetterSwapPingPong label="pilot" className="reveal-word" />
                <LetterSwapPingPong label="market." className="reveal-word" />
              </h2>
              <p className="text-gray-400 text-[14px] leading-relaxed mb-10">
                Real students and verified hosts sharing their JobSwipe stories from Delhi NCR's pilot market. Drag a card or wait — they cycle automatically.
              </p>

              {/* Social proof stats */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '4.8★', label: 'Avg. Trust Score', color: 'text-amber-400' },
                  { value: '18 min', label: 'Avg. Shift Fill Time', color: 'text-teal-400' },
                  { value: '0', label: 'Payment Disputes', color: 'text-emerald-400' },
                  { value: '94%', label: 'Repeat Applicants', color: 'text-indigo-400' },
                ].map((stat) => (
                  <div key={stat.label} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm">
                    <p className={`text-[22px] font-black tracking-tight ${stat.color}`}>{stat.value}</p>
                    <p className="text-[11px] text-gray-500 mt-1 leading-tight">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: draggable card stack */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="flex justify-center"
            >
              <TestimonialStack />
            </motion.div>

          </div>
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
                  onClick={() => window.location.href = '/login'}
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
              <a href="/login" className="hover:text-purple-400 transition-colors">Host Portal</a>
              <a href="/admin/login" className="hover:text-rose-400 transition-colors">Admin Command</a>
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
