import { useRef, useState, useEffect } from "react";
import useReducedMotion from "../../../../hooks/useReducedMotion";
import HeroContent from "./HeroContent";
import styles from "./Hero.module.css";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1200&q=85&fit=crop&auto=format";

const useDeviceCapability = () => {
  const [capability, setCapability] = useState("high");
  useEffect(() => {
    const isMobile = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const hasLowMemory = "deviceMemory" in navigator && navigator.deviceMemory < 4;
    const hasSlowConnection =
      "connection" in navigator &&
      ["slow-2g", "2g"].includes(navigator.connection?.effectiveType);
    if (isMobile && hasLowMemory) setCapability("low");
    else if (isMobile || hasSlowConnection) setCapability("medium");
    else setCapability("high");
  }, []);
  return capability;
};

const Hero = () => {
  const prefersReduced    = useReducedMotion();
  const deviceCapability  = useDeviceCapability();

  return (
    <section
      className={styles.hero}
      aria-label="Hero — Gymssy India's #1 Fitness Marketplace"
    >
      {/* ── Noise texture ── */}
      <div className={styles.noiseOverlay} aria-hidden="true" />

      {/* ── Dark base gradient ── */}
      <div className={styles.baseGradient} aria-hidden="true" />

      {/* ── Athlete image — right half ── */}
      <div className={styles.athleteLayer} aria-hidden="true">
        <img
          src={HERO_IMAGE}
          alt=""
          className={styles.athleteImg}
          loading="eager"
          fetchpriority="high"
        />
        {/* fade the image into the dark left side */}
        <div className={styles.athleteFadeLeft}  aria-hidden="true" />
        <div className={styles.athleteFadeBottom} aria-hidden="true" />
      </div>

      {/* ── Grid overlay ── */}
      <div className={styles.gridOverlay} aria-hidden="true" />

      {/* ── Content ── */}
      <div className={styles.container}>
        <HeroContent />
      </div>

      {/* ── Bottom fade into next section ── */}
      <div className={styles.bottomFade} aria-hidden="true" />
    </section>
  );
};

export default Hero;