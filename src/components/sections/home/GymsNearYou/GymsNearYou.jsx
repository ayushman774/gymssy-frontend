import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { FiAlertCircle, FiArrowRight, FiRefreshCw } from "react-icons/fi";
import SectionLabel from "../../../ui/SectionLabel/SectionLabel";
import useHomeVenues from "../../../../hooks/useHomeVenues.js";
import HomeVenueCard from "./HomeVenueCard.jsx";
import styles from "./GymsNearYou.module.css";

gsap.registerPlugin(ScrollTrigger);

const GymsNearYou = () => {
  const sectionRef = useRef(null);
  const neonLineRef = useRef(null);
  const { listings: venues, loading, error, retry } = useHomeVenues();

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

      if (!loading && !error && venues.length) {
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
      }
    },
    { scope: sectionRef, dependencies: [loading, error, venues.length] },
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
            <SectionLabel text="RECOMMENDED VENUES" variant="light" />
          </motion.div>

          <div className={styles.headlineRow}>
            <motion.h2
              id="gyms-heading"
              className={styles.headline}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Explore Gyms &amp;{" "}
              <span className={styles.headlineAccent}>Fitness Venues</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link to="/gyms-near-you" className={styles.viewAll}>
                Browse by City
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
            Browse published physical venues from across the Gymssy marketplace.
          </motion.p>

          <div className={styles.neonLineWrapper} aria-hidden="true">
            <div ref={neonLineRef} className={styles.neonLine} />
          </div>
        </div>

        {/* Cards */}
        {loading && (
          <div className={styles.grid} aria-label="Loading recommended venues" aria-busy="true">
            {[0, 1, 2, 3].map((item) => <div key={item} className={styles.skeletonCard} aria-hidden="true"><div className={styles.skeletonImage} /><div className={styles.skeletonBody}><span /><span /><span /></div></div>)}
          </div>
        )}

        {!loading && error && (
          <div className={styles.sectionState} role="alert">
            <FiAlertCircle aria-hidden="true" />
            <p>Unable to load venues right now.</p>
            <button type="button" onClick={retry}><FiRefreshCw aria-hidden="true" /> Try Again</button>
          </div>
        )}

        {!loading && !error && venues.length > 0 && (
          <div className={styles.grid} role="list" aria-label="Recommended fitness venues">
            {venues.map((venue) => (
              <div key={venue.id} className={styles.cardSlot} role="listitem">
                <HomeVenueCard venue={venue} />
              </div>
            ))}
          </div>
        )}

        {!loading && !error && venues.length === 0 && (
          <div className={styles.sectionState} role="status"><p>No published venues are available right now.</p></div>
        )}

        {/* Bottom CTA */}
        <motion.div
          className={styles.bottomCTA}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-5%" }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className={styles.ctaContent}>
            <p className={styles.ctaHeadline}>Explore fitness venues by City.</p>
            <p className={styles.ctaBody}>
              Filter by location, facilities, price, and more.
            </p>
          </div>
          <div className={styles.ctaActions}>
            <Link to="/gyms-near-you" className={styles.ctaPrimary}>
              <span>Browse Venues</span>
              <FiArrowRight />
            </Link>
            <Link to="/contact" className={styles.ctaSecondary}>
              List Your Gym
            </Link>
          </div>
          <div className={styles.ctaGlow} aria-hidden="true" />
        </motion.div>
      </div>

      <div className={styles.edgeFadeBottom} aria-hidden="true" />
    </section>
  );
};

export default GymsNearYou;
