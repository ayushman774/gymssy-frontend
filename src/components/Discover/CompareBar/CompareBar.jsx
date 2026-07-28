import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiBarChart2, FiPlus } from "react-icons/fi";
import styles from "./CompareBar.module.css";

const CompareBar = ({ items, onRemove, onCompare, onClear }) => {
  // Slots always shows 3 — filled or empty
  const slots = [0, 1, 2];

  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.div
          className={styles.bar}
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{
            duration: 0.45,
            ease: [0.16, 1, 0.3, 1],
          }}
          role="region"
          aria-label="Compare selection bar"
        >
          {/* Left — label */}
          <div className={styles.barLeft}>
            <FiBarChart2 className={styles.barIcon} aria-hidden="true" />
            <div className={styles.barLabelBlock}>
              <span className={styles.barLabel}>Compare</span>
              <span className={styles.barSub}>
                {items.length} of 3 selected
              </span>
            </div>
          </div>

          {/* Center — slots */}
          <div className={styles.slots} role="list">
            {slots.map((i) => {
              const item = items[i];
              return (
                <div
                  key={i}
                  className={`${styles.slot} ${item ? styles.slotFilled : styles.slotEmpty}`}
                  role="listitem"
                >
                  <AnimatePresence mode="wait">
                    {item ? (
                      <motion.div
                        key={item.id}
                        className={styles.slotContent}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                      >
                        {/* Thumbnail */}
                        <div className={styles.slotThumb}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className={styles.slotThumbImg}
                            loading="lazy"
                          />
                        </div>

                        {/* Info */}
                        <div className={styles.slotInfo}>
                          <span className={styles.slotName}>{item.name}</span>
                          <span className={styles.slotCategory}>
                            {item.category}
                          </span>
                        </div>

                        {/* Remove */}
                        <button
                          className={styles.slotRemove}
                          onClick={() => onRemove(item.id)}
                          aria-label={`Remove ${item.name} from comparison`}
                        >
                          <FiX />
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        className={styles.slotEmptyContent}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FiPlus
                          className={styles.slotEmptyIcon}
                          aria-hidden="true"
                        />
                        <span className={styles.slotEmptyText}>
                          Add listing
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Right — actions */}
          <div className={styles.barActions}>
            <button
              className={styles.clearBtn}
              onClick={onClear}
              aria-label="Clear all comparisons"
            >
              Clear all
            </button>
            <button
              className={styles.compareBtn}
              onClick={onCompare}
              disabled={items.length < 2}
              aria-label={`Compare ${items.length} selected listings`}
            >
              <FiBarChart2 aria-hidden="true" />
              Compare Now
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CompareBar;
