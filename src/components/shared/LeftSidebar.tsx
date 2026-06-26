'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Layers, Award, User, UserCheck } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

export default function LeftSidebar() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('jobswipe_student_profile');
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  const menuItems = [
    { name: "Swipe Feed", url: "/home", icon: Sparkles },
    { name: "My Applications", url: "/applications", icon: Layers },
    { name: "Trust Rep Orbit", url: "/trust-score", icon: Award },
    { name: "My Profile Settings", url: "/profile", icon: User },
  ];

  if (!profile) return null;

  return (
    <div className="space-y-6 sticky top-24">
      {/* Student Profile Card Overview */}
      <div className="p-5 rounded-2xl bg-[#0b0f19]/80 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden flex flex-col items-center text-center">
        <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-indigo-500/5 blur-[40px] -z-10 rounded-full" />
        
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-500/30 p-0.5 mb-3">
          <img src={profile.photoUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
        </div>
        
        <h3 className="text-[14px] font-bold text-gray-200">{profile.name}</h3>
        <p className="text-[10px] text-gray-500 mt-0.5">{profile.college}</p>
        
        <div className="flex gap-1 items-center mt-2.5 text-[9px] font-bold text-glow-indigo bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
          <UserCheck className="w-3 h-3" /> Verified Student
        </div>

        {/* Reputation Score Summary */}
        <div className="w-full grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/[0.04]">
          <div className="text-center">
            <span className="text-[8px] text-gray-500 font-bold block uppercase">Trust Score</span>
            <span className="text-[14px] font-black text-indigo-400 mt-0.5 block">
              <AnimatedCounter value={profile.trustScore || 4.8} decimals={1} />
            </span>
          </div>
          <div className="text-center">
            <span className="text-[8px] text-gray-500 font-bold block uppercase">Rank</span>
            <span className="text-[14px] font-black text-teal-400 mt-0.5 block">Top 5%</span>
          </div>
        </div>
      </div>

      {/* Desktop Side Navigation */}
      <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/[0.05] flex flex-col gap-1">
        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider px-3 mb-2 block">Quick Navigation</span>
        {menuItems.map((item) => {
          const isActive = pathname === item.url;
          const Icon = item.icon;
          return (
            <Link
              key={item.url}
              href={item.url}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[12px] font-bold transition-all ${
                isActive
                  ? 'bg-indigo-500/10 text-glow-indigo border border-indigo-500/20'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.02] border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
