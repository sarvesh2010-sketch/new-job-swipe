"use client";

import React from "react";
import { Sparkles, Layers, Award, User } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";

const navItems = [
  { name: "Swipe", url: "/home", icon: Sparkles },
  { name: "History", url: "/applications", icon: Layers },
  { name: "Trust", url: "/trust-score", icon: Award },
  { name: "Profile", url: "/profile", icon: User },
];

export default function BottomTabBar() {
  return <NavBar items={navItems} />;
}
