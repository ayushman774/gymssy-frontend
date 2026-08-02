import { useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiStar,
  FiMapPin,
  FiNavigation,
  FiHeart,
  FiArrowRight,
  FiCheckCircle,
} from "react-icons/fi";
import { MdLocalFireDepartment } from "react-icons/md";
import styles from "./RecentlyViewedCard.module.css";

/* ══════════════════════════════════════════════════════
   CATEGORY → accent colour map
   Keeps cards visually distinct without new design patterns
══════════════════════════════════════════════════════ */
const CATEGORY_COLORS = {
  "Premium Gym": "#39ff14",
  "24/7 Gym": "#39ff14",
  Yoga: "#39ff14",
  CrossFit: "#39ff14",
  Pilates: "#39ff14",
  Swimming: "#39ff14",
  "Yoga & Wellness": "#39ff14",
};

const getCategoryColor = (category) => CATEGORY_COLORS[category] ?? "#39ff14";

/* ══════════════════════════════════════════════════════
   CARD
══════════════════════════════════════════════════════ */
const RecentlyViewedCard = ({ gym, index = 0 }) => {
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef(null);

  const {
    slug,
    name,
    category,
    location,
    distance,
    rating,
    reviews,
    priceFrom,
    isOpen,
    isVerified,
    image,
  } = gym;

  const accentColor = getCategoryColor(category);

  /* ── Handlers ── */
  const handleWishlist = useCallback((e) => {
    e.stopPropagation();
    setWishlisted((prev) => !prev);
  }, []);

  const handleViewDetails = useCallback(
    (e) => {
      e.stopPropagation();
      navigate(`/gym-detail/${slug}`);
    },
    [navigate, slug],
  );

  const handleCardClick = useCallback(() => {
    navigate(`/gym-detail/${slug}`);
  }, [navigate, slug]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        navigate(`/gym-detail/${slug}`);
      }
    },
    [navigate, slug],
  );

  /* ── Format helpers ── */
  const formattedReviews =
    reviews >= 1000 ? `${(reviews / 1000).toFixed(1)}k` : reviews.toString();

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(priceFrom);

  return (
    <motion.article
      ref={cardRef}
      className={styles.card}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="article"
      aria-label={`${name} — ${category} in ${location}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-4%" }}
      transition={{
        duration: 0.6,
        delay: Math.min(index * 0.08, 0.4),
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover="hover"
    >
      {/* ══ IMAGE BLOCK ══ */}
      <div className={styles.imageBlock}>
        {/* Skeleton shimmer */}
        {!imageLoaded && <div className={styles.skeleton} aria-hidden="true" />}

        <motion.img
          src={image}
          alt={`${name} gym facility`}
          className={styles.image}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          style={{ opacity: imageLoaded ? 1 : 0 }}
          variants={{
            hover: {
              scale: 1.07,
              transition: { duration: 0.55, ease: "easeOut" },
            },
          }}
        />

        {/* Gradient overlay */}
        <div className={styles.imageOverlay} aria-hidden="true" />

        {/* Top-left: Open/Closed badge */}
        <div
          className={`${styles.statusBadge} ${isOpen ? styles.statusOpen : styles.statusClosed}`}
          aria-label={isOpen ? "Open now" : "Currently closed"}
        >
          <span
            className={`${styles.statusDot} ${isOpen ? styles.dotOpen : styles.dotClosed}`}
            aria-hidden="true"
          />
          {isOpen ? "Open Now" : "Closed"}
        </div>

        {/* Top-right: Wishlist */}
        <motion.button
          className={`${styles.wishlistBtn} ${wishlisted ? styles.wishlistActive : ""}`}
          onClick={handleWishlist}
          aria-label={
            wishlisted
              ? `Remove ${name} from wishlist`
              : `Add ${name} to wishlist`
          }
          aria-pressed={wishlisted}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.88 }}
        >
          <FiHeart className={styles.heartIcon} aria-hidden="true" />
        </motion.button>

        {/* Bottom-left: Category pill */}
        <div
          className={styles.categoryPill}
          style={{
            "--cat-color": accentColor,
            borderColor: `${accentColor}40`,
            color: accentColor,
          }}
        >
          {category}
        </div>
      </div>

      {/* ══ CONTENT BLOCK ══ */}
      <div className={styles.contentBlock}>
        {/* Name + Verified */}
        <div className={styles.nameRow}>
          <h3 className={styles.gymName}>{name}</h3>
          {isVerified && (
            <span
              className={styles.verifiedBadge}
              aria-label="Verified gym"
              title="Gymssy Verified"
            >
              <FiCheckCircle
                className={styles.verifiedIcon}
                aria-hidden="true"
              />
            </span>
          )}
        </div>

        {/* Location + Distance */}
        <div className={styles.locationRow}>
          <span className={styles.locationItem}>
            <FiMapPin className={styles.locationIcon} aria-hidden="true" />
            {location}
          </span>
          <span className={styles.distancePill}>
            <FiNavigation className={styles.distanceIcon} aria-hidden="true" />
            {distance}
          </span>
        </div>

        {/* Rating */}
        <div
          className={styles.ratingRow}
          aria-label={`Rated ${rating} out of 5`}
        >
          <FiStar className={styles.starIcon} aria-hidden="true" />
          <span className={styles.ratingVal}>{rating.toFixed(1)}</span>
          <span className={styles.reviewCount}>
            ({formattedReviews} reviews)
          </span>
        </div>

        {/* Divider */}
        <div className={styles.divider} aria-hidden="true" />

        {/* Footer: Price + CTA */}
        <div className={styles.footer}>
          <div className={styles.priceBlock}>
            <span className={styles.priceFrom}>From</span>
            <span className={styles.priceVal}>{formattedPrice}</span>
            <span className={styles.pricePer}>/mo</span>
          </div>

          <motion.button
            className={styles.viewBtn}
            onClick={handleViewDetails}
            aria-label={`View details for ${name}`}
            style={{ "--btn-color": accentColor }}
            whileHover={{
              scale: 1.04,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.96 }}
          >
            View Details
            <FiArrowRight className={styles.viewBtnIcon} aria-hidden="true" />
          </motion.button>
        </div>
      </div>

      {/* Hover neon border */}
      <motion.div
        className={styles.hoverBorder}
        style={{ "--border-color": accentColor }}
        variants={{
          hover: {
            opacity: 1,
            transition: { duration: 0.3 },
          },
        }}
        initial={{ opacity: 0 }}
        aria-hidden="true"
      />
    </motion.article>
  );
};

export default RecentlyViewedCard;
