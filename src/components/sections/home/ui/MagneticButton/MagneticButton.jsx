import { useRef, useCallback } from "react";
import gsap from "gsap";
import { isTouchDevice } from "../../../../../utils/device";
import styles from "./MagneticButton.module.css";

const MagneticButton = ({
  children,
  strength = 0.4,
  className = "",
  as: Tag = "div",
  ...props
}) => {
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);
  const boundingRef = useRef(null);
  const isHovering = useRef(false);

  // ── Update bounding box ──────────────────────────────────
  const updateBounding = useCallback(() => {
    boundingRef.current = wrapperRef.current?.getBoundingClientRect();
  }, []);

  // ── Mouse Enter ──────────────────────────────────────────
  const handleMouseEnter = useCallback(() => {
    if (isTouchDevice()) return;
    isHovering.current = true;
    updateBounding();

    gsap.to(contentRef.current, {
      duration: 0.3,
      ease: "power2.out",
      scale: 1.04,
    });
  }, [updateBounding]);

  // ── Mouse Move ───────────────────────────────────────────
  const handleMouseMove = useCallback(
    (e) => {
      if (isTouchDevice() || !boundingRef.current) return;

      const { left, top, width, height } = boundingRef.current;
      const x = e.clientX - left - width / 2;
      const y = e.clientY - top - height / 2;

      // Wrapper — larger movement
      gsap.to(wrapperRef.current, {
        duration: 0.6,
        ease: "power3.out",
        x: x * strength,
        y: y * strength,
      });

      // Content — subtle inner movement
      gsap.to(contentRef.current, {
        duration: 0.4,
        ease: "power3.out",
        x: x * strength * 0.25,
        y: y * strength * 0.25,
      });
    },
    [strength],
  );

  // ── Mouse Leave ──────────────────────────────────────────
  const handleMouseLeave = useCallback(() => {
    if (isTouchDevice()) return;
    isHovering.current = false;

    // Wrapper snaps back elastically
    gsap.to(wrapperRef.current, {
      duration: 0.7,
      ease: "elastic.out(1, 0.35)",
      x: 0,
      y: 0,
    });

    // Content resets smoothly
    gsap.to(contentRef.current, {
      duration: 0.5,
      ease: "elastic.out(1, 0.35)",
      x: 0,
      y: 0,
      scale: 1,
    });
  }, []);

  return (
    <Tag
      ref={wrapperRef}
      className={`${styles.wrapper} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <span ref={contentRef} className={styles.content}>
        {children}
      </span>
    </Tag>
  );
};

export default MagneticButton;
