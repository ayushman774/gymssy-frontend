import React from "react";
import { motion } from "framer-motion";
import { FiClock, FiUsers, FiUser } from "react-icons/fi";
import styles from "./ClassCard.module.css";

const levelColors = {
  Beginner: {
    bg: "rgba(57,255,20,0.08)",
    color: "#39ff14",
    border: "rgba(57,255,20,0.2)",
  },
  Intermediate: {
    bg: "rgba(59,130,246,0.08)",
    color: "#3b82f6",
    border: "rgba(59,130,246,0.2)",
  },
  Advanced: {
    bg: "rgba(239,68,68,0.08)",
    color: "#ef4444",
    border: "rgba(239,68,68,0.2)",
  },
  "All Levels": {
    bg: "rgba(168,85,247,0.08)",
    color: "#a855f7",
    border: "rgba(168,85,247,0.2)",
  },
};

const ClassCard = ({ cls, onBook }) => {
  const levelStyle = levelColors[cls.level] || levelColors["All Levels"];
  const spotsFraction = cls.spotsLeft / cls.spots;
  const spotsStatus =
    spotsFraction <= 0.2
      ? "critical"
      : spotsFraction <= 0.5
        ? "low"
        : "available";

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -3 }}
    >
      {/* Image */}
      <div className={styles.imageWrap}>
        <img
          src={cls.image}
          alt={cls.name}
          className={styles.image}
          loading="lazy"
        />
        <span
          className={styles.levelBadge}
          style={{
            background: levelStyle.bg,
            color: levelStyle.color,
            borderColor: levelStyle.border,
          }}
        >
          {cls.level}
        </span>
        <span className={styles.categoryBadge}>{cls.category}</span>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <h3 className={styles.name}>{cls.name}</h3>
        <p className={styles.description}>{cls.description}</p>

        {/* Meta */}
        <div className={styles.metaGrid}>
          <div className={styles.metaItem}>
            <FiClock size={12} className={styles.metaIcon} />
            <span>{cls.duration}</span>
          </div>
          <div className={styles.metaItem}>
            <FiUser size={12} className={styles.metaIcon} />
            <span>{cls.trainer}</span>
          </div>
          <div className={styles.metaItem}>
            <FiUsers size={12} className={styles.metaIcon} />
            <span
              className={`${styles.spots} ${
                spotsStatus === "critical"
                  ? styles.spotsCritical
                  : spotsStatus === "low"
                    ? styles.spotsLow
                    : ""
              }`}
            >
              {cls.spotsLeft} spots left
            </span>
          </div>
        </div>

        {/* Schedule */}
        <div className={styles.scheduleRow}>
          <span className={styles.schedule}>{cls.schedule}</span>
          <span className={styles.time}>{cls.time}</span>
        </div>

        {/* CTA */}
        <button
          className={styles.bookBtn}
          onClick={onBook}
          aria-label={`Book ${cls.name} class`}
          disabled={cls.spotsLeft === 0}
        >
          {cls.spotsLeft === 0 ? "Class Full" : "Book Class"}
        </button>
      </div>
    </motion.div>
  );
};

export default ClassCard;
