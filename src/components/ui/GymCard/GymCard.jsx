import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiStar,
  FiMapPin,
  FiClock,
  FiChevronRight,
  FiNavigation,
} from "react-icons/fi";
import styles from "./GymCard.module.css";

const GymCard = ({ gym }) => {
  const {
    id,
    name,
    image,
    rating,
    reviewCount,
    distance,
    location,
    facilities,
    priceFrom,
    isOpen,
    tags,
    featured,
  } = gym;

  return (
    <motion.article
      className={`${styles.card} ${featured ? styles.cardFeatured : ""}`}
      whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
    >
      {/* Image */}
      <div className={styles.imageWrapper}>
        <img src={image} alt={name} className={styles.image} loading="lazy" />
        <div className={styles.imageOverlay} />

        {/* Open badge */}
        <div
          className={`${styles.openBadge} ${
            isOpen ? styles.openBadgeOpen : styles.openBadgeClosed
          }`}
        >
          <span className={styles.openDot} />
          {isOpen ? "Open Now" : "Closed"}
        </div>

        {/* Featured badge */}
        {featured && (
          <div className={styles.featuredBadge}>
            <FiStar className={styles.featuredIcon} />
            Featured
          </div>
        )}

        {/* Distance */}
        <div className={styles.distanceBadge}>
          <FiNavigation className={styles.distanceIcon} />
          {distance}
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.topRow}>
          <h3 className={styles.name}>{name}</h3>
          <div className={styles.rating}>
            <FiStar className={styles.ratingIcon} />
            <span className={styles.ratingValue}>{rating}</span>
            <span className={styles.ratingCount}>({reviewCount})</span>
          </div>
        </div>

        <div className={styles.location}>
          <FiMapPin className={styles.locationIcon} />
          <span>{location}</span>
        </div>

        {/* Tags */}
        <div className={styles.tags}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>

        {/* Facilities */}
        <div className={styles.facilities}>
          {facilities.slice(0, 3).map((f) => (
            <span key={f} className={styles.facility}>
              <span className={styles.facilityDot} aria-hidden="true" />
              {f}
            </span>
          ))}
          {facilities.length > 3 && (
            <span className={styles.facilityMore}>
              +{facilities.length - 3} more
            </span>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.price}>
            <span className={styles.priceFrom}>From</span>
            <span className={styles.priceValue}>${priceFrom}</span>
            <span className={styles.pricePer}>/mo</span>
          </div>
          <div className={styles.actions}>
            <motion.button
              className={styles.btnSecondary}
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

      {/* Hover glow */}
      <div className={styles.hoverGlow} aria-hidden="true" />
    </motion.article>
  );
};

export default GymCard;
