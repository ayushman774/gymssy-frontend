import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MdVerified, MdStar, MdCompareArrows,
  MdSecurity, MdLocalOffer, MdRateReview,
} from "react-icons/md";
import SectionLabel from "../../../ui/SectionLabel/SectionLabel";
import { WHY_FEATURES } from "../../../../assets/data/marketplace";
import styles from "./WhyChooseUs.module.css";

gsap.registerPlugin(ScrollTrigger);

const iconMap = {
  verified:  <MdVerified />,
  trainers:  <MdStar />,
  compare:   <MdCompareArrows />,
  secure:    <MdSecurity />,
  deals:     <MdLocalOffer />,
  reviews:   <MdRateReview />,
};

const FeatureCard = ({ feature, index }) => {
  const isGreen = feature.color === "green";

  return (
    <motion.div
      className={`${styles.card} ${isGreen ? styles.cardGreen : styles.cardBlue}`}
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
      <div className={`${styles.iconBox} ${isGreen ? styles.iconBoxGreen : styles.iconBoxBlue}`}>
        <span className={styles.icon}>{iconMap[feature.id]}</span>
      </div>
      <h3 className={styles.title}>{feature.title}</h3>
      <p className={styles.desc}>{feature.description}</p>
      <div className={`${styles.cardAccent} ${isGreen ? styles.accentGreen : styles.accentBlue}`} />
    </motion.div>
  );
};

const WhyChooseUs = () => {
  const sectionRef = useRef(null);
  const neonLineRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-8% 0px" });

  useGSAP(
    () => {
      gsap.fromTo(
        neonLineRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1, opacity: 1, duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="why-heading"
      id="why-us"
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
            <SectionLabel text="THE APEX ADVANTAGE" variant="light" />
          </motion.div>

          <motion.h2
            id="why-heading"
            className={styles.headline}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Why Choose Our{" "}
            <span className={styles.headlineAccent}>Marketplace</span>
          </motion.h2>

          <motion.p
            className={styles.subCopy}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            Built for fitness seekers. Trusted by thousands.
          </motion.p>

          <div className={styles.neonLineWrapper} aria-hidden="true">
            <div ref={neonLineRef} className={styles.neonLine} />
          </div>
        </div>

        <div className={styles.grid}>
          {WHY_FEATURES.map((f, i) => (
            <FeatureCard key={f.id} feature={f} index={i} />
          ))}
        </div>
      </div>

      <div className={styles.edgeFadeTop} aria-hidden="true" />
      <div className={styles.edgeFadeBottom} aria-hidden="true" />
    </section>
  );
};

export default WhyChooseUs;