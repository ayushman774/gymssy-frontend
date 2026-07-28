import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiStar,
  FiMapPin,
  FiCheck,
  FiMinus,
  FiShield,
  FiClock,
  FiUsers,
  FiDollarSign,
  FiBarChart2,
  FiAward,
  FiNavigation,
} from "react-icons/fi";
import styles from "./CompareDrawer.module.css";

// ── Comparison attribute definitions ─────────────────────────────────────────

const ATTRIBUTES = [
  {
    key: "rating",
    label: "Rating",
    icon: <FiStar aria-hidden="true" />,
    render: (item) =>
      item.rating ? (
        <span className={styles.attrRating}>
          <FiStar className={styles.starIcon} aria-hidden="true" />
          {item.rating}
          <span className={styles.attrRatingSub}>
            ({item.reviews || item.sessions || "—"})
          </span>
        </span>
      ) : (
        <span className={styles.attrNa}>—</span>
      ),
  },
  {
    key: "price",
    label: "Price",
    icon: <FiDollarSign aria-hidden="true" />,
    render: (item) =>
      item.price ? (
        <span className={styles.attrPrice}>{item.price}</span>
      ) : (
        <span className={styles.attrNa}>—</span>
      ),
  },
  {
    key: "distance",
    label: "Distance",
    icon: <FiNavigation aria-hidden="true" />,
    render: (item) =>
      item.distance ? (
        <span className={styles.attrValue}>{item.distance}</span>
      ) : (
        <span className={styles.attrNa}>—</span>
      ),
  },
  {
    key: "verified",
    label: "Verified",
    icon: <FiShield aria-hidden="true" />,
    render: (item) =>
      item.verified ? (
        <span className={styles.attrVerified}>
          <FiCheck aria-hidden="true" />
          Verified
        </span>
      ) : (
        <span className={styles.attrUnverified}>
          <FiMinus aria-hidden="true" />
          Not verified
        </span>
      ),
  },
  {
    key: "amenities",
    label: "Amenities / Tags",
    icon: <FiAward aria-hidden="true" />,
    render: (item) => {
      const list = item.amenities || item.tags || [];
      return list.length > 0 ? (
        <div className={styles.attrTags}>
          {list.map((t) => (
            <span key={t} className={styles.attrTag}>
              {t}
            </span>
          ))}
        </div>
      ) : (
        <span className={styles.attrNa}>—</span>
      );
    },
  },
  {
    key: "experience",
    label: "Experience",
    icon: <FiClock aria-hidden="true" />,
    render: (item) =>
      item.experience ? (
        <span className={styles.attrValue}>{item.experience}</span>
      ) : (
        <span className={styles.attrNa}>—</span>
      ),
  },
  {
    key: "sessions",
    label: "Sessions / Reviews",
    icon: <FiUsers aria-hidden="true" />,
    render: (item) => {
      const val =
        item.sessions || (item.reviews ? `${item.reviews} reviews` : null);
      return val ? (
        <span className={styles.attrValue}>{val}</span>
      ) : (
        <span className={styles.attrNa}>—</span>
      );
    },
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

const CompareDrawer = ({ items, onClose, onRemove }) => {
  const drawerRef = useRef(null);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Focus trap on mount
  useEffect(() => {
    const firstFocusable = drawerRef.current?.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    firstFocusable?.focus();
  }, []);

  // Column width class based on count
  const colClass =
    items.length === 2
      ? styles.twoCol
      : items.length === 3
        ? styles.threeCol
        : styles.oneCol;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.backdrop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        aria-modal="true"
        role="dialog"
        aria-label="Compare fitness listings"
      >
        <motion.div
          className={styles.drawer}
          ref={drawerRef}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{
            duration: 0.55,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {/* ── Header ── */}
          <div className={styles.drawerHeader}>
            <div className={styles.drawerHeaderLeft}>
              <FiBarChart2
                className={styles.drawerHeaderIcon}
                aria-hidden="true"
              />
              <div>
                <h2 className={styles.drawerTitle}>Compare Fitness Classes</h2>
                <p className={styles.drawerSubtitle}>
                  Side-by-side comparison of your selected listings
                </p>
              </div>
            </div>
            <button
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close comparison"
            >
              <FiX />
            </button>
          </div>

          {/* ── Scrollable content ── */}
          <div className={styles.drawerBody}>
            {/* ── Card headers row ── */}
            <div className={`${styles.tableHeader} ${colClass}`}>
              {/* Row label spacer */}
              <div className={styles.rowLabelSpacer} aria-hidden="true" />

              {/* Column headers */}
              {items.map((item) => (
                <div key={item.id} className={styles.colHeader}>
                  {/* Image */}
                  <div className={styles.colImgWrap}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className={styles.colImg}
                      loading="lazy"
                    />
                    <div className={styles.colImgOverlay} aria-hidden="true" />
                  </div>

                  {/* Name + category */}
                  <div className={styles.colMeta}>
                    <span className={styles.colCategory}>{item.category}</span>
                    <h3 className={styles.colName}>{item.name}</h3>
                    {item.address && (
                      <p className={styles.colAddress}>
                        <FiMapPin aria-hidden="true" />
                        {item.address}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className={styles.colActions}>
                    <button className={styles.colViewBtn}>View Details</button>
                    <button className={styles.colBookBtn}>
                      {item.category === "Personal Trainer"
                        ? "Book Session"
                        : "Get Membership"}
                    </button>
                  </div>

                  {/* Remove from compare */}
                  {items.length > 2 && (
                    <button
                      className={styles.colRemoveBtn}
                      onClick={() => onRemove(item.id)}
                      aria-label={`Remove ${item.name}`}
                    >
                      <FiX aria-hidden="true" />
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* ── Attribute rows ── */}
            <div className={styles.attributeRows}>
              {ATTRIBUTES.map((attr, attrIdx) => (
                <motion.div
                  key={attr.key}
                  className={`${styles.attrRow} ${colClass} ${
                    attrIdx % 2 === 0 ? styles.attrRowAlt : ""
                  }`}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: attrIdx * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {/* Row label */}
                  <div className={styles.rowLabel}>
                    <span className={styles.rowLabelIcon}>{attr.icon}</span>
                    <span className={styles.rowLabelText}>{attr.label}</span>
                  </div>

                  {/* Values for each item */}
                  {items.map((item) => (
                    <div key={item.id} className={styles.attrCell}>
                      {attr.render(item)}
                    </div>
                  ))}
                </motion.div>
              ))}
            </div>

            {/* ── Best value callout ── */}
            {items.length >= 2 && (
              <motion.div
                className={styles.bestValueRow}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className={styles.bestValueLabel}>
                  <FiAward
                    className={styles.bestValueIcon}
                    aria-hidden="true"
                  />
                  <span>Gymssy Pick</span>
                </div>
                {/* Highlight the highest rated item */}
                {items.map((item) => {
                  const maxRating = Math.max(
                    ...items.map((i) => i.rating || 0),
                  );
                  const isBest = item.rating === maxRating;
                  return (
                    <div key={item.id} className={styles.bestValueCell}>
                      {isBest ? (
                        <div className={styles.bestValueBadge}>
                          <FiAward aria-hidden="true" />
                          Top Rated
                        </div>
                      ) : (
                        <span className={styles.bestValueNone}>—</span>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CompareDrawer;
