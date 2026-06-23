'use client';

import React from 'react';
import { TrendingUp, Users, ShieldAlert, Zap, Compass, Activity, ShieldCheck, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AdminAnalyticsPage() {
  
  // Real-time Risk Monitoring Dashboard parameters
  const riskMetrics = [
    { name: 'No-Show Rate Average', value: '1.4%', status: 'Normal', color: 'text-glow-emerald bg-emerald-500/10 border-emerald-500/20' },
    { name: 'Scam Flags Registered', value: '2 Cases', status: 'Action Required', color: 'text-glow-rose bg-rose-500/10 border-rose-500/20 animate-pulse' },
    { name: 'Provider Onboard SLA', value: '3.8 Mins', status: 'SLA Met', color: 'text-glow-teal bg-teal-500/10 border-teal-500/20' }
  ];

  return (
    <div className="min-h-screen bg-void text-gray-100 pb-20">
      
      {/* Admin Header */}
      <header className="sticky top-0 z-40 bg-[#050814]/70 backdrop-blur-md border-b border-white/[0.06] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[16px] font-black tracking-tight font-heading text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-indigo-500">
              JOBSWIPE COMMAND
            </span>
            <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300">
              MODERATOR
            </span>
          </div>

          <div className="flex gap-6 text-[12px] font-bold text-gray-500">
            <Link href="/analytics" className="text-indigo-400">Analytics</Link>
            <Link href="/providers" className="hover:text-indigo-400">Verification</Link>
            <Link href="/reports" className="hover:text-indigo-400">Moderation</Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto w-full p-6 space-y-6">
        
        {/* Title row */}
        <div className="flex justify-between items-center mb-4 px-1">
          <div>
            <h2 className="text-[20px] font-bold text-gray-100 font-heading tracking-tight leading-none">
              Command Analytics Board
            </h2>
            <p className="text-[11px] text-gray-500 mt-1">Real-time system health and liquidity index.</p>
          </div>
          <span className="text-[10px] font-bold text-glow-emerald flex items-center gap-1 bg-emerald-500/5 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-glow-emerald animate-pulse" /> Systems Active
          </span>
        </div>

        {/* 1. CORE STATS BENTO GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Active Gigs */}
          <div className="p-5 rounded-[28px] bg-white/[0.01] border border-white/[0.04] flex flex-col justify-between h-[130px]">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Active Campus Gigs</span>
            <div>
              <span className="text-[32px] font-black text-gray-100 font-heading tracking-tight leading-none">18</span>
              <span className="text-[9px] text-glow-emerald block mt-1">+14% vs yesterday</span>
            </div>
          </div>

          {/* Active Students */}
          <div className="p-5 rounded-[28px] bg-white/[0.01] border border-white/[0.04] flex flex-col justify-between h-[130px]">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Registered Students</span>
            <div>
              <span className="text-[32px] font-black text-gray-100 font-heading tracking-tight leading-none">142</span>
              <span className="text-[9px] text-glow-indigo block mt-1">+48 hours growth</span>
            </div>
          </div>

          {/* Swipe Connect Rate */}
          <div className="p-5 rounded-[28px] bg-white/[0.01] border border-white/[0.04] flex flex-col justify-between h-[130px]">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Swipe Apply Rate</span>
            <div>
              <span className="text-[32px] font-black text-gray-100 font-heading tracking-tight leading-none">84.2%</span>
              <span className="text-[9px] text-glow-teal block mt-1">High conversion</span>
            </div>
          </div>

          {/* Verification SLA */}
          <div className="p-5 rounded-[28px] bg-white/[0.01] border border-white/[0.04] flex flex-col justify-between h-[130px]">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Escrow SLA</span>
            <div>
              <span className="text-[32px] font-black text-[#555] font-heading tracking-tight leading-none">N/A</span>
              <span className="text-[9px] text-gray-600 block mt-1">Deferred to Phase 3</span>
            </div>
          </div>

        </div>

        {/* 2. SPARK LINE DATA VISUALIZATIONS SECTION */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Chart 1: Swipe Apply Rate trend */}
          <div className="p-6 rounded-[32px] bg-[#0b0f19]/80 border border-white/[0.08] backdrop-blur-xl space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-[13px] font-bold text-gray-300 font-heading">Student Swipe Conversion (Weekly)</h4>
              <span className="text-[11px] font-bold text-glow-indigo">+18% increase</span>
            </div>
            
            <div className="h-[120px] w-full relative pt-4">
              <svg className="w-full h-full overflow-visible">
                <path
                  d="M 10 90 Q 90 85 180 50 T 520 20"
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_6px_rgba(99,102,241,0.4)]"
                />
                <circle cx="10" cy="90" r="4" className="fill-indigo-500" />
                <circle cx="180" cy="50" r="4" className="fill-purple-500" />
                <circle cx="520" cy="20" r="4" className="fill-teal-400 animate-ping" />
                <circle cx="520" cy="20" r="4" className="fill-teal-400" />
              </svg>
              <span className="absolute bottom-0 left-2 text-[9px] font-bold text-gray-600">60% Start</span>
              <span className="absolute top-2 right-2 text-[9px] font-bold text-glow-teal">84.2% Peak</span>
            </div>
          </div>

          {/* Chart 2: Daily Active Users */}
          <div className="p-6 rounded-[32px] bg-[#0b0f19]/80 border border-white/[0.08] backdrop-blur-xl space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-[13px] font-bold text-gray-300 font-heading">Daily Active Students (Sway curve)</h4>
              <span className="text-[11px] font-bold text-glow-purple">120 Active Peak</span>
            </div>

            <div className="h-[120px] w-full relative pt-4">
              <svg className="w-full h-full overflow-visible">
                <path
                  d="M 10 80 Q 90 30 180 70 T 520 15"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_6px_rgba(139,92,246,0.4)]"
                />
                <circle cx="10" cy="80" r="4" className="fill-purple-500" />
                <circle cx="180" cy="70" r="4" className="fill-indigo-500" />
                <circle cx="520" cy="15" r="4" className="fill-teal-400 animate-ping" />
                <circle cx="520" cy="15" r="4" className="fill-teal-400" />
              </svg>
              <span className="absolute bottom-0 left-2 text-[9px] font-bold text-gray-600">Mon: 45</span>
              <span className="absolute top-2 right-2 text-[9px] font-bold text-glow-teal">Sun: 120</span>
            </div>
          </div>

        </div>

        {/* 3. REAL-TIME RISK MONITORING DASHBOARD */}
        <div className="p-6 rounded-[32px] bg-white/[0.01] border border-white/[0.05] space-y-4">
          <h3 className="text-[13px] font-bold text-gray-300 font-heading flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-500" /> Real-time System Risk Parameters
          </h3>

          <div className="grid md:grid-cols-3 gap-4">
            {riskMetrics.map((rm) => (
              <div 
                key={rm.name}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex flex-col justify-between h-[110px]"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-semibold text-gray-400">{rm.name}</span>
                  <span className={`text-[8px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border ${rm.color}`}>
                    {rm.status}
                  </span>
                </div>
                <span className="text-[22px] font-black text-gray-200 font-heading mt-2">{rm.value}</span>
              </div>
            ))}
          </div>
        </div>

      </main>

    </div>
  );
}
