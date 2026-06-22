import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FiStar } from "react-icons/fi";
import styles from "./SuccessStory.module.css";

const SuccessStory = ({ story, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const {
    memberName,
    memberImage,
    trainerName,
    trainerImage,
    result,
    story: storyText,
    duration,
    achievement,
  } = story;

  return (
    <motion.div
      ref={ref}
      className={styles.card}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      {/* Top glow line */}
      <div className={styles.topGlow} />

      {/* Header — Member & Trainer */}
      <div className={styles.cardHeader}>
        <div className={styles.avatarGroup}>
          <div className={styles.memberAvatar}>
            <img
              src={memberImage}
              alt={memberName}
              className={styles.avatarImg}
              loading="lazy"
            />
          </div>
          <div
            className={`${styles.trainerAvatar} ${styles.trainerAvatarOverlap}`}
          >
            <img
              src={trainerImage}
              alt={trainerName}
              className={styles.avatarImg}
              loading="lazy"
            />
            <div className={styles.trainerBadge}>
              <FiStar />
            </div>
          </div>
        </div>

        <div className={styles.headerText}>
          <p className={styles.memberName}>{memberName}</p>
          <p className={styles.trainerCredit}>
            with Coach{" "}
            <span className={styles.trainerNameAccent}>{trainerName}</span>
          </p>
        </div>
      </div>

      {/* Achievement banner */}
      <div className={styles.achievementBanner}>
        <span className={styles.achievementValue}>{achievement}</span>
        <span className={styles.achievementDot}>·</span>
        <span className={styles.achievementDuration}>{duration}</span>
      </div>

      {/* Quote */}
      <blockquote className={styles.quote}>
        <span className={styles.quoteMarks}>"</span>
        {storyText}
      </blockquote>

      {/* Result tag */}
      <div className={styles.resultTag}>{result}</div>

      {/* Glow effect */}
      <div className={styles.cardGlow} />
    </motion.div>
  );
};

export default SuccessStory;
