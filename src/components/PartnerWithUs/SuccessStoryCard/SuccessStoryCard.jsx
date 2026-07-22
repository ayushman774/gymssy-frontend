import React from "react";
import { motion } from "framer-motion";
import { FiStar, FiTrendingUp } from "react-icons/fi";
import styles from "./SuccessStoryCard.module.css";

const SuccessStoryCard = ({ data, index }) => {
  const {
    businessName,
    ownerName,
    businessType,
    city,
    testimonial,
    growth,
    image,
    avatar,
    rating,
  } = data;

  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: index * 0.12,
      }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -6 }}
    >
      {/* Business image */}
      <div className={styles.imageWrapper}>
        <img
          src={image}
          alt={businessName}
          className={styles.businessImage}
          loading="lazy"
        />
        <div className={styles.imageOverlay} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Growth badge */}
        <div className={styles.growthBadge}>
          <FiTrendingUp className={styles.growthIcon} />
          <span>{growth}</span>
        </div>

        {/* Stars */}
        <div className={styles.stars}>
          {Array.from({ length: rating }).map((_, i) => (
            <FiStar key={i} className={styles.star} />
          ))}
        </div>

        {/* Testimonial */}
        <blockquote className={styles.testimonial}>
          &ldquo;{testimonial}&rdquo;
        </blockquote>

        {/* Owner info */}
        <div className={styles.owner}>
          <img
            src={avatar}
            alt={ownerName}
            className={styles.avatar}
            loading="lazy"
          />
          <div className={styles.ownerInfo}>
            <span className={styles.ownerName}>{ownerName}</span>
            <span className={styles.ownerMeta}>
              {businessName} · {businessType} · {city}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.borderGlow} />
    </motion.article>
  );
};

export default SuccessStoryCard;
