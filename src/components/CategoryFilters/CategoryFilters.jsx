/**
 * CategoryFilters.jsx
 *
 * Fix: renders BOTH the desktop sidebar AND the mobile toolbar
 * from a SINGLE instance. The page no longer needs to render
 * this component twice.
 *
 * Desktop (> 900px): sidebar is visible, toolbar is hidden
 * Mobile  (≤ 900px): toolbar is visible, sidebar is hidden
 *                    + drawer opens on "Filters" tap
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal, Star, ChevronDown } from "lucide-react";
import styles from "./CategoryFilters.module.css";

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended"        },
  { value: "rating",      label: "Highest Rated"      },
  { value: "price_asc",   label: "Price: Low to High" },
  { value: "price_desc",  label: "Price: High to Low" },
  { value: "distance",    label: "Distance"            },
];

const RATING_OPTIONS = [
  { value: 4.5, label: "4.5+ Stars" },
  { value: 4.0, label: "4.0+ Stars" },
  { value: 3.5, label: "3.5+ Stars" },
];

/* ── Shared filter body used in both sidebar and drawer ── */
const FilterBody = ({ filters, onChange, onReset }) => {
  const hasActive =
    filters.sort !== "recommended" ||
    filters.minRating !== null      ||
    filters.openNow   !== false;

  return (
    <div className={styles.filterBody}>

      {/* Header */}
      <div className={styles.filterHead}>
        <span className={styles.filterHeadLabel}>
          <SlidersHorizontal size={14} aria-hidden="true" />
          Filters
        </span>
        {hasActive && (
          <button
            className={styles.resetBtn}
            onClick={onReset}
            aria-label="Reset all filters"
          >
            Reset
          </button>
        )}
      </div>

      {/* Sort */}
      <div className={styles.group}>
        <label className={styles.groupLabel} htmlFor="sidebar-sort">
          Sort By
        </label>
        <div className={styles.selectWrap}>
          <select
            id="sidebar-sort"
            className={styles.select}
            value={filters.sort}
            onChange={(e) => onChange("sort", e.target.value)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown size={13} className={styles.selectIcon} aria-hidden="true" />
        </div>
      </div>

      {/* Rating */}
      <div className={styles.group}>
        <span className={styles.groupLabel}>Minimum Rating</span>
        <div className={styles.ratingList}>
          {RATING_OPTIONS.map((o) => (
            <button
              key={o.value}
              className={`${styles.ratingBtn} ${
                filters.minRating === o.value ? styles.ratingBtnActive : ""
              }`}
              onClick={() =>
                onChange(
                  "minRating",
                  filters.minRating === o.value ? null : o.value,
                )
              }
              aria-pressed={filters.minRating === o.value}
            >
              <Star size={11} aria-hidden="true" />
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Open Now */}
      <div className={styles.group}>
        <span className={styles.groupLabel}>Availability</span>
        <label className={styles.toggleRow} htmlFor="open-now">
          <span className={styles.toggleLabel}>Open Now</span>
          <div className={styles.toggleWrap}>
            <input
              id="open-now"
              type="checkbox"
              className={styles.toggleInput}
              checked={filters.openNow}
              onChange={(e) => onChange("openNow", e.target.checked)}
            />
            <div
              className={`${styles.track} ${filters.openNow ? styles.trackOn : ""}`}
              aria-hidden="true"
            >
              <div className={styles.thumb} />
            </div>
          </div>
        </label>
      </div>

      <p className={styles.note}>
        More filters — location, price range, amenities — coming soon.
      </p>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   MAIN EXPORT — single instance, dual layout
══════════════════════════════════════════════════════ */
const CategoryFilters = ({ filters, onChange, onReset, totalResults }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* ════════════════════════════════════════════
          DESKTOP SIDEBAR
          Visible on > 900px via CSS.
          Hidden on mobile.
      ════════════════════════════════════════════ */}
      <aside className={styles.sidebar} aria-label="Filter listings">
        <FilterBody
          filters={filters}
          onChange={onChange}
          onReset={onReset}
        />
      </aside>

      {/* ════════════════════════════════════════════
          MOBILE TOOLBAR
          Visible on ≤ 900px via CSS.
          Hidden on desktop.
          Sits OUTSIDE the sidebar so it spans full width.
      ════════════════════════════════════════════ */}
      <div className={styles.mobileBar} role="toolbar" aria-label="Filter and sort">

        {/* Filters button → opens drawer */}
        <button
          className={styles.mobileFilterBtn}
          onClick={() => setDrawerOpen(true)}
          aria-label="Open filters"
          aria-expanded={drawerOpen}
          aria-controls="filter-drawer"
        >
          <SlidersHorizontal size={14} aria-hidden="true" />
          Filters
        </button>

        {/* Sort inline */}
        <div className={styles.mobileSortWrap}>
          <select
            className={styles.mobileSelect}
            value={filters.sort}
            onChange={(e) => onChange("sort", e.target.value)}
            aria-label="Sort listings"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown size={13} className={styles.selectIcon} aria-hidden="true" />
        </div>

        {/* Result count pill */}
        {totalResults > 0 && (
          <span className={styles.mobileCount} aria-live="polite">
            {totalResults.toLocaleString()} found
          </span>
        )}
      </div>

      {/* ════════════════════════════════════════════
          MOBILE DRAWER
          AnimatePresence handles smooth mount/unmount.
      ════════════════════════════════════════════ */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className={styles.backdrop}
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setDrawerOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              id="filter-drawer"
              className={styles.drawer}
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.26, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Drawer header */}
              <div className={styles.drawerHead}>
                <span className={styles.drawerTitle}>Filters</span>
                <button
                  className={styles.drawerClose}
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close filters"
                >
                  <X size={17} />
                </button>
              </div>

              {/* Reuse FilterBody */}
              <div className={styles.drawerBody}>
                <FilterBody
                  filters={filters}
                  onChange={onChange}
                  onReset={onReset}
                />
              </div>

              {/* Apply */}
              <div className={styles.drawerFooter}>
                <button
                  className={styles.applyBtn}
                  onClick={() => setDrawerOpen(false)}
                >
                  Show {totalResults.toLocaleString()} Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CategoryFilters;