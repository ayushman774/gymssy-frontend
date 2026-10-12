import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiStar, FiAward } from "react-icons/fi";
import styles from "./GymTrainerCard.module.css";

const GymTrainerCard = ({ trainer }) => {
  const trainerSlug = typeof trainer.slug === "string" ? trainer.slug.trim() : "";
  const profileUrl = trainerSlug ? `/trainers/${encodeURIComponent(trainerSlug)}` : null;
  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      whileHover={{ y: -4 }}
    >
      {/* Availability */}
      <div
        className={`${styles.availBadge} ${
          trainer.available ? styles.availOpen : styles.availBusy
        }`}
      >
        {trainer.available ? "Available" : "Fully Booked"}
      </div>

      {/* Photo */}
      <div className={styles.photoWrap}>
        <img
          src={trainer.image}
          alt={trainer.name}
          className={styles.photo}
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className={styles.info}>
        <h3 className={styles.name}>{trainer.name}</h3>
        <span className={styles.specialization}>{trainer.specialization}</span>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <FiStar className={styles.starIcon} />
            <span>{trainer.rating}</span>
            <span className={styles.statSub}>({trainer.reviewCount})</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <FiAward size={12} />
            <span>{trainer.experience}</span>
          </div>
        </div>

        {/* Certifications */}
        <div className={styles.certifications}>
          {trainer.certifications.map((cert) => (
            <span key={cert} className={styles.cert}>
              {cert}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className={styles.footer}>
          <div>
            <span className={styles.priceLabel}>Per session</span>
            <span className={styles.price}>
              {trainer.currency}
              {trainer.sessionPrice.toLocaleString("en-IN")}
            </span>
          </div>
          {profileUrl ? (
            <Link
              to={profileUrl}
              className={styles.viewBtn}
              aria-label={`View profile of ${trainer.name}`}
            >
              View Profile
            </Link>
          ) : (
            <span
              className={`${styles.viewBtn} ${styles.viewBtnDisabled}`}
              title="This trainer does not have a linked profile yet"
            >
              Profile unavailable
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GymTrainerCard;
