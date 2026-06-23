'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Users, Play, Pause, Award, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProviderManageJobPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const [job, setJob] = useState<any>(null);
  const [openings, setOpenings] = useState(2);
  const [status, setStatus] = useState('ACTIVE');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const listings = JSON.parse(localStorage.getItem('jobswipe_provider_listings') || '[]');
    const target = listings.find((l: any) => l.id === jobId);
    if (target) {
      setJob(target);
      setOpenings(target.openings);
      setStatus(target.status);
    }
  }, [jobId]);

  const handleSave = () => {
    const listings = JSON.parse(localStorage.getItem('jobswipe_provider_listings') || '[]');
    const updated = listings.map((l: any) => {
      if (l.id === jobId) {
        return { ...l, openings, status };
      }
      return l;
    });

    localStorage.setItem('jobswipe_provider_listings', JSON.stringify(updated));
    setMessage('Listing changes saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  if (!job) return null;

  return (
    <div className="min-h-screen bg-void text-gray-100 pb-20">
      
      {/* Header bar */}
      <header className="sticky top-0 z-40 bg-[#050814]/70 backdrop-blur-md border-b border-white/[0.06] px-4 py-4">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button 
            onClick={() => router.back()} 
            className="p-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gray-300" />
          </button>
          <h1 className="text-[14px] font-bold text-gray-100 tracking-tight font-heading">
            Manage Listing Details
          </h1>
        </div>
      </header>

      {/* Main Form */}
      <main className="max-w-md mx-auto w-full p-4 space-y-6">
        
        {message && (
          <div className="flex gap-2 p-3.5 rounded-2xl bg-purple-500/5 border border-purple-500/10 text-purple-300 text-[12px] items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-glow-purple" />
            <span>{message}</span>
          </div>
        )}

        <div className="p-6 rounded-[36px] bg-[#0b0f19]/80 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-purple-500/5 blur-[40px] -z-10 rounded-full" />

          <div>
            <span className="text-[10px] font-extrabold tracking-widest text-purple-400 uppercase">ACTIVE CONFIG</span>
            <h2 className="text-[20px] font-bold text-gray-100 font-heading leading-tight tracking-tight mt-1">{job.title}</h2>
            <p className="text-[12px] text-gray-500 mt-1">{job.pay} • {job.duration} shift</p>
          </div>

          {/* Toggle status */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <div>
              <h4 className="text-[13px] font-bold text-gray-300">Listing Status</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Toggle visibility in swipe feeds.</p>
            </div>
            
            <button
              onClick={() => setStatus(status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE')}
              className={`
                px-4 py-2 rounded-xl text-[11px] font-extrabold border transition-colors flex items-center gap-1.5
                ${status === 'ACTIVE' 
                  ? 'bg-purple-500/10 border-purple-500/30 text-purple-300' 
                  : 'bg-white/5 border border-white/10 text-gray-500'
                }
              `}
            >
              {status === 'ACTIVE' ? (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" /> Active
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5" /> Paused
                </>
              )}
            </button>
          </div>

          {/* Edit Openings */}
          <div>
            <div className="flex justify-between text-[13px] font-semibold mb-2">
              <span className="text-gray-400 flex items-center gap-1.5"><Users className="w-4 h-4 text-glow-purple" /> Slots Capacity</span>
              <span className="text-glow-purple">{openings} positions</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={openings}
              onChange={(e) => setOpenings(parseInt(e.target.value))}
              className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          {/* Payout read-only */}
          <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] text-[12px] space-y-1">
            <span className="text-gray-500 font-semibold block uppercase">Estimated wages</span>
            <p className="text-gray-300">₹{parseInt(job.pay.replace(/\D/g, '')) * parseFloat(job.duration.replace(/[^\d.]/g, ''))} total cost per slot.</p>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-[13px] font-bold text-white shadow-[0_4px_15px_rgba(139,92,246,0.2)]"
          >
            Save Configuration Changes
          </button>

        </div>

      </main>

    </div>
  );
}
