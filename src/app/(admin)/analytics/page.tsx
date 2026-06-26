'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { 
  TrendingUp, Users, ShieldAlert, Zap, Compass, Activity, 
  ShieldCheck, Clock, MessageSquare, DollarSign, ArrowUpRight, 
  ArrowDownRight, RefreshCw, FileText, ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Custom Interactive Sparkline Component
interface SparklineProps {
  data: number[];
  labels: string[];
  color: string;
  glowColor: string;
  unit: string;
}

function CommandSparkline({ data, labels, color, glowColor, unit }: SparklineProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });

  const width = 500;
  const height = 120;
  const padding = 15;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = useMemo(() => {
    return data.map((val, idx) => {
      const x = padding + (idx / (data.length - 1)) * (width - padding * 2);
      const y = height - padding - ((val - min) / range) * (height - padding * 2);
      return { x, y, value: val, label: labels[idx] };
    });
  }, [data, labels, min, range]);

  const pathD = useMemo(() => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cx = (prev.x + curr.x) / 2;
      d += ` C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    return d;
  }, [points]);

  const fillD = useMemo(() => {
    if (points.length === 0) return '';
    return `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;
  }, [points, pathD]);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const svgWidth = rect.width;
    
    const scaleX = width / svgWidth;
    const targetX = mouseX * scaleX;

    let closestIdx = 0;
    let minDiff = Infinity;
    points.forEach((pt, idx) => {
      const diff = Math.abs(pt.x - targetX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    setHoveredIndex(closestIdx);
    
    const pt = points[closestIdx];
    const domX = (pt.x / width) * svgWidth;
    const domY = (pt.y / height) * rect.height;
    setHoverPos({ x: domX, y: domY });
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <div className="relative w-full h-[140px]" onMouseLeave={handleMouseLeave}>
      <svg
        className="w-full h-full overflow-visible cursor-crosshair"
        viewBox={`0 0 ${width} ${height}`}
        onMouseMove={handleMouseMove}
      >
        {/* Gridlines */}
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />
        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />

        <defs>
          <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        <path d={fillD} fill={`url(#grad-${color.replace('#', '')})`} />

        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          className="transition-all duration-300"
          style={{ filter: `drop-shadow(0 0 6px ${glowColor})` }}
        />

        {points.map((pt, idx) => (
          <circle
            key={idx}
            cx={pt.x}
            cy={pt.y}
            r={hoveredIndex === idx ? 5 : 2}
            className="transition-all duration-150"
            fill={hoveredIndex === idx ? color : 'rgba(255,255,255,0.2)'}
            stroke={hoveredIndex === idx ? '#0f0f16' : 'none'}
            strokeWidth="1.5"
          />
        ))}
      </svg>

      {hoveredIndex !== null && points[hoveredIndex] && (
        <div
          className="absolute z-10 pointer-events-none bg-[#14141d] border border-white/[0.08] rounded-lg px-2.5 py-1.5 shadow-xl text-[10px] font-mono leading-none"
          style={{
            left: `${hoverPos.x}px`,
            top: `${hoverPos.y - 45}px`,
            transform: 'translateX(-50%)',
          }}
        >
          <span className="text-gray-500 block mb-0.5">{points[hoveredIndex].label}</span>
          <span className="font-bold text-gray-100">{points[hoveredIndex].value}{unit}</span>
        </div>
      )}
    </div>
  );
}

// Simulated active logs
const INITIAL_LOGS = [
  { time: '10s ago', type: 'match', desc: 'Student A matched with Provider X for "Leaf Raking"', details: 'Payment escrow initialized.' },
  { time: '1m ago', type: 'gig', desc: 'New gig "Library Catalog Assistant" posted', details: 'Provider: Central Library.' },
  { time: '3m ago', type: 'swipe', desc: 'Student swipe right count exceeded peak threshold', details: 'Activity level high.' },
  { time: '6m ago', type: 'user', desc: 'New provider account approved: "TechTutors Inc"', details: 'SLA: 3.8 mins.' },
  { time: '10m ago', type: 'risk', desc: 'Auto-verification flag triggered on user account #891', details: 'IP mismatch detected.' },
];

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('7d');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedCaseId, setExpandedCaseId] = useState<number | null>(null);

  // Moderation state
  const [moderationCases, setModerationCases] = useState([
    { id: 1024, reporter: 'Student #182', subject: 'Provider #92', reason: 'Unpaid wages / no-show payment dispute', severity: 'High', date: 'June 26, 07:12', details: 'Student completed gig "Backend Migration Help" but provider refused payment authorization, claiming incomplete work.' },
    { id: 1025, reporter: 'Provider #14', subject: 'Student #244', reason: 'Student no-show without 2h notice', severity: 'Medium', date: 'June 25, 23:45', details: 'Student scheduled for "Campus Pizza Deliveries" did not check in and did not cancel the gig within the mandated 2-hour SLA window.' },
    { id: 1026, reporter: 'System Guard', subject: 'Gig #491', reason: 'Suspicious posting (phishing pattern)', severity: 'Low', date: 'June 25, 18:22', details: 'Automatic description scan flagged this gig listing due to request for direct Telegram correspondence and payment details off-platform.' },
  ]);

  // System Events Feed state
  const [systemLogs, setSystemLogs] = useState(INITIAL_LOGS);

  useEffect(() => {
    const loggedIn = localStorage.getItem('jobswipe_admin_logged_in');
    if (!loggedIn) {
      router.push('/admin/login');
    }
  }, [router]);

  // Add random logs dynamically to show real-time detail
  useEffect(() => {
    const logPool = [
      { type: 'match', desc: 'Student matched for "Campus Tour Guide"', details: 'Escrow payment active.' },
      { type: 'swipe', desc: 'Student swipe right on "Office Admin Helper"', details: 'User: Student #310.' },
      { type: 'gig', desc: 'Gig "CS 101 Exam Review Tutoring" posted', details: 'Provider: Student Union.' },
      { type: 'user', desc: 'New Student verified: "sarvesh2010"', details: 'Domain: campus.edu.' },
      { type: 'risk', desc: 'Report submitted: "Late fee inquiry"', details: 'Resolved automatically.' }
    ];

    const interval = setInterval(() => {
      const randomItem = logPool[Math.floor(Math.random() * logPool.length)];
      setSystemLogs(prev => [
        { time: 'Just now', type: randomItem.type, desc: randomItem.desc, details: randomItem.details },
        ...prev.map(log => {
          if (log.time === 'Just now') return { ...log, time: '10s ago' };
          if (log.time === '10s ago') return { ...log, time: '1m ago' };
          if (log.time === '1m ago') return { ...log, time: '3m ago' };
          if (log.time === '3m ago') return { ...log, time: '6m ago' };
          return log;
        })
      ].slice(0, 6));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 700);
  };

  // Metrics configurations based on timeframe
  const metrics = useMemo(() => {
    const data = {
      '24h': {
        gigs: '12',
        gigsDiff: '+8% vs yesterday',
        students: '142',
        studentsDiff: '+12 new today',
        conversion: '82.1%',
        conversionDesc: 'Liquidity: Optimal',
        matchTime: '8.4m',
        matchTimeDesc: 'SLA: Healthy',
        chats: '34',
        chatsDesc: 'High engagement',
        escrow: '$840.00',
        escrowDesc: 'Escrow flow (24h)',
        chart1: [75, 78, 80, 84, 82, 85, 88, 87, 83, 79, 76, 82.1],
        chart1Labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '00:00', '02:00', '04:00', '06:00'],
        chart2: [25, 45, 68, 85, 78, 92, 115, 120, 95, 60, 32, 28],
        chart2Labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '00:00', '02:00', '04:00', '06:00']
      },
      '7d': {
        gigs: '18',
        gigsDiff: '+14% vs last week',
        students: '142',
        studentsDiff: '+48 new this week',
        conversion: '84.2%',
        conversionDesc: 'Liquidity: High conversion',
        matchTime: '9.2m',
        matchTimeDesc: 'SLA: Healthy',
        chats: '42',
        chatsDesc: 'Active communication',
        escrow: '$1,240.00',
        escrowDesc: 'Normal weekly flow',
        chart1: [68, 72, 79, 81, 84, 86, 84.2],
        chart1Labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        chart2: [45, 55, 68, 72, 98, 110, 120],
        chart2Labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      '30d': {
        gigs: '45',
        gigsDiff: '+28% vs last month',
        students: '142',
        studentsDiff: '+92 new this month',
        conversion: '79.8%',
        conversionDesc: 'Liquidity: Stable',
        matchTime: '11.5m',
        matchTimeDesc: 'SLA: Within limits',
        chats: '58',
        chatsDesc: 'Consistent active users',
        escrow: '$3,820.00',
        escrowDesc: 'Escrow flow (30d)',
        chart1: [65, 69, 73, 72, 75, 78, 80, 81, 79.8],
        chart1Labels: ['Wk 1', 'Wk 1.5', 'Wk 2', 'Wk 2.5', 'Wk 3', 'Wk 3.5', 'Wk 4', 'Wk 4.5', 'Current'],
        chart2: [180, 220, 290, 310, 380, 420, 490, 520, 580],
        chart2Labels: ['Wk 1', 'Wk 1.5', 'Wk 2', 'Wk 2.5', 'Wk 3', 'Wk 3.5', 'Wk 4', 'Wk 4.5', 'Current']
      }
    };
    return data[timeframe];
  }, [timeframe]);

  const riskMetrics = [
    { name: 'No-Show Rate Average', value: '1.4%', status: 'Normal', color: 'text-[#10B981] bg-emerald-500/10 border-emerald-500/20' },
    { name: 'Scam Flags Registered', value: `${moderationCases.length} Cases`, status: moderationCases.length > 0 ? 'Action Required' : 'Cleared', color: moderationCases.length > 0 ? 'text-red-500 bg-rose-500/10 border-rose-500/20 animate-pulse' : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    { name: 'Provider Onboard SLA', value: '3.8 Mins', status: 'SLA Met', color: 'text-[#b3885d] bg-teal-500/10 border-teal-500/20' }
  ];

  const handleResolveCase = (caseId: number) => {
    setModerationCases(prev => prev.filter(c => c.id !== caseId));
    setExpandedCaseId(null);
  };

  return (
    <div className="min-h-screen bg-[#08080c] text-gray-100 pb-20 selection:bg-[#ff5005]/30">
      
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#08080c]/80 backdrop-blur-md border-b border-white/[0.06] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[14px] font-black tracking-widest font-heading text-white">
              JOBSWIPE COMMAND
            </span>
            <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#ff5005]/10 border border-[#ff5005]/20 text-[#ff7343]">
              MODERATOR
            </span>
          </div>

          <div className="flex gap-6 text-[12px] font-bold text-gray-400 items-center">
            <Link href="/analytics" className="text-white hover:text-white transition-colors">Analytics</Link>
            <Link href="/providers" className="hover:text-white transition-colors">Verification</Link>
            <Link href="/reports" className="hover:text-white transition-colors">Moderation</Link>
            <button
              onClick={() => {
                localStorage.removeItem('jobswipe_admin_logged_in');
                router.push('/admin/login');
              }}
              className="text-[#ff7343] hover:text-[#ff5005] font-bold ml-2 py-1 px-3.5 border border-[#ff5005]/20 hover:border-[#ff5005]/40 rounded-lg bg-[#ff5005]/5 transition-all cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto w-full p-6 space-y-6">
        
        {/* Title row */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 px-1">
          <div>
            <h2 className="text-[22px] font-bold text-gray-100 font-heading tracking-tight leading-none">
              Command Analytics Board
            </h2>
            <p className="text-[11px] text-gray-500 mt-1.5">Real-time system health, transaction flows, and risk parameters.</p>
          </div>
          
          <div className="flex items-center gap-3 self-start sm:self-center">
            {/* Timeframe selector controls */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-1 flex gap-1 text-[11px] font-mono">
              {(['24h', '7d', '30d'] as const).map(tf => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    timeframe === tf 
                      ? 'bg-[#ff5005] text-white shadow-md' 
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  {tf.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Refresh Button */}
            <button 
              onClick={handleRefresh}
              className={`p-2 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] rounded-xl transition-all cursor-pointer text-gray-400 hover:text-white ${isRefreshing ? 'animate-spin' : ''}`}
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <span className="text-[10px] font-bold text-[#10B981] flex items-center gap-1.5 bg-emerald-500/5 border border-emerald-500/20 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5 text-[#10B981] animate-pulse" /> Live
            </span>
          </div>
        </div>

        {/* 1. CORE STATS BENTO GRID */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          
          {/* Active Gigs */}
          <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/[0.04] hover:border-white/[0.08] flex flex-col justify-between h-[135px] transition-colors col-span-2">
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Active Campus Gigs</span>
              <Zap className="w-4 h-4 text-[#ff5005]" />
            </div>
            <div>
              <span className="text-[34px] font-black text-gray-100 font-heading tracking-tight leading-none">{metrics.gigs}</span>
              <span className="text-[9px] text-[#10B981] block mt-1">{metrics.gigsDiff}</span>
            </div>
          </div>

          {/* Registered Students */}
          <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/[0.04] hover:border-white/[0.08] flex flex-col justify-between h-[135px] transition-colors col-span-2">
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Registered Students</span>
              <Users className="w-4 h-4 text-[#d0bce1]" />
            </div>
            <div>
              <span className="text-[34px] font-black text-gray-100 font-heading tracking-tight leading-none">{metrics.students}</span>
              <span className="text-[9px] text-[#d0bce1] block mt-1">{metrics.studentsDiff}</span>
            </div>
          </div>

          {/* Swipe Apply Rate */}
          <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/[0.04] hover:border-white/[0.08] flex flex-col justify-between h-[135px] transition-colors col-span-2">
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Swipe Apply Rate</span>
              <TrendingUp className="w-4 h-4 text-[#dbba95]" />
            </div>
            <div>
              <span className="text-[34px] font-black text-gray-100 font-heading tracking-tight leading-none">{metrics.conversion}</span>
              <span className="text-[9px] text-[#dbba95] block mt-1">{metrics.conversionDesc}</span>
            </div>
          </div>

          {/* Average Match Time */}
          <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/[0.04] hover:border-white/[0.08] flex flex-col justify-between h-[135px] transition-colors col-span-2">
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Avg Match Time</span>
              <Clock className="w-4 h-4 text-[#ff5005]" />
            </div>
            <div>
              <span className="text-[34px] font-black text-gray-100 font-heading tracking-tight leading-none">{metrics.matchTime}</span>
              <span className="text-[9px] text-[#10B981] block mt-1">{metrics.matchTimeDesc}</span>
            </div>
          </div>

          {/* Active Chats */}
          <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/[0.04] hover:border-white/[0.08] flex flex-col justify-between h-[135px] transition-colors col-span-2">
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Active Chats</span>
              <MessageSquare className="w-4 h-4 text-[#d0bce1]" />
            </div>
            <div>
              <span className="text-[34px] font-black text-gray-100 font-heading tracking-tight leading-none">{metrics.chats}</span>
              <span className="text-[9px] text-gray-400 block mt-1">{metrics.chatsDesc}</span>
            </div>
          </div>

          {/* Escrow Flow */}
          <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/[0.04] hover:border-white/[0.08] flex flex-col justify-between h-[135px] transition-colors col-span-2">
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Escrow Flow</span>
              <DollarSign className="w-4 h-4 text-[#dbba95]" />
            </div>
            <div>
              <span className="text-[34px] font-black text-gray-100 font-heading tracking-tight leading-none">{metrics.escrow}</span>
              <span className="text-[9px] text-[#dbba95] block mt-1">{metrics.escrowDesc}</span>
            </div>
          </div>

        </div>

        {/* 2. SPARK LINE DATA VISUALIZATIONS SECTION */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Chart 1: Swipe Apply Rate trend */}
          <div className="p-6 rounded-2xl bg-[#0f0f16]/95 border border-white/[0.06] space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-[13px] font-bold text-gray-300 font-heading">Swipe Conversion Ratio</h4>
              <span className="text-[11px] font-bold text-[#ff7343] flex items-center gap-1 font-mono">
                <ArrowUpRight className="w-3.5 h-3.5" /> +2.4% this period
              </span>
            </div>
            
            <CommandSparkline 
              data={metrics.chart1} 
              labels={metrics.chart1Labels}
              color="#ff5005"
              glowColor="rgba(255, 80, 5, 0.4)"
              unit="%"
            />
          </div>

          {/* Chart 2: Daily Active Users */}
          <div className="p-6 rounded-2xl bg-[#0f0f16]/95 border border-white/[0.06] space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-[13px] font-bold text-gray-300 font-heading">Active Students Timeline</h4>
              <span className="text-[11px] font-bold text-[#d0bce1] flex items-center gap-1 font-mono">
                <ArrowUpRight className="w-3.5 h-3.5" /> Peak Liquidity
              </span>
            </div>

            <CommandSparkline 
              data={metrics.chart2} 
              labels={metrics.chart2Labels}
              color="#9878b0"
              glowColor="rgba(152, 120, 176, 0.4)"
              unit=""
            />
          </div>

        </div>

        {/* 3. DETAILED SPLIT LAYOUT: SYSTEM EVENT LOG & INTERACTIVE MODERATION CASES */}
        <div className="grid lg:grid-cols-5 gap-6">
          
          {/* Real-time System Event Log (2/5 size) */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white/[0.01] border border-white/[0.05] flex flex-col h-[350px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[13px] font-bold text-gray-300 font-heading flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#ff5005] animate-pulse" /> Real-time System Feed
              </h3>
              <span className="text-[9px] font-mono text-gray-500 uppercase">Updating Live</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 custom-scrollbar">
              <AnimatePresence initial={false}>
                {systemLogs.map((log, index) => (
                  <motion.div 
                    key={log.desc + index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.3 }}
                    className="text-[11px] leading-tight pb-3 border-b border-white/[0.03] last:border-0"
                  >
                    <div className="flex justify-between text-gray-500 mb-1">
                      <span className="font-mono text-[9px]">{log.time}</span>
                      <span className="uppercase text-[8px] font-bold tracking-wider px-1 py-0.2 bg-white/[0.04] text-gray-400 rounded-sm">
                        {log.type}
                      </span>
                    </div>
                    <p className="text-gray-200 font-semibold">{log.desc}</p>
                    <p className="text-gray-500 text-[10px] mt-0.5">{log.details}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Interactive Moderation Cases Board (3/5 size) */}
          <div className="lg:col-span-3 p-6 rounded-2xl bg-white/[0.01] border border-white/[0.05] flex flex-col h-[350px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[13px] font-bold text-gray-300 font-heading flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-500" /> Active Moderation Board
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-red-400 font-mono">
                {moderationCases.length} Pending
              </span>
            </div>

            {moderationCases.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2">
                <ShieldCheck className="w-10 h-10 text-[#10B981]" />
                <p className="text-[12px] font-bold text-gray-300">All cases resolved</p>
                <p className="text-[10px] text-gray-500">System security audit and checks cleared.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-2 custom-scrollbar">
                {moderationCases.map((c) => {
                  const isExpanded = expandedCaseId === c.id;
                  const severityStyles = 
                    c.severity === 'High' ? 'text-red-400 border-red-500/20 bg-red-500/5' :
                    c.severity === 'Medium' ? 'text-amber-400 border-amber-500/20 bg-amber-500/5' :
                    'text-gray-400 border-white/[0.06] bg-white/[0.02]';

                  return (
                    <div 
                      key={c.id} 
                      className="border border-white/[0.04] bg-[#0e0e14]/50 rounded-xl overflow-hidden transition-all duration-200"
                    >
                      {/* Top Header Row */}
                      <div 
                        onClick={() => setExpandedCaseId(isExpanded ? null : c.id)}
                        className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono text-gray-500">#{c.id}</span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 border rounded-md uppercase tracking-wider ${severityStyles}`}>
                            {c.severity}
                          </span>
                          <span className="text-[11px] font-semibold text-gray-200 truncate max-w-[200px] sm:max-w-xs">{c.reason}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-gray-500 hidden sm:inline">{c.date}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
                        </div>
                      </div>

                      {/* Expandable Details Container */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-white/[0.03] bg-white/[0.01] p-3.5 text-[11px] text-gray-400 space-y-3"
                          >
                            <div className="grid grid-cols-2 gap-2 text-[10px]">
                              <div>
                                <span className="text-gray-500 block">Reporter:</span>
                                <span className="text-gray-300 font-medium">{c.reporter}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 block">Subject Account:</span>
                                <span className="text-gray-300 font-medium">{c.subject}</span>
                              </div>
                            </div>

                            <p className="leading-relaxed">{c.details}</p>

                            {/* Actions */}
                            <div className="flex justify-end gap-2 pt-1">
                              <button
                                onClick={() => handleResolveCase(c.id)}
                                className="px-3 py-1.5 text-[10px] font-bold border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04] text-gray-300 rounded-lg cursor-pointer transition-all"
                              >
                                Dismiss Report
                              </button>
                              <button
                                onClick={() => {
                                  alert(`Routing to moderation portal for Case #${c.id}`);
                                }}
                                className="px-3 py-1.5 text-[10px] font-bold bg-red-600 hover:bg-red-500 text-white rounded-lg cursor-pointer transition-all shadow-md shadow-red-900/20"
                              >
                                Review Account
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* 4. REAL-TIME RISK PARAMETERS BAR */}
        <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/[0.05] space-y-4">
          <h3 className="text-[13px] font-bold text-gray-300 font-heading flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-[#ff5005]" /> Real-time System Risk Parameters
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
                <span className="text-[24px] font-black text-gray-200 font-heading mt-2">{rm.value}</span>
              </div>
            ))}
          </div>
        </div>

      </main>

    </div>
  );
}
