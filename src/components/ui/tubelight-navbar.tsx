"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

interface NavBarProps {
  items: NavItem[];
  className?: string;
}

export function NavBar({ items, className }: NavBarProps) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(items[0]?.name || "");

  // Sync active tab with route pathnames
  useEffect(() => {
    const currentPath = pathname || "";
    const matchingItem = items.find((item) => {
      if (item.url === "/home") {
        return currentPath === "/home" || currentPath.startsWith("/job/");
      }
      return currentPath === item.url;
    });

    if (matchingItem) {
      setActiveTab(matchingItem.name);
    }
  }, [pathname, items]);

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center w-full max-w-fit px-4",
        className
      )}
    >
      <nav className="flex items-center justify-center gap-2 bg-black/60 border border-white/10 backdrop-blur-xl py-2 px-3 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;

          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "relative cursor-pointer text-xs font-semibold px-4 py-2 rounded-full transition-colors duration-300 focus:outline-none flex items-center justify-center gap-2 select-none",
                isActive ? "text-indigo-400 bg-white/[0.03]" : "text-gray-400 hover:text-indigo-300"
              )}
            >
              {/* Responsive Text on Desktop, Icon on Mobile */}
              <span className="hidden sm:inline">{item.name}</span>
              <span className="sm:hidden">
                <Icon size={16} strokeWidth={isActive ? 2.5 : 2.0} />
              </span>

              {/* Glowing Tubelight (Lamp) Active Indicator */}
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-indigo-500/5 rounded-full -z-10"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-indigo-500 rounded-t-full">
                    {/* Multi-layered glow to simulate neon tubelight */}
                    <div className="absolute w-12 h-6 bg-indigo-500/25 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-indigo-500/20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-indigo-500/15 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
