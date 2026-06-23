'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Layers, Award, User } from 'lucide-react';

const tabs = [
  { id: 'feed',    label: 'Swipe',   path: '/home',         icon: Sparkles },
  { id: 'apps',    label: 'History', path: '/applications', icon: Layers   },
  { id: 'trust',   label: 'Trust',   path: '/trust-score',  icon: Award    },
  { id: 'profile', label: 'Profile', path: '/profile',      icon: User     },
];

export default function BottomTabBar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/home') return pathname === '/home' || pathname.startsWith('/job/');
    return pathname === path;
  };

  return (
    <div className="fixed bottom-6 left-0 right-0 z-40 px-4 pointer-events-none">
      <motion.nav
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[340px] mx-auto flex items-center justify-around p-1.5 rounded-full bg-[#0b0f19]/75 backdrop-blur-2xl border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.6)] pointer-events-auto"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);

          return (
            <Link
              key={tab.id}
              href={tab.path}
              className="relative flex-1 flex flex-col items-center gap-0.5 py-2.5 rounded-full focus:outline-none"
            >
              {/* Sliding active pill */}
              <AnimatePresence>
                {active && (
                  <motion.div
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-full bg-white/[0.07] border border-white/[0.06]"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
              </AnimatePresence>

              {/* Icon */}
              <motion.div
                animate={{
                  scale: active ? 1.12 : 1,
                  y: active ? -1 : 0,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`relative z-10 transition-colors ${
                  active ? 'text-indigo-400' : 'text-gray-500'
                }`}
              >
                <Icon className="w-[18px] h-[18px]" strokeWidth={active ? 2.2 : 1.8} />
              </motion.div>

              {/* Label */}
              <span
                className={`relative z-10 text-[8.5px] font-bold tracking-wide uppercase transition-colors ${
                  active ? 'text-gray-200' : 'text-gray-600'
                }`}
              >
                {tab.label}
              </span>

              {/* Active dot indicator */}
              <AnimatePresence>
                {active && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-indigo-500"
                  />
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
}
