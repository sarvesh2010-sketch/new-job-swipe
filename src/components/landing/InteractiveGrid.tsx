"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function InteractiveGrid() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cells = gsap.utils.toArray(".grid-crosshair");
      if (cells.length === 0) return;

      // Create a scroll-scrubbed staggered entrance/scale effect on the crosshairs
      gsap.fromTo(
        cells,
        {
          scale: 0.2,
          opacity: 0,
          rotate: -90,
        },
        {
          scale: 1,
          opacity: 0.25,
          rotate: 0,
          stagger: {
            grid: [10, 6],
            from: "center",
            amount: 1.5,
          },
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Generate a grid of 60 crosshairs (10 rows x 6 columns)
  const totalCells = 60;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
    >
      {/* Decorative tech grid pattern */}
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-10 w-full h-full p-10 opacity-70">
        {[...Array(totalCells)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-center border-[0.5px] border-white/[0.015] relative group"
          >
            {/* Tiny technical crosshair */}
            <span className="grid-crosshair text-[10px] font-mono text-indigo-400/40 select-none">
              +
            </span>
            
            {/* Subtle glow dot in corners of cells */}
            <div className="absolute top-0 left-0 w-0.5 h-0.5 bg-purple-500/10 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
