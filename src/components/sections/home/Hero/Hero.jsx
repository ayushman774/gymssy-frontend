import { useRef, useState, useEffect } from "react";
import useReducedMotion from "../../../../hooks/useReducedMotion";
import HeroContent from "./HeroContent";
import styles from "./Hero.module.css";

/* ══════════════════════════════════════════════════════
   VIDEO SOURCE
   Replace these with your actual video files in /public/videos/
   Free sources listed below.
══════════════════════════════════════════════════════ */
const VIDEO = {
  // Option A — use a direct MP4 link (works instantly for testing)
  // Replace with your downloaded file path in production
  mp4: "/videos/fitness-hero.mp4",
  webm: "/videos/fitness-hero.webm",

  // Poster shown while video loads / on reduced motion
  poster:
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80&fit=crop&auto=format",
};

/* ══════════════════════════════════════════════════════
   VIDEO BACKGROUND
══════════════════════════════════════════════════════ */
const HeroVideo = ({ reducedMotion }) => {
  const videoRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion) return;

    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "auto";

    const tryPlay = async () => {
      try {
        await video.play();
      } catch (e) {
        // Autoplay blocked — poster image visible as fallback
        if (import.meta.env.DEV) {
          console.info("[Hero] Video autoplay blocked — poster showing.");
        }
      }
    };

    if (video.readyState >= 3) {
      setLoaded(true);
      tryPlay();
    } else {
      video.addEventListener(
        "canplaythrough",
        () => {
          setLoaded(true);
          tryPlay();
        },
        { once: true },
      );

      video.addEventListener(
        "error",
        () => {
          setError(true);
        },
        { once: true },
      );
    }
  }, [reducedMotion]);

  // On reduced motion — just show poster
  if (reducedMotion) {
    return (
      <div
        className={styles.videoPoster}
        style={{ backgroundImage: `url(${VIDEO.poster})` }}
        role="img"
        aria-label="Fitness background"
      />
    );
  }

  return (
    <div className={styles.videoWrapper}>
      {/* Poster shown until video is ready */}
      <div
        className={`${styles.videoPoster} ${loaded ? styles.videoPosterHidden : ""}`}
        style={{ backgroundImage: `url(${VIDEO.poster})` }}
        aria-hidden="true"
      />

      {/* Video element */}
      {!error && (
        <video
          ref={videoRef}
          className={`${styles.videoEl} ${loaded ? styles.videoElVisible : ""}`}
          muted
          loop
          playsInline
          preload="auto"
          poster={VIDEO.poster}
          aria-hidden="true"
        >
          <source src={VIDEO.webm} type="video/webm" />
          <source src={VIDEO.mp4} type="video/mp4" />
        </video>
      )}

      {/* If video fails, keep poster visible */}
      {error && (
        <div
          className={`${styles.videoPoster} ${styles.videoPosterVisible}`}
          style={{ backgroundImage: `url(${VIDEO.poster})` }}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   MAIN HERO
══════════════════════════════════════════════════════ */
const Hero = () => {
  const prefersReduced = useReducedMotion();

  return (
    <section
      className={styles.hero}
      aria-label="Hero — Gymssy India's #1 Fitness Marketplace"
    >
      {/* ── Layer 0: Noise ── */}
      <div className={styles.noiseOverlay} aria-hidden="true" />

      {/* ── Layer 1: Video / Poster ── */}
      <div className={styles.videoLayer} aria-hidden="true">
        <HeroVideo reducedMotion={prefersReduced} />
      </div>

      {/* ── Layer 2: Overlays ── */}
      <div className={styles.overlayDark} aria-hidden="true" />
      <div className={styles.overlayLeft} aria-hidden="true" />
      <div className={styles.overlayBottom} aria-hidden="true" />
      <div className={styles.overlayTop} aria-hidden="true" />
      <div className={styles.overlayVignette} aria-hidden="true" />

      {/* ── Layer 3: Grid ── */}
      <div className={styles.gridOverlay} aria-hidden="true" />

      {/* ── Layer 4: Content ── */}
      <div className={styles.container}>
        <HeroContent />
      </div>

      {/* ── Layer 5: Bottom fade ── */}
      <div className={styles.bottomFade} aria-hidden="true" />
    </section>
  );
};

export default Hero;
