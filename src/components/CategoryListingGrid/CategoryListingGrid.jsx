import { motion } from "framer-motion";
import { AlertCircle, RefreshCw, SearchX, LayoutGrid } from "lucide-react";
import GymCard from "../GymCard/GymCard";
import styles from "./CategoryListingGrid.module.css";

/* ── Skeleton card ── */
const SkeletonCard = ({ index }) => (
  <div
    className={styles.skeleton}
    aria-hidden="true"
    style={{ animationDelay: `${index * 0.06}s` }}
  >
    <div className={styles.skeletonImg} />
    <div className={styles.skeletonBody}>
      <div
        className={styles.skeletonLine}
        style={{ width: "40%", height: 11 }}
      />
      <div
        className={styles.skeletonLine}
        style={{ width: "72%", height: 17, marginTop: 6 }}
      />
      <div
        className={styles.skeletonLine}
        style={{ width: "55%", height: 13, marginTop: 6 }}
      />
      <div className={styles.skeletonFooter}>
        <div
          className={styles.skeletonLine}
          style={{ width: "38%", height: 15 }}
        />
        <div className={styles.skeletonBtn} />
      </div>
    </div>
  </div>
);

/* ── Error state ── */
const ErrorState = ({ onRetry }) => (
  <motion.div
    className={styles.stateBox}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    role="alert"
  >
    <div className={styles.stateIconWrap}>
      <AlertCircle size={28} aria-hidden="true" />
    </div>
    <h3 className={styles.stateTitle}>Something went wrong</h3>
    <p className={styles.stateText}>
      We couldn't load this category right now. Please try again.
    </p>
    <button className={styles.stateBtn} onClick={onRetry}>
      <RefreshCw size={15} aria-hidden="true" />
      Try Again
    </button>
  </motion.div>
);

/* ── Empty state ── */
const EmptyState = ({ title }) => (
  <motion.div
    className={styles.stateBox}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    role="status"
    aria-live="polite"
  >
    <div className={styles.stateIconWrap}>
      <SearchX size={28} aria-hidden="true" />
    </div>
    <h3 className={styles.stateTitle}>No results found</h3>
    <p className={styles.stateText}>
      We couldn't find any {title ?? "listings"} in this category yet.
    </p>
  </motion.div>
);

/* ── Main grid ── */
const CategoryListingGrid = ({
  listings,
  loading,
  error,
  onRetry,
  categoryTitle,
}) => {
  /* Loading state — 8 skeletons */
  if (loading) {
    return (
      <div
        className={styles.grid}
        aria-label="Loading listings"
        aria-busy="true"
      >
        {Array.from({ length: 8 }, (_, i) => (
          <SkeletonCard key={i} index={i} />
        ))}
      </div>
    );
  }

  /* Error */
  if (error) {
    return <ErrorState onRetry={onRetry} />;
  }

  /* Empty */
  if (!listings || listings.length === 0) {
    return <EmptyState title={categoryTitle} />;
  }

  /* Results */
  return (
    <motion.div
      className={styles.grid}
      role="list"
      aria-label={`${categoryTitle ?? "Category"} listings`}
    >
      {listings.map((gym, index) => (
        <motion.div
          key={gym._id ?? gym.id ?? index}
          role="listitem"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.42,
            delay: (index % 8) * 0.055,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <GymCard gym={gym} index={index} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CategoryListingGrid;
