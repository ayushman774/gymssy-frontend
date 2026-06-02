import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import styles from "./BeforeAfterSlider.module.css";

const INITIAL_POSITION = 50; // percent

const BeforeAfterSlider = ({ before, after, autoPlay = true }) => {
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const hasInteracted = useRef(false);
  const autoPlayRef = useRef(null);

  // Motion value drives everything — 0 to 100 (percent)
  const sliderX = useMotionValue(INITIAL_POSITION);

  // Clip path for AFTER image
  const clipPath = useTransform(sliderX, (v) => `inset(0 0 0 ${v}%)`);

  // Handle line + thumb position
  const lineLeft = useTransform(sliderX, (v) => `${v}%`);

  // ── Convert pointer/touch event to % position ─────────────────────────
  const eventToPercent = useCallback((clientX) => {
    if (!containerRef.current) return INITIAL_POSITION;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = (x / rect.width) * 100;
    return Math.min(Math.max(pct, 1), 99);
  }, []);

  // ── Stop auto-play when user interacts ───────────────────────────────
  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      autoPlayRef.current.stop();
      autoPlayRef.current = null;
    }
    hasInteracted.current = true;
  }, []);

  // ── Pointer events (mouse + touch unified) ────────────────────────────
  const handlePointerDown = useCallback(
    (e) => {
      e.preventDefault();
      isDragging.current = true;
      stopAutoPlay();
      containerRef.current?.setPointerCapture(e.pointerId);
      sliderX.set(eventToPercent(e.clientX));
    },
    [eventToPercent, sliderX, stopAutoPlay],
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (!isDragging.current) return;
      sliderX.set(eventToPercent(e.clientX));
    },
    [eventToPercent, sliderX],
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // ── Keyboard accessibility ────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e) => {
      const step = e.shiftKey ? 10 : 2;
      if (e.key === "ArrowLeft") {
        stopAutoPlay();
        sliderX.set(Math.max(sliderX.get() - step, 1));
      }
      if (e.key === "ArrowRight") {
        stopAutoPlay();
        sliderX.set(Math.min(sliderX.get() + step, 99));
      }
    },
    [sliderX, stopAutoPlay],
  );

  // ── Auto-play sweep animation ─────────────────────────────────────────
  useEffect(() => {
    if (!autoPlay || hasInteracted.current) return;

    // Delay before starting
    const timeout = setTimeout(() => {
      if (hasInteracted.current) return;

      // Sweep left → right → back to center
      autoPlayRef.current = animate(sliderX, [50, 20, 80, 50], {
        duration: 4,
        ease: "easeInOut",
        delay: 0.8,
      });
    }, 600);

    return () => {
      clearTimeout(timeout);
      autoPlayRef.current?.stop();
    };
  }, [autoPlay, sliderX]);

  return (
    <div
      ref={containerRef}
      className={styles.sliderContainer}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onKeyDown={handleKeyDown}
      role="slider"
      aria-label="Before and after comparison slider"
      aria-valuemin={1}
      aria-valuemax={99}
      aria-valuenow={Math.round(sliderX.get())}
      tabIndex={0}
    >
      {/* ── BEFORE IMAGE (full width base) ──────────── */}
      <div className={styles.imageBase}>
        <img
          src={before.src}
          alt={before.alt}
          className={styles.image}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
        {/* Before label */}
        <div className={`${styles.imageLabel} ${styles.labelBefore}`}>
          <span className={styles.labelDot} aria-hidden="true" />
          <span>Before</span>
        </div>
        {/* Dark overlay */}
        <div className={styles.imageOverlay} aria-hidden="true" />
      </div>

      {/* ── AFTER IMAGE (clipped by slider position) ─ */}
      <motion.div
        className={styles.imageAfter}
        style={{ clipPath }}
        aria-hidden="true"
      >
        <img
          src={after.src}
          alt={after.alt}
          className={styles.image}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
        {/* After label */}
        <div className={`${styles.imageLabel} ${styles.labelAfter}`}>
          <span className={styles.labelDot} aria-hidden="true" />
          <span>After</span>
        </div>
        {/* Subtle green tint on after */}
        <div className={styles.afterTint} aria-hidden="true" />
        <div className={styles.imageOverlay} aria-hidden="true" />
      </motion.div>

      {/* ── SLIDER LINE ──────────────────────────────── */}
      <motion.div
        className={styles.sliderLine}
        style={{ left: lineLeft }}
        aria-hidden="true"
      >
        {/* Vertical line */}
        <div className={styles.line} />

        {/* Drag handle */}
        <div className={styles.handle}>
          {/* Left arrow */}
          <svg
            className={`${styles.handleArrow} ${styles.arrowLeft}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>

          {/* Divider */}
          <div className={styles.handleDivider} aria-hidden="true" />

          {/* Right arrow */}
          <svg
            className={`${styles.handleArrow} ${styles.arrowRight}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>

          {/* Neon glow ring */}
          <div className={styles.handleGlow} aria-hidden="true" />
        </div>
      </motion.div>

      {/* ── DRAG HINT (fades after first interaction) ─ */}
      <div className={styles.dragHint} aria-hidden="true">
        <span className={styles.dragHintText}>Drag to compare</span>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
