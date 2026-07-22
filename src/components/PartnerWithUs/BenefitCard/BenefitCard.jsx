import React from "react";
import { motion } from "framer-motion";
import styles from "./BenefitCard.module.css";

const BenefitCard = ({ data, index }) => {
  const { icon, title, description } = data;

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: (index % 4) * 0.08,
      }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -5 }}
    >
      <div className={styles.iconWrapper}>
        <span className={styles.icon}>{icon}</span>
        <div className={styles.iconGlow} />
      </div>

      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>

      <div className={styles.accentLine} />
    </motion.div>
  );
};

export default BenefitCard;
