import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./SectionLabel.module.css";

gsap.registerPlugin(ScrollTrigger);

const SectionLabel = ({ text, variant = "light" }) => {
  const labelRef = useRef(null);
  const lineLeftRef = useRef(null);
  const lineRightRef = useRef(null);
  const textRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: labelRef.current,
          start: "top 85%",
          once: true,
        },
      });

      // Lines draw in from center outward
      tl.fromTo(
        lineLeftRef.current,
        { scaleX: 0, transformOrigin: "right center" },
        { scaleX: 1, duration: 0.6, ease: "power3.out" },
      )
        .fromTo(
          lineRightRef.current,
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.6, ease: "power3.out" },
          "<", // same time as left line
        )
        .fromTo(
          textRef.current,
          { opacity: 0, y: 8, letterSpacing: "0.3em" },
          {
            opacity: 1,
            y: 0,
            letterSpacing: "0.2em",
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.3",
        );
    },
    { scope: labelRef },
  );

  return (
    <div
      ref={labelRef}
      className={`${styles.label} ${styles[`label--${variant}`]}`}
      aria-label={text}
    >
      {/* Left line */}
      <span ref={lineLeftRef} className={styles.line} aria-hidden="true" />

      {/* Text */}
      <span ref={textRef} className={styles.text}>
        {text}
      </span>

      {/* Right line */}
      <span ref={lineRightRef} className={styles.line} aria-hidden="true" />
    </div>
  );
};

export default SectionLabel;
