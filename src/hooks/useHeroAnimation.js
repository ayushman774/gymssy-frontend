/**
 * useHeroAnimation
 * Orchestrates the complete Hero section entrance animation sequence.
 * Uses GSAP SplitText for character-by-character headline reveal.
 *
 * Animation Timeline:
 *  0.0s  → Badge slides + fades in
 *  0.3s  → H1 line 1 characters stagger in
 *  0.6s  → H1 line 2 characters stagger in
 *  1.0s  → Subheadline fades up
 *  1.2s  → CTA buttons appear with bounce
 *  1.5s  → Stats row fades in
 *  1.8s  → Scroll indicator pulses in
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import useReducedMotion from "./useReducedMotion";

const useHeroAnimation = ({ isLoaderDone = true } = {}) => {
  const prefersReduced = useReducedMotion();
  const tl = useRef(null);

  // Element refs
  const refs = {
    badge: useRef(null),
    headline1: useRef(null),
    headline2: useRef(null),
    subheadline: useRef(null),
    ctaPrimary: useRef(null),
    ctaSecondary: useRef(null),
    stats: useRef(null),
    scrollIndicator: useRef(null),
    overlay: useRef(null),
  };

  useEffect(() => {
    if (!isLoaderDone) return;

    // Kill any existing timeline
    if (tl.current) tl.current.kill();

    // Reduced motion: instant appearance, no animation
    if (prefersReduced) {
      const elements = Object.values(refs)
        .map((r) => r.current)
        .filter(Boolean);
      gsap.set(elements, { opacity: 1, y: 0, x: 0 });
      return;
    }

    // ── Set initial states ─────────────────────────────────
    gsap.set(refs.badge.current, { opacity: 0, y: -20 });
    gsap.set(refs.subheadline.current, { opacity: 0, y: 30 });
    gsap.set(refs.ctaPrimary.current, { opacity: 0, y: 20, scale: 0.95 });
    gsap.set(refs.ctaSecondary.current, { opacity: 0, y: 20, scale: 0.95 });
    gsap.set(refs.stats.current, { opacity: 0, y: 20 });
    gsap.set(refs.scrollIndicator.current, { opacity: 0, y: 10 });

    // ── Headline character splitting ───────────────────────
    // We manually wrap each character since SplitText requires license
    // This is handled in the component via CSS animation classes
    if (refs.headline1.current) {
      gsap.set(refs.headline1.current, { opacity: 1 });
      const chars1 = refs.headline1.current.querySelectorAll(".char");
      gsap.set(chars1, { opacity: 0, y: 80, rotateX: -90, transformOrigin: "0% 50% -50px" });
    }
    if (refs.headline2.current) {
      gsap.set(refs.headline2.current, { opacity: 1 });
      const chars2 = refs.headline2.current.querySelectorAll(".char");
      gsap.set(chars2, { opacity: 0, y: 80, rotateX: -90, transformOrigin: "0% 50% -50px" });
    }

    // ── Master timeline ───────────────────────────────────
    tl.current = gsap.timeline({ delay: 0.2 });

    // Badge
    tl.current.to(refs.badge.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power3.out",
    });

    // Headline line 1 characters
    if (refs.headline1.current) {
      const chars1 = refs.headline1.current.querySelectorAll(".char");
      tl.current.to(
        chars1,
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.7,
          ease: "power4.out",
          stagger: 0.03,
        },
        "-=0.2"
      );
    }

    // Headline line 2 characters
    if (refs.headline2.current) {
      const chars2 = refs.headline2.current.querySelectorAll(".char");
      tl.current.to(
        chars2,
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.7,
          ease: "power4.out",
          stagger: 0.03,
        },
        "-=0.4"
      );
    }

    // Subheadline
    tl.current.to(
      refs.subheadline.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      },
      "-=0.3"
    );

    // CTAs (staggered)
    tl.current.to(
      [refs.ctaPrimary.current, refs.ctaSecondary.current],
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: "back.out(1.7)",
        stagger: 0.12,
      },
      "-=0.4"
    );

    // Stats
    tl.current.to(
      refs.stats.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
      },
      "-=0.3"
    );

    // Scroll indicator
    tl.current.to(
      refs.scrollIndicator.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      },
      "-=0.2"
    );

    return () => {
      tl.current?.kill();
    };
  }, [isLoaderDone, prefersReduced]);

  return refs;
};

export default useHeroAnimation;