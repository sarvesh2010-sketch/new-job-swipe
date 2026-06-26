'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, Bell } from 'lucide-react';

interface NavbarProps {
  title: string;
  showBack?: boolean;
}

export default function Navbar({ title, showBack = false }: NavbarProps) {
  const router = useRouter();
  const [unreadCount] = useState(2);
  const [scrolled, setScrolled] = useState(false);
  const avatarUrl =
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`sticky top-0 z-40 w-full px-4 py-3 transition-all duration-300 ${
        scrolled
          ? 'bg-deep/80 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.04)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-md mx-auto flex items-center justify-between">
        
        {/* Left: Back or Logo */}
        <div className="flex items-center gap-2.5">
          {showBack ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => router.back()}
              className="p-2 rounded-full bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-gray-300" />
            </motion.button>
          ) : (
            <Link href="/home" className="flex items-center gap-1.5 select-none">
              <span className="text-[15px] font-black tracking-tight font-heading text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                JOBSWIPE
              </span>
            </Link>
          )}
        </div>

        {/* Center: Page Title */}
        <h1 className="text-[13px] font-bold text-gray-100 tracking-tight font-heading max-w-[180px] truncate">
          {title}
        </h1>

        {/* Right: Notifications + Avatar */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/notifications"
            className="relative p-2 rounded-full bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all duration-200 group"
          >
            <Bell className="w-4 h-4 text-gray-400 group-hover:text-indigo-400 transition-colors" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 ring-2 ring-black"
              />
            )}
          </Link>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/profile"
              className="block w-7 h-7 rounded-full overflow-hidden border border-white/[0.12] hover:border-indigo-500/50 transition-colors"
            >
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
