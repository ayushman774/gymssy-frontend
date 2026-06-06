import { useRef, useEffect, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import TransformationCard from "./TransformationCard";
import TransformationStats from "./TransformationStats";
import { TRANSFORMATIONS } from "../../../../assets/data/transformations";
import styles from "./Transformation.module.css";

gsap.registerPlugin(ScrollTrigger);

const Transformation = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const neonLineRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isInView = useInView(sectionRef, {
    once: true,
    margin: "-8% 0px",
  });

  // ── Parallax on section background ───────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  // ── GSAP neon sweep line ──────────────────────────────────────────────
  useEffect(() => {
    if (!neonLineRef.current || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        neonLineRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ── Navigation ────────────────────────────────────────────────────────
  const goNext = () => {
    setActiveIndex((prev) =>
      prev < TRANSFORMATIONS.length - 1 ? prev + 1 : 0,
    );
  };

  const goPrev = () => {
    setActiveIndex((prev) =>
      prev > 0 ? prev - 1 : TRANSFORMATIONS.length - 1,
    );
  };

  return (
    <section
      ref={sectionRef}
      className={styles.transformation}
      aria-labelledby="transformation-heading"
      id="transformations"
    >
      {/* ── PARALLAX BACKGROUND ─────────────────────── */}
      <motion.div
        className={styles.bgParallax}
        style={{ y: bgY }}
        aria-hidden="true"
      >
        <div className={styles.bgImage} />
        <div className={styles.bgOverlay} />
      </motion.div>

      {/* ── BACKGROUND ACCENTS ──────────────────────── */}
      <div className={styles.bgGlow} aria-hidden="true" />
      <div className={styles.bgNoise} aria-hidden="true" />

      <div className={styles.container}>
        {/* ── SECTION HEADER ────────────────────────── */}
        <motion.div
          ref={headerRef}
          className={styles.header}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Label */}
          <motion.div
            className={styles.labelRow}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className={styles.labelLine} aria-hidden="true" />
            <span className={styles.labelText}>Transformations</span>
            <span className={styles.labelLine} aria-hidden="true" />
          </motion.div>

          {/* Headline */}
          <div className={styles.headlineWrapper}>
            <motion.h2
              id="transformation-heading"
              className={styles.headline}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Real People.{" "}
              <span className={styles.headlineAccent}>Real Results.</span>
            </motion.h2>

            {/* Navigation controls */}
            <motion.div
              className={styles.navControls}
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              <button
                className={styles.navBtn}
                onClick={goPrev}
                aria-label="Previous transformation story"
              >
                <FiChevronLeft />
              </button>
              <div
                className={styles.navPips}
                aria-label="Transformation story navigation"
              >
                {TRANSFORMATIONS.map((_, i) => (
                  <button
                    key={i}
                    className={`
                      ${styles.pip}
                      ${i === activeIndex ? styles.pipActive : ""}
                    `}
                    onClick={() => setActiveIndex(i)}
                    aria-label={`Go to story ${i + 1}`}
                    aria-current={i === activeIndex ? "true" : undefined}
                  />
                ))}
              </div>
              <button
                className={styles.navBtn}
                onClick={goNext}
                aria-label="Next transformation story"
              >
                <FiChevronRight />
              </button>
            </motion.div>
          </div>

          {/* Sub copy */}
          <motion.p
            className={styles.subCopy}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Every transformation starts with a decision. These members made
            theirs — and Gymsssy delivered. Drag the slider to see the full story.
          </motion.p>

          {/* Neon line */}
          <div className={styles.neonLineWrapper} aria-hidden="true">
            <div ref={neonLineRef} className={styles.neonLine} />
          </div>
        </motion.div>

        {/* ── TRANSFORMATION CARDS ──────────────────── */}
        <div className={styles.cardsWrapper}>
          {TRANSFORMATIONS.map((transformation, index) => (
            <TransformationCard
              key={transformation.id}
              transformation={transformation}
              index={index}
              isActive={index === activeIndex}
            />
          ))}
        </div>

        {/* ── STATS ROW ─────────────────────────────── */}
        <TransformationStats />

        {/* ── BOTTOM CTA ────────────────────────────── */}
        <motion.div
          className={styles.bottomCTA}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-5%" }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className={styles.ctaContent}>
            <p className={styles.ctaHeadline}>
              Your transformation starts here.
            </p>
            <p className={styles.ctaBody}>
              Book a free consultation and let our coaches build your
              personalised program today.
            </p>
          </div>
          <div className={styles.ctaActions}>
            <Link to="/contact" className={styles.ctaPrimary}>
              <span>Start My Transformation</span>
              <FiArrowRight className={styles.ctaArrow} />
            </Link>
            <Link to="/programs" className={styles.ctaSecondary}>
              View Programs
            </Link>
          </div>

          {/* Glow */}
          <div className={styles.ctaGlow} aria-hidden="true" />
        </motion.div>
      </div>

      {/* ── EDGE FADES ──────────────────────────────── */}
      <div className={styles.edgeFadeTop} aria-hidden="true" />
      <div className={styles.edgeFadeBottom} aria-hidden="true" />
    </section>
  );
};

export default Transformation;
