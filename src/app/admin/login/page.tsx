'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, ShieldAlert, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username.trim().toLowerCase() === 'admin' && password === 'admin') {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        localStorage.setItem('jobswipe_admin_logged_in', 'true');
        router.push('/reports'); // Redirect to moderation panel
      }, 1200);
    } else {
      setError('Invalid administrator credentials. Access Denied. Hint: Use admin/admin');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-void relative overflow-hidden">
      
      {/* Red/Rose tactical glow background */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-rose-500/5 blur-[120px] -z-10 rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-indigo-500/5 blur-[120px] -z-10 rounded-full" />

      <div className="w-full max-w-[400px] space-y-6">
        
        {/* Command Center Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Restricted Access</span>
          </div>
          <h1 className="text-[22px] font-black tracking-tight font-heading text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-rose-400 to-indigo-500">
            JOBSWIPE COMMAND
          </h1>
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.18em]">
            Moderation Portal
          </p>
        </div>

        {/* Form panel */}
        <div className="p-7 rounded-[32px] bg-[#0b0f19]/80 border border-white/[0.08] backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          
          <h2 className="text-[16px] font-bold text-gray-100 font-heading mb-1">
            Sign In to Console
          </h2>
          <p className="text-[12px] text-gray-500 mb-6 leading-relaxed">
            Enter your moderator credentials to review reports, suspend accounts, and manage provider status.
          </p>

          {error && (
            <div className="flex gap-2 p-3.5 mb-5 rounded-xl bg-rose-500/5 border border-rose-500/10 text-rose-300 text-[11.5px] items-center leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Moderator Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-rose-500/40 outline-none text-[13.5px] text-gray-100 placeholder-gray-500 transition-all font-semibold"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                placeholder="Secure Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-rose-500/40 outline-none text-[13.5px] text-gray-100 placeholder-gray-500 transition-all font-semibold"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-[12.5px] font-bold text-white shadow-[0_4px_15px_rgba(244,63,94,0.2)] flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Access Console <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Helper Credentials Info */}
          <div className="mt-5 p-3 rounded-lg bg-white/[0.01] border border-white/[0.03] text-center">
            <span className="text-[10px] text-gray-600 leading-normal block">
              Default credentials: <strong className="text-gray-400">admin</strong> / <strong className="text-gray-400">admin</strong>
            </span>
          </div>

        </div>

        {/* Back Link */}
        <div className="text-center">
          <button 
            onClick={() => router.push('/')}
            className="text-[11.5px] font-bold text-gray-500 hover:text-gray-300 transition-colors"
          >
            ← Back to Home
          </button>
        </div>

      </div>

    </div>
  );
}
