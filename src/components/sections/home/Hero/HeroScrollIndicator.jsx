/**
 * HeroScrollIndicator
 * Animated scroll prompt at the bottom of the hero section.
 * Pulses and bounces to draw attention to scrolling.
 */

import { useRef, useEffect } from "react";
import gsap from "gsap";
import styles from "./HeroScrollIndicator.module.css";

const HeroScrollIndicator = ({ forwardRef }) => {
  const lineRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (!lineRef.current) return;

    // Animate the scroll line up/down continuously
    gsap.to(lineRef.current, {
      scaleY: 0,
      transformOrigin: "top center",
      duration: 1.2,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: false,
      repeatDelay: 0.3,
    });

    // Subtle text pulse
    gsap.to(textRef.current, {
      opacity: 0.4,
      duration: 1.2,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
    });
  }, []);

  return (
    <div ref={forwardRef} className={styles.scrollIndicator}>
      <span ref={textRef} className={styles.scrollText}>
        SCROLL
      </span>
      <div className={styles.lineWrapper}>
        <div ref={lineRef} className={styles.scrollLine} />
      </div>
    </div>
  );
};

export default HeroScrollIndicator;
