import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { FiCheck, FiX, FiArrowRight, FiZap } from "react-icons/fi";
import styles from "./PricingCard.module.css";

// ── Feature row ───────────────────────────────────────────────────────────
const FeatureRow = ({ feature, index, isVisible }) => (
  <motion.li
    className={`
      ${styles.featureItem}
      ${!feature.included ? styles.featureExcluded : ""}
    `}
    initial={{ opacity: 0, x: -12 }}
    animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
    transition={{
      duration: 0.4,
      delay: 0.5 + index * 0.04,
      ease: [0.25, 0.46, 0.45, 0.94],
    }}
  >
    <span
      className={`
        ${styles.featureIcon}
        ${feature.included ? styles.featureIconCheck : styles.featureIconX}
      `}
      aria-hidden="true"
    >
      {feature.included ? <FiCheck /> : <FiX />}
    </span>
    <span className={styles.featureText}>{feature.text}</span>
  </motion.li>
);

// ── Animated price ────────────────────────────────────────────────────────
const AnimatedPrice = ({ price, isAnnual }) => {
  return (
    <div className={styles.priceBlock}>
      <span className={styles.priceCurrency}>$</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={`${price}-${isAnnual}`}
          className={styles.priceAmount}
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{
            duration: 0.35,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        >
          {price}
        </motion.span>
      </AnimatePresence>
      <div className={styles.pricePeriod}>
        <span>/ mo</span>
        {isAnnual && (
          <motion.span
            className={styles.billedAnnually}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            billed annually
          </motion.span>
        )}
      </div>
    </div>
  );
};

// ── PricingCard ───────────────────────────────────────────────────────────
const PricingCard = ({ plan, isAnnual, index, isInView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const isPopular = plan.badge === "Most Popular";
  const isPremium = plan.color === "blue";
  const isNeon = plan.color === "neon";

  // 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-4deg", "4deg"]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) / (rect.width / 2));
    mouseY.set((e.clientY - centerY) / (rect.height / 2));
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
  const savings = plan.monthlyPrice - plan.annualPrice;

  return (
    <motion.div
      ref={cardRef}
      className={`
        ${styles.cardOuter}
        ${isPopular ? styles.cardPopular : ""}
        ${isPremium ? styles.cardPremium : ""}
      `}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={
        isInView
          ? {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                duration: 0.75,
                delay: index * 0.15,
                ease: [0.25, 0.46, 0.45, 0.94],
              },
            }
          : {}
      }
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        zIndex: isPopular ? 2 : 1,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── POPULAR GLOW HALO ─────────────────────── */}
      {isPopular && <div className={styles.popularHalo} aria-hidden="true" />}

      <div
        className={`
          ${styles.card}
          ${isPopular ? styles.cardNeon : ""}
          ${isPremium ? styles.cardBlue : ""}
          ${isHovered ? styles.cardHovered : ""}
        `}
      >
        {/* ── GLASS NOISE TEXTURE ───────────────────── */}
        <div className={styles.glassNoise} aria-hidden="true" />

        {/* ── INNER GLOW ────────────────────────────── */}
        <div
          className={`
            ${styles.innerGlow}
            ${isNeon ? styles.innerGlowNeon : ""}
            ${isPremium ? styles.innerGlowBlue : ""}
          `}
          style={{ opacity: isHovered ? 1 : 0.5 }}
          aria-hidden="true"
        />

        {/* ── HEADER ────────────────────────────────── */}
        <div className={styles.cardHeader}>
          {/* Badge */}
          {plan.badge && (
            <motion.div
              className={`
                ${styles.badge}
                ${isNeon ? styles.badgeNeon : ""}
                ${isPremium ? styles.badgeBlue : ""}
              `}
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.5,
                delay: index * 0.15 + 0.3,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            >
              {isNeon && (
                <FiZap className={styles.badgeIcon} aria-hidden="true" />
              )}
              {plan.badge}
            </motion.div>
          )}

          {/* Plan icon + name */}
          <div className={styles.planMeta}>
            <span className={styles.planIcon} aria-hidden="true">
              {plan.icon}
            </span>
            <div>
              <h3 className={styles.planName}>{plan.name}</h3>
              <p className={styles.planTagline}>{plan.tagline}</p>
            </div>
          </div>

          {/* Price */}
          <AnimatedPrice price={price} isAnnual={isAnnual} />

          {/* Annual savings callout */}
          <AnimatePresence>
            {isAnnual && (
              <motion.div
                className={styles.savingsCallout}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className={styles.savingsText}>
                  You save ${savings * 12}/year
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Description */}
          <p className={styles.planDescription}>{plan.description}</p>
        </div>

        {/* ── DIVIDER ───────────────────────────────── */}
        <div
          className={`
            ${styles.divider}
            ${isNeon ? styles.dividerNeon : ""}
            ${isPremium ? styles.dividerBlue : ""}
          `}
          aria-hidden="true"
        />

        {/* ── FEATURES ──────────────────────────────── */}
        <div className={styles.featuresSection}>
          <span className={styles.featuresLabel}>What's included</span>
          <ul
            className={styles.featuresList}
            role="list"
            aria-label={`${plan.name} plan features`}
          >
            {plan.features.map((feature, i) => (
              <FeatureRow
                key={i}
                feature={feature}
                index={i}
                isVisible={isInView}
              />
            ))}
          </ul>
        </div>

        {/* ── CTA BUTTON ────────────────────────────── */}
        <div className={styles.ctaWrapper}>
          <Link
            to={plan.href}
            className={`
              ${styles.ctaBtn}
              ${isNeon ? styles.ctaBtnNeon : ""}
              ${isPremium ? styles.ctaBtnBlue : ""}
              ${!isNeon && !isPremium ? styles.ctaBtnDefault : ""}
            `}
            aria-label={`${plan.cta} — ${plan.name} plan`}
          >
            <span>{plan.cta}</span>
            <FiArrowRight className={styles.ctaBtnIcon} />

            {/* Shimmer */}
            <span className={styles.ctaShimmer} aria-hidden="true" />
          </Link>

          <p className={styles.ctaNote}>No contract · Cancel anytime</p>
        </div>

        {/* ── CORNER ACCENTS (popular only) ─────────── */}
        {isPopular && (
          <>
            <div
              className={`${styles.corner} ${styles.cornerTL}`}
              aria-hidden="true"
            />
            <div
              className={`${styles.corner} ${styles.cornerBR}`}
              aria-hidden="true"
            />
          </>
        )}
      </div>
    </motion.div>
  );
};

export default PricingCard;
