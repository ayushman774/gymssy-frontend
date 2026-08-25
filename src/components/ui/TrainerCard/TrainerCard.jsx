// src/ui/TrainerCard/TrainerCard.jsx

import { motion } from "framer-motion";
import { FiStar, FiArrowRight } from "react-icons/fi";
import { MdVerified } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import styles from "./TrainerCard.module.css";

/* ── resolve image regardless of string | { url, alt } ── */
const resolveImage = (image, fallbackAlt = "") => {
  if (!image) return { src: "", alt: fallbackAlt };
  if (typeof image === "string") return { src: image, alt: fallbackAlt };
  return { src: image.url ?? "", alt: image.alt ?? fallbackAlt };
};

const TrainerCard = ({ trainer, isCenter }) => {
  const navigate = useNavigate();

  const {
    name,
    slug,
    specialization,
    experience,
    rating,
    reviewCount,
    image,
    pricePerSession,
    available,
    isVerified,
    href,
  } = trainer;

  const { src: imgSrc, alt: imgAlt } = resolveImage(image, name);

  /* href from normaliser wins; fallback to slug then slugified name */
  const destination =
    href ?? `/trainers/${slug ?? name?.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <motion.div
      className={`${styles.card} ${isCenter ? styles.cardCenter : ""}`}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      {/* ── Image ── */}
      <div className={styles.imageWrapper}>
        {imgSrc && (
          <img
            src={imgSrc}
            alt={imgAlt}
            className={styles.image}
            loading="lazy"
          />
        )}
        <div className={styles.imageOverlay} />

        {/* Availability badge */}
        <div
          className={`${styles.availBadge} ${
            available ? styles.availOpen : styles.availBusy
          }`}
          aria-label={available ? "Available for booking" : "Currently busy"}
        >
          <span className={styles.availDot} aria-hidden="true" />
          {available ? "Available" : "Busy"}
        </div>
      </div>

      {/* ── Content ── */}
      <div className={styles.content}>
        <div className={styles.nameRow}>
          <h3 className={styles.name}>{name}</h3>
          {isVerified && (
            <MdVerified
              className={styles.verified}
              aria-label="Verified trainer"
            />
          )}
        </div>

        <span className={styles.specialization}>{specialization}</span>

        <div className={styles.metaRow}>
          <div className={styles.rating}>
            <FiStar className={styles.starIcon} aria-hidden="true" />
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
            onClick={() => navigate(destination)}
            aria-label={`Book session with ${name}`}
          >
            Book Session
            <FiArrowRight className={styles.bookArrow} aria-hidden="true" />
          </motion.button>
        </div>
      </div>

      {/* Center glow */}
      {isCenter && <div className={styles.centerGlow} aria-hidden="true" />}
    </motion.div>
  );
};

export default TrainerCard;
