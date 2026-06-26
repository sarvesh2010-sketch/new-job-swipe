'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import PageTransition from './PageTransition';
import ShaderBackground from './ShaderBackground';

const LoadingScreen = dynamic(() => import('./LoadingScreen'), { ssr: false });

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);

  const handleComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      {/* Dynamic WebGL Shader Background behind all pages */}
      <ShaderBackground />

      {/* Loading screen — shows once per session, then exits */}
      <LoadingScreen onComplete={handleComplete} />

      {/* Main app — fades in after loading */}
      <div
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.4s ease 0.1s',
        }}
      >
        <PageTransition>{children}</PageTransition>
      </div>
    </>
  );
}
