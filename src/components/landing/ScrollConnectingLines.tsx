"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function ScrollConnectingLines() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef1 = useRef<SVGPathElement>(null);
  const pathRef1GlowInner = useRef<SVGPathElement>(null);
  const pathRef1GlowOuter = useRef<SVGPathElement>(null);
  const pathRef2 = useRef<SVGPathElement>(null);
  const particleRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const path1 = pathRef1.current;
      const path1GlowInner = pathRef1GlowInner.current;
      const path1GlowOuter = pathRef1GlowOuter.current;
      const path2 = pathRef2.current;
      const particle = particleRef.current;

      if (path1 && path1GlowInner && path1GlowOuter) {
        const length = path1.getTotalLength();
        // Set initial dash settings to hide all three layers
        gsap.set([path1, path1GlowInner, path1GlowOuter], {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        // Precalculate 300 points along the path for O(1) particle tracking
        const steps = 300;
        const pointsList: { x: number; y: number }[] = [];
        for (let i = 0; i <= steps; i++) {
          const pt = path1.getPointAtLength((i / steps) * length);
          pointsList.push({ x: pt.x, y: pt.y });
        }

        // Animate drawing the main line and its glow layers synced to scroll
        gsap.to([path1, path1GlowInner, path1GlowOuter], {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
            onUpdate: (self) => {
              if (particle) {
                const progress = self.progress;
                // Fade in/out particle near ends
                if (progress > 0.005 && progress < 0.995) {
                  gsap.set(particle, { opacity: 1 });
                } else {
                  gsap.set(particle, { opacity: 0 });
                }
                
                // Fetch cached points and linearly interpolate for high performance
                const idx = progress * steps;
                const iFloor = Math.floor(idx);
                const iCeil = Math.min(steps, iFloor + 1);
                const t = idx - iFloor;
                
                const p0 = pointsList[iFloor];
                const p1 = pointsList[iCeil];
                
                if (p0 && p1) {
                  const x = p0.x + (p1.x - p0.x) * t;
                  const y = p0.y + (p1.y - p0.y) * t;
                  gsap.set(particle, { x, y });
                }
              }
            },
          },
        });
      }

      if (path2) {
        const length = path2.getTotalLength();
        gsap.set(path2, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        // Animate the secondary line slightly faster/delayed
        gsap.to(path2, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top+=10% top",
            end: "bottom-=5% bottom",
            scrub: 0.8,
          },
        });
      }

      // Staggered node pulse animations as they enter the screen
      const nodeElements = gsap.utils.toArray(".connector-node");
      nodeElements.forEach((node: any) => {
        gsap.fromTo(
          node,
          { r: 5, fillOpacity: 0.35, strokeWidth: 0, strokeOpacity: 0 },
          {
            r: 10,
            fillOpacity: 1,
            strokeWidth: 6,
            strokeOpacity: 0.4,
            duration: 0.6,
            ease: "power2.out",
            yoyo: true,
            repeat: 1,
            scrollTrigger: {
              trigger: containerRef.current,
              start: () => {
                const cy = parseFloat(node.getAttribute("cy") || "0");
                const pct = cy / 6000;
                return `top+=${pct * 100}% 60%`;
              },
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 1200 6000"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main glowing gradient */}
          <linearGradient id="glowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff5005" stopOpacity="0.8" />
            <stop offset="30%" stopColor="#d0bce1" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#dbba95" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ff5005" stopOpacity="0.8" />
          </linearGradient>

          {/* Secondary subtle gradient */}
          <linearGradient id="subGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff5005" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#dbba95" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#d0bce1" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Secondary background line */}
        <path
          ref={pathRef2}
          d="M 400,200 C 200,600 1000,900 1000,1400 C 1000,1900 100,2100 100,2600 C 100,3100 1100,3400 1100,3900 C 1100,4400 300,4700 300,5200"
          stroke="url(#subGradient)"
          strokeWidth="1.5"
          strokeDasharray="6 6"
          fill="none"
        />

        {/* Glow simulation layers: Outer low-opacity thick line */}
        <path
          ref={pathRef1GlowOuter}
          d="M 800,400 C 600,800 200,800 200,1200 C 200,1600 900,1800 900,2200 C 900,2600 150,2800 150,3200 C 150,3600 850,3800 850,4200 C 850,4600 500,4800 500,5200"
          stroke="url(#glowGradient)"
          strokeWidth="16"
          strokeLinecap="round"
          fill="none"
          opacity="0.12"
        />

        {/* Glow simulation layers: Mid-thick medium-opacity line */}
        <path
          ref={pathRef1GlowInner}
          d="M 800,400 C 600,800 200,800 200,1200 C 200,1600 900,1800 900,2200 C 900,2600 150,2800 150,3200 C 150,3600 850,3800 850,4200 C 850,4600 500,4800 500,5200"
          stroke="url(#glowGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          opacity="0.3"
        />

        {/* Main sharp line */}
        <path
          ref={pathRef1}
          d="M 800,400 C 600,800 200,800 200,1200 C 200,1600 900,1800 900,2200 C 900,2600 150,2800 150,3200 C 150,3600 850,3800 850,4200 C 850,4600 500,4800 500,5200"
          stroke="url(#glowGradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Path-following glowing particle overlay (simulated glow) */}
        <g ref={particleRef} opacity="0">
          <circle cx="0" cy="0" r="16" fill="#dbba95" opacity="0.12" />
          <circle cx="0" cy="0" r="9" fill="#dbba95" opacity="0.35" />
          <circle cx="0" cy="0" r="5.5" fill="#dbba95" />
          <circle cx="0" cy="0" r="12" fill="none" stroke="#dbba95" strokeWidth="1.5" strokeOpacity="0.6" />
        </g>

        {/* Decorative nodes at section transition points */}
        <g>
          <circle className="connector-node" cx="800" cy="400" r="5" fill="#ff5005" stroke="#ff5005" strokeWidth="0" strokeOpacity="0.4" fillOpacity="0.35" />
          <circle className="connector-node" cx="200" cy="1200" r="5" fill="#d0bce1" stroke="#d0bce1" strokeWidth="0" strokeOpacity="0.4" fillOpacity="0.35" />
          <circle className="connector-node" cx="900" cy="2200" r="5" fill="#dbba95" stroke="#dbba95" strokeWidth="0" strokeOpacity="0.4" fillOpacity="0.35" />
          <circle className="connector-node" cx="150" cy="3200" r="5" fill="#ff5005" stroke="#ff5005" strokeWidth="0" strokeOpacity="0.4" fillOpacity="0.35" />
          <circle className="connector-node" cx="850" cy="4200" r="5" fill="#dbba95" stroke="#dbba95" strokeWidth="0" strokeOpacity="0.4" fillOpacity="0.35" />
          <circle className="connector-node" cx="500" cy="5200" r="5" fill="#ff5005" stroke="#ff5005" strokeWidth="0" strokeOpacity="0.4" fillOpacity="0.35" />
        </g>
      </svg>
    </div>
  );
}
