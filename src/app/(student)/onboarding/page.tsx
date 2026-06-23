'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, ShieldCheck, User, School, Sparkles, AlertCircle } from 'lucide-react';

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

export default function OnboardingPage() {
  const router = useRouter();
  
  // Step tracker: 'PHONE' | 'OTP' | 'PROFILE' | 'SKILLS'
  const [step, setStep] = useState<'PHONE' | 'OTP' | 'PROFILE' | 'SKILLS'>('PHONE');

  // Input states
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [age, setAge] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [error, setError] = useState('');

  // OTP Ref references for focus cycling
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError('');
    setStep('OTP');
  };

  const handleOtpChange = (val: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);

    // Auto-focus next field
    if (val && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code !== '1234') {
      setError('Invalid OTP code. Please enter "1234" to simulate success.');
      return;
    }
    setError('');
    setStep('PROFILE');
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError('Please enter your name.');
    if (!college.trim()) return setError('Please enter your college or area.');
    
    const parsedAge = parseInt(age);
    if (isNaN(parsedAge) || parsedAge < 18) {
      return setError('You must be 18 years or older to apply for gigs.');
    }

    setError('');
    setStep('SKILLS');
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleComplete = () => {
    if (selectedSkills.length === 0) {
      setError('Please select at least one skill to continue.');
      return;
    }
    
    // Save profile to localStorage to enable live mock interaction across views
    const studentProfile = {
      name,
      college,
      age: parseInt(age),
      skills: selectedSkills,
      phone,
      trustScore: 4.0,
      photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150"
    };
    
    localStorage.setItem('jobswipe_student_profile', JSON.stringify(studentProfile));
    
    // Invalidate old application caches to prevent conflicts
    localStorage.removeItem('jobswipe_applications');
    
    router.push('/home');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-void relative overflow-hidden">
      
      {/* Visual background lights */}
      <div className="absolute top-1/4 left-1/4 w-[250px] h-[250px] bg-indigo-500/10 blur-[80px] -z-10 rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-purple-500/10 blur-[80px] -z-10 rounded-full" />

      <div className="w-full max-w-md p-6 rounded-[36px] bg-[#0b0f19]/80 border border-white/[0.08] backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        {/* Progress Bar Indicator */}
        <div className="flex gap-1.5 mb-8">
          {(['PHONE', 'OTP', 'PROFILE', 'SKILLS'] as const).map((s, idx) => {
            const steps = ['PHONE', 'OTP', 'PROFILE', 'SKILLS'];
            const activeIdx = steps.indexOf(step);
            return (
              <div 
                key={s} 
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  idx <= activeIdx ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'bg-white/5'
                }`} 
              />
            );
          })}
        </div>

        {error && (
          <div className="flex gap-2 p-3.5 mb-6 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-rose-300 text-[12px] items-center leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0 text-glow-rose" />
            <span>{error}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: ENTER PHONE NUMBER */}
          {step === 'PHONE' && (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-[22px] font-bold text-gray-100 font-heading mb-2">Claim Pocket Money</h2>
              <p className="text-[13px] text-gray-400 mb-6 leading-relaxed">
                Enter your mobile number to receive a verification OTP. Start swiping on nearby student gigs.
              </p>

              <form onSubmit={handlePhoneSubmit} className="space-y-5">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-gray-400">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-14 pr-4 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] focus:border-indigo-500/50 outline-none text-[14px] text-gray-100 placeholder-gray-500 transition-all font-semibold"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-[13px] font-bold text-white shadow-[0_4px_15px_rgba(99,102,241,0.2)] flex items-center justify-center gap-1.5"
                >
                  Send OTP Code <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 2: VERIFY OTP CODE SIMULATOR */}
          {step === 'OTP' && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-[22px] font-bold text-gray-100 font-heading mb-2">Verify Phone Number</h2>
              <p className="text-[13px] text-gray-400 mb-6 leading-relaxed">
                We sent an OTP to <span className="text-gray-200 font-bold">+91 {phone}</span>. Enter code <strong className="text-indigo-400">"1234"</strong> to simulate successful verification.
              </p>

              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div className="flex justify-between gap-3 max-w-[260px] mx-auto">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={otpRefs[idx]}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, idx)}
                      onKeyDown={(e) => {
                        // Focus previous on Backspace
                        if (e.key === 'Backspace' && !digit && idx > 0) {
                          otpRefs[idx - 1].current?.focus();
                        }
                      }}
                      className="w-12 h-14 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-indigo-500/50 outline-none text-[20px] font-bold text-center text-gray-100 transition-all"
                      required
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-[13px] font-bold text-white shadow-[0_4px_15px_rgba(99,102,241,0.2)] flex items-center justify-center gap-1.5"
                >
                  Verify OTP <ShieldCheck className="w-4 h-4 text-glow-indigo animate-pulse" />
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 3: CREATE PROFILE DETAILS */}
          {step === 'PROFILE' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-[22px] font-bold text-gray-100 font-heading mb-2">Setup Your Profile</h2>
              <p className="text-[13px] text-gray-400 mb-6 leading-relaxed">
                Provide your details to build your student card. This is what local cafes and event hosts see.
              </p>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] focus:border-indigo-500/50 outline-none text-[13px] text-gray-100 placeholder-gray-500 transition-all font-semibold"
                    required
                  />
                </div>

                <div className="relative">
                  <School className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Your college or area name (e.g., DU)"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] focus:border-indigo-500/50 outline-none text-[13px] text-gray-100 placeholder-gray-500 transition-all font-semibold"
                    required
                  />
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[12px] font-bold text-gray-500">Age</span>
                  <input
                    type="number"
                    placeholder="Age (must be 18+)"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full pl-14 pr-4 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] focus:border-indigo-500/50 outline-none text-[13px] text-gray-100 placeholder-gray-500 transition-all font-semibold"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-[13px] font-bold text-white shadow-[0_4px_15px_rgba(99,102,241,0.2)] flex items-center justify-center gap-1.5"
                >
                  Continue to Skills <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 4: SELECT SKILL CHIPS */}
          {step === 'SKILLS' && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-[22px] font-bold text-gray-100 font-heading mb-2">Select Your Skills</h2>
              <p className="text-[13px] text-gray-400 mb-6 leading-relaxed">
                Pick skill tags representing what you are good at to matching nearby gigs. Select at least one.
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {SKILLS_LIST.map((skill) => {
                  const selected = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`
                        px-3.5 py-2 rounded-xl text-[11px] font-bold border transition-all duration-300
                        ${selected 
                          ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.15)]' 
                          : 'bg-white/[0.02] border-white/[0.06] text-gray-400 hover:border-white/15'
                        }
                      `}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleComplete}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-[13px] font-bold text-white shadow-[0_4px_15px_rgba(99,102,241,0.2)] flex items-center justify-center gap-1.5"
              >
                Complete Registration <Sparkles className="w-4 h-4 text-glow-teal animate-pulse" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
