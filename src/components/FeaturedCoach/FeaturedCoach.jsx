import React, { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiAward, FiCheck } from "react-icons/fi";
import styles from "./FeaturedCoach.module.css";

gsap.registerPlugin(ScrollTrigger);

const FeaturedCoach = ({ coach, index }) => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const {
    name,
    position,
    experience,
    image,
    imageAlt,
    specializations,
    certifications,
    bio,
    imageLeft,
    accentStat,
  } = coach;

  // Subtle image parallax on scroll
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!imageRef.current) return;
      gsap.to(imageRef.current, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`${styles.coachSection} ${
        index % 2 !== 0 ? styles.coachSectionReverse : ""
      }`}
    >
      {/* ── Image Column ────────────────────────────────────── */}
      <motion.div
        className={styles.imageColumn}
        initial={{ opacity: 0, x: imageLeft ? -60 : 60 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className={styles.imageFrame}>
          <div className={styles.imageOverflowWrapper}>
            <img
              ref={imageRef}
              src={image}
              alt={imageAlt}
              className={styles.coachImage}
              loading="lazy"
            />
          </div>
          <div className={styles.imageGlowAccent} />

          {/* Accent stat card */}
          <div
            className={`${styles.statCard} ${
              imageLeft ? styles.statCardRight : styles.statCardLeft
            }`}
          >
            <span className={styles.statCardValue}>{accentStat.value}</span>
            <span className={styles.statCardLabel}>{accentStat.label}</span>
          </div>

          {/* Experience pill */}
          <div className={styles.expPill}>
            <FiAward className={styles.expIcon} />
            <span className={styles.expText}>
              {experience} Years Experience
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── Content Column ──────────────────────────────────── */}
      <motion.div
        ref={contentRef}
        className={styles.contentColumn}
        initial={{ opacity: 0, x: imageLeft ? 60 : -60 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{
          duration: 1,
          delay: 0.15,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        <span className={styles.coachEyebrow}>HEAD COACH</span>
        <h2 className={styles.coachName}>{name}</h2>
        <p className={styles.coachPosition}>{position}</p>

        {/* Specializations */}
        <div className={styles.specWrapper}>
          {specializations.map((spec) => (
            <span key={spec} className={styles.specTag}>
              {spec}
            </span>
          ))}
        </div>

        {/* Bio */}
        <p className={styles.coachBio}>{bio}</p>

        {/* Certifications */}
        <div className={styles.certWrapper}>
          <span className={styles.certHeading}>CERTIFICATIONS</span>
          <ul className={styles.certList}>
            {certifications.map((cert) => (
              <li key={cert} className={styles.certItem}>
                <span className={styles.certCheck}>
                  <FiCheck />
                </span>
                <span className={styles.certText}>{cert}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <motion.button
          className={styles.coachBtn}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          Book a Session
        </motion.button>
      </motion.div>

      {/* Section divider */}
      <div className={styles.sectionDivider} />
    </div>
  );
};

export default FeaturedCoach;
