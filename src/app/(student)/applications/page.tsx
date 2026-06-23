'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/shared/Navbar';
import BottomTabBar from '@/components/shared/BottomTabBar';
import { Layers, Calendar, MapPin, CheckCircle2, AlertCircle, Clock, ShieldCheck, PhoneCall, Users } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock applications histories to pre-fill the history logs
const DEFAULT_APPS = [
  {
    id: 'a-hist-1',
    jobId: '2',
    title: 'Nexus Concert Usher',
    provider: 'Nexus Fest Committee',
    pay: '₹600/day',
    duration: '4 hrs',
    distance: '0.8 km',
    status: 'APPROVED',
    appliedAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    buddy: 'Aman Verma'
  },
  {
    id: 'a-hist-2',
    jobId: '4',
    title: 'Gym Flyer Distributor',
    provider: 'Fit Gym North Campus',
    pay: '₹300/job',
    duration: '2.5 hrs',
    distance: '0.1 km',
    status: 'COMPLETED',
    appliedAt: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
  },
  {
    id: 'a-hist-3',
    jobId: '5',
    title: 'Excel Data Entry Helper',
    provider: 'EduTech Academy',
    pay: '₹180/hr',
    duration: '4 hrs',
    distance: '1.2 km',
    status: 'REJECTED',
    appliedAt: new Date(Date.now() - 86400000 * 5).toISOString() // 5 days ago
  }
];

export default function StudentApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    // Read swiped right apps
    const swiped = JSON.parse(localStorage.getItem('jobswipe_applications') || '[]');
    
    // Merge with default histories so they are populated
    if (swiped.length === 0 && !localStorage.getItem('jobswipe_apps_seeded')) {
      localStorage.setItem('jobswipe_applications', JSON.stringify(DEFAULT_APPS));
      localStorage.setItem('jobswipe_apps_seeded', 'true');
      setApplications(DEFAULT_APPS);
    } else {
      setApplications(swiped);
    }
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'APPROVED':
        return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
      case 'COMPLETED':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'REJECTED':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default:
        return 'text-gray-400 bg-white/5 border-white/10';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Awaiting Host Review';
      case 'APPROVED': return 'Approved - Connect Host';
      case 'COMPLETED': return 'Gig Completed & Paid';
      case 'REJECTED': return 'Not Selected';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-void text-gray-100 flex flex-col justify-between pb-28">
      <Navbar title="My Applications" />

      <main className="flex-1 max-w-md mx-auto w-full p-4 space-y-6">
        
        {applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((app) => (
              <div 
                key={app.id}
                className="p-5 rounded-[28px] bg-[#0b0f19]/80 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden group hover:border-white/15 transition-all"
              >
                {/* Visual glow backdrop */}
                <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-indigo-500/5 blur-[40px] -z-10 rounded-full" />
                
                {/* Row Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-[15px] font-bold text-gray-100 font-heading leading-tight tracking-tight">{app.title}</h3>
                    <p className="text-[11px] text-gray-500 font-medium mt-0.5">{app.provider}</p>
                  </div>
                  
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusStyle(app.status)}`}>
                    {getStatusText(app.status)}
                  </span>
                </div>

                {/* Sub Metadata details */}
                <div className="flex gap-4 items-center text-[11px] text-gray-500 pb-4 border-b border-white/[0.04] mb-4">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {app.duration} gig</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {app.distance}</span>
                  {app.buddy && (
                    <span className="flex items-center gap-1 text-indigo-400 font-bold"><Users className="w-3.5 h-3.5" /> Buddy Group</span>
                  )}
                </div>

                {/* Vertical Timeline Tracking (Premium Feature) */}
                <div className="relative pl-6 space-y-4">
                  {/* Timeline central bar */}
                  <div className="absolute left-2.5 top-2.5 bottom-2.5 w-[2px] bg-white/[0.06] -translate-x-1/2" />

                  {/* Node 1: Swipe Applied */}
                  <div className="relative flex items-center gap-3">
                    {/* Node Dot */}
                    <div className="absolute -left-5 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-[#0b0f19] z-10" />
                    <div>
                      <h4 className="text-[12px] font-bold text-gray-300">Swipe Applied</h4>
                      <p className="text-[10px] text-gray-500">{new Date(app.appliedAt).toLocaleDateString()} at {new Date(app.appliedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>

                  {/* Node 2: Host Review / Decision */}
                  <div className="relative flex items-center gap-3">
                    {/* Node Dot */}
                    <div className={`
                      absolute -left-5 w-3 h-3 rounded-full ring-4 ring-[#0b0f19] z-10
                      ${app.status === 'PENDING' ? 'bg-amber-400 animate-ping' : ''}
                      ${app.status === 'APPROVED' || app.status === 'COMPLETED' ? 'bg-indigo-500' : ''}
                      ${app.status === 'REJECTED' ? 'bg-rose-500' : ''}
                      ${app.status === 'PENDING' ? 'bg-amber-400' : ''}
                    `} />
                    
                    <div>
                      <h4 className="text-[12px] font-bold text-gray-300">
                        {app.status === 'PENDING' ? 'Host Reviewing Profile' : ''}
                        {app.status === 'APPROVED' || app.status === 'COMPLETED' ? 'Application Approved!' : ''}
                        {app.status === 'REJECTED' ? 'Application Closed' : ''}
                      </h4>
                      <p className="text-[10px] text-gray-500">
                        {app.status === 'PENDING' ? 'Average host review latency: 15 mins' : 'Review completed'}
                      </p>
                    </div>
                  </div>

                  {/* Node 3: Gig Execution / Complete */}
                  {(app.status === 'APPROVED' || app.status === 'COMPLETED') && (
                    <div className="relative flex items-center gap-3">
                      {/* Node Dot */}
                      <div className={`
                        absolute -left-5 w-3 h-3 rounded-full ring-4 ring-[#0b0f19] z-10
                        ${app.status === 'APPROVED' ? 'bg-indigo-500 animate-pulse' : 'bg-emerald-500'}
                      `} />
                      
                      <div>
                        <h4 className="text-[12px] font-bold text-gray-300">
                          {app.status === 'APPROVED' ? 'Ready to Work' : 'Gig Marked Complete'}
                        </h4>
                        <p className="text-[10px] text-gray-500">
                          {app.status === 'APPROVED' ? 'Show up at the storefront to start shift' : 'Trust score rating computed'}
                        </p>
                      </div>
                    </div>
                  )}

                </div>

                {/* Connect CTA (WhatsApp coordination, visible on Approved only) */}
                {app.status === 'APPROVED' && (
                  <div className="mt-5 pt-4 border-t border-white/[0.04] flex items-center gap-3">
                    <button
                      onClick={() => alert(`Opening mock WhatsApp connection with Host to coordinate the ${app.title} shift.`)}
                      className="flex-1 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-[12px] font-bold text-white transition-colors flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(99,102,241,0.2)]"
                    >
                      <PhoneCall className="w-3.5 h-3.5" /> Contact via WhatsApp
                    </button>
                  </div>
                )}

              </div>
            ))}
          </div>
        ) : (
          /* Empty Application Logs state */
          <div className="flex flex-col justify-center items-center py-20 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 mb-6">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-[16px] font-bold text-gray-200 font-heading mb-1">No Applications Yet</h3>
            <p className="text-[13px] text-gray-500 max-w-xs leading-relaxed">
              When you swipe right on job cards, your active applications and tracking timelines will appear here.
            </p>
          </div>
        )}

      </main>

      <BottomTabBar />
    </div>
  );
}
