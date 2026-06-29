import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import styles from "./ContactCard.module.css";

const ContactCard = forwardRef(({ card }, ref) => {
  const { icon, title, info, subInfo, description, href, color } = card;
  const isGreen = color === "green";

  return (
    <div ref={ref}>
      <motion.a
        href={href}
        className={`${styles.card} ${isGreen ? styles.cardGreen : styles.cardBlue}`}
        whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Animated top glow line */}
        <div
          className={`${styles.topLine} ${isGreen ? styles.topLineGreen : styles.topLineBlue}`}
        />

        {/* Icon */}
        <div
          className={`${styles.iconRing} ${isGreen ? styles.iconRingGreen : styles.iconRingBlue}`}
        >
          <span className={styles.iconInner}>{icon}</span>
          <div
            className={`${styles.iconGlow} ${isGreen ? styles.iconGlowGreen : styles.iconGlowBlue}`}
          />
        </div>

        {/* Content */}
        <div className={styles.body}>
          <span className={styles.cardTitle}>{title}</span>
          <span
            className={`${styles.cardInfo} ${isGreen ? styles.cardInfoGreen : styles.cardInfoBlue}`}
          >
            {info}
          </span>
          <span className={styles.cardSubInfo}>{subInfo}</span>
          <p className={styles.cardDesc}>{description}</p>
        </div>

        {/* Arrow */}
        <span
          className={`${styles.arrow} ${isGreen ? styles.arrowGreen : styles.arrowBlue}`}
        >
          <FiArrowRight />
        </span>
      </motion.a>
    </div>
  );
});

ContactCard.displayName = "ContactCard";
export default ContactCard;
