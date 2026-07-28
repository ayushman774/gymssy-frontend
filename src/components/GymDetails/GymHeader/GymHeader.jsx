import React from "react";
import { motion } from "framer-motion";
import {
  FiHeart,
  FiShare2,
  FiMapPin,
  FiStar,
  FiCheck,
  FiCopy,
} from "react-icons/fi";
import { FaWhatsapp, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import styles from "./GymHeader.module.css";

const GymHeader = ({
  gym,
  isSaved,
  onSave,
  onShare,
  onBookVisit,
  onViewMemberships,
  showShareMenu,
  shareMenuRef,
  onCopyLink,
  openStatus,
  todayTiming,
  formatTime,
  lowestPrice,
}) => {
  const shareUrl = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent(
    `Check out ${gym.name} on Gymssy — India's Complete Fitness Marketplace`,
  );

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        {/* Left */}
        <div className={styles.headerLeft}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className={styles.categoryRow}>
              <span className={styles.categoryTag}>{gym.category}</span>
              {gym.verified && (
                <span className={styles.verifiedBadge}>
                  <FiCheck size={11} />
                  Verified
                </span>
              )}
              <span
                className={`${styles.openStatusBadge} ${
                  openStatus ? styles.openStatusOpen : styles.openStatusClosed
                }`}
              >
                <span className={styles.statusDot} />
                {openStatus ? "Open Now" : "Closed"}
              </span>
            </div>

            <h1 className={styles.gymName}>{gym.name}</h1>

            <div className={styles.metaRow}>
              <div className={styles.ratingBlock}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`${styles.star} ${
                        i < Math.floor(gym.rating) ? styles.starFilled : ""
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className={styles.ratingValue}>{gym.rating}</span>
                <span className={styles.reviewCount}>
                  {gym.reviewCount.toLocaleString("en-IN")} reviews
                </span>
              </div>

              <span className={styles.metaDivider}>·</span>

              <div className={styles.locationBlock}>
                <FiMapPin size={13} />
                <span>
                  {gym.location.area}, {gym.location.city}
                </span>
              </div>

              <span className={styles.metaDivider}>·</span>

              <span className={styles.distanceBadge}>{gym.distance} away</span>
            </div>

            {/* Tags */}
            {gym.tags && (
              <div className={styles.tagRow}>
                {gym.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right */}
        <motion.div
          className={styles.headerRight}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          {/* Action Buttons */}
          <div className={styles.actionRow}>
            <button
              className={`${styles.iconBtn} ${isSaved ? styles.iconBtnSaved : ""}`}
              onClick={onSave}
              aria-label={isSaved ? "Unsave gym" : "Save gym"}
              aria-pressed={isSaved}
            >
              <FiHeart
                size={16}
                style={{ fill: isSaved ? "#ef4444" : "none" }}
              />
              <span>{isSaved ? "Saved" : "Save"}</span>
            </button>

            <div className={styles.shareWrapper} ref={shareMenuRef}>
              <button
                className={styles.iconBtn}
                onClick={onShare}
                aria-label="Share gym"
                aria-expanded={showShareMenu}
              >
                <FiShare2 size={16} />
                <span>Share</span>
              </button>

              {showShareMenu && (
                <motion.div
                  className={styles.shareMenu}
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  role="menu"
                >
                  <button
                    className={styles.shareItem}
                    onClick={onCopyLink}
                    role="menuitem"
                  >
                    <FiCopy size={14} />
                    Copy Link
                  </button>
                  <a
                    className={styles.shareItem}
                    href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    role="menuitem"
                  >
                    <FaWhatsapp size={14} color="#25d366" />
                    WhatsApp
                  </a>
                  <a
                    className={styles.shareItem}
                    href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    role="menuitem"
                  >
                    <FaFacebook size={14} color="#1877f2" />
                    Facebook
                  </a>
                  <a
                    className={styles.shareItem}
                    href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    role="menuitem"
                  >
                    <FaTwitter size={14} color="#1da1f2" />
                    Twitter / X
                  </a>
                </motion.div>
              )}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className={styles.ctaRow}>
            <button
              className={styles.ctaPrimary}
              onClick={onBookVisit}
              aria-label={`Book free visit at ${gym.name}`}
            >
              Book Free Visit
            </button>
            <button
              className={styles.ctaSecondary}
              onClick={onViewMemberships}
              aria-label="View membership plans"
            >
              View Memberships
            </button>
          </div>

          {/* Price */}
          {lowestPrice && (
            <p className={styles.priceNote}>
              Memberships starting from{" "}
              <strong>₹{lowestPrice.toLocaleString("en-IN")}/month</strong>
            </p>
          )}
        </motion.div>
      </div>
    </header>
  );
};

export default GymHeader;
