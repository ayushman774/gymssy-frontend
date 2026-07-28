import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiStar, FiThumbsUp, FiCheck, FiEdit3 } from "react-icons/fi";
import styles from "./ReviewSection.module.css";

const ReviewSection = ({
  rating,
  reviewCount,
  ratingBreakdown,
  reviews,
  onWriteReview,
}) => {
  const [displayCount, setDisplayCount] = useState(3);

  const renderStars = (count, size = 14) =>
    [...Array(5)].map((_, i) => (
      <span
        key={i}
        className={`${styles.star} ${
          i < count ? styles.starFilled : styles.starEmpty
        }`}
        style={{ fontSize: `${size}px` }}
      >
        ★
      </span>
    ));

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <motion.div
      className={styles.reviewSection}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Header */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.title}>Reviews & Ratings</h2>
        <button
          className={styles.writeReviewBtn}
          onClick={onWriteReview}
          aria-label="Write a review"
        >
          <FiEdit3 size={13} />
          Write a Review
        </button>
      </div>

      {/* Summary */}
      <div className={styles.summary}>
        {/* Big Rating */}
        <div className={styles.ratingBig}>
          <span className={styles.ratingNumber}>{rating}</span>
          <div className={styles.ratingStars}>
            {renderStars(Math.round(rating), 22)}
          </div>
          <span className={styles.ratingCount}>
            {reviewCount.toLocaleString("en-IN")} verified reviews
          </span>
        </div>

        {/* Breakdown */}
        <div className={styles.breakdown}>
          {ratingBreakdown.map((item) => (
            <div key={item.stars} className={styles.breakdownRow}>
              <span className={styles.breakdownStarLabel}>{item.stars} ★</span>
              <div className={styles.breakdownBar}>
                <motion.div
                  className={styles.breakdownFill}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${item.percentage}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={
                    item.stars === 5
                      ? { background: "#39ff14" }
                      : item.stars === 4
                        ? { background: "#86efac" }
                        : { background: "rgba(255,255,255,0.2)" }
                  }
                />
              </div>
              <span className={styles.breakdownPercent}>
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Cards */}
      <div className={styles.reviewList}>
        {reviews.slice(0, displayCount).map((review, i) => (
          <motion.div
            key={review.id}
            className={styles.reviewCard}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
          >
            {/* User */}
            <div className={styles.reviewHeader}>
              <div className={styles.userInfo}>
                {review.user.image ? (
                  <img
                    src={review.user.image}
                    alt={review.user.name}
                    className={styles.userAvatar}
                    loading="lazy"
                  />
                ) : (
                  <div className={styles.userInitials}>
                    {review.user.initials}
                  </div>
                )}
                <div>
                  <div className={styles.userName}>{review.user.name}</div>
                  <div className={styles.reviewDate}>
                    {formatDate(review.date)}
                  </div>
                </div>
              </div>

              <div className={styles.reviewRating}>
                {renderStars(review.rating, 13)}
              </div>
            </div>

            {/* Verified */}
            {review.verifiedVisit && (
              <span className={styles.verifiedBadge}>
                <FiCheck size={10} />
                Verified Visit
              </span>
            )}

            {/* Content */}
            <h4 className={styles.reviewTitle}>{review.title}</h4>
            <p className={styles.reviewText}>{review.text}</p>

            {/* Helpful */}
            <div className={styles.helpfulRow}>
              <button
                className={styles.helpfulBtn}
                aria-label="Mark review as helpful"
              >
                <FiThumbsUp size={12} />
                Helpful ({review.helpfulCount})
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      {reviews.length > displayCount && (
        <button
          className={styles.loadMoreBtn}
          onClick={() => setDisplayCount((c) => c + 3)}
          aria-label="Load more reviews"
        >
          View More Reviews
        </button>
      )}
    </motion.div>
  );
};

export default ReviewSection;
