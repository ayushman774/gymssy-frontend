/**
 * APEX FITNESS — Hero Section
 *
 * The most important section of the entire website.
 * Combines:
 *  - Cinematic video background
 *  - React Three Fiber 3D scene (athlete + particles + lights)
 *  - GSAP entrance animations
 *  - Mouse parallax
 *  - Content overlay
 *  - Scroll indicator
 *
 * Performance:
 *  - 3D scene lazy loaded
 *  - Mobile gets static image fallback
 *  - GPU tier detection
 *  - Reduced particle count on low-end devices
 */

import { lazy, Suspense, useRef, useState, useEffect } from "react";
import useMouseParallax from "../../../../hooks/useMouseParallax";
import useHeroAnimation from "../../../../hooks/useHeroAnimation";
import useReducedMotion from "../../../../hooks/useReducedMotion";
import HeroContent from "./HeroContent";
import HeroScrollIndicator from "./HeroScrollIndicator";
import styles from "./Hero.module.css";

// Lazy load the heavy 3D scene
const HeroScene = lazy(() => import("../../../three/HeroScene/HeroScene"));

// ── Video sources (Pexels free video) ────────────────────────────────────
const VIDEO_SOURCES = {
  // Dark cinematic gym footage — replace with actual video files in production
  // These are placeholder URLs — use downloaded WebM/MP4 in /public/videos/
  webm: "/videos/hero-loop.webm",
  mp4: "/videos/hero-loop.mp4",
  // Poster image shown while video loads
  poster:
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=60&fit=crop&auto=format",
};

// ── Device/GPU capability check ───────────────────────────────────────────
const useDeviceCapability = () => {
  const [capability, setCapability] = useState("high");

  useEffect(() => {
    const checkCapability = () => {
      // Check for touch/mobile
      const isMobile = window.matchMedia(
        "(hover: none) and (pointer: coarse)",
      ).matches;

      // Check for low memory (if available)
      const hasLowMemory =
        "deviceMemory" in navigator && navigator.deviceMemory < 4;

      // Check for slow connection
      const hasSlowConnection =
        "connection" in navigator &&
        ["slow-2g", "2g"].includes(navigator.connection?.effectiveType);

      if (isMobile && hasLowMemory) {
        setCapability("low");
      } else if (isMobile || hasSlowConnection) {
        setCapability("medium");
      } else {
        setCapability("high");
      }
    };

    checkCapability();
  }, []);

  return capability;
};

// ── Fallback background for mobile / low capability ────────────────────────
const StaticFallback = () => (
  <div
    className={styles.staticFallback}
    style={{
      backgroundImage: `url(${VIDEO_SOURCES.poster})`,
    }}
    role="img"
    aria-label="Elite athlete training in premium Apex Fitness facility"
  />
);

// ── Main Hero Component ───────────────────────────────────────────────────
const Hero = () => {
  const prefersReduced = useReducedMotion();
  const deviceCapability = useDeviceCapability();
  const videoRef = useRef(null);

  // Mouse parallax tracking (disabled on touch/mobile)
  const isMobile = deviceCapability !== "high";
  const { mouseX, mouseY } = useMouseParallax({
    lerpFactor: 0.05,
    disabled: isMobile || prefersReduced,
  });

  // GSAP entrance animation refs
  const animRefs = useHeroAnimation({ isLoaderDone: true });

  // Show 3D scene only on high-capability devices
  const show3D = deviceCapability !== "low";
  const showVideo = !prefersReduced;

  // Video autoplay management
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !showVideo) return;

    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    const playVideo = async () => {
      try {
        await video.play();
      } catch {
        // Autoplay blocked — poster image will show as fallback
        if (import.meta.env.DEV) {
          console.info("[Hero] Video autoplay blocked — poster image showing.");
        }
      }
    };

    playVideo();
  }, [showVideo]);

  return (
    <section
      className={styles.hero}
      aria-label="Hero section — Apex Fitness premium gym"
    >
      {/* ── LAYER 0: NOISE TEXTURE OVERLAY ────────────── */}
      <div className={styles.noiseOverlay} aria-hidden="true" />

      {/* ── LAYER 1: VIDEO / STATIC BACKGROUND ────────── */}
      <div className={styles.videoLayer} aria-hidden="true">
        {showVideo ? (
          <video
            ref={videoRef}
            className={styles.videoBackground}
            poster={VIDEO_SOURCES.poster}
            muted
            loop
            playsInline
            autoPlay
            preload="none"
            aria-hidden="true"
          >
            <source src={VIDEO_SOURCES.webm} type="video/webm" />
            <source src={VIDEO_SOURCES.mp4} type="video/mp4" />
          </video>
        ) : (
          <StaticFallback />
        )}
      </div>

      {/* ── LAYER 2: GRADIENT OVERLAYS ────────────────── */}
      <div className={styles.gradientLeft} aria-hidden="true" />
      <div className={styles.gradientBottom} aria-hidden="true" />
      <div className={styles.gradientTop} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />

      {/* ── LAYER 3: THREE.JS 3D SCENE ────────────────── */}
      {show3D && (
        <Suspense fallback={null}>
          <HeroScene mouseX={mouseX} mouseY={mouseY} isMobile={isMobile} />
        </Suspense>
      )}

      {/* ── LAYER 4: GRID PATTERN ─────────────────────── */}
      <div className={styles.gridOverlay} aria-hidden="true" />

      {/* ── LAYER 5: NEON LINE ACCENTS ────────────────── */}
      <div className={styles.neonLineLeft} aria-hidden="true" />
      <div className={styles.neonLineRight} aria-hidden="true" />

      {/* ── LAYER 6: CONTENT ──────────────────────────── */}
      <div className={styles.container}>
        <HeroContent animRefs={animRefs} />
      </div>

      {/* ── LAYER 7: SCROLL INDICATOR ─────────────────── */}
      <HeroScrollIndicator forwardRef={animRefs.scrollIndicator} />

      {/* ── LAYER 8: BOTTOM EDGE FADE ─────────────────── */}
      <div className={styles.bottomFade} aria-hidden="true" />
    </section>
  );
};

export default Hero;
