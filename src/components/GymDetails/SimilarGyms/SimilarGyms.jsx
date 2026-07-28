import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiStar, FiMapPin } from "react-icons/fi";
import styles from "./SimilarGyms.module.css";

const SimilarGyms = ({ gyms, onBookVisit }) => {
  if (!gyms || gyms.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>You May Also Like</h2>
            <p className={styles.subtitle}>
              Explore more highly rated fitness destinations near you.
            </p>
          </div>
          <Link to="/gyms" className={styles.viewAllLink}>
            View All Gyms
          </Link>
        </div>

        <div className={styles.grid}>
          {gyms.map((gym, i) => (
            <motion.div
              key={gym.id}
              className={styles.card}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              whileHover={{ y: -5 }}
            >
              {/* Image */}
              <div className={styles.imageWrap}>
                <img
                  src={gym.images.cover}
                  alt={gym.name}
                  className={styles.image}
                  loading="lazy"
                />
                {gym.verified && (
                  <span className={styles.verifiedBadge}>✓ Verified</span>
                )}
                <span className={styles.categoryBadge}>{gym.category}</span>
              </div>

              {/* Content */}
              <div className={styles.content}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.gymName}>{gym.name}</h3>
                  <div className={styles.ratingBlock}>
                    <FiStar className={styles.starIcon} />
                    <span>{gym.rating}</span>
                    <span className={styles.reviewCount}>
                      ({gym.reviewCount})
                    </span>
                  </div>
                </div>

                <div className={styles.locationRow}>
                  <FiMapPin size={12} />
                  <span>
                    {gym.location.area}, {gym.location.city}
                  </span>
                  <span className={styles.distance}>· {gym.distance}</span>
                </div>

                {gym.memberships && gym.memberships.length > 0 && (
                  <div className={styles.priceRow}>
                    <span className={styles.priceLabel}>From</span>
                    <span className={styles.price}>
                      ₹
                      {Math.min(
                        ...gym.memberships.map((m) => m.price),
                      ).toLocaleString("en-IN")}
                      /mo
                    </span>
                  </div>
                )}

                <div className={styles.cardActions}>
                  <Link
                    to={`/gyms/${gym.slug}`}
                    className={styles.viewBtn}
                    aria-label={`View details for ${gym.name}`}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SimilarGyms;
