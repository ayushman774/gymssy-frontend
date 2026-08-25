// src/components/CityListings/ListingCard/ListingCard.jsx

/**
 * ListingCard
 *
 * Used exclusively on the City Listings page.
 * Reuses the same navigation pattern as existing detail pages:
 *   /gyms/:slug
 *
 * Accepts the normalised listing shape from useCityListings.
 */

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiStar, FiMapPin, FiCheck, FiClock } from "react-icons/fi";
import { MdLocalFireDepartment } from "react-icons/md";
import styles from "./ListingCard.module.css";

/* ── safe image resolution ── */
const resolveImage = (image, fallbackAlt = "") => {
  if (!image) return { src: "", alt: fallbackAlt };
  if (typeof image === "string") return { src: image, alt: fallbackAlt };
  return { src: image.url ?? "", alt: image.alt ?? fallbackAlt };
};

/* ── safe location string ── */
const resolveArea = (location) => {
  if (!location) return "";
  if (typeof location === "string") return location;
  return [location.area, location.city].filter(Boolean).join(", ");
};

const ListingCard = ({ listing, index }) => {
  const {
    slug,
    name,
    category,
    location,
    rating,
    reviewCount,
    priceFrom,
    isOpen,
    isVerified,
    featured,
    image,
    images,
  } = listing;

  /* Prefer cover image, fall back to primary image */
  const coverSrc = images?.cover || null;
  const { src: imgSrc, alt: imgAlt } = resolveImage(
    coverSrc ? { url: coverSrc, alt: name } : image,
    name,
  );

  const areaText = resolveArea(location);

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-4%" }}
      transition={{
        duration: 0.5,
        delay: (index % 6) * 0.07,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -5, transition: { duration: 0.25 } }}
    >
      {/* ── Image ── */}
      <div className={styles.imageWrap}>
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={imgAlt}
            className={styles.image}
            loading={index < 3 ? "eager" : "lazy"}
          />
        ) : (
          <div className={styles.imagePlaceholder} aria-hidden="true" />
        )}
        <div className={styles.imageOverlay} />

        {/* Badges */}
        <div className={styles.badgeRow}>
          {featured && (
            <span className={styles.featuredBadge}>
              <MdLocalFireDepartment size={11} aria-hidden="true" />
              Featured
            </span>
          )}
          {isVerified && (
            <span className={styles.verifiedBadge}>
              <FiCheck size={10} aria-hidden="true" />
              Verified
            </span>
          )}
        </div>

        {/* Category */}
        <span className={styles.categoryBadge}>{category}</span>

        {/* Open/Closed */}
        <span
          className={`${styles.openBadge} ${
            isOpen ? styles.openBadgeOpen : styles.openBadgeClosed
          }`}
          aria-label={isOpen ? "Open now" : "Currently closed"}
        >
          <span className={styles.openDot} aria-hidden="true" />
          {isOpen ? "Open" : "Closed"}
        </span>
      </div>

      {/* ── Content ── */}
      <div className={styles.content}>
        <h3 className={styles.name}>{name}</h3>

        {areaText && (
          <div className={styles.locationRow}>
            <FiMapPin
              size={11}
              className={styles.locationIcon}
              aria-hidden="true"
            />
            <span className={styles.locationText}>{areaText}</span>
          </div>
        )}

        <div className={styles.metaRow}>
          {/* Rating */}
          {rating > 0 && (
            <div className={styles.ratingBlock}>
              <FiStar
                size={12}
                className={styles.starIcon}
                aria-hidden="true"
              />
              <span className={styles.ratingVal}>{rating}</span>
              {reviewCount > 0 && (
                <span className={styles.reviewCount}>
                  ({reviewCount.toLocaleString("en-IN")})
                </span>
              )}
            </div>
          )}

          {/* Price */}
          {priceFrom != null && (
            <div className={styles.priceBlock}>
              <span className={styles.priceFrom}>From</span>
              <span className={styles.priceVal}>
                ₹{priceFrom.toLocaleString("en-IN")}
              </span>
              <span className={styles.pricePer}>/mo</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <Link
          to={`/gym-detail/${slug}`}
          className={styles.viewBtn}
          aria-label={`View details for ${name}`}
        >
          View Details
        </Link>
      </div>

      {/* Hover border glow */}
      <div className={styles.borderGlow} aria-hidden="true" />
    </motion.div>
  );
};

export default ListingCard;
