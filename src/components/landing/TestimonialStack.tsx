"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShieldCheck, Zap } from "lucide-react";

/* ─── Data ──────────────────────────────────────────────────────────────────── */
type CardRole = "Student" | "Host";

interface Testimonial {
  id: number;
  author: string;
  role: CardRole;
  detail: string;
  quote: string;
  score: string;
  scoreLabel: string;
  tag: string;
  accentColor: "indigo" | "teal" | "purple" | "emerald" | "rose" | "amber";
}

const CARDS: Testimonial[] = [
  {
    id: 1,
    author: "Rohan Sharma",
    role: "Student",
    detail: "B.Com · Delhi University",
    quote:
      "Had a 3-hour gap between lectures. Swiped right at a cafe 400m away, got approved in 10 minutes with my roommate. We cleared tables, earned ₹450 each, and were back in class by 3 PM.",
    score: "4.9",
    scoreLabel: "Trust Score",
    tag: "Top 5% Earner",
    accentColor: "indigo",
  },
  {
    id: 2,
    author: "Priya Nair",
    role: "Host",
    detail: "Owner · The Daily Grind Cafe",
    quote:
      "My weekend helper called in sick at 11 AM during the rush. I posted a 4-hour gig on JobSwipe. By 11:15 AM I had two students with 4.8+ Trust Scores approved and on their way.",
    score: "Verified",
    scoreLabel: "Host Status",
    tag: "100+ Gigs Posted",
    accentColor: "teal",
  },
  {
    id: 3,
    author: "Aditya Mehta",
    role: "Student",
    detail: "B.Tech CSE · IIT Delhi",
    quote:
      "Applied with my college friend for a TEDx event usher role. We both got approved, worked a 5-hour shift, and made ₹800 each. The buddy feature made me feel safe the whole time.",
    score: "4.7",
    scoreLabel: "Trust Score",
    tag: "8 Gigs Completed",
    accentColor: "purple",
  },
  {
    id: 4,
    author: "Sneha Kapoor",
    role: "Student",
    detail: "BA Sociology · Jadavpur University",
    quote:
      "I was between classes with zero cash. Found a flyer distribution gig 2 blocks from campus. Swiped, got approved, earned ₹300 in 90 minutes. Now I check JobSwipe every morning.",
    score: "4.8",
    scoreLabel: "Trust Score",
    tag: "No-Shows: 0",
    accentColor: "emerald",
  },
  {
    id: 5,
    author: "Rahul Singhvi",
    role: "Host",
    detail: "Manager · Satya Niketan Bistro",
    quote:
      "We used to lose Saturday revenue when staff didn't show up. With JobSwipe we can fill any shift in under 30 minutes. The Trust Score filter saves us from unreliable applicants completely.",
    score: "Verified",
    scoreLabel: "Host Status",
    tag: "Avg. Fill Time: 18 min",
    accentColor: "amber",
  },
  {
    id: 6,
    author: "Meera Iyer",
    role: "Student",
    detail: "MBA · FMS Delhi",
    quote:
      "Worked three data-entry gigs during semester break. Earned ₹4,500 total without ever leaving my neighborhood. The instant pay confirmation after each gig is genuinely satisfying.",
    score: "5.0",
    scoreLabel: "Trust Score",
    tag: "Perfect Punctuality",
    accentColor: "rose",
  },
  {
    id: 7,
    author: "Karan Bhatia",
    role: "Student",
    detail: "B.Sc Economics · St. Stephen's",
    quote:
      "My first gig was terrifying — I didn't know what to expect. But the host was verified, the location was campus-close, and I applied with my best friend. Easiest ₹350 I've ever made.",
    score: "4.6",
    scoreLabel: "Trust Score",
    tag: "Growing Fast",
    accentColor: "indigo",
  },
];

/* ─── Accent map ─────────────────────────────────────────────────────────────── */
const ACCENT: Record<
  Testimonial["accentColor"],
  { border: string; badge: string; score: string; glow: string }
> = {
  indigo: {
    border: "border-indigo-500/30",
    badge: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
    score: "from-indigo-400 to-purple-400",
    glow: "rgba(99,102,241,0.18)",
  },
  teal: {
    border: "border-teal-500/30",
    badge: "bg-teal-500/10 text-teal-300 border-teal-500/20",
    score: "from-teal-400 to-emerald-400",
    glow: "rgba(20,184,166,0.18)",
  },
  purple: {
    border: "border-purple-500/30",
    badge: "bg-purple-500/10 text-purple-300 border-purple-500/20",
    score: "from-purple-400 to-pink-400",
    glow: "rgba(168,85,247,0.18)",
  },
  emerald: {
    border: "border-emerald-500/30",
    badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    score: "from-emerald-400 to-teal-400",
    glow: "rgba(52,211,153,0.18)",
  },
  rose: {
    border: "border-rose-500/30",
    badge: "bg-rose-500/10 text-rose-300 border-rose-500/20",
    score: "from-rose-400 to-orange-400",
    glow: "rgba(251,113,133,0.18)",
  },
  amber: {
    border: "border-amber-500/30",
    badge: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    score: "from-amber-400 to-yellow-300",
    glow: "rgba(251,191,36,0.18)",
  },
};

/* ─── Single card ────────────────────────────────────────────────────────────── */
interface CardProps {
  card: Testimonial;
  position: "front" | "middle" | "back";
  handleShuffle: () => void;
}

function TestimonialCard({ card, position, handleShuffle }: CardProps) {
  const dragStartX = React.useRef(0);
  const isFront = position === "front";
  const accent = ACCENT[card.accentColor];

  return (
    <motion.div
      style={{
        zIndex: isFront ? 3 : position === "middle" ? 2 : 1,
        boxShadow: isFront
          ? `0 0 60px ${accent.glow}, 0 20px 60px rgba(0,0,0,0.5)`
          : "0 8px 32px rgba(0,0,0,0.35)",
      }}
      animate={{
        rotate:
          position === "front"
            ? -5
            : position === "middle"
            ? 0
            : 5,
        x:
          position === "front"
            ? "0%"
            : position === "middle"
            ? "28%"
            : "56%",
        scale: isFront ? 1 : position === "middle" ? 0.97 : 0.94,
      }}
      drag={isFront}
      dragElastic={0.18}
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      onDragStart={(e) => {
        dragStartX.current = (e as MouseEvent).clientX;
      }}
      onDragEnd={(e) => {
        if (dragStartX.current - (e as MouseEvent).clientX > 120) {
          handleShuffle();
        }
        dragStartX.current = 0;
      }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute left-0 top-0 flex flex-col select-none w-[320px] sm:w-[360px] rounded-[28px] border ${accent.border} bg-[#0a0d18]/70 backdrop-blur-xl p-7 gap-5 ${
        isFront ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
      }`}
    >
      {/* Role badge */}
      <div className="flex items-center justify-between">
        <span
          className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border ${accent.badge}`}
        >
          {card.role === "Host" ? (
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Verified Host
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3" /> Student
            </span>
          )}
        </span>
        <span className="text-[10px] font-semibold text-gray-600 bg-white/[0.03] border border-white/[0.06] rounded-full px-2.5 py-1">
          {card.tag}
        </span>
      </div>

      {/* Avatar + author */}
      <div className="flex items-center gap-4">
        <img
          src={`https://i.pravatar.cc/128?img=${card.id}`}
          alt={`Avatar of ${card.author}`}
          className={`w-14 h-14 rounded-full border-2 ${accent.border} object-cover shrink-0`}
          draggable={false}
        />
        <div>
          <p className="text-[14px] font-bold text-gray-100">{card.author}</p>
          <p className="text-[11.5px] text-gray-500 mt-0.5">{card.detail}</p>
        </div>
      </div>

      {/* Stars */}
      {card.role === "Student" && (
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
            />
          ))}
        </div>
      )}

      {/* Quote */}
      <blockquote className="text-[13.5px] text-gray-300 leading-relaxed italic flex-1">
        &ldquo;{card.quote}&rdquo;
      </blockquote>

      {/* Score bar */}
      <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
          {card.scoreLabel}
        </span>
        <span
          className={`text-[20px] font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r ${accent.score}`}
        >
          {card.score}
        </span>
      </div>

      {/* Drag hint (front only) */}
      {isFront && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-[10px] text-gray-700 text-center -mt-2"
        >
          ← drag left to see more
        </motion.p>
      )}
    </motion.div>
  );
}

/* ─── Stack container ────────────────────────────────────────────────────────── */
export default function TestimonialStack() {
  const [order, setOrder] = React.useState<number[]>(
    CARDS.map((_, i) => i)
  );

  const shuffle = React.useCallback(() => {
    setOrder((prev) => {
      const next = [...prev];
      // Move front card to back
      const front = next.shift()!;
      next.push(front);
      return next;
    });
  }, []);

  // Auto-advance every 6 seconds
  React.useEffect(() => {
    const t = setInterval(shuffle, 6000);
    return () => clearInterval(t);
  }, [shuffle]);

  const getPosition = (idx: number): "front" | "middle" | "back" => {
    if (idx === 0) return "front";
    if (idx === 1) return "middle";
    return "back";
  };

  return (
    <div className="flex flex-col items-center gap-12">
      {/* Card stack */}
      <div className="relative h-[440px] w-[320px] sm:w-[360px]">
        <AnimatePresence>
          {order.slice(0, 3).map((cardIndex, stackPos) => (
            <TestimonialCard
              key={CARDS[cardIndex].id}
              card={CARDS[cardIndex]}
              position={getPosition(stackPos)}
              handleShuffle={shuffle}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="flex gap-2 items-center">
        {CARDS.map((_, i) => {
          const isActive = order[0] === i;
          return (
            <button
              key={i}
              onClick={() => {
                setOrder((prev) => {
                  // Rotate until desired card is at front
                  const next = [...prev];
                  while (next[0] !== i) {
                    const front = next.shift()!;
                    next.push(front);
                  }
                  return next;
                });
              }}
              className={`rounded-full transition-all duration-300 ${
                isActive
                  ? "bg-indigo-500 w-6 h-1.5"
                  : "bg-white/20 w-1.5 h-1.5 hover:bg-white/40"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
