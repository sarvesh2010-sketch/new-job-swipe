'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  ArrowRight, 
  User, 
  School, 
  Sparkles, 
  AlertCircle, 
  Briefcase, 
  Building2, 
  MapPin, 
  FileText, 
  Lock, 
  Mail
} from 'lucide-react';
import { ImageSlider } from '@/components/shared/ImageSlider';

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

const SLIDES = [
  {
    url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800",
    title: "Micro-Gigs for Students",
    subtitle: "Find paid part-time work near your DU campus. Swipe right, get approved, work with a buddy, and earn instantly."
  },
  {
    url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800",
    title: "Emergency Shifts for Hosts",
    subtitle: "Understaffed during the weekend rush? Post a 3-hour shift and hire verified student helpers in 15 minutes."
  },
  {
    url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
    title: "A Secure Trust Ledger",
    subtitle: "Build your credit-like Reputation Score through punctual completions and secure digital verification logs."
  }
];

export default function UnifiedLoginPage() {
  const router = useRouter();

  // Role: 'STUDENT' | 'PROVIDER'
  const [role, setRole] = useState<'STUDENT' | 'PROVIDER'>('STUDENT');
  
  // Auth flow steps: 'AUTH' | 'PHONE' | 'OTP' | 'DETAILS'
  const [step, setStep] = useState<'AUTH' | 'PHONE' | 'OTP' | 'DETAILS'>('AUTH');

  // Input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Details - Student
  const [studentName, setStudentName] = useState('');
  const [studentCollege, setStudentCollege] = useState('');
  const [studentAge, setStudentAge] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Details - Provider (Business Owner)
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('Cafe');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessGstin, setBusinessGstin] = useState('');

  // OTP Ref references for focus cycling
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  // Reset errors when changing step
  useEffect(() => {
    setError('');
  }, [step, role]);

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all email and password fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      setStep('PHONE');
    }, 1200);
  };

  const handleSocialAuth = (platform: 'Google' | 'Microsoft') => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      setStep('PHONE');
    }, 1500);
  };

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
    setStep('DETAILS');
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (role === 'STUDENT') {
      if (!studentName.trim()) return setError('Please enter your name.');
      if (!studentCollege.trim()) return setError('Please enter your college name.');
      
      const parsedAge = parseInt(studentAge);
      if (isNaN(parsedAge) || parsedAge < 18) {
        return setError('You must be 18 years or older to apply for gigs.');
      }
      if (selectedSkills.length === 0) {
        return setError('Please select at least one skill to match you with gigs.');
      }

      // Save Student Profile
      const studentProfile = {
        name: studentName,
        college: studentCollege,
        age: parsedAge,
        skills: selectedSkills,
        phone,
        trustScore: 4.0,
        photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150"
      };

      localStorage.setItem('jobswipe_student_profile', JSON.stringify(studentProfile));
      localStorage.removeItem('jobswipe_applications'); // Clear cache
      
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        router.push('/home');
      }, 1000);

    } else {
      // Host / Provider onboarding
      if (!businessName.trim()) return setError('Please enter your business name.');
      if (!businessAddress.trim()) return setError('Please enter your business location address.');

      const providerProfile = {
        businessName,
        businessType,
        address: businessAddress,
        phone,
        gstin: businessGstin || '07AAAAA0000A1Z1',
        isVerified: true,
        location: { lat: 28.6862, lng: 77.2218 } // DU Campus coordinates
      };

      localStorage.setItem('jobswipe_provider_profile', JSON.stringify(providerProfile));
      
      // Seed initial sample jobs for provider dashboard
      const mockJobs = [
        {
          id: 'job-active-1',
          title: 'Table Busser & Server',
          provider: businessName,
          pay: '₹150/hr',
          duration: '3 hrs',
          distance: '0.2 km',
          skills: ['Customer Service', 'Beverages'],
          description: 'Need an urgent helper to bus dining tables and run clean coffee mugs to the barista counter during peak hours.',
          status: 'ACTIVE',
          views: 42,
          openings: 2,
          applicantsCount: 2,
          applicants: [
            {
              id: 'app-stud-1',
              name: 'Rohan Sharma',
              college: 'Delhi University (B.Com)',
              trustScore: 4.8,
              photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150',
              status: 'PENDING'
            },
            {
              id: 'app-stud-2',
              name: 'Aditya Mehta',
              college: 'IIT Delhi (B.Tech)',
              trustScore: 4.7,
              photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
              status: 'PENDING'
            }
          ]
        }
      ];
      localStorage.setItem('jobswipe_provider_listings', JSON.stringify(mockJobs));

      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        router.push('/dashboard');
      }, 1000);
    }
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-void text-gray-100 relative overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/3 w-[350px] h-[350px] bg-indigo-500/5 blur-[120px] -z-10 rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-purple-500/5 blur-[120px] -z-10 rounded-full" />

      {/* LEFT PANEL: Image Slider (Visible only on lg screens) */}
      <div className="hidden lg:block lg:col-span-5 h-full relative">
        <ImageSlider slides={SLIDES} interval={5500} className="w-full h-full" />
      </div>

      {/* RIGHT PANEL: Auth Card */}
      <div className="lg:col-span-7 flex flex-col justify-center items-center px-6 py-12 lg:px-16 overflow-y-auto">
        <div className="w-full max-w-[430px] space-y-8">
          
          {/* Logo & Header */}
          <div className="text-center lg:text-left space-y-2">
            <h1 className="text-[26px] font-black tracking-tight font-heading text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              JOBSWIPE
            </h1>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em]">
              Hyperlocal Gig Network
            </p>
          </div>

          {/* Form Container */}
          <div className="p-7 rounded-[32px] bg-[#0b0f19]/60 border border-white/[0.08] backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            
            {/* Step Progress Dots */}
            <div className="flex gap-1.5 mb-8">
              {(['AUTH', 'PHONE', 'OTP', 'DETAILS'] as const).map((s, idx) => {
                const steps = ['AUTH', 'PHONE', 'OTP', 'DETAILS'];
                const activeIdx = steps.indexOf(step);
                return (
                  <div 
                    key={s} 
                    className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                      idx <= activeIdx ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'bg-white/5'
                    }`} 
                  />
                );
              })}
            </div>

            {/* Error banner */}
            {error && (
              <div className="flex gap-2 p-3.5 mb-6 rounded-xl bg-rose-500/5 border border-rose-500/10 text-rose-300 text-[12px] items-center leading-relaxed">
                <AlertCircle className="w-4.5 h-4.5 shrink-0 text-rose-400 animate-pulse" />
                <span>{error}</span>
              </div>
            )}

            <AnimatePresence mode="wait">
              
              {/* STEP 1: AUTHENTICATION DECK */}
              {step === 'AUTH' && (
                <motion.div
                  key="auth"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-[20px] font-bold text-gray-100 font-heading mb-1.5">Join the Network</h2>
                    <p className="text-[12.5px] text-gray-400 leading-relaxed">
                      Create an account or login below to find walk-to-work gigs or hire student helpers.
                    </p>
                  </div>

                  {/* Role Selector Tabs */}
                  <div className="flex gap-1.5 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                    <button
                      type="button"
                      onClick={() => setRole('STUDENT')}
                      className={`flex-1 py-2 text-[10.5px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        role === 'STUDENT'
                          ? 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-300'
                          : 'text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" /> Student Portal
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('PROVIDER')}
                      className={`flex-1 py-2 text-[10.5px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        role === 'PROVIDER'
                          ? 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-300'
                          : 'text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      <Briefcase className="w-3.5 h-3.5" /> Business / Host
                    </button>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleEmailAuth} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-indigo-500/50 outline-none text-[13.5px] text-gray-100 placeholder-gray-500 transition-all font-semibold"
                        required
                      />
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="password"
                        placeholder="Password (Min. 6 chars)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-indigo-500/50 outline-none text-[13.5px] text-gray-100 placeholder-gray-500 transition-all font-semibold"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-[12.5px] font-bold text-white shadow-[0_4px_15px_rgba(99,102,241,0.2)] flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Continue Authentication <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Social Divider */}
                  <div className="relative my-6 text-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/[0.06]" />
                    </div>
                    <span className="relative px-3 text-[9px] font-bold text-gray-500 bg-[#0c101b] uppercase tracking-wider">
                      Or Social login
                    </span>
                  </div>

                  {/* Social Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleSocialAuth('Google')}
                      className="py-3 px-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] text-[11.5px] font-bold text-gray-300 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4 mr-0.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Google
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSocialAuth('Microsoft')}
                      className="py-3 px-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] text-[11.5px] font-bold text-gray-300 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4 mr-0.5 shrink-0" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0h10.5v10.5H0z" fill="#F25022"/>
                        <path d="M11.5 0H22v10.5H11.5z" fill="#7FBA00"/>
                        <path d="M0 11.5h10.5V22H0z" fill="#00A4EF"/>
                        <path d="M11.5 11.5H22V22H11.5z" fill="#FFB900"/>
                      </svg>
                      Microsoft
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: PHONE ENROLLMENT */}
              {step === 'PHONE' && (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-[20px] font-bold text-gray-100 font-heading mb-1.5">Phone Verification</h2>
                    <p className="text-[12.5px] text-gray-400 leading-relaxed">
                      Enter your mobile number to bind verified OTP credentials to your reputation ledger.
                    </p>
                  </div>

                  <form onSubmit={handlePhoneSubmit} className="space-y-4">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-gray-400">+91</span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full pl-14 pr-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-indigo-500/50 outline-none text-[13.5px] text-gray-100 placeholder-gray-500 transition-all font-semibold"
                        required
                        autoFocus
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-[12.5px] font-bold text-white shadow-[0_4px_15px_rgba(99,102,241,0.2)] flex items-center justify-center gap-1.5 transition-all"
                    >
                      Send Verification OTP <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </motion.div>
              )}

              {/* STEP 3: OTP DECK */}
              {step === 'OTP' && (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-[20px] font-bold text-gray-100 font-heading mb-1.5">Enter OTP Code</h2>
                    <p className="text-[12.5px] text-gray-400 leading-relaxed">
                      We sent a 4-digit simulation code to +91 {phone}. Enter <strong className="text-indigo-400">"1234"</strong> to authorize.
                    </p>
                  </div>

                  <form onSubmit={handleOtpSubmit} className="space-y-5">
                    <div className="flex justify-between gap-3 max-w-[280px] mx-auto">
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={otpRefs[idx]}
                          type="text"
                          maxLength={1}
                          pattern="\d*"
                          value={digit}
                          onChange={(e) => handleOtpChange(e.target.value, idx)}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !digit && idx > 0) {
                              otpRefs[idx - 1].current?.focus();
                            }
                          }}
                          className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-indigo-500/50 outline-none text-[16px] text-center text-gray-100 font-bold transition-all"
                          required
                          autoFocus={idx === 0}
                        />
                      ))}
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-[12.5px] font-bold text-white shadow-[0_4px_15px_rgba(99,102,241,0.2)] flex items-center justify-center gap-1.5 transition-all"
                    >
                      Verify Credentials <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </motion.div>
              )}

              {/* STEP 4: SETUP PROFILE DETAILS */}
              {step === 'DETAILS' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-[20px] font-bold text-gray-100 font-heading mb-1.5">Profile Setup</h2>
                    <p className="text-[12.5px] text-gray-400 leading-relaxed">
                      Complete your registration details to start listing or swiping on gigs.
                    </p>
                  </div>

                  <form onSubmit={handleDetailsSubmit} className="space-y-4">
                    
                    {/* STUDENT DETAILS */}
                    {role === 'STUDENT' ? (
                      <>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="text"
                            placeholder="Full Name"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-indigo-500/50 outline-none text-[13px] text-gray-100 placeholder-gray-500 transition-all font-semibold"
                            required
                          />
                        </div>

                        <div className="relative">
                          <School className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="text"
                            placeholder="College Name (e.g. SRCC, DU)"
                            value={studentCollege}
                            onChange={(e) => setStudentCollege(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-indigo-500/50 outline-none text-[13px] text-gray-100 placeholder-gray-500 transition-all font-semibold"
                            required
                          />
                        </div>

                        <div className="relative">
                          <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="number"
                            min={18}
                            max={35}
                            placeholder="Age (Min. 18)"
                            value={studentAge}
                            onChange={(e) => setStudentAge(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-indigo-500/50 outline-none text-[13px] text-gray-100 placeholder-gray-500 transition-all font-semibold"
                            required
                          />
                        </div>

                        {/* Skills multiselect */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block px-1">
                            Select Your Skills (Min. 1)
                          </label>
                          <div className="flex flex-wrap gap-1.5 max-h-[110px] overflow-y-auto p-1 border border-white/[0.04] rounded-xl bg-white/[0.01]">
                            {SKILLS_LIST.map((skill) => {
                              const isSelected = selectedSkills.includes(skill);
                              return (
                                <button
                                  type="button"
                                  key={skill}
                                  onClick={() => toggleSkill(skill)}
                                  className={`text-[10.5px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                                    isSelected
                                      ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300'
                                      : 'bg-white/[0.02] border-white/[0.06] text-gray-400 hover:border-white/[0.12]'
                                  }`}
                                >
                                  {skill}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    ) : (
                      
                      /* PROVIDER / HOST DETAILS */
                      <>
                        <div className="relative">
                          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="text"
                            placeholder="Business / Cafe Name"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-indigo-500/50 outline-none text-[13px] text-gray-100 placeholder-gray-500 transition-all font-semibold"
                            required
                          />
                        </div>

                        <div className="relative">
                          <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <select
                            value={businessType}
                            onChange={(e) => setBusinessType(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#0e121e] border border-white/[0.08] focus:border-indigo-500/50 outline-none text-[13px] text-gray-100 transition-all font-semibold appearance-none"
                          >
                            <option value="Cafe">Cafe / Restaurant</option>
                            <option value="Event">Event Management</option>
                            <option value="Retail">Retail Store</option>
                            <option value="Logistics">Logistics / Delivery</option>
                            <option value="Office">Office Admin</option>
                          </select>
                        </div>

                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="text"
                            placeholder="Store Address (e.g. Satya Niketan, Delhi)"
                            value={businessAddress}
                            onChange={(e) => setBusinessAddress(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-indigo-500/50 outline-none text-[13px] text-gray-100 placeholder-gray-500 transition-all font-semibold"
                            required
                          />
                        </div>

                        <div className="relative">
                          <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="text"
                            placeholder="GSTIN Number (Optional)"
                            value={businessGstin}
                            onChange={(e) => setBusinessGstin(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-indigo-500/50 outline-none text-[13px] text-gray-100 placeholder-gray-500 transition-all font-semibold"
                          />
                        </div>
                      </>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-[12.5px] font-bold text-white shadow-[0_4px_15px_rgba(99,102,241,0.2)] flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Complete Registration <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
              
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
