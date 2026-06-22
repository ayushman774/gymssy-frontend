import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FiCheck, FiChevronRight, FiZap } from "react-icons/fi";
import styles from "./PricingCard.module.css";

const PricingCard = ({ plan, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const {
    name,
    tagline,
    price,
    period,
    badge,
    features,
    cta,
    highlighted,
    accentColor,
  } = plan;

  return (
    <motion.div
      ref={ref}
      className={`${styles.card} ${highlighted ? styles.cardHighlighted : ""}`}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        y: highlighted ? -12 : -8,
        transition: { duration: 0.35, ease: "easeOut" },
      }}
    >
      {/* Animated border glow for highlighted card */}
      {highlighted && (
        <>
          <div className={styles.glowBorderTop} />
          <div className={styles.glowBorderBottom} />
          <div className={styles.cardGlowBg} />
        </>
      )}

      {/* Badge */}
      {badge && (
        <div
          className={`${styles.badge} ${
            highlighted ? styles.badgeGreen : styles.badgeBlue
          }`}
        >
          <FiZap className={styles.badgeIcon} />
          {badge}
        </div>
      )}

      {/* Header */}
      <div className={styles.cardHeader}>
        <h3 className={styles.planName}>{name}</h3>
        <p className={styles.planTagline}>{tagline}</p>
      </div>

      {/* Price */}
      <div className={styles.priceBlock}>
        <div className={styles.priceRow}>
          <span className={styles.priceCurrency}>$</span>
          <span
            className={`${styles.priceAmount} ${
              highlighted ? styles.priceAmountGreen : ""
            }`}
          >
            {price}
          </span>
        </div>
        <span className={styles.pricePeriod}>per {period}</span>
      </div>

      {/* Divider */}
      <div
        className={styles.divider}
        style={{
          background: highlighted
            ? "rgba(57, 255, 20, 0.25)"
            : "rgba(255,255,255,0.08)",
        }}
      />

      {/* Features */}
      <ul className={styles.featureList}>
        {features.map((feature, i) => (
          <motion.li
            key={feature}
            className={styles.featureItem}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.4,
              delay: index * 0.15 + 0.3 + i * 0.07,
            }}
          >
            <span
              className={`${styles.checkIcon} ${
                highlighted ? styles.checkIconGreen : styles.checkIconBlue
              }`}
            >
              <FiCheck />
            </span>
            <span className={styles.featureText}>{feature}</span>
          </motion.li>
        ))}
      </ul>

      {/* CTA */}
      <motion.button
        className={`${styles.ctaButton} ${
          highlighted ? styles.ctaButtonPrimary : styles.ctaButtonSecondary
        }`}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        {cta}
        <FiChevronRight className={styles.ctaIcon} />
      </motion.button>
    </motion.div>
  );
};

export default PricingCard;
