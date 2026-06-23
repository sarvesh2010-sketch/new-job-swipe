'use client';

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, PointMaterial, Points } from '@react-three/drei';
import * as THREE from 'three';

// Sample hyper-focused student gig opportunities
const OPPORTUNITIES = [
  {
    id: '1',
    title: 'Barista (Part-Time)',
    provider: 'Chai & Coffee DU',
    pay: '₹150/hr',
    duration: '3 hrs',
    distance: '300m away',
    skills: ['Customer Service', 'Beverages'],
    color: 'indigo',
  },
  {
    id: '2',
    title: 'Event Staff',
    provider: 'Nexus College Fest',
    pay: '₹600/day',
    duration: '4 hrs',
    distance: '800m away',
    skills: ['Logistics', 'Crowd Mgmt'],
    color: 'purple',
  },
  {
    id: '3',
    title: 'Social Coordinator',
    provider: 'The Social Cafe',
    pay: '₹200/hr',
    duration: '2 hrs',
    distance: '500m away',
    skills: ['Instagram', 'Canva'],
    color: 'teal',
  },
  {
    id: '4',
    title: 'Flyer Distributor',
    provider: 'Fit Gym North Campus',
    pay: '₹350/job',
    duration: '2.5 hrs',
    distance: '100m away',
    skills: ['Promo', 'Walking'],
    color: 'rose',
  },
  {
    id: '5',
    title: 'Data Entry Assistant',
    provider: 'EduTech Academy',
    pay: '₹180/hr',
    duration: '4 hrs',
    distance: '1.2 km away',
    skills: ['MS Excel', 'Typing'],
    color: 'emerald',
  },
];

// Individual floating card inside the 3D scene
function OpportunityCard({
  job,
  index,
  total,
  scrollOffset,
}: {
  job: typeof OPPORTUNITIES[0];
  index: number;
  total: number;
  scrollOffset: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Set up 3D trajectory
  const radius = 5.5; // Orbit radius
  const angleOffset = (index / total) * Math.PI * 2;
  const speed = 0.15; // Orbit rotation speed
  const yOffset = (index - (total - 1) / 2) * 1.6; // Staggered heights

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Slow down rotation if hovered
    const currentAngle = t * speed * (hovered ? 0.05 : 1) + angleOffset;
    
    // Orbit math
    const x = Math.cos(currentAngle) * radius;
    const z = Math.sin(currentAngle) * radius;
    const y = yOffset + Math.sin(t * 1.5 + index) * 0.25; // Gentle float bounce

    // Apply scroll parallax zoom-out effect
    const zScrollModifier = scrollOffset * 8; // Move cards back on scroll

    meshRef.current.position.set(x, y, z - zScrollModifier);

    // Keep cards facing directly at the camera (Billboard behavior)
    meshRef.current.quaternion.copy(state.camera.quaternion);
  });

  const glowColors = {
    indigo: 'border-indigo-500/30 hover:border-indigo-500/80 hover:shadow-[0_0_30px_rgba(99,102,241,0.25)]',
    purple: 'border-purple-500/30 hover:border-purple-500/80 hover:shadow-[0_0_30px_rgba(139,92,246,0.25)]',
    teal: 'border-teal-500/30 hover:border-teal-500/80 hover:shadow-[0_0_30px_rgba(45,212,191,0.25)]',
    rose: 'border-rose-500/30 hover:border-rose-500/80 hover:shadow-[0_0_30px_rgba(244,63,94,0.25)]',
    emerald: 'border-emerald-500/30 hover:border-emerald-500/80 hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]',
  };

  const bgGlows = {
    indigo: 'from-indigo-500/10 to-transparent',
    purple: 'from-purple-500/10 to-transparent',
    teal: 'from-teal-500/10 to-transparent',
    rose: 'from-rose-500/10 to-transparent',
    emerald: 'from-emerald-500/10 to-transparent',
  };

  return (
    <mesh ref={meshRef}>
      <Html
        transform
        occlude="blending"
        distanceFactor={6}
        style={{
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: `scale(${hovered ? 1.08 : 0.95})`,
          cursor: 'pointer',
        }}
      >
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`
            w-[280px] p-5 rounded-[24px] select-none
            bg-[#0b0f19]/80 backdrop-blur-xl
            border border-subpixel ${glowColors[job.color as keyof typeof glowColors]}
            transition-all duration-500 ease-out
          `}
        >
          {/* Subtle colored backdrop lighting inside card */}
          <div className={`absolute inset-0 rounded-[24px] bg-gradient-to-br ${bgGlows[job.color as keyof typeof bgGlows]} opacity-50 pointer-events-none`} />

          {/* Card Header */}
          <div className="relative z-10 flex justify-between items-start mb-3">
            <div>
              <p className="text-[11px] font-semibold text-gray-500 tracking-wider uppercase">{job.provider}</p>
              <h4 className="text-[16px] font-bold text-gray-100 mt-0.5 tracking-tight font-heading leading-tight">{job.title}</h4>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-glow-teal">{job.distance}</span>
          </div>

          {/* Card Details */}
          <div className="relative z-10 flex items-baseline gap-2 mb-4">
            <span className="text-[20px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 tracking-tight font-heading">{job.pay}</span>
            <span className="text-[12px] text-gray-500">/ {job.duration} gig</span>
          </div>

          {/* Skill tags */}
          <div className="relative z-10 flex flex-wrap gap-1.5 mb-4">
            {job.skills.map((skill) => (
              <span
                key={skill}
                className="text-[10px] font-medium text-gray-400 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-md"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Swipe indicator */}
          <div className="relative z-10 flex justify-between items-center pt-3 border-t border-white/[0.06] text-gray-500 text-[11px] font-semibold">
            <span>Swipe Right to Apply</span>
            <span className="text-glow-indigo animate-pulse-slow">👉</span>
          </div>
        </div>
      </Html>
    </mesh>
  );
}

// Stars Background particle swarm
function Starfield() {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate random floating particles
  const count = 350;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20; // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20; // z
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Slow rotational swaying of the entire star constellation
    pointsRef.current.rotation.y = t * 0.02;
    pointsRef.current.rotation.x = Math.sin(t * 0.05) * 0.05;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#8b5cf6"
        size={0.06}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
      />
    </Points>
  );
}

// Scene orchestrator coordinating pointers, camera and depth triggers
function GalaxyScene({ scrollOffset }: { scrollOffset: number }) {
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });

  // Handle pointer tracking
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    // Smooth camera depth tracking based on mouse coordinate vectors (Linear & Apple style)
    const targetCamX = mouseRef.current.x * 1.5;
    const targetCamY = mouseRef.current.y * 1.2;
    
    // Smooth transition
    camera.position.x += (targetCamX - camera.position.x) * 0.05;
    camera.position.y += (targetCamY - camera.position.y) * 0.05;
    camera.lookAt(0, 0, -2);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#6366F1" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#2DD4BF" />
      
      {OPPORTUNITIES.map((job, idx) => (
        <OpportunityCard
          key={job.id}
          job={job}
          index={idx}
          total={OPPORTUNITIES.length}
          scrollOffset={scrollOffset}
        />
      ))}
      
      <Starfield />
    </>
  );
}

// Master component containing Canvas initialization
export default function OpportunityGalaxy({ scrollOffset = 0 }: { scrollOffset?: number }) {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color('#050814'), 0);
        }}
      >
        <GalaxyScene scrollOffset={scrollOffset} />
      </Canvas>
    </div>
  );
}
