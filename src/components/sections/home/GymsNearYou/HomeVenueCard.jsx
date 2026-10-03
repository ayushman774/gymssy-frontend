import { motion } from "framer-motion";
import { FiCheck, FiMapPin, FiStar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { FALLBACK_IMAGE, TYPE_LABELS } from "../../../Discover/DiscoveryCard/discoveryCardUtils.js";
import { homeVenueLocation, homeVenueTags } from "../../../../utils/homeMarketplace.js";
import styles from "../../../ui/GymCard/GymCard.module.css";
import FavoriteButton from "../../../Favorites/FavoriteButton.jsx";

export default function HomeVenueCard({ venue }) {
  const navigate = useNavigate();
  const location = homeVenueLocation(venue);
  const tags = homeVenueTags(venue);
  const viewVenue = () => navigate(venue.href);

  return (
    <motion.article
      className={`${styles.card} ${venue.featured ? styles.cardFeatured : ""}`}
      whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
    >
      <div className={styles.imageWrapper}>
        <img
          src={venue.image?.url || FALLBACK_IMAGE}
          alt={venue.image?.alt || venue.name}
          className={styles.image}
          loading="lazy"
          onError={(event) => { event.currentTarget.src = FALLBACK_IMAGE; }}
        />
        <div className={styles.imageOverlay} aria-hidden="true" />
        {venue.verified && (
          <div className={`${styles.openBadge} ${styles.openBadgeOpen}`}>
            <FiCheck aria-hidden="true" /> Verified
          </div>
        )}
        <div className={styles.distanceBadge}>
          {TYPE_LABELS[venue.entityType] || venue.entityType}
        </div>
        <div style={{ position: "absolute", bottom: 12, right: 12, zIndex: 4 }}><FavoriteButton targetType="gym" targetId={venue.id} name={venue.name} /></div>
      </div>

      <div className={styles.content}>
        <div className={styles.topRow}>
          <h3 className={styles.name}>{venue.name}</h3>
          <div className={styles.rating} aria-label={`${venue.rating || 0} rating from ${venue.reviewCount || 0} reviews`}>
            <FiStar className={styles.ratingIcon} aria-hidden="true" />
            <span className={styles.ratingValue}>{Number(venue.rating || 0).toFixed(1)}</span>
            <span className={styles.ratingCount}>({venue.reviewCount || 0})</span>
          </div>
        </div>

        {location && (
          <div className={styles.location}>
            <FiMapPin className={styles.locationIcon} aria-hidden="true" />
            <span>{location}</span>
          </div>
        )}

        {tags.length > 0 && (
          <div className={styles.tags}>
            {tags.slice(0, 4).map((tag) => (
              <span key={tag} className={styles.tag}>{tag.replaceAll("-", " ")}</span>
            ))}
          </div>
        )}

        <div className={styles.footer}>
          {venue.price ? (
            <div className={styles.price}>
              <span className={styles.priceFrom}>From</span>
              <span className={styles.priceValue}>{venue.price.currency}{venue.price.from}</span>
            </div>
          ) : <span className={styles.priceFrom}>View venue details</span>}
          <motion.button
            type="button"
            className={styles.btnSecondary}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={viewVenue}
          >
            View Details
          </motion.button>
        </div>
      </div>
      <div className={styles.hoverGlow} aria-hidden="true" />
    </motion.article>
  );
}
