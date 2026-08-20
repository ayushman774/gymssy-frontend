import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import SectionLabel from "../../../ui/SectionLabel/SectionLabel";
import styles from "./FitnessSection.module.css";

/* ══════════════════════════════════════════════════════
   FITNESS SECTION WRAPPER
   Reusable section shell — mirrors ExploreCategories
   and GymsNearYou section architecture.
══════════════════════════════════════════════════════ */
const FitnessSection = ({
  id,
  label,
  title,
  titleAccent,
  subtitle,
  viewAllHref,
  viewAllText = "View All",
  children,
  neonColor = "#39ff14",
  className = "",
}) => {
  const sectionRef = useRef(null);
  const neonLineRef = useRef(null);

  const isInView = useInView(sectionRef, {
    once: true,
    margin: "-8% 0px",
  });

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${className}`}
      id={id}
      aria-labelledby={`${id}-heading`}
      style={{ "--neon": neonColor }}
    >
      <div className={styles.bgGradient} aria-hidden="true" />
      <div className={styles.bgNoise} aria-hidden="true" />

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          {label && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <SectionLabel text={label} variant="light" />
            </motion.div>
          )}

          <div className={styles.headlineRow}>
            <motion.h2
              id={`${id}-heading`}
              className={styles.headline}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {title}
              {titleAccent && (
                <span className={styles.headlineAccent}> {titleAccent}</span>
              )}
            </motion.h2>

            {viewAllHref && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Link
                  to={viewAllHref}
                  className={styles.viewAll}
                  aria-label={`${viewAllText} — see more`}
                >
                  {viewAllText}
                  <FiArrowRight
                    className={styles.viewAllIcon}
                    aria-hidden="true"
                  />
                </Link>
              </motion.div>
            )}
          </div>

          {subtitle && (
            <motion.p
              className={styles.subCopy}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.25 }}
            >
              {subtitle}
            </motion.p>
          )}

          {/* Neon line */}
          <div className={styles.neonLineWrapper} aria-hidden="true">
            <motion.div
              ref={neonLineRef}
              className={styles.neonLine}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            />
          </div>
        </div>

        {/* Slot for section content */}
        {children}
      </div>

      <div className={styles.edgeFadeTop} aria-hidden="true" />
      <div className={styles.edgeFadeBottom} aria-hidden="true" />
    </section>
  );
};

export default FitnessSection;
