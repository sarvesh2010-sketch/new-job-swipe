'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Trash2, XCircle, Search, FileText, UserX, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const DEFAULT_REPORTS = [
  {
    id: 'rep-t-1',
    reportedType: 'JOB',
    targetName: 'DU Cafe Barista',
    reportedBy: 'Rohan Sharma',
    reason: 'The host sent me a WhatsApp message asking me to pay a ₹200 advance deposit for "barista training modules" before starting.',
    details: 'Provider: Chai & Coffee DU • Coords: Satya Niketan',
    triggerWords: ['deposit', 'advance']
  },
  {
    id: 'rep-t-2',
    reportedType: 'STUDENT',
    targetName: 'Aman Verma',
    reportedBy: 'The Daily Grind Cafe',
    reason: 'Hired student did not show up for the shift. No notification was given, leaving our checkout counters unstaffed.',
    details: 'Gig: Event Usher • Coords: DU Campus',
    triggerWords: ['show up', 'unstaffed']
  }
];

export default function AdminReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Auth gate check
    const loggedIn = localStorage.getItem('jobswipe_admin_logged_in');
    if (!loggedIn) {
      router.push('/admin/login');
      return;
    }

    const saved = localStorage.getItem('jobswipe_admin_reports');
    if (!saved) {
      localStorage.setItem('jobswipe_admin_reports', JSON.stringify(DEFAULT_REPORTS));
      setReports(DEFAULT_REPORTS);
      setSelectedId(DEFAULT_REPORTS[0].id);
    } else {
      const data = JSON.parse(saved);
      setReports(data);
      if (data.length > 0) setSelectedId(data[0].id);
    }
  }, [router]);

  // Automated flag triggers checking for scam keywords
  const getScamWarnings = (reason: string) => {
    const triggers = ['deposit', 'advance', 'registration', 'fee', 'money'];
    const detected: string[] = [];
    triggers.forEach(word => {
      if (reason.toLowerCase().includes(word)) {
        detected.push(word);
      }
    });
    return detected;
  };

  const handleModeration = (id: string, action: 'DISMISS' | 'BAN') => {
    const target = reports.find(r => r.id === id);
    if (!target) return;

    // Remove from active queue
    const remaining = reports.filter(r => r.id !== id);
    setReports(remaining);
    localStorage.setItem('jobswipe_admin_reports', JSON.stringify(remaining));

    if (remaining.length > 0) {
      setSelectedId(remaining[0].id);
    } else {
      setSelectedId(null);
    }

    if (action === 'BAN') {
      // Simulate profile suspension in databases
      if (target.reportedType === 'JOB') {
        const listings = JSON.parse(localStorage.getItem('jobswipe_provider_listings') || '[]');
        const updated = listings.map((l: any) => {
          if (l.title === target.targetName) {
            return { ...l, status: 'CLOSED' }; // Terminate listing
          }
          return l;
        });
        localStorage.setItem('jobswipe_provider_listings', JSON.stringify(updated));
      } else {
        // Suspend student profile
        const studentProfileRaw = localStorage.getItem('jobswipe_student_profile');
        if (studentProfileRaw) {
          const studentProfile = JSON.parse(studentProfileRaw);
          if (studentProfile.name === target.targetName) {
            studentProfile.trustScore = 1.0; // Restrict trust
            localStorage.setItem('jobswipe_student_profile', JSON.stringify(studentProfile));
          }
        }
      }
      setMessage(`Moderation action applied: banned/closed reported entity "${target.targetName}".`);
    } else {
      setMessage(`Report ticket dismissed.`);
    }

    setTimeout(() => setMessage(''), 3000);
  };

  const selectedReport = reports.find(r => r.id === selectedId);

  return (
    <div className="min-h-screen bg-void text-gray-100 flex flex-col justify-between pb-10">
      
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

          <div className="flex gap-6 text-[12px] font-bold text-gray-500 items-center">
            <Link href="/analytics" className="hover:text-indigo-400">Analytics</Link>
            <Link href="/providers" className="hover:text-indigo-400">Verification</Link>
            <Link href="/reports" className="text-indigo-400">Moderation</Link>
            <button
              onClick={() => {
                localStorage.removeItem('jobswipe_admin_logged_in');
                router.push('/admin/login');
              }}
              className="text-rose-400 hover:text-rose-300 font-bold ml-2 py-1 px-3.5 border border-rose-500/20 hover:border-rose-500/40 rounded-lg bg-rose-500/5 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Split-pane moderation */}
      <main className="max-w-6xl mx-auto w-full flex-1 grid md:grid-cols-12 gap-6 p-6">
        
        {/* Left pane: Reports list */}
        <section className="md:col-span-5 space-y-4">
          <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-1">
            Open Reports Queue ({reports.length})
          </h3>

          {message && (
            <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-indigo-300 text-[11px] text-center leading-relaxed">
              {message}
            </div>
          )}

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            <AnimatePresence mode="popLayout">
              {reports.length > 0 ? (
                reports.map((r) => {
                  const warnings = getScamWarnings(r.reason);
                  const isScamRisk = warnings.length > 0;

                  return (
                    <button
                      key={r.id}
                      onClick={() => setSelectedId(r.id)}
                      className={`
                        w-full p-4 rounded-2xl text-left border transition-all flex items-start gap-3 relative overflow-hidden
                        ${selectedId === r.id 
                          ? 'bg-rose-500/10 border-rose-500/30 text-gray-100 shadow-[0_0_15px_rgba(244,63,94,0.1)]' 
                          : 'bg-white/[0.01] border-white/[0.04] text-gray-400 hover:bg-white/[0.03]'
                        }
                      `}
                    >
                      {/* Left border strip for scam risk highlight */}
                      {isScamRisk && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500" />
                      )}

                      <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h4 className="text-[13px] font-bold truncate pr-2">{r.targetName}</h4>
                          <span className="text-[8px] font-bold uppercase tracking-wider text-gray-500">{r.reportedType}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 truncate mt-0.5">{r.reason}</p>
                        
                        {/* Warnings display */}
                        {isScamRisk && (
                          <div className="flex gap-1.5 mt-2 flex-wrap">
                            {warnings.map(w => (
                              <span key={w} className="text-[8px] font-bold text-glow-rose bg-rose-500/10 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                ⚠️ SCAM RISK: {w}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-8 text-center rounded-2xl bg-white/[0.01] border border-white/[0.04]">
                  <Check className="w-8 h-8 text-gray-600 mx-auto mb-3 animate-pulse" />
                  <p className="text-[12px] text-gray-500">All reports resolved!</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Right pane: Action parameters */}
        <section className="md:col-span-7">
          <AnimatePresence mode="wait">
            {selectedReport ? (
              <motion.div
                key={selectedReport.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-6 rounded-[32px] bg-[#0b0f19]/80 border border-white/[0.08] backdrop-blur-xl space-y-6 h-full flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <div>
                    <span className="text-[9px] font-extrabold tracking-widest text-rose-500 uppercase">Moderator Audit Panel</span>
                    <h2 className="text-[20px] font-bold text-gray-100 font-heading leading-tight tracking-tight mt-1">
                      Target: {selectedReport.targetName}
                    </h2>
                    <p className="text-[11px] text-gray-500 mt-1">{selectedReport.details}</p>
                  </div>

                  {/* Warning alert if scam detected */}
                  {getScamWarnings(selectedReport.reason).length > 0 && (
                    <div className="flex gap-3 p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-rose-300 text-[12px] leading-relaxed">
                      <AlertCircle className="w-5 h-5 shrink-0 text-glow-rose mt-0.5" />
                      <div>
                        <strong className="text-gray-200 block">Flagged: High Scam Risk</strong>
                        Our automated audit flagged this listing containing trigger keywords representing deposit requests. advance payments are prohibited on JobSwipe.
                      </div>
                    </div>
                  )}

                  {/* Audit Details */}
                  <div className="space-y-4">
                    <div>
                      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Reported By</span>
                      <span className="text-[13px] font-semibold text-gray-200">{selectedReport.reportedBy}</span>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Detailed Complaint</span>
                      <p className="text-[12.5px] text-gray-300 leading-relaxed bg-white/[0.01] border border-white/[0.04] p-4 rounded-2xl">
                        "{selectedReport.reason}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Split Action triggers */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/[0.04]">
                  <button
                    onClick={() => handleModeration(selectedReport.id, 'DISMISS')}
                    className="py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-[12px] font-bold text-gray-400 hover:text-white transition-all flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" /> Dismiss Complaint
                  </button>
                  <button
                    onClick={() => handleModeration(selectedReport.id, 'BAN')}
                    className="py-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-[12px] font-bold text-rose-400 transition-all flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4 text-glow-rose" /> Suspend Entity
                  </button>
                </div>

              </motion.div>
            ) : (
              <div className="h-full rounded-[32px] bg-white/[0.01] border border-white/[0.04] flex flex-col items-center justify-center text-center p-8">
                <ShieldAlert className="w-10 h-10 text-gray-700 mb-4" />
                <h4 className="text-[14px] font-bold text-gray-400">Select a report to audit</h4>
                <p className="text-[11px] text-gray-600 max-w-xs mt-1 leading-relaxed">
                  Select an active complaint ticket from the moderation queue to evaluate compliance actions.
                </p>
              </div>
            )}
          </AnimatePresence>
        </section>

      </main>

    </div>
  );
}
