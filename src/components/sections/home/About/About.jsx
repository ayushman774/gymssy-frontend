import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import AboutImage from "./AboutImage";
import AboutContent from "./AboutContent";
import AboutStats from "./AboutStats";
import styles from "./About.module.css";

const About = () => {
  const sectionRef = useRef(null);

  // Trigger when section is 20% into viewport
  const isInView = useInView(sectionRef, {
    once: true,
    margin: "-10% 0px -10% 0px",
  });

  return (
    <section
      ref={sectionRef}
      className={styles.about}
      aria-labelledby="about-heading"
      id="about"
    >
      {/* ── BACKGROUND ELEMENTS ───────────────────────── */}
      <div className={styles.bgGradient} aria-hidden="true" />
      <div className={styles.bgNoise} aria-hidden="true" />
      <div className={styles.bgGrid} aria-hidden="true" />

      {/* ── NEON LIGHT SWEEP ──────────────────────────── */}
      <motion.div
        className={styles.neonSweep}
        aria-hidden="true"
        initial={{ x: "-100%", opacity: 0 }}
        animate={
          isInView
            ? { x: "100%", opacity: [0, 0.6, 0.6, 0] }
            : { x: "-100%", opacity: 0 }
        }
        transition={{
          duration: 1.4,
          delay: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      />

      {/* ── SECTION LABEL ─────────────────────────────── */}
      <div className={styles.container}>
        <motion.div
          className={styles.sectionLabel}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className={styles.labelLine} aria-hidden="true" />
          <span className={styles.labelText}>Our Story</span>
          <span className={styles.labelLine} aria-hidden="true" />
        </motion.div>

        {/* ── MAIN GRID ─────────────────────────────── */}
        <div className={styles.mainGrid}>
          {/* LEFT — Image */}
          <AboutImage isInView={isInView} />

          {/* RIGHT — Content */}
          <div className={styles.rightCol}>
            <AboutContent isInView={isInView} />
            <AboutStats isInView={isInView} />
          </div>
        </div>

        {/* ── BOTTOM MARQUEE ────────────────────────── */}
        <div className={styles.marqueeWrapper} aria-hidden="true">
          <motion.div
            className={styles.marquee}
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 20,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            {[...Array(8)].map((_, i) => (
              <span key={i} className={styles.marqueeItem}>
                <span className={styles.marqueeText}>ELITE TRAINING</span>
                <span className={styles.marqueeDot}>·</span>
                <span
                  className={`${styles.marqueeText} ${styles.marqueeOutline}`}
                >
                  WORLD CLASS
                </span>
                <span className={styles.marqueeDot}>·</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── DECORATIVE NEON LINES ─────────────────────── */}
      <div className={styles.neonLineTop} aria-hidden="true" />
      <div className={styles.neonLineBottom} aria-hidden="true" />
    </section>
  );
};

export default About;
