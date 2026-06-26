'use client';

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SlideData {
  url: string;
  title: string;
  subtitle: string;
}

interface ImageSliderProps extends React.HTMLAttributes<HTMLDivElement> {
  slides: SlideData[];
  interval?: number;
}

const ImageSlider = React.forwardRef<HTMLDivElement, ImageSliderProps>(
  ({ slides, interval = 6000, className, ...props }, ref) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);

    // Effect to handle the interval-based slide transition
    React.useEffect(() => {
      if (slides.length <= 1) return;
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === slides.length - 1 ? 0 : prevIndex + 1
        );
      }, interval);

      // Cleanup the interval on component unmount
      return () => clearInterval(timer);
    }, [slides, interval]);

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full h-full overflow-hidden bg-black",
          className
        )}
        {...props}
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.7, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={slides[currentIndex].url}
              alt={slides[currentIndex].title}
              className="w-full h-full object-cover select-none pointer-events-none"
            />
            {/* Dark radial overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_60%)]" />
          </motion.div>
        </AnimatePresence>

        {/* Floating details overlay */}
        <div className="absolute inset-x-0 bottom-16 px-10 text-left z-10 flex flex-col justify-end h-1/2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3"
            >
              <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full w-fit">
                JobSwipe Gigs
              </span>
              <h2 className="text-[28px] sm:text-[34px] font-black text-gray-100 font-heading leading-tight tracking-tight max-w-md">
                {slides[currentIndex].title}
              </h2>
              <p className="text-[14px] text-gray-400 font-medium leading-relaxed max-w-sm">
                {slides[currentIndex].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-10 flex gap-2.5 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                currentIndex === index 
                  ? "w-7 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" 
                  : "w-2.5 bg-white/20 hover:bg-white/40"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    );
  }
);

ImageSlider.displayName = "ImageSlider";

export { ImageSlider };
