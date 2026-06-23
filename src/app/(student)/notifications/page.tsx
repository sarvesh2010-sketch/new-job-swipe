'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import BottomTabBar from '@/components/shared/BottomTabBar';
import { Bell, Award, Sparkles, PhoneCall, ChevronRight } from 'lucide-react';

const NOTIFICATIONS = [
  {
    id: 'n1',
    type: 'APPROVAL',
    title: 'Application Approved!',
    body: 'Your application for DU Cafe Barista was approved by host Priya Nair. Tap to coordinate your 3-hour shift on WhatsApp.',
    time: '10 mins ago',
    link: '/applications'
  },
  {
    id: 'n2',
    type: 'RATING',
    title: 'Trust Score Updated!',
    body: 'Host Priya rated your Gym Flyer Distributor gig 5.0 stars for punctuality and quality. Your trust rating grew by +0.1 points.',
    time: '2 hours ago',
    link: '/trust-score'
  },
  {
    id: 'n3',
    type: 'MATCH',
    title: 'New Match Found!',
    body: 'A new gig "Cafe Social Feed Designer" matching your Instagram/Canva skills has just been posted 500m away.',
    time: '5 hours ago',
    link: '/home'
  }
];

export default function StudentNotificationsPage() {
  const router = useRouter();

  const getIcon = (type: string) => {
    switch (type) {
      case 'APPROVAL':
        return <PhoneCall className="w-5 h-5 text-glow-indigo" />;
      case 'RATING':
        return <Award className="w-5 h-5 text-glow-emerald" />;
      case 'MATCH':
        return <Sparkles className="w-5 h-5 text-glow-purple" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const getIconStyle = (type: string) => {
    switch (type) {
      case 'APPROVAL': return 'bg-indigo-500/10 border-indigo-500/20';
      case 'RATING': return 'bg-emerald-500/10 border-emerald-500/20';
      case 'MATCH': return 'bg-purple-500/10 border-purple-500/20';
      default: return 'bg-white/5 border-white/10';
    }
  };

  return (
    <div className="min-h-screen bg-void text-gray-100 flex flex-col justify-between pb-28">
      <Navbar title="Notifications" showBack />

      <main className="flex-1 max-w-md mx-auto w-full p-4 space-y-4">
        
        {NOTIFICATIONS.map((notif) => (
          <div
            key={notif.id}
            onClick={() => router.push(notif.link)}
            className="p-5 rounded-[28px] bg-[#0b0f19]/80 border border-white/[0.08] backdrop-blur-xl hover:border-white/15 transition-all flex items-start gap-4 cursor-pointer relative group"
          >
            {/* Visual accent indicator */}
            <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-indigo-500/5 blur-[40px] -z-10 rounded-full" />

            {/* Icon Block */}
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${getIconStyle(notif.type)}`}>
              {getIcon(notif.type)}
            </div>

            {/* Notification content */}
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-baseline">
                <h4 className="text-[13px] font-bold text-gray-200 group-hover:text-indigo-400 transition-colors leading-none">{notif.title}</h4>
                <span className="text-[9px] text-gray-500 font-semibold">{notif.time}</span>
              </div>
              <p className="text-[12px] text-gray-400 leading-relaxed pr-2">
                {notif.body}
              </p>
            </div>

            <ChevronRight className="w-4 h-4 text-gray-600 self-center shrink-0 group-hover:translate-x-1 group-hover:text-indigo-400 transition-all" />

          </div>
        ))}

      </main>

      <BottomTabBar />
    </div>
  );
}
