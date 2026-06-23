'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import BottomTabBar from '@/components/shared/BottomTabBar';
import { MapPin, Star, Shield, ArrowRight, UserPlus, Users, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_GIGS = [
  {
    id: '1',
    title: 'DU Cafe Barista',
    provider: 'Chai & Coffee DU',
    pay: '₹150/hr',
    duration: '3 hrs',
    distance: '0.3 km',
    skills: ['Customer Service', 'Beverages'],
    description: 'We need an energetic student helper to serve hot/cold beverages during the busy afternoon lecture rush. Free coffee included!',
    openings: 2,
    locationName: 'Opposite DU Arts Faculty Gate, Delhi 110007',
    providerRating: 4.7
  },
  {
    id: '2',
    title: 'Nexus Concert Usher',
    provider: 'Nexus Fest Committee',
    pay: '₹600/day',
    duration: '4 hrs',
    distance: '0.8 km',
    skills: ['Logistics', 'Crowd Mgmt'],
    description: 'Help manage check-in gates and queue lines for the upcoming local college band concert. Includes dinner and festival entry pass.',
    openings: 5,
    locationName: 'Polo Ground Campus Annex, Delhi 110009',
    providerRating: 4.9
  },
  {
    id: '3',
    title: 'Cafe Social Feed Designer',
    provider: 'The Social Cafe',
    pay: '₹250/hr',
    duration: '2 hrs',
    distance: '0.5 km',
    skills: ['Instagram', 'Canva'],
    description: 'Help us design 3-5 creative Canva flyers and Instagram reels capturing student groups in our cafe storefront. Creative layout skills required.',
    openings: 1,
    locationName: 'Satya Niketan market block C, Delhi 110021',
    providerRating: 4.8
  },
  {
    id: '4',
    title: 'Gym Flyer Distributor',
    provider: 'Fit Gym North Campus',
    pay: '₹300/job',
    duration: '2.5 hrs',
    distance: '0.1 km',
    skills: ['Promo', 'Walking'],
    description: 'Distribute fitness promotion leaflets to students entering/exiting the college gate. Must be energetic and polite.',
    openings: 3,
    locationName: 'Metro Station exit gate 2, North Campus, Delhi 110007',
    providerRating: 4.2
  },
  {
    id: '5',
    title: 'Excel Data Entry Helper',
    provider: 'EduTech Academy',
    pay: '₹180/hr',
    duration: '4 hrs',
    distance: '1.2 km',
    skills: ['MS Excel', 'Typing'],
    description: 'Help our administrative desk tabulate student marks sheets into MS Excel sheets. Basic typing precision is mandatory.',
    openings: 2,
    locationName: 'Patel Nagar Academic Block, Delhi 110008',
    providerRating: 4.5
  }
];

// Friends list for Buddy Invite simulation
const FRIENDS = [
  { id: 'f1', name: 'Aman Verma', college: 'DU St. Stephens' },
  { id: 'f2', name: 'Neha Gupta', college: 'DU SRCC' },
  { id: 'f3', name: 'Kabir Dev', college: 'DU Hansraj' }
];

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;
  const job = MOCK_GIGS.find(g => g.id === jobId);

  // App states
  const [isBuddyOpen, setIsBuddyOpen] = useState(false);
  const [invitedFriend, setInvitedFriend] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    // Check if already applied (so details page reflects state)
    const apps = JSON.parse(localStorage.getItem('jobswipe_applications') || '[]');
    const isApplied = apps.some((app: any) => app.jobId === jobId);
    setApplied(isApplied);
  }, [jobId]);

  if (!job) {
    return (
      <div className="min-h-screen bg-void text-gray-100 flex flex-col justify-between pb-28">
        <Navbar title="Error" showBack />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <p className="text-gray-400">Job not found.</p>
        </div>
        <BottomTabBar />
      </div>
    );
  }

  const handleApply = () => {
    if (applied) return;

    // Save application to localStorage (Simulating Swipe Right success)
    const apps = JSON.parse(localStorage.getItem('jobswipe_applications') || '[]');
    const newApp = {
      id: Math.random().toString(),
      jobId: job.id,
      title: job.title,
      provider: job.provider,
      pay: job.pay,
      duration: job.duration,
      distance: job.distance,
      status: 'PENDING',
      appliedAt: new Date().toISOString(),
      buddy: invitedFriend ? FRIENDS.find(f => f.id === invitedFriend)?.name : undefined
    };
    
    localStorage.setItem('jobswipe_applications', JSON.stringify([newApp, ...apps]));
    setApplied(true);

    alert(`Successfully applied to ${job.title}! ${invitedFriend ? `Applied as a Buddy Group with ${FRIENDS.find(f => f.id === invitedFriend)?.name}.` : ''}`);
  };

  const handleInvite = (friendId: string) => {
    setInvitedFriend(friendId);
    setIsBuddyOpen(false);
  };

  return (
    <div className="min-h-screen bg-void text-gray-100 flex flex-col justify-between pb-28">
      <Navbar title={job.title} showBack />

      <main className="flex-1 max-w-md mx-auto w-full p-4 space-y-6">
        
        {/* Core Job Details Card */}
        <div className="p-6 rounded-[32px] bg-[#0b0f19]/80 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden">
          
          {/* Accent lighting */}
          <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-indigo-500/5 blur-[50px] -z-10 rounded-full" />
          
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] font-extrabold tracking-widest text-indigo-400 uppercase">Hyperlocal Host</p>
              <h2 className="text-[20px] font-bold text-gray-100 font-heading leading-tight tracking-tight mt-0.5">{job.provider}</h2>
            </div>
            
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
              <Star className="w-3.5 h-3.5 fill-current" />
              {job.providerRating}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4 my-4 border-y border-white/[0.06] text-[13px]">
            <div>
              <span className="text-gray-500 font-semibold block">Gig Payout</span>
              <span className="text-[20px] font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 font-heading mt-0.5">{job.pay}</span>
            </div>
            <div>
              <span className="text-gray-500 font-semibold block">Duration</span>
              <span className="text-[16px] font-bold text-gray-200 mt-1 block">{job.duration}</span>
            </div>
          </div>

          <div>
            <h4 className="text-[13px] font-bold text-gray-300 mb-2">Required Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {job.skills.map((skill) => (
                <span 
                  key={skill}
                  className="text-[11px] font-medium text-gray-300 bg-white/[0.04] border border-white/[0.06] px-2.5 py-0.5 rounded-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Description Section */}
        <div className="p-6 rounded-[32px] bg-white/[0.01] border border-white/[0.05]">
          <h4 className="text-[13px] font-bold text-gray-300 mb-2 font-heading">Job Description</h4>
          <p className="text-[13px] text-gray-400 leading-relaxed">
            {job.description}
          </p>

          <div className="mt-4 pt-4 border-t border-white/[0.04] flex items-center justify-between text-[12px] text-gray-500">
            <span>Available Openings</span>
            <span className="font-bold text-gray-300">{job.openings} Students</span>
          </div>
        </div>

        {/* Location Section */}
        <div className="p-6 rounded-[32px] bg-white/[0.01] border border-white/[0.05] space-y-4">
          <div>
            <h4 className="text-[13px] font-bold text-gray-300 mb-1 font-heading">Gig Location</h4>
            <p className="text-[12px] text-gray-400 leading-relaxed">{job.locationName}</p>
          </div>

          {/* Mini Map Visual Placeholder */}
          <div className="h-[120px] rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden relative flex items-center justify-center">
            {/* Grid layout representational map */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
            <div className="absolute w-[80px] h-[80px] bg-indigo-500/10 rounded-full blur-[20px]" />
            
            <div className="relative z-10 flex flex-col items-center gap-1">
              <MapPin className="w-5 h-5 text-glow-indigo animate-bounce" />
              <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">{job.distance} radius</span>
            </div>
          </div>
        </div>

        {/* Buddy Apply Selector section */}
        <div className="p-6 rounded-[32px] bg-white/[0.01] border border-white/[0.05] relative overflow-hidden">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-[13px] font-bold text-gray-300 font-heading">Buddy Apply</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Invite a college friend to apply with you.</p>
            </div>
            
            <button
              onClick={() => setIsBuddyOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 text-[11px] font-bold text-indigo-300 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" /> Invite Friend
            </button>
          </div>

          {invitedFriend && (
            <div className="mt-4 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-between text-[12px]">
              <span className="text-gray-400">Buddy Group with: <strong className="text-gray-200">{FRIENDS.find(f => f.id === invitedFriend)?.name}</strong></span>
              <button 
                onClick={() => setInvitedFriend(null)} 
                className="text-rose-400 hover:text-rose-500 font-bold"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleApply}
          disabled={applied}
          className={`
            w-full py-4 rounded-2xl font-bold text-[13px] transition-all flex items-center justify-center gap-2
            ${applied 
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 cursor-default' 
              : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-[0_4px_15px_rgba(99,102,241,0.2)] hover:scale-[1.01]'
            }
          `}
        >
          {applied ? (
            <>
              Applied Successfully <CheckCircle2 className="w-4 h-4 text-glow-emerald" />
            </>
          ) : (
            <>
              Confirm Swipe Apply <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

      </main>

      {/* Buddy Invite Sheet Backdrop / Modal */}
      <AnimatePresence>
        {isBuddyOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBuddyOpen(false)}
              className="fixed inset-0 z-40 bg-[#050814]/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto p-6 rounded-t-[36px] bg-[#0b0f19]/90 border-t border-white/[0.08] backdrop-blur-2xl"
            >
              <div className="w-10 h-1 bg-white/10 rounded-full mx-auto mb-6" />

              <div className="flex justify-between items-center mb-5">
                <h3 className="text-[16px] font-bold text-gray-100 font-heading flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" /> Choose a Buddy Friend
                </h3>
              </div>

              <div className="space-y-2 mb-6">
                {FRIENDS.map((friend) => (
                  <button
                    key={friend.id}
                    onClick={() => handleInvite(friend.id)}
                    className="w-full p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-indigo-500/20 hover:bg-white/[0.04] transition-all flex justify-between items-center text-left"
                  >
                    <div>
                      <h4 className="text-[13px] font-bold text-gray-200">{friend.name}</h4>
                      <p className="text-[11px] text-gray-500">{friend.college}</p>
                    </div>
                    <span className="text-[11px] font-bold text-indigo-400">Invite</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsBuddyOpen(false)}
                className="w-full py-3.5 rounded-xl bg-white/5 border border-white/10 text-[12px] font-bold text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <BottomTabBar />
    </div>
  );
}
