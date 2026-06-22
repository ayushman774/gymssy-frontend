import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FiInstagram, FiTwitter, FiExternalLink } from "react-icons/fi";
import styles from "./TrainerCard.module.css";

const TrainerCard = ({ trainer, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const { name, position, specialization, experience, image, social } = trainer;

  return (
    <motion.div
      ref={ref}
      className={styles.card}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.65,
        delay: (index % 4) * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {/* Image */}
      <div className={styles.imageWrapper}>
        <img
          src={image}
          alt={`${name} — ${position}`}
          className={styles.image}
          loading="lazy"
        />
        <div className={styles.imageOverlay} />

        {/* Social reveal */}
        <div className={styles.socialOverlay}>
          {social?.instagram && (
            <motion.a
              href={social.instagram}
              className={styles.socialLink}
              aria-label={`${name} Instagram`}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiInstagram />
            </motion.a>
          )}
          {social?.twitter && (
            <motion.a
              href={social.twitter}
              className={styles.socialLink}
              aria-label={`${name} Twitter`}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiTwitter />
            </motion.a>
          )}
          <motion.a
            href="#"
            className={styles.socialLink}
            aria-label={`${name} Profile`}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiExternalLink />
          </motion.a>
        </div>

        {/* Experience badge */}
        <div className={styles.expBadge}>
          <span className={styles.expNumber}>{experience}</span>
          <span className={styles.expText}>YRS</span>
        </div>
      </div>

      {/* Info */}
      <div className={styles.info}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.position}>{position}</p>
        <span className={styles.specialization}>{specialization}</span>
      </div>

      {/* Neon border glow */}
      <div className={styles.borderGlow} />
    </motion.div>
  );
};

export default TrainerCard;
