import { motion } from "framer-motion";
import { FiStar, FiArrowRight } from "react-icons/fi";
import { MdVerified } from "react-icons/md";
import styles from "./TrainerCard.module.css";

const TrainerCard = ({ trainer, isCenter }) => {
  const {
    name,
    specialization,
    experience,
    rating,
    reviewCount,
    image,
    pricePerSession,
    available,
  } = trainer;

  return (
    <motion.div
      className={`${styles.card} ${isCenter ? styles.cardCenter : ""}`}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      {/* Image */}
      <div className={styles.imageWrapper}>
        <img src={image} alt={name} className={styles.image} loading="lazy" />
        <div className={styles.imageOverlay} />

        {/* Available badge */}
        <div
          className={`${styles.availBadge} ${available ? styles.availOpen : styles.availBusy}`}
        >
          <span className={styles.availDot} />
          {available ? "Available" : "Busy"}
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.nameRow}>
          <h3 className={styles.name}>{name}</h3>
          <MdVerified
            className={styles.verified}
            aria-label="Verified trainer"
          />
        </div>

        <span className={styles.specialization}>{specialization}</span>

        <div className={styles.metaRow}>
          <div className={styles.rating}>
            <FiStar className={styles.starIcon} />
            <span className={styles.ratingVal}>{rating}</span>
            <span className={styles.ratingCnt}>({reviewCount})</span>
          </div>
          <span className={styles.exp}>{experience} yrs exp</span>
        </div>

        <div className={styles.footer}>
          <div className={styles.price}>
            <span className={styles.priceVal}>${pricePerSession}</span>
            <span className={styles.pricePer}>/session</span>
          </div>
          <motion.button
            className={styles.bookBtn}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Book Session
            <FiArrowRight className={styles.bookArrow} />
          </motion.button>
        </div>
      </div>

      {/* Glow */}
      {isCenter && <div className={styles.centerGlow} aria-hidden="true" />}
    </motion.div>
  );
};

export default TrainerCard;
