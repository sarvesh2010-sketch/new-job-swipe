'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sliders, MapPin, Clock, Shield } from 'lucide-react';

interface Filters {
  radius: number;
  payMin: number;
  maxHours: number;
  skills: string[];
}

interface FiltersPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: Filters;
  onApplyFilters: (newFilters: Filters) => void;
}

const AVAILABLE_SKILLS = [
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

export default function FiltersPanel({ isOpen, onClose, filters, onApplyFilters }: FiltersPanelProps) {
  const [radius, setRadius] = useState(filters.radius);
  const [payMin, setPayMin] = useState(filters.payMin);
  const [maxHours, setMaxHours] = useState(filters.maxHours);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(filters.skills);

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleApply = () => {
    onApplyFilters({
      radius,
      payMin,
      maxHours,
      skills: selectedSkills
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Bottom Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto p-6 rounded-t-[36px] bg-deep/90 border-t border-white/[0.08] backdrop-blur-2xl shadow-[0_-12px_40px_rgba(0,0,0,0.5)]"
          >
            {/* Drawer Bevel Handle */}
            <div className="w-10 h-1 bg-white/10 rounded-full mx-auto mb-6" />

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[18px] font-bold text-gray-100 font-heading flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" /> Filter Nearby Gigs
              </h3>
              <button 
                onClick={onClose} 
                className="p-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable content inside drawer */}
            <div className="space-y-6 max-h-[380px] overflow-y-auto pr-1">
              
              {/* Radius Filter */}
              <div>
                <div className="flex justify-between text-[13px] font-semibold mb-2">
                  <span className="text-gray-400 flex items-center gap-1.5"><MapPin className="w-4 h-4 text-glow-teal" /> Maximum Distance</span>
                  <span className="text-glow-teal">{radius} km radius</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={radius}
                  onChange={(e) => setRadius(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Pay Minimum Filter */}
              <div>
                <div className="flex justify-between text-[13px] font-semibold mb-2">
                  <span className="text-gray-400 flex items-center gap-1.5">⚡ Minimum Payout</span>
                  <span className="text-glow-indigo">₹{payMin} / shift</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  value={payMin}
                  onChange={(e) => setPayMin(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Duration Hours Filter */}
              <div>
                <div className="flex justify-between text-[13px] font-semibold mb-2">
                  <span className="text-gray-400 flex items-center gap-1.5"><Clock className="w-4 h-4 text-glow-purple" /> Max Shift Duration</span>
                  <span className="text-glow-purple">{maxHours} hours</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="0.5"
                  value={maxHours}
                  onChange={(e) => setMaxHours(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Skills Tags Filter */}
              <div>
                <span className="text-[13px] font-semibold text-gray-400 mb-3 block">Filter by Skills</span>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_SKILLS.map((skill) => {
                    const selected = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`
                          px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all
                          ${selected 
                            ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300' 
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

            </div>

            {/* Apply Button */}
            <button
              onClick={handleApply}
              className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-[13px] font-bold text-white shadow-[0_4px_15px_rgba(99,102,241,0.2)]"
            >
              Apply Filter Mappings
            </button>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
