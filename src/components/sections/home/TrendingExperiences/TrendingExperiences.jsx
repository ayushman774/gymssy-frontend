import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiClock, FiUsers, FiStar, FiArrowRight } from "react-icons/fi";
import { MdLocalFireDepartment } from "react-icons/md";
import SectionLabel from "../../../ui/SectionLabel/SectionLabel";
import { TRENDING_EXPERIENCES } from "../../../../assets/data/marketplace";
import styles from "./TrendingExperiences.module.css";

gsap.registerPlugin(ScrollTrigger);

const ExperienceCard = ({ exp, index }) => {
  const {
    title,
    category,
    image,
    duration,
    level,
    rating,
    priceFrom,
    spots,
    trending,
  } = exp;

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{
        duration: 0.65,
        delay: (index % 3) * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      {/* Image */}
      <div className={styles.imageWrapper}>
        <img src={image} alt={title} className={styles.image} loading="lazy" />
        <div className={styles.imageOverlay} />

        {trending && (
          <div className={styles.trendBadge}>
            <MdLocalFireDepartment className={styles.trendIcon} />
            Trending
          </div>
        )}

        <div className={styles.categoryBadge}>{category}</div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>

        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <FiClock className={styles.metaIcon} />
            {duration}
          </span>
          <span className={styles.metaItem}>
            <FiUsers className={styles.metaIcon} />
            {spots} spots left
          </span>
          <span className={styles.metaItem}>
            <FiStar className={`${styles.metaIcon} ${styles.starIcon}`} />
            {rating}
          </span>
        </div>

        <span className={styles.level}>{level}</span>

        <div className={styles.footer}>
          <div className={styles.price}>
            <span className={styles.priceFrom}>From</span>
            <span className={styles.priceVal}>${priceFrom}</span>
          </div>
          <motion.button
            className={styles.bookBtn}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Book Now
            <FiArrowRight />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const TrendingExperiences = () => {
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
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="trending-heading"
      id="trending"
    >
      <div className={styles.bgGradient} aria-hidden="true" />
      <div className={styles.bgNoise} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.header}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <SectionLabel text="HOT RIGHT NOW" variant="light" />
          </motion.div>

          <motion.h2
            id="trending-heading"
            className={styles.headline}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Trending Fitness{" "}
            <span className={styles.headlineAccent}>Experiences</span>
          </motion.h2>

          <motion.p
            className={styles.subCopy}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            The most popular fitness sessions this week.
          </motion.p>

          <div className={styles.neonLineWrapper} aria-hidden="true">
            <div ref={neonLineRef} className={styles.neonLine} />
          </div>
        </div>

        <div className={styles.grid}>
          {TRENDING_EXPERIENCES.map((exp, index) => (
            <ExperienceCard key={exp.id} exp={exp} index={index} />
          ))}
        </div>
      </div>

      <div className={styles.edgeFadeTop} aria-hidden="true" />
      <div className={styles.edgeFadeBottom} aria-hidden="true" />
    </section>
  );
};

export default TrendingExperiences;
