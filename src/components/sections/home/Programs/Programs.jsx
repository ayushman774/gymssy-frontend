import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import ProgramCard from "./ProgramCard";
import { PROGRAMS } from "../../../../assets/data/programs";
import styles from "./Programs.module.css";

gsap.registerPlugin(ScrollTrigger);

// ── Header variants ───────────────────────────────────────────────────────
const headerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const headerChildVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const Programs = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const neonLineRef = useRef(null);

  const isInView = useInView(sectionRef, {
    once: true,
    margin: "-8% 0px",
  });

  // ── GSAP neon line draw on enter ────────────────────────────────────────
  useEffect(() => {
    if (!neonLineRef.current || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        neonLineRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.programs}
      aria-labelledby="programs-heading"
      id="programs"
    >
      {/* ── BACKGROUND ────────────────────────────────── */}
      <div className={styles.bgTop} aria-hidden="true" />
      <div className={styles.bgBottom} aria-hidden="true" />
      <div className={styles.bgNoise} aria-hidden="true" />

      <div className={styles.container}>
        {/* ── SECTION HEADER ──────────────────────────── */}
        <motion.div
          ref={headerRef}
          className={styles.header}
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Label row */}
          <motion.div
            className={styles.labelRow}
            variants={headerChildVariants}
          >
            <span className={styles.labelLine} aria-hidden="true" />
            <span className={styles.labelText}>What We Offer</span>
            <span className={styles.labelLine} aria-hidden="true" />
          </motion.div>

          {/* Headline */}
          <motion.h2
            id="programs-heading"
            className={styles.headline}
            variants={headerChildVariants}
          >
            <span className={styles.headlineNormal}>Programs Built</span>
            <span className={styles.headlineNormal}>
              for <span className={styles.headlineAccent}>Champions</span>
            </span>
          </motion.h2>

          {/* Sub copy */}
          <motion.p className={styles.subCopy} variants={headerChildVariants}>
            Six elite programs. One goal — to make you unstoppable. Every
            session is engineered to push your limits and deliver results that
            last.
          </motion.p>

          {/* Neon divider line */}
          <div className={styles.neonLineWrapper} aria-hidden="true">
            <div ref={neonLineRef} className={styles.neonLine} />
          </div>
        </motion.div>

        {/* ── PROGRAMS GRID ───────────────────────────── */}
        <div className={styles.grid} role="list" aria-label="Training programs">
          {PROGRAMS.map((program, index) => (
            <div key={program.id} role="listitem">
              <ProgramCard program={program} index={index} />
            </div>
          ))}
        </div>

        {/* ── BOTTOM CTA ──────────────────────────────── */}
        <motion.div
          className={styles.bottomCTA}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-5%" }}
          transition={{
            duration: 0.7,
            delay: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <div className={styles.ctaInner}>
            <div className={styles.ctaText}>
              <p className={styles.ctaHeadline}>
                Not sure which program is right for you?
              </p>
              <p className={styles.ctaBody}>
                Book a free consultation and our coaches will design the perfect
                plan for your goals.
              </p>
            </div>

            <div className={styles.ctaButtons}>
              <Link to="/contact" className={styles.ctaPrimary}>
                <span>Book Free Consultation</span>
                <FiArrowRight />
              </Link>
              <Link to="/programs" className={styles.ctaSecondary}>
                <span>View All Programs</span>
              </Link>
            </div>
          </div>

          {/* Decorative glow */}
          <div className={styles.ctaGlow} aria-hidden="true" />
        </motion.div>
      </div>

      {/* ── SECTION EDGE FADES ──────────────────────── */}
      <div className={styles.edgeFadeTop} aria-hidden="true" />
      <div className={styles.edgeFadeBottom} aria-hidden="true" />
    </section>
  );
};

export default Programs;
