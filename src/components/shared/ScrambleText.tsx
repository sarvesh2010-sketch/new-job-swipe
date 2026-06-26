'use client';

import React, { useEffect, useState } from 'react';

interface ScrambleTextProps {
  text: string;
  duration?: number; // total scramble duration in ms
  delay?: number; // delay before starting in ms
  className?: string;
}

export default function ScrambleText({
  text,
  duration = 800,
  delay = 0,
  className = '',
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    // Initial placeholder scramble
    setDisplayText(
      text
        .split('')
        .map((char) => (char === ' ' ? ' ' : '-'))
        .join('')
    );

    const timeoutId = setTimeout(() => {
      let frame = 0;
      const totalFrames = 25;
      const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefghjkmnpqrstwxyz23456789!@#%&*';
      const intervalTime = duration / totalFrames;

      const interval = setInterval(() => {
        setDisplayText(
          text
            .split('')
            .map((char, i) => {
              if (char === ' ') return ' ';
              const progress = frame / totalFrames;
              // Resolve characters from left to right
              if (i / text.length < progress) {
                return text[i];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('')
        );

        frame++;
        if (frame > totalFrames) {
          clearInterval(interval);
          setDisplayText(text);
        }
      }, intervalTime);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [text, duration, delay]);

  return <span className={className}>{displayText}</span>;
}
