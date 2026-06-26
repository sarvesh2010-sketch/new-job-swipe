'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import BottomTabBar from '@/components/shared/BottomTabBar';
import { User, Phone, LogOut, CheckCircle2, UserCheck, Star, Award, Layers } from 'lucide-react';

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

export default function StudentProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempSkills, setTempSkills] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('jobswipe_student_profile');
    if (!saved) {
      router.push('/login');
      return;
    }
    const data = JSON.parse(saved);
    setProfile(data);
    setTempSkills(data.skills);
  }, []);

  const toggleSkill = (skill: string) => {
    if (tempSkills.includes(skill)) {
      setTempSkills(tempSkills.filter(s => s !== skill));
    } else {
      setTempSkills([...tempSkills, skill]);
    }
  };

  const handleSave = () => {
    if (tempSkills.length === 0) {
      alert('Please select at least one skill.');
      return;
    }
    const updated = { ...profile, skills: tempSkills };
    localStorage.setItem('jobswipe_student_profile', JSON.stringify(updated));
    setProfile(updated);
    setIsEditing(false);
    
    // Clear matches to force re-evaluation in feed
    setMessage('Skills updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('jobswipe_student_profile');
      localStorage.removeItem('jobswipe_applications');
      localStorage.removeItem('jobswipe_apps_seeded');
      router.push('/login');
    }
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-void text-gray-100 flex flex-col justify-between pb-28">
      <Navbar title="My Profile" />

      <main className="flex-1 max-w-md mx-auto w-full p-4 space-y-6">
        
        {/* Profile Card Header */}
        <div className="p-6 rounded-[36px] bg-[#0b0f19]/80 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-indigo-500/5 blur-[50px] -z-10 rounded-full" />

          {/* Profile Photo */}
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-indigo-500/50 p-1 mb-4">
            <img 
              src={profile.photoUrl} 
              alt="Profile" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <h2 className="text-[20px] font-bold text-gray-100 font-heading leading-tight tracking-tight">{profile.name}</h2>
          <p className="text-[12px] text-gray-400 mt-1">{profile.college} • {profile.age} years old</p>

          <div className="flex gap-1.5 items-center mt-3 text-[11px] font-semibold text-glow-indigo bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
            <UserCheck className="w-3.5 h-3.5" /> Verified Student Profile
          </div>

          {/* Grid Stats */}
          <div className="w-full grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-white/[0.04] text-center">
            <div>
              <span className="text-[10px] text-gray-500 font-semibold block uppercase">Rating</span>
              <span className="text-[16px] font-extrabold text-amber-400 mt-1 flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-current" /> 4.8
              </span>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 font-semibold block uppercase">Completions</span>
              <span className="text-[16px] font-extrabold text-indigo-400 mt-1 flex items-center justify-center gap-1">
                <Layers className="w-4 h-4" /> 12 Gigs
              </span>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 font-semibold block uppercase">Reputation</span>
              <span className="text-[16px] font-extrabold text-teal-400 mt-1 flex items-center justify-center gap-1">
                <Award className="w-4 h-4" /> Top 5%
              </span>
            </div>
          </div>

        </div>

        {/* Success message banner */}
        {message && (
          <div className="flex gap-2 p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-300 text-[12px] items-center leading-relaxed">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-glow-emerald" />
            <span>{message}</span>
          </div>
        )}

        {/* Skill Tags Configuration Section */}
        <div className="p-6 rounded-[36px] bg-white/[0.01] border border-white/[0.05] space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-[14px] font-bold text-gray-200 font-heading">My Active Skills</h3>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)} 
                className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300"
              >
                Modify Skills
              </button>
            ) : (
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsEditing(false)} 
                  className="text-[11px] font-bold text-gray-500 hover:text-gray-400"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave} 
                  className="text-[11px] font-bold text-glow-emerald"
                >
                  Save Change
                </button>
              </div>
            )}
          </div>

          {!isEditing ? (
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.map((skill: string) => (
                <span 
                  key={skill}
                  className="text-[11px] font-medium text-gray-300 bg-white/[0.04] border border-white/[0.06] px-2.5 py-0.5 rounded-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {SKILLS_LIST.map((skill) => {
                const selected = tempSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`
                      px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all duration-300
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
          )}
        </div>

        {/* Security & Account Details */}
        <div className="p-6 rounded-[36px] bg-white/[0.01] border border-white/[0.05] space-y-4 text-[13px]">
          <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
            <span className="text-gray-400 flex items-center gap-1.5"><Phone className="w-4 h-4 text-gray-500" /> Phone login</span>
            <span className="font-semibold text-gray-200">+91 {profile.phone || '9876543210'}</span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-4 rounded-2xl bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 text-rose-400 text-[13px] font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-4 h-4 text-glow-rose" /> Sign Out & Clear Cache
          </button>
        </div>

      </main>

      <BottomTabBar />
    </div>
  );
}
