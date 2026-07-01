import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import TrainerCard from "../../../ui/TrainerCard/TrainerCard";
import SectionLabel from "../../../ui/SectionLabel/SectionLabel";
import { FEATURED_TRAINERS } from "../../../../assets/data/marketplace";
import styles from "./FeaturedTrainers.module.css";

gsap.registerPlugin(ScrollTrigger);

const FeaturedTrainers = () => {
  const sectionRef = useRef(null);
  const neonLineRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isInView = useInView(sectionRef, {
    once: true,
    margin: "-8% 0px",
  });

  const VISIBLE = 3;

  const goNext = () =>
    setActiveIndex((p) => (p + 1) % FEATURED_TRAINERS.length);
  const goPrev = () =>
    setActiveIndex(
      (p) => (p - 1 + FEATURED_TRAINERS.length) % FEATURED_TRAINERS.length,
    );

  const visible = Array.from({ length: VISIBLE }, (_, i) => {
    const idx = (activeIndex + i) % FEATURED_TRAINERS.length;
    return { ...FEATURED_TRAINERS[idx], slotIndex: i };
  });

  useGSAP(
    () => {
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
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="trainers-heading"
      id="featured-trainers"
    >
      <div className={styles.bgGradient} aria-hidden="true" />
      <div className={styles.bgNoise} aria-hidden="true" />

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <SectionLabel text="EXPERT COACHES" variant="light" />
          </motion.div>

          <div className={styles.headlineRow}>
            <motion.h2
              id="trainers-heading"
              className={styles.headline}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Featured <span className={styles.headlineAccent}>Trainers</span>
            </motion.h2>

            {/* Nav Controls */}
            <motion.div
              className={styles.navControls}
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              <button
                className={styles.navBtn}
                onClick={goPrev}
                aria-label="Previous trainer"
              >
                <FiChevronLeft />
              </button>
              <div className={styles.navPips}>
                {FEATURED_TRAINERS.map((_, i) => (
                  <button
                    key={i}
                    className={`${styles.pip} ${i === activeIndex ? styles.pipActive : ""}`}
                    onClick={() => setActiveIndex(i)}
                    aria-label={`Trainer ${i + 1}`}
                  />
                ))}
              </div>
              <button
                className={styles.navBtn}
                onClick={goNext}
                aria-label="Next trainer"
              >
                <FiChevronRight />
              </button>
            </motion.div>
          </div>

          <motion.p
            className={styles.subCopy}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            Connect with certified coaches across every discipline.
          </motion.p>

          <div className={styles.neonLineWrapper} aria-hidden="true">
            <div ref={neonLineRef} className={styles.neonLine} />
          </div>
        </div>

        {/* Carousel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            className={styles.cardsRow}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
          >
            {visible.map((trainer, i) => (
              <TrainerCard
                key={`${trainer.id}-${i}`}
                trainer={trainer}
                isCenter={i === 1}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={styles.edgeFadeTop} aria-hidden="true" />
      <div className={styles.edgeFadeBottom} aria-hidden="true" />
    </section>
  );
};

export default FeaturedTrainers;
