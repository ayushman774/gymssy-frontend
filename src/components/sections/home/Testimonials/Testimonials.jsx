import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TestimonialCard from "./TestimonialCard";
import SectionLabel from "../ui/SectionLabel/SectionLabel";
import { testimonials } from "../../../../assets/data/testimonials";
import styles from "./Testimonials.module.css";

gsap.registerPlugin(ScrollTrigger);

const AUTOPLAY_INTERVAL = 4500;
const VISIBLE_CARDS = 3;

const Testimonials = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const intervalRef = useRef(null);
  const dragStartX = useRef(null);
  const isDragging = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // ── GSAP Section Entrance ──────────────────────────────
  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      tl.fromTo(
        `.${styles.sectionHeader}`,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      )
        .fromTo(
          `.${styles.bigQuote}`,
          { opacity: 0, scale: 0.5 },
          { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.7)" },
          "-=0.4"
        )
        .fromTo(
          `.${styles.controls}`,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.3"
        );

      gsap.to(`.${styles.particle}`, {
        y: "random(-30, 30)",
        x: "random(-20, 20)",
        duration: "random(3, 6)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: { each: 0.5, from: "random" },
      });
    },
    { scope: sectionRef }
  );

  // ── Navigation ─────────────────────────────────────────
  const goToNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  const goToPrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  const goToIndex = useCallback((index) => {
    if (isAnimating || index === activeIndex) return;
    setIsAnimating(true);
    setActiveIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, activeIndex]);

  // ── Autoplay ───────────────────────────────────────────
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
      }
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [isPaused]);

  // ── Drag / Swipe ───────────────────────────────────────
  const handlePointerDown = useCallback((e) => {
    dragStartX.current = e.clientX ?? e.touches?.[0]?.clientX;
    isDragging.current = false;
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (dragStartX.current === null) return;
    const currentX = e.clientX ?? e.touches?.[0]?.clientX;
    if (Math.abs(currentX - dragStartX.current) > 8) {
      isDragging.current = true;
    }
  }, []);

  const handlePointerUp = useCallback((e) => {
    if (dragStartX.current === null) return;
    const endX = e.clientX ?? e.changedTouches?.[0]?.clientX;
    const diff = dragStartX.current - endX;
    if (isDragging.current && Math.abs(diff) > 50) {
      diff > 0 ? goToNext() : goToPrev();
    }
    dragStartX.current = null;
    isDragging.current = false;
  }, [goToNext, goToPrev]);

  // ── Build visible window: one before + active + two after
  //    so we always render VISIBLE_CARDS centered on active ─
  const getVisibleItems = () => {
    return Array.from({ length: VISIBLE_CARDS }, (_, i) => {
      const index = (activeIndex + i) % testimonials.length;
      return { ...testimonials[index], slotIndex: i };
    });
  };

  const visibleItems = getVisibleItems();

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-label="Member Testimonials"
    >
      <div className={styles.bgNoise} aria-hidden="true" />
      <div className={styles.bgGradient} aria-hidden="true" />

      <div className={styles.particles} aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={styles.particle}
            style={{
              left: `${(i * 8.3 + 3) % 100}%`,
              top: `${(i * 13.7 + 5) % 100}%`,
              animationDelay: `${(i * 0.4) % 4}s`,
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              opacity: 0.1 + (i % 4) * 0.08,
            }}
          />
        ))}
      </div>

      <div className={styles.bigQuote} aria-hidden="true">&ldquo;</div>

      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <SectionLabel text="TESTIMONIALS" variant="light" />
          <h2 className={styles.heading}>
            Results That
            <span className={styles.headingAccent}> Speak</span>
          </h2>
          <p className={styles.subheading}>
            Over 10,000 members have transformed their lives at Gymsssy. Here are
            their stories.
          </p>
        </div>

        {/* Cards Track — simple sliding strip */}
        <div
          ref={trackRef}
          className={styles.trackOuter}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        >
          <div className={styles.track}>
            {visibleItems.map((testimonial, i) => (
              <div
                key={`${testimonial.id}-${i}`}
                className={`${styles.cardWrapper} ${i === 1 ? styles.cardWrapperCenter : ""}`}
              >
                <TestimonialCard
                  testimonial={testimonial}
                  isActive={i === 1}
                  index={i}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <button className={styles.navBtn} onClick={goToPrev} aria-label="Previous testimonial">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className={styles.dots} role="tablist">
            {testimonials.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ""}`}
                onClick={() => goToIndex(i)}
              />
            ))}
          </div>

          <button className={styles.navBtn} onClick={goToNext} aria-label="Next testimonial">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className={styles.progressBar} aria-hidden="true">
          <motion.div
            className={styles.progressFill}
            key={activeIndex}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: AUTOPLAY_INTERVAL / 1000, ease: "linear" }}
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;