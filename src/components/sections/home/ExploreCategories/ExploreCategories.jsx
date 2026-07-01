import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import CategoryCard from "../../../ui/CategoryCard/CategoryCard";
import SectionLabel from "../../../ui/SectionLabel/SectionLabel";
import { CATEGORIES } from "../../../../assets/data/marketplace";
import styles from "./ExploreCategories.module.css";

gsap.registerPlugin(ScrollTrigger);

const ExploreCategories = () => {
  const sectionRef = useRef(null);
  const neonLineRef = useRef(null);

  const isInView = useInView(sectionRef, {
    once: true,
    margin: "-8% 0px",
  });

  useGSAP(
    () => {
      // Neon line draw
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

      // Cards stagger
      gsap.fromTo(
        `.${styles.cardSlot}`,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
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
      aria-labelledby="categories-heading"
      id="categories"
    >
      {/* Backgrounds */}
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
            <SectionLabel text="BROWSE BY CATEGORY" variant="light" />
          </motion.div>

          <div className={styles.headlineRow}>
            <motion.h2
              id="categories-heading"
              className={styles.headline}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Explore <span className={styles.headlineAccent}>Categories</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link to="/categories" className={styles.viewAll}>
                View All
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
            Choose your preferred fitness experience.
          </motion.p>

          {/* Neon line */}
          <div className={styles.neonLineWrapper} aria-hidden="true">
            <div ref={neonLineRef} className={styles.neonLine} />
          </div>
        </div>

        {/* Grid */}
        <div
          className={styles.grid}
          role="list"
          aria-label="Fitness categories"
        >
          {CATEGORIES.map((cat, index) => (
            <div key={cat.id} className={styles.cardSlot} role="listitem">
              <CategoryCard category={cat} index={index} />
            </div>
          ))}
        </div>
      </div>

      {/* Edge fades */}
      <div className={styles.edgeFadeTop} aria-hidden="true" />
      <div className={styles.edgeFadeBottom} aria-hidden="true" />
    </section>
  );
};

export default ExploreCategories;
