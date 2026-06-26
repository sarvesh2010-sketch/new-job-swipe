'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Store, Users, Plus, Zap, Eye, ChevronRight, LogOut, Play, Pause
} from 'lucide-react';
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

/* ─── Animated counter tile ─────────────────────────────── */
function MetricTile({
  label, value, icon: Icon, iconColor, suffix = '', trendLabel, delay = 0
}: {
  label: string; value: number; icon: React.ComponentType<{ className?: string }>;
  iconColor: string; suffix?: string; trendLabel?: string; delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const count = useMotionValue(0);
  const spring = useSpring(count, { stiffness: 60, damping: 18 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) count.set(value);
    return spring.on('change', (v) => setDisplay(Math.round(v)));
  }, [inView, value, count, spring]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="p-5 rounded-[28px] bg-white/[0.015] border border-white/[0.06] flex flex-col justify-between h-[130px] relative overflow-hidden group hover:border-white/[0.1] transition-all duration-300"
    >
      <div className="flex justify-between items-start">
        <span className="text-[9.5px] font-bold text-gray-600 uppercase tracking-widest">{label}</span>
        <div className={`p-1.5 rounded-lg ${iconColor} opacity-70 group-hover:opacity-100 transition-opacity`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>
      <div>
        <span className="text-[32px] font-black text-gray-100 font-heading tracking-tight leading-none tabular-nums">
          {display}{suffix}
        </span>
        {trendLabel && (
          <span className="text-[10px] font-bold text-emerald-400 block mt-1">{trendLabel}</span>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Toggle switch ──────────────────────────────────────── */
function StatusToggle({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`w-11 h-6 rounded-full p-0.5 transition-colors relative flex items-center focus:outline-none ${
        active ? 'bg-purple-500' : 'bg-gray-800 border border-white/10'
      }`}
    >
      <motion.div
        layout
        className="w-5 h-5 rounded-full bg-white shadow-md"
        animate={{ x: active ? 20 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

/* ─── Main dashboard ─────────────────────────────────────── */
export default function ProviderDashboardPage() {
  const router = useRouter();
  const [provider, setProvider] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const savedProfile = localStorage.getItem('jobswipe_provider_profile');
    if (!savedProfile) {
      router.push('/login');
      return;
    }
    setProvider(JSON.parse(savedProfile));
    const savedListings = localStorage.getItem('jobswipe_provider_listings');
    if (savedListings) setListings(JSON.parse(savedListings));
  }, []);

  const handleToggle = (jobId: string) => {
    const updated = listings.map((job) =>
      job.id === jobId ? { ...job, status: job.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } : job
    );
    setListings(updated);
    localStorage.setItem('jobswipe_provider_listings', JSON.stringify(updated));
    const t = updated.find((j) => j.id === jobId);
    setMessage(`"${t.title}" is now ${t.status}`);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLogout = () => {
    if (confirm('Exit Host Portal?')) {
      localStorage.removeItem('jobswipe_provider_profile');
      localStorage.removeItem('jobswipe_provider_listings');
      router.push('/login');
    }
  };

  if (!provider) return null;

  const totalViews = listings.reduce((a, l) => a + (l.views || 0), 0);
  const totalApplicants = listings.reduce((a, l) => a + (l.applicantsCount || 0), 0);
  const activeCount = listings.filter((l) => l.status === 'ACTIVE').length;

  return (
    <div className="min-h-screen bg-void text-gray-100 pb-20">

      {/* Header */}
      <motion.header
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-40 bg-[#050814]/75 backdrop-blur-xl border-b border-white/[0.05] px-4 py-4"
      >
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-[16px] font-black tracking-tight font-heading text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
              JOBSWIPE HOST
            </span>
            <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300">
              PORTAL
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleLogout}
            className="p-2 rounded-full bg-white/[0.04] border border-white/[0.08] hover:bg-rose-500/10 hover:border-rose-500/20 text-gray-400 hover:text-rose-400 transition-all"
          >
            <LogOut className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.header>

      <main className="max-w-md mx-auto w-full p-4 space-y-5">

        {/* Toast message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              className="p-3.5 rounded-2xl bg-purple-500/8 border border-purple-500/15 text-purple-300 text-[12px] text-center"
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Provider profile card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="p-5 rounded-[28px] bg-[#0b0f19]/80 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden flex justify-between items-center"
        >
          <div className="absolute top-0 right-0 w-[140px] h-[140px] bg-purple-500/6 blur-[50px] -z-10 rounded-full" />
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-gray-100 font-heading leading-tight">{provider.businessName}</h2>
              <p className="text-[11px] text-gray-500 mt-0.5">{provider.businessType}</p>
            </div>
          </div>
          <span className="text-[9.5px] font-bold px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 uppercase tracking-wide">
            Verified
          </span>
        </motion.div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-4">
          <MetricTile label="Total Reach" value={totalViews} icon={Eye} iconColor="bg-purple-500/15 text-purple-400" trendLabel="+12% this week" delay={0} />
          <MetricTile label="Applicants" value={totalApplicants} icon={Users} iconColor="bg-teal-500/15 text-teal-400" suffix="" delay={0.08} />
          <MetricTile label="Active Gigs" value={activeCount} icon={Play} iconColor="bg-indigo-500/15 text-indigo-400" delay={0.16} />
          <MetricTile label="Avg Score" value={47} icon={Zap} iconColor="bg-emerald-500/15 text-emerald-400" suffix="%" trendLabel="Match rate" delay={0.24} />
        </div>

        {/* Post new gig CTA */}
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(139,92,246,0.35)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/post-job')}
          className="w-full p-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-[13px] shadow-[0_4px_20px_rgba(139,92,246,0.25)] flex items-center justify-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" /> Post a New Gig (Takes &lt; 2 Mins)
        </motion.button>

        {/* Listings */}
        <div className="space-y-4">
          <h3 className="text-[11.5px] font-bold text-gray-600 uppercase tracking-wider px-1">My Posted Gigs</h3>

          <AnimatePresence>
            {listings.length > 0 ? (
              listings.map((job, idx) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="p-5 rounded-[28px] bg-[#0b0f19]/80 border border-white/[0.07] backdrop-blur-xl relative overflow-hidden hover:border-white/[0.12] transition-all duration-300"
                >
                  <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-purple-500/5 blur-[40px] -z-10 rounded-full" />

                  {/* Job header row */}
                  <div className="flex justify-between items-start pb-4 border-b border-white/[0.04] mb-4">
                    <div>
                      <h4 className="text-[15px] font-bold text-gray-100 font-heading leading-tight">{job.title}</h4>
                      <p className="text-[11px] text-gray-600 mt-1">{job.pay} · {job.duration} · {job.views || 0} views</p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                        job.status === 'ACTIVE'
                          ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                          : 'text-gray-500 bg-white/5 border border-white/10'
                      }`}>
                        {job.status}
                      </span>
                      <StatusToggle active={job.status === 'ACTIVE'} onToggle={() => handleToggle(job.id)} />
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => router.push(`/listing/${job.id}/applicants`)}
                      className="py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] text-[11px] font-bold text-gray-300 transition-all flex items-center justify-center gap-1.5"
                    >
                      Review ({job.applicantsCount || 0}) <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                    <button
                      onClick={() => router.push(`/listing/${job.id}/complete`)}
                      className="py-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-[11px] font-bold text-purple-400 transition-all flex items-center justify-center gap-1.5"
                    >
                      Mark Complete <Zap className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 px-6 rounded-[28px] bg-white/[0.01] border border-white/[0.05]"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto mb-4">
                  <Plus className="w-5 h-5" />
                </div>
                <p className="text-[13px] text-gray-500 leading-relaxed max-w-xs mx-auto">
                  No gigs posted yet. Tap the button above to list your first campus micro-gig.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </main>
    </div>
  );
}
