import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";
import styles from "./PartnerCategoryCard.module.css";

const PartnerCategoryCard = ({ data, index }) => {
  const { icon, title, description, image } = data;

  return (
    <motion.div
      className={styles.card}
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

        <Link to="#partner-form" className={styles.cta}>
          Join as Partner
          <HiArrowRight className={styles.ctaIcon} />
        </Link>
      </div>

      {/* Hover border glow */}
      <div className={styles.borderGlow} />
    </motion.div>
  );
};

export default PartnerCategoryCard;
