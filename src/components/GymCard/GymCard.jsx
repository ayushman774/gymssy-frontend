import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  FiMapPin,
  FiClock,
  FiChevronRight,
  FiStar,
  FiNavigation,
} from "react-icons/fi";
import styles from "./GymCard.module.css";

const GymCard = ({ gym, index, isHighlighted, onViewDetails }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const {
    name,
    address,
    distance,
    image,
    rating,
    reviewCount,
    tags,
    hours,
    membershipFrom,
    featured,
    facilities,
  } = gym;

  return (
    <motion.article
      ref={ref}
      className={`${styles.card} ${isHighlighted ? styles.cardHighlighted : ""}`}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.65,
        delay: (index % 3) * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {/* Image */}
      <div className={styles.imageWrapper}>
        <img src={image} alt={name} className={styles.image} loading="lazy" />
        <div className={styles.imageOverlay} />

        {/* Badges */}
        <div className={styles.imageBadges}>
          {featured && (
            <span className={styles.featuredBadge}>
              <FiStar className={styles.featuredIcon} />
              Featured
            </span>
          )}
        </div>

        {/* Distance */}
        <div className={styles.distanceBadge}>
          <FiNavigation className={styles.distanceIcon} />
          {distance}
        </div>

        {/* Rating */}
        <div className={styles.ratingBadge}>
          <FiStar className={styles.ratingIcon} />
          <span className={styles.ratingValue}>{rating}</span>
          <span className={styles.ratingCount}>({reviewCount})</span>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.cardHeader}>
          <h3 className={styles.name}>{name}</h3>
          <div className={styles.address}>
            <FiMapPin className={styles.addressIcon} />
            <span>{address}</span>
          </div>
        </div>

        {/* Tags */}
        <div className={styles.tags}>
          {tags.slice(0, 3).map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className={styles.tagMore}>+{tags.length - 3}</span>
          )}
        </div>

        {/* Hours */}
        <div className={styles.hours}>
          <FiClock className={styles.hoursIcon} />
          <span className={styles.hoursText}>{hours.weekday}</span>
        </div>

        {/* Facilities preview */}
        <div className={styles.facilities}>
          {facilities.slice(0, 3).map((f) => (
            <span key={f} className={styles.facility}>
              {f}
            </span>
          ))}
        </div>

        {/* Pricing + CTA */}
        <div className={styles.cardFooter}>
          <div className={styles.pricing}>
            <span className={styles.pricingFrom}>From</span>
            <span className={styles.pricingValue}>${membershipFrom}</span>
            <span className={styles.pricingPer}>/mo</span>
          </div>

          <div className={styles.actions}>
            <motion.button
              className={styles.btnSecondary}
              onClick={onViewDetails}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              View Details
            </motion.button>
            <motion.a
              href="/memberships"
              className={styles.btnPrimary}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Join Now
              <FiChevronRight />
            </motion.a>
          </div>
        </div>
      </div>

      {/* Highlight glow top border */}
      <div className={styles.topBorder} />
    </motion.article>
  );
};

export default GymCard;
