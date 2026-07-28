import React from "react";
import { motion } from "framer-motion";
import { FiCheck, FiX } from "react-icons/fi";
import styles from "./MembershipCard.module.css";

const MembershipCard = ({ plan, onSelect }) => {
  const isPopular = plan.popular;
  const isPremium = plan.color === "premium";

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
        <span className={styles.planName}>{plan.name}</span>
        <span className={styles.planDuration}>{plan.duration}</span>
      </div>

      {/* Pricing */}
      <div className={styles.pricingBlock}>
        {plan.originalPrice && (
          <span className={styles.originalPrice}>
            {plan.currency}
            {plan.originalPrice.toLocaleString("en-IN")}
          </span>
        )}
        <div className={styles.priceRow}>
          <span className={styles.currency}>{plan.currency}</span>
          <span className={styles.price}>
            {plan.price.toLocaleString("en-IN")}
          </span>
        </div>
        <span className={styles.billingPeriod}>{plan.billingPeriod}</span>
        {plan.savings && (
          <span className={styles.savingsBadge}>{plan.savings}</span>
        )}
      </div>

      {/* Divider */}
      <div className={styles.divider} />

      {/* Features */}
      <ul className={styles.featureList}>
        {plan.features.map((feature, i) => (
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
        aria-label={`Select ${plan.name} plan — ${plan.currency}${plan.price} ${plan.billingPeriod}`}
      >
        {plan.cta}
      </button>

      {/* Note */}
      <p className={styles.note}>No hidden fees · Cancel anytime</p>
    </motion.div>
  );
};

export default MembershipCard;
