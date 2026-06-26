'use client'

import React, { useState } from "react"
import {
  AnimationOptions,
  motion,
  stagger,
  useAnimate,
} from "framer-motion"

// Custom dependency-free debounce implementation supporting leading & trailing options
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options?: { leading?: boolean; trailing?: boolean }
) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: any[] | null = null;
  let lastCallTime = 0;

  return function(this: any, ...args: Parameters<T>) {
    const context = this;
    const now = Date.now();
    const isLeading = options?.leading && (!timeout || (now - lastCallTime >= wait));

    lastArgs = args;
    lastCallTime = now;

    if (timeout) {
      clearTimeout(timeout);
    }

    if (isLeading) {
      func.apply(context, args);
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);
    } else if (options?.trailing !== false) {
      timeout = setTimeout(() => {
        func.apply(context, lastArgs!);
        timeout = null;
      }, wait);
    }
  };
}

interface TextProps {
  label: string
  reverse?: boolean
  transition?: AnimationOptions
  staggerDuration?: number
  staggerFrom?: "first" | "last" | "center" | number
  className?: string
  onClick?: () => void
}

export function LetterSwapForward({
  label,
  reverse = true,
  transition = {
    type: "spring",
    duration: 0.7,
  },
  staggerDuration = 0.03,
  staggerFrom = "first",
  className,
  onClick,
  ...props
}: TextProps) {
  const [scope, animate] = useAnimate()
  const [blocked, setBlocked] = useState(false)

  const hoverStart = () => {
    if (blocked) return

    setBlocked(true)

    // Function to merge user transition with stagger and delay
    const mergeTransition = (baseTransition: AnimationOptions) => ({
      ...baseTransition,
      delay: stagger(staggerDuration, {
        from: staggerFrom,
      }),
    })

    animate(
      ".letter",
      { y: reverse ? "100%" : "-100%" },
      mergeTransition(transition)
    ).then(() => {
      animate(
        ".letter",
        {
          y: 0,
        },
        {
          duration: 0,
        }
      ).then(() => {
        setBlocked(false)
      })
    })

    animate(
      ".letter-secondary",
      {
        top: "0%",
      },
      mergeTransition(transition)
    ).then(() => {
      animate(
        ".letter-secondary",
        {
          top: reverse ? "-100%" : "100%",
        },
        {
          duration: 0,
        }
      )
    })
  }

  return (
    <span
      className={`inline-flex justify-center items-center relative overflow-hidden ${className}`}
      onMouseEnter={hoverStart}
      onClick={onClick}
      ref={scope}
      {...props}
    >
      <span className="sr-only">{label}</span>

      {label.split("").map((letter: string, i: number) => {
        return (
          <span className="whitespace-pre relative flex" key={i}>
            <motion.span className={`relative letter`} style={{ top: 0 }}>
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
            <motion.span
              className="absolute letter-secondary w-full text-center"
              aria-hidden={true}
              style={{ top: reverse ? "-100%" : "100%", left: 0 }}
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          </span>
        )
      })}
    </span>
  )
}

export function LetterSwapPingPong({
  label,
  reverse = true,
  transition = {
    type: "spring",
    duration: 0.7,
  },
  staggerDuration = 0.03,
  staggerFrom = "first",
  className,
  onClick,
  ...props
}: TextProps) {
  const [scope, animate] = useAnimate()
  const [isHovered, setIsHovered] = useState(false)

  const mergeTransition = (baseTransition: AnimationOptions) => ({
    ...baseTransition,
    delay: stagger(staggerDuration, {
      from: staggerFrom,
    }),
  })

  const hoverStart = debounce(
    () => {
      if (isHovered) return
      setIsHovered(true)

      animate(
        ".letter",
        { y: reverse ? "100%" : "-100%" },
        mergeTransition(transition)
      )

      animate(
        ".letter-secondary",
        {
          top: "0%",
        },
        mergeTransition(transition)
      )
    },
    100,
    { leading: true, trailing: true }
  )

  const hoverEnd = debounce(
    () => {
      setIsHovered(false)

      animate(
        ".letter",
        {
          y: 0,
        },
        mergeTransition(transition)
      )

      animate(
        ".letter-secondary",
        {
          top: reverse ? "-100%" : "100%",
        },
        mergeTransition(transition)
      )
    },
    100,
    { leading: true, trailing: true }
  )

  return (
    <motion.span
      className={`inline-flex justify-center items-center relative overflow-hidden ${className}`}
      onHoverStart={hoverStart}
      onHoverEnd={hoverEnd}
      onClick={onClick}
      ref={scope}
      {...props}
    >
      <span className="sr-only">{label}</span>

      {label.split("").map((letter: string, i: number) => {
        return (
          <span className="whitespace-pre relative flex" key={i}>
            <motion.span className={`relative letter`} style={{ top: 0 }}>
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
            <motion.span
              className="absolute letter-secondary w-full text-center"
              aria-hidden={true}
              style={{ top: reverse ? "-100%" : "100%", left: 0 }}
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          </span>
        )
      })}
    </motion.span>
  )
}
