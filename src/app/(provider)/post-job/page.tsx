'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, FileText, Sliders, Clock, Users, MapPin } from 'lucide-react';

const SKILLS_LIST = [
  'Customer Service',
  'Beverages',
  'Logistics',
  'Crowd Mgmt',
  'Instagram',
  'Canva',
  'Promo',
  'Walking',
  'MS Excel',
  'Typing'
];

export default function ProviderPostJobPage() {
  const router = useRouter();

  // Wizard steps: 1 (Details) -> 2 (Logistics) -> 3 (Payout)
  const [step, setStep] = useState(1);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [duration, setDuration] = useState(3); // hrs
  const [openings, setOpenings] = useState(2); // students
  const [payAmount, setPayAmount] = useState(150); // INR
  const [payType, setPayType] = useState<'PER_HOUR' | 'PER_JOB' | 'PER_DAY'>('PER_HOUR');
  const [error, setError] = useState('');

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!title.trim()) return setError('Please enter a gig title.');
      if (!description.trim()) return setError('Please enter a brief description.');
      if (selectedSkills.length === 0) return setError('Please select at least one required skill.');
    }
    setError('');
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Fetch existing listings
    const savedListings = JSON.parse(localStorage.getItem('jobswipe_provider_listings') || '[]');
    
    // Create new listing object
    const newJob = {
      id: 'job-new-' + Math.random().toString(),
      title,
      provider: 'Cafe Espresso DU', // Fallback provider name if profile missing
      pay: `₹${payAmount}/${payType === 'PER_HOUR' ? 'hr' : payType === 'PER_DAY' ? 'day' : 'job'}`,
      duration: `${duration} hrs`,
      distance: '0.4 km',
      skills: selectedSkills,
      description,
      status: 'ACTIVE',
      views: 0,
      openings,
      applicantsCount: 0,
      applicants: [] // Empty applicants list initially
    };

    // Update profile provider details if available
    const savedProfile = localStorage.getItem('jobswipe_provider_profile');
    if (savedProfile) {
      newJob.provider = JSON.parse(savedProfile).businessName;
    }

    const updatedListings = [newJob, ...savedListings];
    localStorage.setItem('jobswipe_provider_listings', JSON.stringify(updatedListings));

    alert(`"${title}" has been successfully posted and is live in the student swipe feed!`);
    router.push('/dashboard');
  };

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
            Post a New Campus Gig
          </h1>
        </div>
      </header>

      {/* Wizard Form */}
      <main className="max-w-md mx-auto w-full p-4">
        
        <div className="p-6 rounded-[36px] bg-[#0b0f19]/80 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-purple-500/5 blur-[40px] -z-10 rounded-full" />

          {/* Step Indicators */}
          <div className="flex justify-between items-center mb-8">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Step {step} of 3
            </span>
            <div className="flex gap-1.5">
              {[1, 2, 3].map((s) => (
                <div 
                  key={s} 
                  className={`w-4 h-1.5 rounded-full transition-all duration-300 ${
                    s === step ? 'bg-purple-500 w-8 shadow-[0_0_8px_rgba(139,92,246,0.5)]' : 'bg-white/5'
                  }`} 
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="flex gap-2 p-3.5 mb-6 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-rose-300 text-[12px] items-center leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 text-glow-rose" />
              <span>{error}</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* STEP 1: JOB DETAILS */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div>
                  <h3 className="text-[16px] font-bold text-gray-200 font-heading mb-2">Provide Core Details</h3>
                  <p className="text-[11px] text-gray-500 leading-relaxed mb-4">Define what role students will execute and what skills they must possess.</p>
                </div>

                <div className="relative">
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Gig title (e.g. DU Cafe Barista)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] focus:border-purple-500/50 outline-none text-[13px] text-gray-100 placeholder-gray-500 transition-all font-semibold"
                    required
                  />
                </div>

                <div className="relative">
                  <textarea
                    placeholder="Brief gig description (e.g. Table busser needed for afternoon rush. Must be fast...)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] focus:border-purple-500/50 outline-none text-[13px] text-gray-100 placeholder-gray-500 transition-all font-semibold resize-none"
                    required
                  />
                </div>

                <div>
                  <span className="text-[12px] font-bold text-gray-400 mb-3 block">Required Skills (Select &gt;= 1)</span>
                  <div className="flex flex-wrap gap-1.5">
                    {SKILLS_LIST.map((skill) => {
                      const selected = selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`
                            px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all duration-300
                            ${selected 
                              ? 'bg-purple-500/10 border-purple-500/50 text-purple-300' 
                              : 'bg-white/[0.02] border-white/[0.06] text-gray-400 hover:border-white/15'
                            }
                          `}
                        >
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full mt-4 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-[13px] font-bold text-white shadow-[0_4px_15px_rgba(139,92,246,0.2)] flex items-center justify-center gap-1.5"
                >
                  Continue to Logistics <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* STEP 2: LOGISTICS */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-[16px] font-bold text-gray-200 font-heading mb-2">Configure Logistics</h3>
                  <p className="text-[11px] text-gray-500 leading-relaxed mb-4">Specify the duration, capacity openings, and store GPS markers.</p>
                </div>

                {/* Duration Slider */}
                <div>
                  <div className="flex justify-between text-[13px] font-semibold mb-2">
                    <span className="text-gray-400 flex items-center gap-1.5"><Clock className="w-4 h-4 text-glow-purple" /> Shift Duration</span>
                    <span className="text-glow-purple">{duration} hours</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    step="0.5"
                    value={duration}
                    onChange={(e) => setDuration(parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>

                {/* Openings count */}
                <div>
                  <div className="flex justify-between text-[13px] font-semibold mb-2">
                    <span className="text-gray-400 flex items-center gap-1.5"><Users className="w-4 h-4 text-glow-teal" /> Student Openings</span>
                    <span className="text-glow-teal">{openings} positions</span>
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

                {/* Map Simulator */}
                <div>
                  <span className="text-[12px] font-bold text-gray-400 mb-2 block flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-500" /> Map Coordinates</span>
                  <div className="h-[90px] rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px]" />
                    <span className="relative z-10 text-[10px] font-bold text-glow-teal">Store location pin aligned via GPS</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="py-4 rounded-2xl bg-white/5 border border-white/10 text-[13px] font-bold text-gray-400 hover:text-white transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-[13px] font-bold text-white shadow-[0_4px_15px_rgba(139,92,246,0.2)] flex items-center justify-center gap-1.5"
                  >
                    Payout specs <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: PAYOUT */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-[16px] font-bold text-gray-200 font-heading mb-2">Define Payout Rate</h3>
                  <p className="text-[11px] text-gray-500 leading-relaxed mb-4">Slide to set estimated student wages. No platform fees deducted.</p>
                </div>

                {/* Payout Slider */}
                <div>
                  <div className="flex justify-between text-[13px] font-semibold mb-2">
                    <span className="text-gray-400 flex items-center gap-1.5"><Sliders className="w-4 h-4 text-glow-emerald" /> Gig Payout</span>
                    <span className="text-glow-emerald">₹{payAmount} ({payType === 'PER_HOUR' ? '/ hour' : payType === 'PER_DAY' ? '/ day' : '/ job'})</span>
                  </div>
                  
                  <input
                    type="range"
                    min="100"
                    max="1000"
                    step="20"
                    value={payAmount}
                    onChange={(e) => setPayAmount(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-purple-500 mb-6"
                  />

                  {/* Pay Type Toggle */}
                  <div className="grid grid-cols-3 gap-2">
                    {(['PER_HOUR', 'PER_JOB', 'PER_DAY'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setPayType(type)}
                        className={`
                          py-2.5 rounded-xl text-[10px] font-bold border transition-colors
                          ${payType === type 
                            ? 'bg-purple-500/10 border-purple-500/50 text-purple-300' 
                            : 'bg-white/[0.02] border-white/[0.06] text-gray-400'
                          }
                        `}
                      >
                        {type === 'PER_HOUR' ? 'Hourly' : type === 'PER_DAY' ? 'Daily' : 'Flat'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Estimate box */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] text-[12px] space-y-2">
                  <div className="flex justify-between text-gray-400">
                    <span>Base Shift cost</span>
                    <span>₹{payAmount} x {duration} hrs</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Number of students</span>
                    <span>x {openings}</span>
                  </div>
                  <div className="flex justify-between text-gray-200 font-bold pt-2 border-t border-white/[0.04]">
                    <span>Estimated total cost</span>
                    <span className="text-glow-emerald">₹{payAmount * duration * openings}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="py-4 rounded-2xl bg-white/5 border border-white/10 text-[13px] font-bold text-gray-400 hover:text-white transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-[13px] font-bold text-white shadow-[0_4px_15px_rgba(139,92,246,0.2)] flex items-center justify-center gap-1.5"
                  >
                    Launch Gig <CheckCircle2 className="w-4 h-4 text-glow-purple" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </main>

    </div>
  );
}
