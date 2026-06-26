import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiSliders } from "react-icons/fi";
import styles from "./FilterChips.module.css";

const FilterChips = ({ options, activeFilters, onChange }) => {
  const toggleFilter = (tag) => {
    onChange(
      activeFilters.includes(tag)
        ? activeFilters.filter((f) => f !== tag)
        : [...activeFilters, tag],
    );
  };

  const clearAll = () => onChange([]);

  return (
    <div className={styles.filterWrapper}>
      <div className={styles.filterLabel}>
        <FiSliders className={styles.filterLabelIcon} />
        <span className={styles.filterLabelText}>Filter by:</span>
      </div>

      <div className={styles.chipsRow}>
        {options.map((option, index) => {
          const isActive = activeFilters.includes(option.tag);
          return (
            <motion.button
              key={option.id}
              className={`${styles.chip} ${isActive ? styles.chipActive : ""}`}
              onClick={() => toggleFilter(option.tag)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    className={styles.chipCheck}
                    initial={{ opacity: 0, scale: 0.5, width: 0 }}
                    animate={{ opacity: 1, scale: 1, width: "auto" }}
                    exit={{ opacity: 0, scale: 0.5, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiCheck />
                  </motion.span>
                )}
              </AnimatePresence>
              <span className={styles.chipLabel}>{option.label}</span>
            </motion.button>
          );
        })}

        <AnimatePresence>
          {activeFilters.length > 0 && (
            <motion.button
              className={styles.clearChip}
              onClick={clearAll}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.04 }}
            >
              Clear ({activeFilters.length})
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FilterChips;
