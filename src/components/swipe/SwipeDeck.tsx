'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SwipeCard from './SwipeCard';
import { RefreshCcw, Search, X, Check } from 'lucide-react';

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

export default function SwipeDeck({ jobs, onApply, onSkip, onTapDetails, onResetDeck }: SwipeDeckProps) {
  return (
    <div className="relative w-full flex flex-col items-center max-w-md mx-auto">
      {/* Cards container wrapper */}
      <div className="relative w-full h-[540px]">
        {/* Ambient glow ring behind deck */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-indigo-500/5 blur-[80px]" />
        </div>

        <AnimatePresence mode="popLayout">
          {jobs.length > 0 ? (
            jobs.slice(0, 2).map((job, idx) => {
              const isActive = idx === 0;
              return (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{
                    opacity: isActive ? 1 : 0.65,
                    scale: isActive ? 1 : 0.94,
                    rotate: isActive ? 0 : 3, // stacked rotated look
                    x: isActive ? 0 : -4,
                    y: isActive ? 0 : 16,
                    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.88,
                    y: -20,
                    transition: { duration: 0.3, ease: 'easeIn' }
                  }}
                  className="absolute inset-0"
                >
                  <SwipeCard
                    job={job}
                    active={isActive}
                    onSwipeRight={onApply}
                    onSwipeLeft={onSkip}
                    onTapDetails={onTapDetails}
                  />
                </motion.div>
              );
            })
          ) : (
            /* Empty deck */
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 rounded-2xl p-8 flex flex-col justify-center items-center text-center bg-deep/50 backdrop-blur-xl border border-white/[0.06]"
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
          )}
        </AnimatePresence>
      </div>

      {/* Control Action Bar (Inspired by the Carousel control design) */}
      {jobs.length > 0 && (
        <div className="mt-8 flex items-center gap-5 px-4 py-2.5 rounded-full bg-background/50 border border-white/[0.06] backdrop-blur-md shadow-xl">
          {/* Skip Button */}
          <button
            aria-label="Skip gig"
            onClick={() => onSkip(jobs[0].id)}
            className="p-3.5 rounded-full border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 hover:border-rose-500/40 text-rose-400 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Reset / Undo Deck Button */}
          <button
            aria-label="Reset deck"
            onClick={onResetDeck}
            className="p-2.5 rounded-full border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] text-gray-400 hover:text-white transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>

          {/* Apply Button */}
          <button
            aria-label="Apply gig"
            onClick={() => onApply(jobs[0].id)}
            className="p-3.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/40 text-emerald-400 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
          >
            <Check className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

