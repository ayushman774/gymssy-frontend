import { useRef, useState, useEffect } from "react";
import useReducedMotion from "../../../../hooks/useReducedMotion";
import HeroContent from "./HeroContent";
import styles from "./Hero.module.css";

/* ══════════════════════════════════════════════════════
   HERO BACKGROUND IMAGES
   High-quality fitness images from Unsplash.
   Replace URLs with your own CDN/assets in production.
══════════════════════════════════════════════════════ */
const HERO_IMAGES = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=85&fit=crop&auto=format",
    alt: "Premium gym interior with modern equipment",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1920&q=85&fit=crop&auto=format",
    alt: "Athlete training with weights",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1920&q=85&fit=crop&auto=format",
    alt: "CrossFit workout session",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1920&q=85&fit=crop&auto=format",
    alt: "Yoga studio with peaceful atmosphere",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1920&q=85&fit=crop&auto=format",
    alt: "Modern fitness center with cardio equipment",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=1920&q=85&fit=crop&auto=format",
    alt: "Personal training session",
  },
];

/* Auto-slide interval in milliseconds */
const SLIDE_INTERVAL = 4500;
const TRANSITION_DURATION = 1200; // ms — must match CSS

/* ══════════════════════════════════════════════════════
   IMAGE SLIDESHOW BACKGROUND
══════════════════════════════════════════════════════ */
const HeroSlideshow = ({ reducedMotion }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set([0]));
  const timerRef = useRef(null);
  const transitionRef = useRef(null);

  /* ── Preload adjacent images ── */
  useEffect(() => {
    const preload = (index) => {
      if (loadedImages.has(index)) return;
      const img = new Image();
      img.src = HERO_IMAGES[index].url;
      img.onload = () => {
        setLoadedImages((prev) => new Set([...prev, index]));
      };
    };

    // Preload next and previous
    const next = (currentIndex + 1) % HERO_IMAGES.length;
    const prev = (currentIndex - 1 + HERO_IMAGES.length) % HERO_IMAGES.length;
    preload(next);
    preload(prev);
  }, [currentIndex, loadedImages]);

  /* ── Auto advance slides ── */
  useEffect(() => {
    if (reducedMotion) return;

    const startTimer = () => {
      timerRef.current = setTimeout(() => {
        advance();
      }, SLIDE_INTERVAL);
    };

    startTimer();

    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(transitionRef.current);
    };
  }, [currentIndex, reducedMotion]);

  const advance = () => {
    if (isTransitioning) return;

    const next = (currentIndex + 1) % HERO_IMAGES.length;

    setNextIndex(next);
    setIsTransitioning(true);

    transitionRef.current = setTimeout(() => {
      setCurrentIndex(next);
      setNextIndex(null);
      setIsTransitioning(false);
    }, TRANSITION_DURATION);
  };

  const goTo = (index) => {
    if (isTransitioning || index === currentIndex) return;

    clearTimeout(timerRef.current);
    clearTimeout(transitionRef.current);

    setNextIndex(index);
    setIsTransitioning(true);

    transitionRef.current = setTimeout(() => {
      setCurrentIndex(index);
      setNextIndex(null);
      setIsTransitioning(false);
    }, TRANSITION_DURATION);
  };

  /* ── Reduced motion: just show first image ── */
  if (reducedMotion) {
    return (
      <div className={styles.slideshowWrapper}>
        <div
          className={styles.slide}
          style={{ backgroundImage: `url(${HERO_IMAGES[0].url})` }}
          role="img"
          aria-label={HERO_IMAGES[0].alt}
        />
      </div>
    );
  }

  return (
    <div
      className={styles.slideshowWrapper}
      role="region"
      aria-label="Hero background slideshow"
      aria-live="off"
    >
      {/* ── Current slide — always visible ── */}
      <div
        className={`${styles.slide} ${styles.slideCurrent}`}
        style={{
          backgroundImage: `url(${HERO_IMAGES[currentIndex].url})`,
        }}
        role="img"
        aria-label={HERO_IMAGES[currentIndex].alt}
        aria-hidden="true"
      />

      {/* ── Next slide — fades in during transition ── */}
      {nextIndex !== null && (
        <div
          className={`${styles.slide} ${styles.slideNext} ${
            isTransitioning ? styles.slideNextVisible : ""
          }`}
          style={{
            backgroundImage: `url(${HERO_IMAGES[nextIndex].url})`,
          }}
          role="img"
          aria-label={HERO_IMAGES[nextIndex].alt}
          aria-hidden="true"
        />
      )}

      {/* ── Dot indicators ── */}
      <div className={styles.dots} role="tablist" aria-label="Slide indicators">
        {HERO_IMAGES.map((img, i) => (
          <button
            key={img.id}
            className={`${styles.dot} ${
              i === currentIndex ? styles.dotActive : ""
            }`}
            onClick={() => goTo(i)}
            role="tab"
            aria-selected={i === currentIndex}
            aria-label={`Go to slide ${i + 1}: ${img.alt}`}
          />
        ))}
      </div>

      {/* ── Progress bar ── */}
      <div className={styles.progressBar} aria-hidden="true">
        <div
          key={currentIndex}
          className={styles.progressFill}
          style={{
            animationDuration: `${SLIDE_INTERVAL}ms`,
          }}
        />
      </div>
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

      {/* ── Layer 1: Image Slideshow ── */}
      <div className={styles.videoLayer} aria-hidden="true">
        <HeroSlideshow reducedMotion={prefersReduced} />
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
