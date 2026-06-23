'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import { Star, Check, X, ShieldAlert, Award, Sparkles, PhoneCall, HelpCircle, Users, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProviderApplicantReviewPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const [job, setJob] = useState<any>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const listings = JSON.parse(localStorage.getItem('jobswipe_provider_listings') || '[]');
    const target = listings.find((l: any) => l.id === jobId);
    
    if (target) {
      setJob(target);
      setApplicants(target.applicants || []);
    }
  }, [jobId]);

  const handleDecision = (studentId: string, action: 'APPROVE' | 'REJECT') => {
    if (!job) return;

    // Check if the student belongs to a Buddy Group
    const student = applicants.find(a => a.id === studentId);
    let targetStudentIds = [studentId];
    let isBuddy = false;

    if (student?.buddy) {
      isBuddy = true;
      // Find buddy student profile in applicants list
      const buddyObj = applicants.find(a => a.name === student.buddy);
      if (buddyObj) {
        targetStudentIds.push(buddyObj.id);
      }
    }

    // Update applicants local array state
    const remaining = applicants.filter(a => !targetStudentIds.includes(a.id));
    setApplicants(remaining);

    // Save decision inside the provider listings localStorage database
    const listings = JSON.parse(localStorage.getItem('jobswipe_provider_listings') || '[]');
    const updatedListings = listings.map((l: any) => {
      if (l.id === jobId) {
        const nextApplicants = l.applicants.filter((a: any) => !targetStudentIds.includes(a.id));
        return {
          ...l,
          applicants: nextApplicants,
          applicantsCount: nextApplicants.length
        };
      }
      return l;
    });
    localStorage.setItem('jobswipe_provider_listings', JSON.stringify(updatedListings));

    // Update Student application status (linked via local storage apps db)
    const apps = JSON.parse(localStorage.getItem('jobswipe_applications') || '[]');
    const updatedApps = apps.map((app: any) => {
      if (app.jobId === jobId && targetStudentIds.includes(app.jobId)) {
        // Mock ID mapping is generic in local demo, we search by title/provider
      }
      // Simple fallback matching by jobId
      if (app.jobId === jobId) {
        return { 
          ...app, 
          status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED',
          decidedAt: new Date().toISOString()
        };
      }
      return app;
    });
    localStorage.setItem('jobswipe_applications', JSON.stringify(updatedApps));

    // Feed alert message
    setMessage(
      isBuddy 
        ? `Buddy Group (${targetStudentIds.length} students) ${action === 'APPROVE' ? 'approved' : 'declined'} successfully!`
        : `Applicant ${action === 'APPROVE' ? 'approved' : 'declined'} successfully!`
    );
    setTimeout(() => setMessage(''), 3500);
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
              Reviewing Applicants
            </h1>
            <p className="text-[10px] text-gray-500 mt-0.5">{job.title}</p>
          </div>
        </div>
      </header>

      {/* Main Review Section */}
      <main className="max-w-md mx-auto w-full p-4 space-y-5">
        
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-2xl bg-purple-500/5 border border-purple-500/10 text-purple-300 text-[12px] text-center"
          >
            {message}
          </motion.div>
        )}

        <div className="flex justify-between items-center px-1">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
            Awaiting Decision: {applicants.length} profiles
          </span>
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {applicants.length > 0 ? (
              
              // Group and render applicants (handling Buddy-Apply connections)
              applicants.map((student, idx) => {
                
                // If it is a buddy-apply, check if we already rendered the group container
                const hasBuddy = !!student.buddy;
                
                // For simplicity in client rendering: if the student has a buddy, 
                // and their index in the applicants is first, we render a combined Buddy Group card!
                // If we are on the second buddy member, we skip rendering it separately to avoid duplicates.
                if (hasBuddy) {
                  const buddyObj = applicants.find(a => a.name === student.buddy);
                  const isFirst = applicants.indexOf(student) < (buddyObj ? applicants.indexOf(buddyObj) : 0);
                  if (!isFirst) return null; // Skip rendering second card as it is combined

                  return (
                    <motion.div
                      key={student.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="p-5 rounded-[32px] bg-white/[0.01] border border-indigo-500/20 backdrop-blur-xl relative space-y-5"
                    >
                      {/* Buddy Group Header Banner */}
                      <div className="flex justify-between items-center pb-3 border-b border-indigo-500/10">
                        <span className="text-[10px] font-extrabold tracking-widest text-indigo-400 uppercase flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 animate-pulse" /> Buddy Apply Group (2 Students)
                        </span>
                        <span className="text-[9px] text-gray-500">Apply in pairs for safety</span>
                      </div>

                      {/* Combo profiles */}
                      <div className="grid grid-cols-2 gap-4">
                        
                        {/* Student 1 */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
                              <img src={student.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h4 className="text-[12px] font-bold text-gray-200 truncate max-w-[80px]">{student.name.split(' ')[0]}</h4>
                              <span className="text-[10px] text-glow-emerald font-black">★ {student.trustScore}</span>
                            </div>
                          </div>
                        </div>

                        {/* Student 2 */}
                        {buddyObj && (
                          <div className="space-y-3 border-l border-white/[0.04] pl-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
                                <img src={buddyObj.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <h4 className="text-[12px] font-bold text-gray-200 truncate max-w-[80px]">{buddyObj.name.split(' ')[0]}</h4>
                                <span className="text-[10px] text-glow-emerald font-black">★ {buddyObj.trustScore}</span>
                              </div>
                            </div>
                          </div>
                        )}

                      </div>

                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        These DU classmates applied together. Approving will hire both to execute the 2 open slots.
                      </p>

                      {/* Combined Action buttons */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                          onClick={() => handleDecision(student.id, 'REJECT')}
                          className="py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-rose-500/10 hover:border-rose-500/20 text-[11px] font-bold text-gray-400 hover:text-rose-400 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <X className="w-3.5 h-3.5" /> Decline Group
                        </button>
                        <button
                          onClick={() => handleDecision(student.id, 'APPROVE')}
                          className="py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-[11px] font-bold text-white shadow-[0_4px_12px_rgba(139,92,246,0.2)] transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve Group
                        </button>
                      </div>

                    </motion.div>
                  );
                }

                // Regular Single Application Card
                return (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="p-5 rounded-[32px] bg-[#0b0f19]/80 border border-white/[0.08] backdrop-blur-xl relative space-y-4"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
                        <img src={student.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                      
                      {/* Details */}
                      <div>
                        <h4 className="text-[14px] font-bold text-gray-200 leading-tight">{student.name}</h4>
                        <p className="text-[10px] text-gray-500 mt-0.5">{student.college}</p>
                      </div>
                    </div>

                    {/* Stats & Trust Score */}
                    <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <span className="text-[11px] text-gray-500 font-semibold flex items-center gap-1"><Award className="w-3.5 h-3.5" /> Trust Score</span>
                      <span className="text-[13px] font-extrabold text-glow-emerald">★ {student.trustScore}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => handleDecision(student.id, 'REJECT')}
                        className="py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-rose-500/10 hover:border-rose-500/20 text-[11px] font-bold text-gray-400 hover:text-rose-400 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <X className="w-3.5 h-3.5" /> Decline
                      </button>
                      <button
                        onClick={() => handleDecision(student.id, 'APPROVE')}
                        className="py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-[11px] font-bold text-white shadow-[0_4px_12px_rgba(139,92,246,0.2)] transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                    </div>

                  </motion.div>
                );

              })

            ) : (
              <div className="text-center py-20 px-6 rounded-[32px] bg-white/[0.01] border border-white/[0.05]">
                <Sparkles className="w-8 h-8 text-gray-600 mx-auto mb-4 animate-pulse" />
                <h3 className="text-[16px] font-bold text-gray-200 font-heading mb-1">Decisions Completed</h3>
                <p className="text-[13px] text-gray-500 max-w-xs mx-auto leading-relaxed">
                  All applicant reviews are finalized. When new students swipe right on this gig, they will appear here.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </main>

    </div>
  );
}
