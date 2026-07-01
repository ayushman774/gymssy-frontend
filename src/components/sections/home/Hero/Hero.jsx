import { lazy, Suspense, useRef, useState, useEffect } from "react";
import useMouseParallax from "../../../../hooks/useMouseParallax";
import useHeroAnimation from "../../../../hooks/useHeroAnimation";
import useReducedMotion from "../../../../hooks/useReducedMotion";
import HeroContent from "./HeroContent";
import styles from "./Hero.module.css";

const HeroScene = lazy(() => import("../../../three/HeroScene/HeroScene"));

const VIDEO_SOURCES = {
  webm: "/videos/hero-loop.webm",
  mp4: "/videos/hero-loop.mp4",
  poster:
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=60&fit=crop&auto=format",
};

const useDeviceCapability = () => {
  const [capability, setCapability] = useState("high");

  useEffect(() => {
    const checkCapability = () => {
      const isMobile = window.matchMedia(
        "(hover: none) and (pointer: coarse)"
      ).matches;
      const hasLowMemory =
        "deviceMemory" in navigator && navigator.deviceMemory < 4;
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

const StaticFallback = () => (
  <div
    className={styles.staticFallback}
    style={{ backgroundImage: `url(${VIDEO_SOURCES.poster})` }}
    role="img"
    aria-label="Elite athlete training in premium Gymsssy Fitness facility"
  />
);

const Hero = () => {
  const prefersReduced = useReducedMotion();
  const deviceCapability = useDeviceCapability();
  const videoRef = useRef(null);

  const isMobile = deviceCapability !== "high";
  const { mouseX, mouseY } = useMouseParallax({
    lerpFactor: 0.05,
    disabled: isMobile || prefersReduced,
  });

  const animRefs = useHeroAnimation({ isLoaderDone: true });
  const showVideo = !prefersReduced;

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
      aria-label="Hero section — Gymsssy Fitness premium gym"
    >
      {/* LAYER 0: NOISE TEXTURE OVERLAY */}
      <div className={styles.noiseOverlay} aria-hidden="true" />

      {/* LAYER 1: VIDEO / STATIC BACKGROUND */}
      <div className={styles.videoLayer} aria-hidden="true">
        <StaticFallback />
      </div>

      {/* LAYER 2: GRADIENT OVERLAYS */}
      <div className={styles.gradientLeft} aria-hidden="true" />
      <div className={styles.gradientBottom} aria-hidden="true" />
      <div className={styles.gradientTop} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />

      {/* LAYER 4: GRID PATTERN */}
      <div className={styles.gridOverlay} aria-hidden="true" />

      {/* LAYER 5: NEON LINE ACCENTS */}
      <div className={styles.neonLineLeft} aria-hidden="true" />
      <div className={styles.neonLineRight} aria-hidden="true" />

      {/* LAYER 6: CONTENT */}
      <div className={styles.container}>
        <HeroContent animRefs={animRefs} />
      </div>

      {/* LAYER 8: BOTTOM EDGE FADE */}
      <div className={styles.bottomFade} aria-hidden="true" />
    </section>
  );
};

export default Hero;