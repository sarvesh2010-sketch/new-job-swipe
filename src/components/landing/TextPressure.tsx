"use client";

import { useEffect, useRef, useState, useMemo, useCallback, useId } from "react";

// Original React Bits helper — maps cursor distance to a font-axis value.
// dist = 0 (cursor ON char)   → maxVal + minVal  (full effect)
// dist = maxDist (far away)   → minVal            (resting state)
const getAttr = (distance: number, maxDist: number, minVal: number, maxVal: number) => {
  const val = maxVal - Math.abs((maxVal * distance) / maxDist);
  return Math.max(minVal, val + minVal);
};

const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
};

interface TextPressureProps {
  text?: string;
  fontFamily?: string;
  fontUrl?: string;
  width?: boolean;
  weight?: boolean;
  italic?: boolean;
  alpha?: boolean;
  flex?: boolean;
  stroke?: boolean;
  scale?: boolean;
  textColor?: string;
  strokeColor?: string;
  className?: string;
  minFontSize?: number;
  scaleFactor?: number;
}

const TextPressure = ({
  text = "Compressa",
  fontFamily = "Roboto Flex",
  fontUrl = "https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght,GRAD@8..144,25..151,100..1000,-200..150&display=swap",
  width = true,
  weight = true,
  italic = true,
  alpha = false,
  flex = true,
  stroke = false,
  scale = false,
  textColor = "#FFFFFF",
  strokeColor = "#FF0000",
  className = "",
  minFontSize = 24,
  scaleFactor = 1.6,
}: TextPressureProps) => {
  const reactId = useId();
  const id = useMemo(() => `tp-${reactId.replace(/:/g, "")}`, [reactId]);

  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const spansRef = useRef<(HTMLSpanElement | null)[]>([]);

  // Cached layout coordinates and title width to prevent layout thrashing
  const spanCoordsRef = useRef<{ x: number; y: number }[]>([]);
  const titleWidthRef = useRef<number>(0);

  // Smoothed mouse position (lerped towards raw cursor)
  const mouseRef = useRef({ x: 0, y: 0 });
  // Raw cursor position — updated by global mousemove
  const cursorRef = useRef({ x: 0, y: 0 });

  const [fontSize, setFontSize] = useState(minFontSize);
  const [scaleY, setScaleY] = useState(1);
  const [lineHeight, setLineHeight] = useState(1);

  const chars = useMemo(() => text.split(""), [text]);

  // Cache coordinates helper
  const updateCachedCoords = useCallback(() => {
    if (!titleRef.current) return;

    // Cache the title width
    titleWidthRef.current = titleRef.current.getBoundingClientRect().width;

    // Cache document-relative character centers
    const coords: { x: number; y: number }[] = [];
    spansRef.current.forEach((span) => {
      if (!span) {
        coords.push({ x: 0, y: 0 });
        return;
      }
      const rect = span.getBoundingClientRect();
      coords.push({
        x: rect.left + rect.width / 2 + window.scrollX,
        y: rect.top + rect.height / 2 + window.scrollY,
      });
    });
    spanCoordsRef.current = coords;
  }, []);

  // ── Mouse tracking: global so the effect works anywhere on page ──────────
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorRef.current.x = e.pageX;
      cursorRef.current.y = e.pageY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        cursorRef.current.x = e.touches[0].pageX;
        cursorRef.current.y = e.touches[0].pageY;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    // Seed mouse position at container center so text is readable on load
    if (containerRef.current) {
      const { left, top, width: cw, height: ch } = containerRef.current.getBoundingClientRect();
      mouseRef.current = {
        x: left + cw / 2 + window.scrollX,
        y: top + ch / 2 + window.scrollY,
      };
      cursorRef.current = { ...mouseRef.current };
    }

    // Cache positions initially
    updateCachedCoords();

    // Re-cache once fonts are fully loaded and layout settles
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        updateCachedCoords();
      });
    }

    // Safe delayed update for dynamically rendered elements
    const timer = setTimeout(updateCachedCoords, 600);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      clearTimeout(timer);
    };
  }, [updateCachedCoords]);

  // ── Font-size fitting ────────────────────────────────────────────────────
  const setSize = useCallback(() => {
    if (!containerRef.current || !titleRef.current) return;

    const { width: containerW, height: containerH } =
      containerRef.current.getBoundingClientRect();

    let newFontSize = containerW / (chars.length / scaleFactor);
    newFontSize = Math.max(newFontSize, minFontSize);
    setFontSize(newFontSize);
    setScaleY(1);
    setLineHeight(1);

    requestAnimationFrame(() => {
      if (!titleRef.current || !scale) {
        updateCachedCoords();
        return;
      }
      const { height: textH } = titleRef.current.getBoundingClientRect();
      if (textH > 0) {
        const r = containerH / textH;
        setScaleY(r);
        setLineHeight(r);
      }
      updateCachedCoords();
    });
  }, [chars.length, minFontSize, scale, scaleFactor, updateCachedCoords]);

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;
    const debounced = () => {
      clearTimeout(timerId);
      timerId = setTimeout(setSize, 100);
    };
    debounced();
    window.addEventListener("resize", debounced);
    return () => {
      clearTimeout(timerId);
      window.removeEventListener("resize", debounced);
    };
  }, [setSize]);

  // ── Animation loop — faithful to original React Bits getAttr logic ─────────
  useEffect(() => {
    let rafId: number;

    const animate = () => {
      // Smooth-follow cursor with natural lag
      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 15;
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 15;

      if (titleRef.current) {
        // Influence radius = half the title width (matches original)
        const maxDist = titleWidthRef.current / 2 || 300;

        spansRef.current.forEach((span, idx) => {
          if (!span) return;

          const charCenter = spanCoordsRef.current[idx] || { x: 0, y: 0 };
          const d = dist(mouseRef.current, charCenter);

          // Original React Bits axis ranges:
          //   wdth   5 → 200  (narrow at rest, wide under cursor)
          //   wght 100 → 900  (thin at rest, black under cursor)
          //   ital   0 → 1    (upright at rest, full italic under cursor)
          //   alpha  0 → 1    (ghost at rest, solid under cursor)
          const wdth = width  ? Math.floor(getAttr(d, maxDist, 5,   200)) : 100;
          const wght = weight ? Math.floor(getAttr(d, maxDist, 100, 900)) : 400;
          const ital = italic ? getAttr(d, maxDist, 0, 1).toFixed(2)      : "0";
          const opac = alpha  ? getAttr(d, maxDist, 0, 1).toFixed(2)      : "1";

          const fvs = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${ital}`;
          if (span.style.fontVariationSettings !== fvs) {
            span.style.fontVariationSettings = fvs;
          }
          if (span.style.opacity !== opac) {
            span.style.opacity = opac;
          }
        });
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(rafId);
  }, [width, weight, italic, alpha]);

  // ── Scoped CSS — uses unique ID to avoid cross-component pollution ──────
  const styleElement = useMemo(
    () => (
      <style>{`
        @import url('${fontUrl}');

        #${id}-title.flex-pressure {
          display: flex;
          justify-content: space-between;
          width: 100%;
        }
        #${id}-title .stroke-pressure-span {
          position: relative;
          color: ${textColor};
        }
        #${id}-title .stroke-pressure-span::after {
          content: attr(data-char);
          position: absolute;
          left: 0;
          top: 0;
          color: transparent;
          z-index: -1;
          -webkit-text-stroke-width: 3px;
          -webkit-text-stroke-color: ${strokeColor};
        }
        #${id}-title {
          color: ${textColor};
        }
      `}</style>
    ),
    [fontUrl, textColor, strokeColor, id]
  );

  const titleClassName = [
    flex ? "flex-pressure" : "",
    stroke ? "stroke-pressure" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width: "100%", height: "100%", background: "transparent" }}
    >
      {styleElement}
      <h1
        id={`${id}-title`}
        ref={titleRef}
        className={titleClassName}
        style={{
          fontFamily,
          textTransform: "uppercase",
          fontSize,
          lineHeight,
          transform: `scale(1, ${scaleY})`,
          transformOrigin: "center top",
          margin: 0,
          textAlign: "center",
          userSelect: "none",
          whiteSpace: "nowrap",
          fontWeight: 100,
          width: "100%",
        }}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            ref={(el) => { spansRef.current[i] = el; }}
            data-char={char}
            className={stroke ? "stroke-pressure-span" : ""}
            style={{
              display: "inline-block",
              color: stroke ? undefined : textColor,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h1>
    </div>
  );
};

export default TextPressure;
