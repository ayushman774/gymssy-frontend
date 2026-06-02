/**
 * useMouseParallax
 * Tracks normalized mouse position (-1 to 1) with smooth lerp interpolation.
 * Used for 3D camera parallax and content depth effects.
 * Automatically disabled on touch devices.
 */

import { useState, useEffect, useRef, useCallback } from "react";

const lerp = (start, end, factor) => start + (end - start) * factor;

const useMouseParallax = ({
  lerpFactor = 0.05,
  disabled = false,
} = {}) => {
  // Normalized mouse position: -1 to 1 on both axes
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Raw target position (updated on mousemove)
  const targetRef = useRef({ x: 0, y: 0 });

  // Current smoothed position (updated by RAF)
  const currentRef = useRef({ x: 0, y: 0 });

  // RAF id for cleanup
  const rafRef = useRef(null);

  // Whether device supports hover (not touch-primary)
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice(
      window.matchMedia("(hover: none) and (pointer: coarse)").matches
    );
  }, []);

  const handleMouseMove = useCallback((e) => {
    // Normalize to -1 → 1 range
    targetRef.current = {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -((e.clientY / window.innerHeight) * 2 - 1),
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    // Smoothly return to center on mouse leave
    targetRef.current = { x: 0, y: 0 };
  }, []);

  useEffect(() => {
    if (disabled || isTouchDevice) return;

    // Smooth lerp animation loop
    const animate = () => {
      const prev = currentRef.current;
      const target = targetRef.current;

      const next = {
        x: lerp(prev.x, target.x, lerpFactor),
        y: lerp(prev.y, target.y, lerpFactor),
      };

      // Only update state if there's meaningful change (perf optimization)
      if (
        Math.abs(next.x - prev.x) > 0.0001 ||
        Math.abs(next.y - prev.y) > 0.0001
      ) {
        currentRef.current = next;
        setMousePosition({ ...next });
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [disabled, isTouchDevice, lerpFactor, handleMouseMove, handleMouseLeave]);

  return {
    mouseX: isTouchDevice || disabled ? 0 : mousePosition.x,
    mouseY: isTouchDevice || disabled ? 0 : mousePosition.y,
    isTouchDevice,
  };
};

export default useMouseParallax;