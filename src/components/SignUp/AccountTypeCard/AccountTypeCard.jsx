import React from "react";
import { motion } from "framer-motion";
import { HiCheckCircle } from "react-icons/hi";
import styles from "./AccountTypeCard.module.css";

const AccountTypeCard = ({ data, isSelected, onSelect }) => {
  const { icon, title, description } = data;

  return (
    <motion.button
      className={`${styles.card} ${isSelected ? styles.selected : ""}`}
      onClick={onSelect}
      type="button"
      whileHover={{ scale: 1.025, y: -2 }}
      whileTap={{ scale: 0.975 }}
      transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
      aria-pressed={isSelected}
    >
      {/* Selected check */}
      <motion.div
        className={styles.checkWrapper}
        initial={{ scale: 0, opacity: 0 }}
        animate={
          isSelected ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }
        }
        transition={{ duration: 0.22, ease: "backOut" }}
      >
        <HiCheckCircle className={styles.checkIcon} />
      </motion.div>

      {/* Icon */}
      <span className={styles.icon}>{icon}</span>

      {/* Text */}
      <span className={styles.title}>{title}</span>
      <span className={styles.description}>{description}</span>

      {/* Active border glow */}
      {isSelected && <div className={styles.glow} />}
    </motion.button>
  );
};

export default AccountTypeCard;
