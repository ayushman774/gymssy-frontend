import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";
import styles from "./AboutContent.module.css";

gsap.registerPlugin(ScrollTrigger);

// ── Text lines for staggered reveal ──────────────────────────────────────
const HEADLINE_LINES = [
  { text: "More Than", accent: false },
  { text: "A Gym.", accent: true },
];

const FEATURES = [
  "State-of-the-art equipment across 3 floors",
  "World-class certified coaching staff",
  "Personalised nutrition & recovery programs",
  "24 / 7 access with premium locker facilities",
];

// ── Line reveal component (GSAP) ──────────────────────────────────────────
const RevealLine = ({ children, delay = 0, isInView }) => {
  const lineRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!isInView || !lineRef.current) return;

    gsap.fromTo(
      lineRef.current,
      { y: "105%", opacity: 0 },
      {
        y: "0%",
        opacity: 1,
        duration: 0.85,
        delay,
        ease: "power4.out",
      },
    );
  }, [isInView, delay]);

  return (
    <div ref={wrapperRef} className={styles.lineWrapper}>
      <div ref={lineRef} style={{ transform: "translateY(105%)", opacity: 0 }}>
        {children}
      </div>
    </div>
  );
};

const AboutContent = ({ isInView }) => {
  return (
    <div className={styles.content}>
      {/* ── EYEBROW ───────────────────────────────────── */}
      <motion.div
        className={styles.eyebrow}
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        <span className={styles.eyebrowDot} aria-hidden="true" />
        <span>Est. 2009 · Premium Fitness</span>
      </motion.div>

      {/* ── HEADLINE ──────────────────────────────────── */}
      <h2
        id="about-heading"
        className={styles.headline}
        aria-label="More Than A Gym."
      >
        {HEADLINE_LINES.map((line, i) => (
          <RevealLine key={i} delay={0.3 + i * 0.15} isInView={isInView}>
            <span
              className={`
                ${styles.headlineLine}
                ${line.accent ? styles.headlineAccent : ""}
              `}
            >
              {line.text}
            </span>
          </RevealLine>
        ))}
      </h2>

      {/* ── BODY TEXT ─────────────────────────────────── */}
      <motion.div
        className={styles.bodyWrapper}
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.65 }}
      >
        <p className={styles.body}>
          Founded in 2009, Apex Fitness was built on a single belief — that
          everyone deserves access to elite-level training. We combined
          cutting-edge facilities with world-class coaching to create something
          the industry had never seen.
        </p>
        <p className={styles.body}>
          Today, we stand as the benchmark for premium fitness experiences.
          Every machine, every program, every coach is selected to one standard
          only — the best.
        </p>
      </motion.div>

      {/* ── FEATURE LIST ──────────────────────────────── */}
      <motion.ul
        className={styles.featureList}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.8,
            },
          },
        }}
        role="list"
      >
        {FEATURES.map((feature, i) => (
          <motion.li
            key={i}
            className={styles.featureItem}
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: {
                opacity: 1,
                x: 0,
                transition: {
                  duration: 0.5,
                  ease: [0.25, 0.46, 0.45, 0.94],
                },
              },
            }}
          >
            <FiCheckCircle className={styles.featureIcon} aria-hidden="true" />
            <span>{feature}</span>
          </motion.li>
        ))}
      </motion.ul>

      {/* ── CTA ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <Link to="/about" className={styles.cta}>
          <span>Discover Our Story</span>
          <span className={styles.ctaIconWrapper}>
            <FiArrowRight className={styles.ctaIcon} />
          </span>
          <span className={styles.ctaLine} aria-hidden="true" />
        </Link>
      </motion.div>
    </div>
  );
};

export default AboutContent;
