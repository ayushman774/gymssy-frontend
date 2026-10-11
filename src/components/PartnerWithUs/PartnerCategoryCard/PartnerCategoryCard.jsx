import React from "react";
import { motion } from "framer-motion";
import { HiArrowRight } from "react-icons/hi";
import styles from "./PartnerCategoryCard.module.css";

const PartnerCategoryCard = ({ data, index, onSelect }) => {
  const { icon, title, description, image } = data;

  return (
    <motion.div
      className={styles.card}
      role="button"
      tabIndex={0}
      aria-label={`Register as a partner: ${title}`}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect?.();
        }
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.65,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: (index % 3) * 0.1,
      }}
      viewport={{ once: true, margin: "-60px" }}
      whileHover={{ y: -6 }}
    >
      {/* Image */}
      <div className={styles.imageWrapper}>
        <img src={image} alt={title} className={styles.image} loading="lazy" />
        <div className={styles.imageOverlay} />
        <span className={styles.icon}>{icon}</span>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>

        <span className={styles.cta}>
          Join as Partner
          <HiArrowRight className={styles.ctaIcon} />
        </span>
      </div>

      {/* Hover border glow */}
      <div className={styles.borderGlow} />
    </motion.div>
  );
};

export default PartnerCategoryCard;
