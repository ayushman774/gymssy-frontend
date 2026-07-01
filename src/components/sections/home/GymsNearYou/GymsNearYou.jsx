import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import GymCard from "../../../ui/GymCard/GymCard";
import SectionLabel from "../../../ui/SectionLabel/SectionLabel";
import { FEATURED_GYMS } from "../../../../assets/data/marketplace";
import styles from "./GymsNearYou.module.css";

gsap.registerPlugin(ScrollTrigger);

const GymsNearYou = () => {
  const sectionRef = useRef(null);
  const neonLineRef = useRef(null);

  const isInView = useInView(sectionRef, {
    once: true,
    margin: "-8% 0px",
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

      gsap.fromTo(
        `.${styles.cardSlot}`,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: `.${styles.grid}`,
            start: "top 80%",
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
      aria-labelledby="gyms-heading"
      id="gyms-near-you"
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
            <SectionLabel text="NEAR YOU" variant="light" />
          </motion.div>

          <div className={styles.headlineRow}>
            <motion.h2
              id="gyms-heading"
              className={styles.headline}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Popular Gyms{" "}
              <span className={styles.headlineAccent}>Near You</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link to="/locations" className={styles.viewAll}>
                View All Gyms
                <FiArrowRight className={styles.viewAllIcon} />
              </Link>
            </motion.div>
          </div>

          <motion.p
            className={styles.subCopy}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            Discover the highest-rated fitness centers in your area.
          </motion.p>

          <div className={styles.neonLineWrapper} aria-hidden="true">
            <div ref={neonLineRef} className={styles.neonLine} />
          </div>
        </div>

        {/* Cards */}
        <div
          className={styles.grid}
          role="list"
          aria-label="Featured gyms near you"
        >
          {FEATURED_GYMS.map((gym, index) => (
            <div key={gym.id} className={styles.cardSlot} role="listitem">
              <GymCard gym={gym} index={index} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className={styles.bottomCTA}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-5%" }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className={styles.ctaContent}>
            <p className={styles.ctaHeadline}>Explore all gyms in your city.</p>
            <p className={styles.ctaBody}>
              Filter by location, facilities, price, and more.
            </p>
          </div>
          <div className={styles.ctaActions}>
            <Link to="/locations" className={styles.ctaPrimary}>
              <span>View All Gyms</span>
              <FiArrowRight />
            </Link>
            <Link to="/contact" className={styles.ctaSecondary}>
              List Your Gym
            </Link>
          </div>
          <div className={styles.ctaGlow} aria-hidden="true" />
        </motion.div>
      </div>

      <div className={styles.edgeFadeTop} aria-hidden="true" />
      <div className={styles.edgeFadeBottom} aria-hidden="true" />
    </section>
  );
};

export default GymsNearYou;
