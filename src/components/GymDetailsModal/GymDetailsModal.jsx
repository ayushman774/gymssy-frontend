import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiUsers,
  FiChevronRight,
  FiExternalLink,
  FiStar,
} from "react-icons/fi";
import styles from "./GymDetailsModal.module.css";

const GymDetailsModal = ({ gym, isOpen, onClose }) => {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && gym && (
        /*
         * BACKDROP — position:fixed, flex, centers the modal as a child.
         * Clicking the backdrop itself (not the modal) closes it.
         */
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          {/*
           * MODAL — position:relative inside the flex backdrop.
           * stopPropagation prevents backdrop click from firing
           * when clicking inside the modal.
           */}
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, y: 50, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={gym.name}
          >
            {/* ── Close Button ──────────────────────────────── */}
            <button
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close modal"
            >
              <FiX />
            </button>

            {/* ── Hero Image ────────────────────────────────── */}
            <div className={styles.heroWrapper}>
              <img
                src={gym.image}
                alt={gym.name}
                className={styles.heroImage}
              />
              <div className={styles.heroOverlay} />
              <div className={styles.heroContent}>
                <h2 className={styles.modalName}>{gym.name}</h2>
                <div className={styles.modalAddress}>
                  <FiMapPin className={styles.modalAddressIcon} />
                  {gym.address}
                </div>
                <div className={styles.heroBadges}>
                  <span className={styles.heroBadgeRating}>
                    <FiStar className={styles.starIcon} />
                    {gym.rating} ({gym.reviewCount} reviews)
                  </span>
                  <span className={styles.heroBadgeDistance}>
                    {gym.distance} away
                  </span>
                </div>
              </div>
            </div>

            {/* ── Body ──────────────────────────────────────── */}
            <div className={styles.modalBody}>
              <div className={styles.bodyGrid}>
                {/* Left Column */}
                <div className={styles.bodyLeft}>
                  {/* Hours */}
                  <div className={styles.infoBlock}>
                    <span className={styles.infoBlockTitle}>
                      <FiClock className={styles.infoBlockIcon} />
                      Opening Hours
                    </span>
                    <div className={styles.hoursRow}>
                      <span className={styles.hoursDay}>Mon – Fri</span>
                      <span className={styles.hoursVal}>
                        {gym.hours.weekday}
                      </span>
                    </div>
                    <div className={styles.hoursRow}>
                      <span className={styles.hoursDay}>Sat – Sun</span>
                      <span className={styles.hoursVal}>
                        {gym.hours.weekend}
                      </span>
                    </div>
                  </div>

                  {/* Trainers */}
                  <div className={styles.infoBlock}>
                    <span className={styles.infoBlockTitle}>
                      <FiUsers className={styles.infoBlockIcon} />
                      Training Team
                    </span>
                    <p className={styles.trainerCount}>
                      <span className={styles.trainerNumber}>
                        {gym.trainerCount}
                      </span>{" "}
                      certified coaches on-site
                    </p>
                  </div>

                  {/* Contact */}
                  <div className={styles.infoBlock}>
                    <span className={styles.infoBlockTitle}>Contact</span>
                    <a href={`tel:${gym.phone}`} className={styles.contactLink}>
                      <FiPhone className={styles.contactIcon} />
                      {gym.phone}
                    </a>
                    <a
                      href={`mailto:${gym.email}`}
                      className={styles.contactLink}
                    >
                      <FiMail className={styles.contactIcon} />
                      {gym.email}
                    </a>
                  </div>
                </div>

                {/* Right Column */}
                <div className={styles.bodyRight}>
                  {/* Facilities */}
                  <div className={styles.infoBlock}>
                    <span className={styles.infoBlockTitle}>Facilities</span>
                    <ul className={styles.facilityList}>
                      {gym.facilities.map((f) => (
                        <li key={f} className={styles.facilityItem}>
                          <span className={styles.facilityDot} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tags */}
                  <div className={styles.infoBlock}>
                    <span className={styles.infoBlockTitle}>Features</span>
                    <div className={styles.tagCloud}>
                      {gym.tags.map((t) => (
                        <span key={t} className={styles.modalTag}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Membership Pricing */}
                  <div className={styles.membershipBox}>
                    <div className={styles.membershipLeft}>
                      <span className={styles.membershipFrom}>
                        Memberships from
                      </span>
                      <div className={styles.membershipPrice}>
                        <span className={styles.membershipCurrency}>$</span>
                        <span className={styles.membershipValue}>
                          {gym.membershipFrom}
                        </span>
                        <span className={styles.membershipPer}>/mo</span>
                      </div>
                    </div>
                    <motion.a
                      href="/memberships"
                      className={styles.joinBtn}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Join Membership
                      <FiChevronRight />
                    </motion.a>
                  </div>
                </div>
              </div>

              {/* ── Footer Actions ─────────────────────────── */}
              <div className={styles.modalActions}>
                <motion.a
                  href={`tel:${gym.phone}`}
                  className={styles.actionBtn}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <FiPhone />
                  Call Now
                </motion.a>
                <motion.a
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    gym.address,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.actionBtn}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <FiExternalLink />
                  Get Directions
                </motion.a>
                <motion.a
                  href="/memberships"
                  className={styles.actionBtnPrimary}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Join Now
                  <FiChevronRight />
                </motion.a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GymDetailsModal;
