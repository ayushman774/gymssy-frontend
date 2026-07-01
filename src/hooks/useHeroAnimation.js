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

    // Collect all current ref values once
    const el = Object.fromEntries(
      Object.entries(refs).map(([key, ref]) => [key, ref.current]),
    );

    // Reduced motion: instant appearance, no animation
    if (prefersReduced) {
      const elements = Object.values(el).filter(Boolean);
      gsap.set(elements, { opacity: 1, y: 0, x: 0 });
      return;
    }

    // ── Guard: ensure critical elements exist ──────────────
    // If any required element is missing, bail out gracefully
    const required = [
      "badge",
      "subheadline",
      "ctaPrimary",
      "ctaSecondary",
      "stats",
      "scrollIndicator",
    ];
    const allPresent = required.every((key) => el[key] !== null);
    if (!allPresent) {
      console.warn(
        "useHeroAnimation: Some required refs are null. Skipping animation.",
      );
      return;
    }

    // ── Set initial states ─────────────────────────────────
    gsap.set(el.badge, { opacity: 0, y: -20 });
    gsap.set(el.subheadline, { opacity: 0, y: 30 });
    gsap.set(el.ctaPrimary, { opacity: 0, y: 20, scale: 0.95 });
    gsap.set(el.ctaSecondary, { opacity: 0, y: 20, scale: 0.95 });
    gsap.set(el.stats, { opacity: 0, y: 20 });
    gsap.set(el.scrollIndicator, { opacity: 0, y: 10 });

    // ── Headline character splitting ───────────────────────
    if (el.headline1) {
      gsap.set(el.headline1, { opacity: 1 });
      const chars1 = el.headline1.querySelectorAll(".char");
      if (chars1.length) {
        gsap.set(chars1, {
          opacity: 0,
          y: 80,
          rotateX: -90,
          transformOrigin: "0% 50% -50px",
        });
      }
    }

    if (el.headline2) {
      gsap.set(el.headline2, { opacity: 1 });
      const chars2 = el.headline2.querySelectorAll(".char");
      if (chars2.length) {
        gsap.set(chars2, {
          opacity: 0,
          y: 80,
          rotateX: -90,
          transformOrigin: "0% 50% -50px",
        });
      }
    }

    // ── Master timeline ────────────────────────────────────
    tl.current = gsap.timeline({ delay: 0.2 });

    // Badge
    tl.current.to(el.badge, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power3.out",
    });

    // Headline line 1 characters
    if (el.headline1) {
      const chars1 = el.headline1.querySelectorAll(".char");
      if (chars1.length) {
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
          "-=0.2",
        );
      }
    }

    // Headline line 2 characters
    if (el.headline2) {
      const chars2 = el.headline2.querySelectorAll(".char");
      if (chars2.length) {
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
          "-=0.4",
        );
      }
    }

    // Subheadline
    tl.current.to(
      el.subheadline,
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      "-=0.3",
    );

    // CTAs — filter out any null values before passing to gsap
    const ctaEls = [el.ctaPrimary, el.ctaSecondary].filter(Boolean);
    if (ctaEls.length) {
      tl.current.to(
        ctaEls,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "back.out(1.7)",
          stagger: 0.12,
        },
        "-=0.4",
      );
    }

    // Stats
    tl.current.to(
      el.stats,
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      "-=0.3",
    );

    // Scroll indicator
    tl.current.to(
      el.scrollIndicator,
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      "-=0.2",
    );

    return () => {
      tl.current?.kill();
    };
  }, [isLoaderDone, prefersReduced]);

  return refs;
};

export default useHeroAnimation;
