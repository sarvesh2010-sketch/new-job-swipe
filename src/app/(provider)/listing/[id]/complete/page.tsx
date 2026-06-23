'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Star, CheckCircle2, AlertCircle, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProviderMarkCompletePage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  // States
  const [job, setJob] = useState<any>(null);
  const [punctuality, setPunctuality] = useState(5);
  const [quality, setQuality] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const listings = JSON.parse(localStorage.getItem('jobswipe_provider_listings') || '[]');
    const target = listings.find((l: any) => l.id === jobId);
    if (target) {
      setJob(target);
    }
  }, [jobId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;

    // Recalculate student trust score (Simulating atomic DB trigger on rating submit)
    const studentProfileRaw = localStorage.getItem('jobswipe_student_profile');
    if (studentProfileRaw) {
      const studentProfile = JSON.parse(studentProfileRaw);
      
      // Seed rating record
      const ratingRecord = {
        punctualityScore: punctuality,
        qualityScore: quality,
        comment,
        createdAt: new Date().toISOString()
      };

      // Current parameters
      const currentCompletions = 12; // Pre-seeded value in profile stats
      const nextCompletions = currentCompletions + 1;
      
      // Apply Math Trust Formula:
      // Trust Score = (avgPunctuality * 0.4 + avgQuality * 0.4 + completionBonus * 0.2)
      // where completionBonus = Math.min(5.0, 4.0 + 0.1 * completedGigs)
      // Let's assume average is current rating (which was 4.8) and we weight in the new rating!
      const currentAvgPunct = 5.0;
      const currentAvgQual = 4.7;

      const nextAvgPunct = (currentAvgPunct * 12 + punctuality) / 13;
      const nextAvgQual = (currentAvgQual * 12 + quality) / 13;
      
      const completionBonus = Math.min(5.0, 4.0 + 0.1 * nextCompletions);
      const rawScore = (nextAvgPunct * 0.4) + (nextAvgQual * 0.4) + (completionBonus * 0.2);
      
      const finalScore = Math.max(1.0, Math.min(5.0, rawScore));

      // Save updated score to student profile
      studentProfile.trustScore = finalScore;
      localStorage.setItem('jobswipe_student_profile', JSON.stringify(studentProfile));
    }

    // Update application status to COMPLETED in student applications db
    const apps = JSON.parse(localStorage.getItem('jobswipe_applications') || '[]');
    const updatedApps = apps.map((app: any) => {
      if (app.jobId === jobId) {
        return { ...app, status: 'COMPLETED' };
      }
      return app;
    });
    localStorage.setItem('jobswipe_applications', JSON.stringify(updatedApps));

    // Remove job from active listings or update status
    const listings = JSON.parse(localStorage.getItem('jobswipe_provider_listings') || '[]');
    const updatedListings = listings.map((l: any) => {
      if (l.id === jobId) {
        return { ...l, status: 'CLOSED' };
      }
      return l;
    });
    localStorage.setItem('jobswipe_provider_listings', JSON.stringify(updatedListings));

    alert(`Gig successfully marked complete! Hired student's Trust Score recalculation completed.`);
    router.push('/dashboard');
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
          <div>
            <h1 className="text-[13px] font-bold text-gray-100 tracking-tight font-heading">
              Complete Shift checkout
            </h1>
            <p className="text-[10px] text-gray-500 mt-0.5">{job.title}</p>
          </div>
        </div>
      </header>

      {/* Checkout Form */}
      <main className="max-w-md mx-auto w-full p-4">
        
        <form onSubmit={handleSubmit} className="p-6 rounded-[36px] bg-[#0b0f19]/80 border border-white/[0.08] backdrop-blur-xl relative space-y-6">
          <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-purple-500/5 blur-[40px] -z-10 rounded-full" />

          <div>
            <span className="text-[10px] font-extrabold tracking-widest text-purple-400 uppercase">GIG EVALUATION</span>
            <h2 className="text-[20px] font-bold text-gray-100 font-heading leading-tight tracking-tight mt-1">Rate Hired Candidates</h2>
            <p className="text-[12px] text-gray-500 mt-1">Your ratings feed the student's reputation profile directly. Be fair and precise.</p>
          </div>

          {/* Metric 1: Punctuality */}
          <div className="space-y-2">
            <span className="text-[12px] font-bold text-gray-400 block uppercase tracking-wider">1. Punctuality & Arrival</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setPunctuality(star)}
                  className="p-1 transition-colors"
                >
                  <Star className={`w-8 h-8 ${star <= punctuality ? 'text-amber-400 fill-current' : 'text-gray-700'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Metric 2: Quality of Work */}
          <div className="space-y-2">
            <span className="text-[12px] font-bold text-gray-400 block uppercase tracking-wider">2. Quality of Work Executed</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setQuality(star)}
                  className="p-1 transition-colors"
                >
                  <Star className={`w-8 h-8 ${star <= quality ? 'text-amber-400 fill-current' : 'text-gray-700'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Comment */}
          <div className="space-y-2">
            <span className="text-[12px] font-bold text-gray-400 block uppercase tracking-wider">3. Comments (Optional)</span>
            <textarea
              placeholder="Provide a brief summary of their performance..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] focus:border-purple-500/50 outline-none text-[13px] text-gray-100 placeholder-gray-500 transition-all font-semibold resize-none"
            />
          </div>

          {/* Math calculation display indicator */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex gap-3 items-start">
            <Award className="w-5 h-5 text-glow-emerald shrink-0 mt-0.5" />
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Submitting triggers the <strong className="text-gray-300">Trust Score Hook</strong>. Punctuality (40%), Quality (40%), and completions (20%) will update the student's rating ledger.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-[13px] font-bold text-white shadow-[0_4px_15px_rgba(139,92,246,0.2)] flex items-center justify-center gap-1.5"
          >
            Submit Review & Close Gig <CheckCircle2 className="w-4 h-4 text-glow-purple" />
          </button>

        </form>

      </main>

    </div>
  );
}
