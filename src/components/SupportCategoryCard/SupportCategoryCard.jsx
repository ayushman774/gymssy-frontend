import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import styles from "./SupportCategoryCard.module.css";

const SupportCategoryCard = forwardRef(({ category }, ref) => {
  const { icon, title, description, link, color } = category;
  const isGreen = color === "green";

  return (
    <div ref={ref} className={styles.cardOuter}>
      <motion.a
        href={link}
        className={`${styles.card} ${isGreen ? styles.cardGreen : styles.cardBlue}`}
        whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Animated corner accent */}
        <div
          className={`${styles.cornerAccent} ${isGreen ? styles.cornerGreen : styles.cornerBlue}`}
        />

        {/* Icon */}
        <div
          className={`${styles.iconBox} ${isGreen ? styles.iconBoxGreen : styles.iconBoxBlue}`}
        >
          <span className={styles.iconInner}>{icon}</span>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.desc}>{description}</p>
        </div>

        {/* Learn More */}
        <div
          className={`${styles.learnMore} ${isGreen ? styles.learnGreen : styles.learnBlue}`}
        >
          <span className={styles.learnText}>Learn More</span>
          <FiArrowRight className={styles.learnArrow} />
        </div>

        {/* Bottom glow */}
        <div
          className={`${styles.bottomGlow} ${isGreen ? styles.bottomGlowGreen : styles.bottomGlowBlue}`}
        />
      </motion.a>
    </div>
  );
});

SupportCategoryCard.displayName = "SupportCategoryCard";
export default SupportCategoryCard;
