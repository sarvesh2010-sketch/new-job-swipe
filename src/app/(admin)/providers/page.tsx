'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserX, UserCheck, Search, Building, MapPin, FileText, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const DEFAULT_PENDING_PROVIDERS = [
  {
    id: 'prov-p-1',
    businessName: 'Chai Tapri Satya',
    businessType: 'Cafe / Restaurant',
    address: 'Shop No. 12, Satya Niketan Market, New Delhi 110021',
    phone: '9876543210',
    gstin: '07CHTAP9876A1Z3',
    location: { lat: 28.5888, lng: 77.2025 }
  },
  {
    id: 'prov-p-2',
    businessName: 'DU Stationary Hub',
    businessType: 'Retail Store',
    address: '15-A, Hudson Lane, Kingsway Camp, Delhi 110009',
    phone: '9811223344',
    gstin: '07DUSTH1234B1Z4',
    location: { lat: 28.6948, lng: 77.2085 }
  }
];

export default function AdminProvidersPage() {
  const router = useRouter();
  const [pending, setPending] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Auth gate check
    const loggedIn = localStorage.getItem('jobswipe_admin_logged_in');
    if (!loggedIn) {
      router.push('/admin/login');
      return;
    }

    // Seed initial pending providers
    const saved = localStorage.getItem('jobswipe_admin_pending_providers');
    if (!saved) {
      localStorage.setItem('jobswipe_admin_pending_providers', JSON.stringify(DEFAULT_PENDING_PROVIDERS));
      setPending(DEFAULT_PENDING_PROVIDERS);
      setSelectedId(DEFAULT_PENDING_PROVIDERS[0].id);
    } else {
      const data = JSON.parse(saved);
      setPending(data);
      if (data.length > 0) setSelectedId(data[0].id);
    }
  }, [router]);

  const handleVerify = (id: string, action: 'APPROVE' | 'REJECT') => {
    const target = pending.find(p => p.id === id);
    if (!target) return;

    // Remove from pending queue
    const remaining = pending.filter(p => p.id !== id);
    setPending(remaining);
    localStorage.setItem('jobswipe_admin_pending_providers', JSON.stringify(remaining));

    // Update selected profile ID
    if (remaining.length > 0) {
      setSelectedId(remaining[0].id);
    } else {
      setSelectedId(null);
    }

    if (action === 'APPROVE') {
      // Simulate adding to active provider profiles database
      const savedProfile = {
        businessName: target.businessName,
        businessType: target.businessType,
        address: target.address,
        phone: target.phone,
        gstin: target.gstin,
        isVerified: true,
        location: target.location
      };
      // Write profile to provider credentials layer
      localStorage.setItem('jobswipe_provider_profile', JSON.stringify(savedProfile));
      
      setMessage(`"${target.businessName}" approved successfully and added to verified hosts.`);
    } else {
      setMessage(`"${target.businessName}" verification request rejected.`);
    }

    setTimeout(() => setMessage(''), 3000);
  };

  const selectedProvider = pending.find(p => p.id === selectedId);

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
            <Link href="/providers" className="text-indigo-400">Verification</Link>
            <Link href="/reports" className="hover:text-indigo-400">Moderation</Link>
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

      {/* Main split-pane content */}
      <main className="max-w-6xl mx-auto w-full flex-1 grid md:grid-cols-12 gap-6 p-6">
        
        {/* Left pane: Pending list (5 columns) */}
        <section className="md:col-span-5 space-y-4">
          <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-1">
            Pending Queue ({pending.length})
          </h3>

          {message && (
            <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-indigo-300 text-[11px] text-center leading-relaxed">
              {message}
            </div>
          )}

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            <AnimatePresence mode="popLayout">
              {pending.length > 0 ? (
                pending.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className={`
                      w-full p-4 rounded-2xl text-left border transition-all flex items-center gap-3
                      ${selectedId === p.id 
                        ? 'bg-purple-500/10 border-purple-500/30 text-gray-100 shadow-[0_0_15px_rgba(139,92,246,0.15)]' 
                        : 'bg-white/[0.01] border-white/[0.04] text-gray-400 hover:bg-white/[0.03]'
                      }
                    `}
                  >
                    <Building className="w-4 h-4 shrink-0 text-purple-400" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[13px] font-bold truncate">{p.businessName}</h4>
                      <p className="text-[10px] text-gray-500 truncate mt-0.5">{p.businessType}</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center rounded-2xl bg-white/[0.01] border border-white/[0.04]">
                  <ShieldCheck className="w-8 h-8 text-gray-600 mx-auto mb-3 animate-pulse" />
                  <p className="text-[12px] text-gray-500">All provider verifications completed!</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Right pane: Review & Action details (7 columns) */}
        <section className="md:col-span-7">
          <AnimatePresence mode="wait">
            {selectedProvider ? (
              <motion.div
                key={selectedProvider.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-6 rounded-[32px] bg-[#0b0f19]/80 border border-white/[0.08] backdrop-blur-xl space-y-6 h-full flex flex-col justify-between"
              >
                <div className="space-y-6">
                  {/* Title block */}
                  <div>
                    <span className="text-[9px] font-extrabold tracking-widest text-purple-400 uppercase">GST ID Verification Queue</span>
                    <h2 className="text-[20px] font-bold text-gray-100 font-heading leading-tight tracking-tight mt-1">
                      {selectedProvider.businessName}
                    </h2>
                    <p className="text-[12px] text-gray-400 mt-1">{selectedProvider.businessType}</p>
                  </div>

                  {/* Metadata fields */}
                  <div className="space-y-3.5 text-[12px]">
                    <div className="flex justify-between items-center py-2.5 border-b border-white/[0.04]">
                      <span className="text-gray-500 flex items-center gap-1.5"><FileText className="w-4 h-4 text-gray-600" /> GSTIN Credentials</span>
                      <span className="font-mono font-bold text-gray-200 tracking-wider">{selectedProvider.gstin}</span>
                    </div>

                    <div className="flex justify-between items-center py-2.5 border-b border-white/[0.04]">
                      <span className="text-gray-500 flex items-center gap-1.5">⚡ Mobile phone contact</span>
                      <span className="font-semibold text-gray-200">+91 {selectedProvider.phone}</span>
                    </div>

                    <div className="py-2.5">
                      <span className="text-gray-500 flex items-center gap-1.5 mb-1.5"><MapPin className="w-4 h-4 text-gray-600" /> Physical storefront address</span>
                      <p className="text-gray-300 leading-relaxed pl-5">{selectedProvider.address}</p>
                    </div>
                  </div>

                  {/* Maps pinner coordinates mockup */}
                  <div className="h-[120px] rounded-2xl bg-[#050814]/40 border border-white/[0.06] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px]" />
                    <div className="relative z-10 flex flex-col items-center gap-1">
                      <MapPin className="w-5 h-5 text-glow-purple animate-bounce" />
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Storefront Verified via GPS: Lat {selectedProvider.location.lat}</span>
                    </div>
                  </div>
                </div>

                {/* Pipeline Action buttons */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/[0.04]">
                  <button
                    onClick={() => handleVerify(selectedProvider.id, 'REJECT')}
                    className="py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-rose-500/10 hover:border-rose-500/20 text-[12px] font-bold text-gray-400 hover:text-rose-400 transition-all flex items-center justify-center gap-1.5"
                  >
                    <X className="w-4 h-4" /> Reject Request
                  </button>
                  <button
                    onClick={() => handleVerify(selectedProvider.id, 'APPROVE')}
                    className="py-4 rounded-2xl bg-purple-500 hover:bg-purple-600 text-[12px] font-bold text-white shadow-[0_4px_15px_rgba(139,92,246,0.3)] transition-all flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" /> Verify Business
                  </button>
                </div>

              </motion.div>
            ) : (
              <div className="h-full rounded-[32px] bg-white/[0.01] border border-white/[0.04] flex flex-col items-center justify-center text-center p-8">
                <ShieldCheck className="w-10 h-10 text-gray-700 mb-4" />
                <h4 className="text-[14px] font-bold text-gray-400">Select an applicant to review</h4>
                <p className="text-[11px] text-gray-600 max-w-xs mt-1 leading-relaxed">
                  Select a business profile from the pending queue to inspect details and activate hosting profiles.
                </p>
              </div>
            )}
          </AnimatePresence>
        </section>

      </main>

    </div>
  );
}
