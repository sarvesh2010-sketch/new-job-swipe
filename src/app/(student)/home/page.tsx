'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import BottomTabBar from '@/components/shared/BottomTabBar';
import SwipeDeck from '@/components/swipe/SwipeDeck';
import FiltersPanel from '@/components/swipe/FiltersPanel';
import { Sliders, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LeftSidebar from '@/components/shared/LeftSidebar';
import RightSidebar from '@/components/shared/RightSidebar';

// Master data set for student gigs
const MOCK_GIGS = [
  {
    id: '1',
    title: 'DU Cafe Barista',
    provider: 'Chai & Coffee DU',
    pay: '₹150/hr',
    duration: '3 hrs',
    distance: '0.3', // km
    skills: ['Customer Service', 'Beverages'],
    description: 'We need an energetic student helper to serve hot/cold beverages during the busy afternoon lecture rush. Free coffee included!'
  },
  {
    id: '2',
    title: 'Nexus Concert Usher',
    provider: 'Nexus Fest Committee',
    pay: '₹600/day',
    duration: '4 hrs',
    distance: '0.8', // km
    skills: ['Logistics', 'Crowd Mgmt'],
    description: 'Help manage check-in gates and queue lines for the upcoming local college band concert. Includes dinner and festival entry pass.'
  },
  {
    id: '3',
    title: 'Cafe Social Feed Designer',
    provider: 'The Social Cafe',
    pay: '₹250/hr',
    duration: '2 hrs',
    distance: '0.5', // km
    skills: ['Instagram', 'Canva'],
    description: 'Help us design 3-5 creative Canva flyers and Instagram reels capturing student groups in our cafe storefront. Creative layout skills required.'
  },
  {
    id: '4',
    title: 'Gym Flyer Distributor',
    provider: 'Fit Gym North Campus',
    pay: '₹300/job',
    duration: '2.5 hrs',
    distance: '0.1', // km
    skills: ['Promo', 'Walking'],
    description: 'Distribute fitness promotion leaflets to students entering/exiting the college gate. Must be energetic and polite.'
  },
  {
    id: '5',
    title: 'Excel Data Entry Helper',
    provider: 'EduTech Academy',
    pay: '₹180/hr',
    duration: '4 hrs',
    distance: '1.2', // km
    skills: ['MS Excel', 'Typing'],
    description: 'Help our administrative desk tabulate student marks sheets into MS Excel sheets. Basic typing precision is mandatory.'
  }
];

export default function StudentHomePage() {
  const router = useRouter();

  // Load user profile details
  const [profile, setProfile] = useState<any>(null);
  
  // Filter settings state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    radius: 5, // km
    payMin: 100, // INR
    maxHours: 6, // hrs
    skills: [] as string[]
  });

  // Deck lists
  const [deckJobs, setDeckJobs] = useState<typeof MOCK_GIGS>([]);
  const [lastSwiped, setLastSwiped] = useState<{ job: typeof MOCK_GIGS[0], direction: 'LEFT' | 'RIGHT' } | null>(null);
  
  // Undo Toast state
  const [showUndo, setShowUndo] = useState(false);
  const [undoCountdown, setUndoCountdown] = useState(3);

  // Live ticker simulations
  const [liveEvent, setLiveEvent] = useState('Ankit K. just swiped on Barista Gig');

  useEffect(() => {
    const events = [
      'Ankit K. just swiped on Cafe Barista',
      'Priya S. matched with Nexus Ushering',
      'Vikram R. completed Excel Helper shift',
      'Sneha M. joined Cafe Social Feed design group',
      'Tushar G. earned ₹400 in concert crowd mgmt',
      'Karan D. reputation rating rose to 4.9',
      'Riya J. completed onboarding'
    ];
    const interval = setInterval(() => {
      const random = events[Math.floor(Math.random() * events.length)];
      setLiveEvent(random);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Load profile on mount
  useEffect(() => {
    const saved = localStorage.getItem('jobswipe_student_profile');
    if (!saved) {
      router.push('/login');
      return;
    }
    setProfile(JSON.parse(saved));
    
    // Apply initial filters to load the deck
    filterDeck(JSON.parse(saved).skills, filters);
  }, []);

  // Filter deck based on settings
  const filterDeck = (userSkills: string[], activeFilters: typeof filters) => {
    const filtered = MOCK_GIGS.filter(gig => {
      // 1. Distance check
      const dist = parseFloat(gig.distance);
      if (dist > activeFilters.radius) return false;

      // 2. Pay check (parse "₹150/hr" -> 150, or "₹600/day" -> 600)
      const payVal = parseInt(gig.pay.replace(/\D/g, ''));
      if (payVal < activeFilters.payMin) return false;

      // 3. Duration check
      const hrs = parseFloat(gig.duration.replace(/[^\d.]/g, ''));
      if (hrs > activeFilters.maxHours) return false;

      // 4. Skills match
      if (activeFilters.skills.length > 0) {
        const hasSkill = gig.skills.some(s => activeFilters.skills.includes(s));
        if (!hasSkill) return false;
      }

      return true;
    });

    setDeckJobs(filtered);
  };

  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    filterDeck(profile?.skills || [], newFilters);
  };

  const handleSwipeRight = (jobId: string) => {
    const job = deckJobs.find(j => j.id === jobId);
    if (!job) return;

    // Remove from active deck
    setDeckJobs(prev => prev.filter(j => j.id !== jobId));
    
    // Record last swiped
    setLastSwiped({ job, direction: 'RIGHT' });
    
    // Save application to localStorage (Simulating backend API trigger)
    const apps = JSON.parse(localStorage.getItem('jobswipe_applications') || '[]');
    const newApp = {
      id: Math.random().toString(),
      jobId: job.id,
      title: job.title,
      provider: job.provider,
      pay: job.pay,
      duration: job.duration,
      distance: job.distance + ' km',
      status: 'PENDING',
      appliedAt: new Date().toISOString()
    };
    localStorage.setItem('jobswipe_applications', JSON.stringify([newApp, ...apps]));

    // Trigger Undo countdown timer
    triggerUndo();
  };

  const handleSwipeLeft = (jobId: string) => {
    const job = deckJobs.find(j => j.id === jobId);
    if (!job) return;

    // Remove from active deck
    setDeckJobs(prev => prev.filter(j => j.id !== jobId));
    
    // Record last swiped
    setLastSwiped({ job, direction: 'LEFT' });

    // Trigger Undo timer
    triggerUndo();
  };

  const triggerUndo = () => {
    setShowUndo(true);
    setUndoCountdown(3);
  };

  // Countdown timer loop for Undo Action
  useEffect(() => {
    if (!showUndo) return;
    if (undoCountdown === 0) {
      setShowUndo(false);
      setLastSwiped(null);
      return;
    }
    const timer = setTimeout(() => {
      setUndoCountdown(prev => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [showUndo, undoCountdown]);

  const handleUndo = () => {
    if (!lastSwiped) return;

    // Put job card back to top of the deck
    setDeckJobs(prev => [lastSwiped.job, ...prev]);

    // If it was a Right swipe, remove from applications
    if (lastSwiped.direction === 'RIGHT') {
      const apps = JSON.parse(localStorage.getItem('jobswipe_applications') || '[]');
      const filtered = apps.filter((app: any) => app.jobId !== lastSwiped.job.id);
      localStorage.setItem('jobswipe_applications', JSON.stringify(filtered));
    }

    // Reset states
    setShowUndo(false);
    setLastSwiped(null);
  };

  const handleResetDeck = () => {
    filterDeck(profile?.skills || [], filters);
    localStorage.removeItem('jobswipe_applications'); // Clear apps for fresh swipes
  };

  const onTapDetails = (jobId: string) => {
    router.push(`/job/${jobId}`);
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-void text-gray-100 flex flex-col justify-between pb-28">
      <Navbar title="Feed" />

      {/* Main Feed Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 lg:grid lg:grid-cols-12 lg:gap-8 pt-4 relative">

        {/* Left Column Sidebar */}
        <div className="hidden lg:block lg:col-span-3">
          <LeftSidebar />
        </div>

        {/* Center Column Content */}
        <div className="col-span-12 lg:col-span-6 flex flex-col items-center relative">
          
          {/* Floating background blobs */}
          <div className="absolute top-10 left-10 w-[200px] h-[200px] bg-indigo-500/5 blur-[60px] -z-10 rounded-full" />
          <div className="absolute bottom-10 right-10 w-[200px] h-[200px] bg-purple-500/5 blur-[60px] -z-10 rounded-full" />

          {/* Sub-Header bar */}
          <div className="w-full max-w-md flex justify-between items-center mb-5 px-2">
            <p className="text-[12px] font-bold text-gray-400">
              Found <span className="text-glow-indigo font-extrabold">{deckJobs.length} Gigs</span> matching your skills
            </p>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] text-[11px] font-bold text-gray-300 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" /> Filters
            </button>
          </div>

          {/* 3D Physics Swipe Deck */}
          <SwipeDeck
            jobs={deckJobs}
            onApply={handleSwipeRight}
            onSkip={handleSwipeLeft}
            onTapDetails={onTapDetails}
            onResetDeck={handleResetDeck}
            onUndo={handleUndo}
            lastSwiped={lastSwiped}
          />

          {/* Live Activity Ticker (Hidden on desktop sidebar duplicate) */}
          <div className="w-full max-w-md mt-6 flex lg:hidden items-center justify-center gap-2 bg-[#0b0f19]/45 border border-white/[0.04] rounded-full py-2.5 px-4 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <AnimatePresence mode="wait">
              <motion.p
                key={liveEvent}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="text-[10px] text-gray-500 font-semibold tracking-wide uppercase text-center"
              >
                {liveEvent}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Slide-Up Filters Panel */}
          <FiltersPanel
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            filters={filters}
            onApplyFilters={handleApplyFilters}
          />

          {/* Floating Swipe Undo Toast */}
          <AnimatePresence>
            {showUndo && lastSwiped && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.9 }}
                className="absolute bottom-6 z-30 w-full max-w-[340px] px-4 py-3 rounded-2xl bg-[#0b0f19]/90 border border-white/[0.1] backdrop-blur-md shadow-2xl flex items-center justify-between pointer-events-auto"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-[12px] font-medium text-gray-300">
                    {lastSwiped.direction === 'RIGHT' ? 'Applied to' : 'Skipped'} <strong className="text-gray-100 font-bold">{lastSwiped.job.title}</strong>
                  </span>
                </div>

                {/* Undo action button with timer */}
                <button
                  onClick={handleUndo}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-[11px] font-extrabold text-glow-indigo transition-colors"
                >
                  Undo ({undoCountdown}s)
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Right Column Sidebar */}
        <div className="hidden lg:block lg:col-span-3">
          <RightSidebar />
        </div>

      </main>

      <BottomTabBar />
    </div>
  );
}
