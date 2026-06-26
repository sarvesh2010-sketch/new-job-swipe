'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, BellRing } from 'lucide-react';

export default function RightSidebar() {
  const [activePin, setActivePin] = useState<any>(null);
  const [liveEvent, setLiveEvent] = useState('Ankit K. just swiped on Barista Gig');

  // Simulated live event feed
  useEffect(() => {
    const events = [
      'Ankit K. just swiped on Cafe Barista',
      'Priya S. matched with Nexus Ushering',
      'Vikram R. completed Excel Helper shift',
      'Sneha M. joined Cafe Social Feed design group',
      'Tushar G. earned ₹400 in concert crowd mgmt',
      'Karan D. reputation rating rose to 4.9',
      'Riya J. completed onboarding',
      'Neha T. matched with Data Entry gig',
      'Arjun V. verified college ID',
      'Siddharth P. formed concert ushering buddy group'
    ];
    const interval = setInterval(() => {
      const random = events[Math.floor(Math.random() * events.length)];
      setLiveEvent(random);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const pins = [
    { id: 1, name: 'Chai & Coffee DU', x: 70, y: 60, status: '1 active gig', color: 'bg-emerald-500 shadow-emerald-500/50' },
    { id: 2, name: 'Concert Hall Gate', x: 190, y: 110, status: '2 gigs open', color: 'bg-indigo-500 shadow-indigo-500/50' },
    { id: 3, name: 'Fit Gym Campus', x: 110, y: 160, status: 'No gigs', color: 'bg-gray-500 shadow-gray-500/50' },
    { id: 4, name: 'Admin Block', x: 230, y: 40, status: '1 active gig', color: 'bg-teal-500 shadow-teal-500/50' },
  ];

  return (
    <div className="space-y-6 sticky top-24">
      {/* Interactive Map Visualizer */}
      <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/[0.05] space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-[12.5px] font-bold text-gray-400 flex items-center gap-1.5">
            <Navigation className="w-4 h-4 text-indigo-400 animate-pulse" /> Campus Gig Map
          </h4>
          <span className="text-[9.5px] font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full">Live</span>
        </div>

        {/* Map Grid Canvas */}
        <div className="h-[200px] w-full rounded-xl bg-[#050814] border border-white/[0.04] relative overflow-hidden">
          {/* Custom SVG Grid lines representing roads/paths */}
          <svg className="absolute inset-0 w-full h-full opacity-10">
            <line x1="0" y1="100" x2="350" y2="100" stroke="white" strokeWidth="2" />
            <line x1="160" y1="0" x2="160" y2="250" stroke="white" strokeWidth="2" />
            <path d="M 0 40 Q 150 140 350 200" fill="transparent" stroke="white" strokeWidth="3" />
            {/* Grid mesh */}
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Map Landmarks Labels */}
          <span className="absolute text-[8.5px] font-bold text-gray-600 top-2 left-3 uppercase">North Campus</span>
          <span className="absolute text-[8.5px] font-bold text-gray-600 bottom-2 right-3 uppercase">Science Block</span>

          {/* Glowing Pins */}
          {pins.map((pin) => (
            <button
              key={pin.id}
              onClick={() => setActivePin(pin)}
              className="absolute group focus:outline-none"
              style={{ left: `${pin.x}px`, top: `${pin.y}px`, transform: 'translate(-50%, -50%)' }}
            >
              <span className={`w-3.5 h-3.5 rounded-full border border-black/40 flex items-center justify-center relative cursor-pointer hover:scale-125 transition-transform ${pin.color}`}>
                <span className={`absolute -inset-1 rounded-full animate-ping opacity-75 ${pin.color}`} />
              </span>
            </button>
          ))}

          {/* Hover / Click Pin Details Box */}
          <AnimatePresence>
            {activePin && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 5 }}
                className="absolute bottom-2 left-2 right-2 p-2 rounded-lg bg-[#0b0f19]/95 border border-white/10 backdrop-blur-md shadow-2xl flex items-center justify-between"
              >
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <div>
                    <h5 className="text-[10px] font-bold text-gray-200">{activePin.name}</h5>
                    <p className="text-[8.5px] text-gray-500">{activePin.status}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActivePin(null)}
                  className="text-[9.5px] font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded"
                >
                  Dismiss
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Live Campus Feed Ticker */}
      <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/[0.05] space-y-4">
        <h4 className="text-[12.5px] font-bold text-gray-400 flex items-center gap-1.5">
          <BellRing className="w-4 h-4 text-emerald-400" /> Live Campus Actions
        </h4>
        <div className="bg-[#050814] p-3 border border-white/[0.04] rounded-xl flex items-center gap-2.5 overflow-hidden h-[48px]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <AnimatePresence mode="wait">
            <motion.span
              key={liveEvent}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="text-[10.5px] text-gray-400 font-bold uppercase tracking-wide leading-tight truncate"
            >
              {liveEvent}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
