import React from "react";
import { motion } from "framer-motion";
import { FiCheck, FiX } from "react-icons/fi";
import styles from "./MembershipCard.module.css";

const MembershipCard = ({ membership, onSelect }) => {
  const isPopular = membership.popular || false;
  const isPremium = membership.color === "premium";

  return (
    <motion.div
      className={`${styles.card} ${isPopular ? styles.cardPopular : ""} ${
        isPremium ? styles.cardPremium : ""
      }`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      style={{ scrollSnapAlign: "start", flexShrink: 0, minWidth: "260px" }}
    >
      {/* Popular Badge */}
      {isPopular && <div className={styles.popularBadge}>MOST POPULAR</div>}
      {isPremium && !isPopular && (
        <div className={styles.premiumBadge}>BEST VALUE</div>
      )}

      {/* Plan Header */}
      <div className={styles.planHeader}>
        <span className={styles.planName}>{membership.name}</span>
        <span className={styles.planDuration}>{membership.duration}</span>
      </div>

      {/* Pricing */}
      <div className={styles.pricingBlock}>
        {membership.originalPrice && (
          <span className={styles.originalPrice}>
            {membership.currency}
            {membership.originalPrice.toLocaleString("en-IN")}
          </span>
        )}
        <div className={styles.priceRow}>
          <span className={styles.currency}>{membership.currency}</span>
          <span className={styles.price}>
            {membership.price.toLocaleString("en-IN")}
          </span>
        </div>
        <span className={styles.billingPeriod}>{membership.billingPeriod}</span>
        {membership.savings && (
          <span className={styles.savingsBadge}>{membership.savings}</span>
        )}
      </div>

      {/* Divider */}
      <div className={styles.divider} />

      {/* Features */}
      <ul className={styles.featureList}>
        {membership.features.map((feature, i) => (
          <li
            key={i}
            className={`${styles.featureItem} ${
              !feature.included ? styles.featureExcluded : ""
            }`}
          >
            {feature.included ? (
              <FiCheck className={styles.featureCheck} />
            ) : (
              <FiX className={styles.featureCross} />
            )}
            <span>{feature.text}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        className={`${styles.cta} ${isPopular ? styles.ctaPopular : ""}`}
        onClick={onSelect}
        aria-label={`Select ${membership.name} membership — ${membership.currency}${membership.price} ${membership.billingPeriod}`}
      >
        {membership.cta}
      </button>

      {/* Note */}
      <p className={styles.note}>No hidden fees · Cancel anytime</p>
    </motion.div>
  );
};

export default MembershipCard;
