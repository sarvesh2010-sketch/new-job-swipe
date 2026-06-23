'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, ShieldCheck, UserCheck, Store, MapPin, AlertCircle, FileText } from 'lucide-react';

const BUSINESS_TYPES = [
  'Cafe / Restaurant',
  'Retail Store',
  'Event Organizer',
  'Coaching Center',
  'Warehouse / Logistics',
  'Other Local Business'
];

export default function ProviderOnboardingPage() {
  const router = useRouter();

  // Step tracker: 'PHONE' | 'OTP' | 'BUSINESS' | 'GST'
  const [step, setStep] = useState<'PHONE' | 'OTP' | 'BUSINESS' | 'GST'>('PHONE');

  // Form states
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [address, setAddress] = useState('');
  const [gstin, setGstin] = useState('');
  const [error, setError] = useState('');
  const [isValidatingGST, setIsValidatingGST] = useState(false);

  // OTP Ref references
  const otpRefs = [
    React.useRef<HTMLInputElement>(null),
    React.useRef<HTMLInputElement>(null),
    React.useRef<HTMLInputElement>(null),
    React.useRef<HTMLInputElement>(null)
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
    setStep('BUSINESS');
  };

  const handleBusinessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return setError('Please enter your business name.');
    if (!businessType) return setError('Please select a business type.');
    if (!address.trim()) return setError('Please enter your shop address.');
    setError('');
    setStep('GST');
  };

  const handleGSTSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gstin.length < 15) {
      setError('A valid GSTIN must be exactly 15 characters.');
      return;
    }

    setError('');
    setIsValidatingGST(true);

    // Simulate database GST lookup latency (Apple/Stripe style loading)
    setTimeout(() => {
      setIsValidatingGST(false);
      
      const providerProfile = {
        businessName,
        businessType,
        address,
        phone,
        gstin,
        isVerified: true, // Auto-verified on successful mock GST entry
        location: { lat: 28.6862, lng: 77.2218 } // DU Campus coords
      };

      localStorage.setItem('jobswipe_provider_profile', JSON.stringify(providerProfile));
      
      // Seed initial jobs & applicant configurations
      seedInitialJobs();

      router.push('/dashboard');
    }, 1500);
  };

  const seedInitialJobs = () => {
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
            skills: ['Customer Service', 'Beverages'],
            buddy: 'Aman Verma' // Connected buddy
          },
          {
            id: 'app-stud-2',
            name: 'Aman Verma',
            college: 'DU St. Stephens',
            trustScore: 4.9,
            photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
            skills: ['Logistics', 'Customer Service'],
            buddy: 'Rohan Sharma'
          }
        ]
      },
      {
        id: 'job-active-2',
        title: 'Flyer Distributor',
        provider: businessName,
        pay: '₹300/job',
        duration: '2 hrs',
        distance: '0.4 km',
        skills: ['Promo', 'Walking'],
        description: 'Distribute event posters to students leaving the library cluster.',
        status: 'ACTIVE',
        views: 18,
        openings: 1,
        applicantsCount: 1,
        applicants: [
          {
            id: 'app-stud-3',
            name: 'Neha Gupta',
            college: 'DU SRCC',
            trustScore: 4.6,
            photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150',
            skills: ['Promo', 'Canva']
          }
        ]
      }
    ];
    
    localStorage.setItem('jobswipe_provider_listings', JSON.stringify(mockJobs));
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-void relative overflow-hidden">
      
      {/* Dynamic background lights */}
      <div className="absolute top-1/4 left-1/4 w-[250px] h-[250px] bg-purple-500/10 blur-[80px] -z-10 rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-teal-500/10 blur-[80px] -z-10 rounded-full" />

      <div className="w-full max-w-md p-6 rounded-[36px] bg-[#0b0f19]/80 border border-white/[0.08] backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        {/* Stepper progress */}
        <div className="flex gap-1.5 mb-8">
          {(['PHONE', 'OTP', 'BUSINESS', 'GST'] as const).map((s, idx) => {
            const steps = ['PHONE', 'OTP', 'BUSINESS', 'GST'];
            const activeIdx = steps.indexOf(step);
            return (
              <div 
                key={s} 
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  idx <= activeIdx ? 'bg-purple-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]' : 'bg-white/5'
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
          {/* STEP 1: PHONE LOGIN */}
          {step === 'PHONE' && (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-[22px] font-bold text-gray-100 font-heading mb-2">Host Portal Onboarding</h2>
              <p className="text-[13px] text-gray-400 mb-6 leading-relaxed">
                Log in to recruit reliable campus students for temp gigs in minutes. Enter your mobile number.
              </p>

              <form onSubmit={handlePhoneSubmit} className="space-y-5">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-gray-400">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="Mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-14 pr-4 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] focus:border-purple-500/50 outline-none text-[14px] text-gray-100 placeholder-gray-500 transition-all font-semibold"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-[13px] font-bold text-white shadow-[0_4px_15px_rgba(139,92,246,0.2)] flex items-center justify-center gap-1.5"
                >
                  Send OTP Code <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 2: OTP VERIFICATION SIMULATOR */}
          {step === 'OTP' && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-[22px] font-bold text-gray-100 font-heading mb-2">Verify Host Access</h2>
              <p className="text-[13px] text-gray-400 mb-6 leading-relaxed">
                Enter code <strong className="text-purple-400">"1234"</strong> to authorize the phone profile.
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
                        if (e.key === 'Backspace' && !digit && idx > 0) {
                          otpRefs[idx - 1].current?.focus();
                        }
                      }}
                      className="w-12 h-14 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-purple-500/50 outline-none text-[20px] font-bold text-center text-gray-100 transition-all"
                      required
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-[13px] font-bold text-white shadow-[0_4px_15px_rgba(139,92,246,0.2)] flex items-center justify-center gap-1.5"
                >
                  Verify Access <ShieldCheck className="w-4 h-4 text-glow-purple" />
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 3: BUSINESS PROFILE */}
          {step === 'BUSINESS' && (
            <motion.div
              key="business"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-[22px] font-bold text-gray-100 font-heading mb-2">Business Profile</h2>
              <p className="text-[13px] text-gray-400 mb-6 leading-relaxed">
                Provide your store detail properties to begin posting student jobs.
              </p>

              <form onSubmit={handleBusinessSubmit} className="space-y-4">
                <div className="relative">
                  <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Business / Shop name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] focus:border-purple-500/50 outline-none text-[13px] text-gray-100 placeholder-gray-500 transition-all font-semibold"
                    required
                  />
                </div>

                <div className="relative">
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full pl-4 pr-4 py-4 rounded-2xl bg-[#0b0f19] border border-white/[0.08] focus:border-purple-500/50 outline-none text-[13px] text-gray-400 transition-all font-semibold"
                    required
                  >
                    <option value="">Select Business Type</option>
                    {BUSINESS_TYPES.map((t) => (
                      <option key={t} value={t} className="bg-[#0b0f19] text-gray-200">{t}</option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <MapPin className="absolute left-4 top-4 w-4 h-4 text-gray-500" />
                  <textarea
                    placeholder="Physical store address (e.g. Satya Niketan block A)"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={2}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] focus:border-purple-500/50 outline-none text-[13px] text-gray-100 placeholder-gray-500 transition-all font-semibold resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-[13px] font-bold text-white shadow-[0_4px_15px_rgba(139,92,246,0.2)] flex items-center justify-center gap-1.5"
                >
                  Continue to GST Verify <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 4: GST VERIFICATION MOCK */}
          {step === 'GST' && (
            <motion.div
              key="gst"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-[22px] font-bold text-gray-100 font-heading mb-2">GSTIN Verification</h2>
              <p className="text-[13px] text-gray-400 mb-6 leading-relaxed">
                Provide your 15-character **GSTIN** number to verify your storefront status. Enter any 15-character string to complete onboarding (e.g., `07AAAAA0000A1Z5`).
              </p>

              <form onSubmit={handleGSTSubmit} className="space-y-5">
                <div className="relative">
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    maxLength={15}
                    placeholder="Enter 15-digit GSTIN"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    disabled={isValidatingGST}
                    className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] focus:border-purple-500/50 outline-none text-[13px] text-gray-100 placeholder-gray-500 transition-all font-semibold tracking-wider"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isValidatingGST}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-[13px] font-bold text-white shadow-[0_4px_15px_rgba(139,92,246,0.2)] flex items-center justify-center gap-1.5"
                >
                  {isValidatingGST ? (
                    <>
                      Validating GSTIN...
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    </>
                  ) : (
                    <>
                      Verify & Activate Profile <UserCheck className="w-4 h-4 text-glow-purple" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
