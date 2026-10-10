import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, ArrowRight, RefreshCw, SearchX } from "lucide-react";
import DiscoveryCard from "../Discover/DiscoveryCard/DiscoveryCard";
import styles from "./CategoryListingGrid.module.css";

const SkeletonCard = ({ index }) => <div className={styles.skeleton} aria-hidden="true" style={{ animationDelay: `${index * 0.06}s` }}>
  <div className={styles.skeletonImg} />
  <div className={styles.skeletonBody}><div className={styles.skeletonLine} style={{ width: "40%", height: 11 }} /><div className={styles.skeletonLine} style={{ width: "72%", height: 17, marginTop: 6 }} /><div className={styles.skeletonLine} style={{ width: "55%", height: 13, marginTop: 6 }} /><div className={styles.skeletonFooter}><div className={styles.skeletonLine} style={{ width: "38%", height: 15 }} /><div className={styles.skeletonBtn} /></div></div>
</div>;

const ErrorState = ({ error, onRetry }) => <motion.div className={styles.stateBox} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} role="alert">
  <div className={styles.stateIconWrap}><AlertCircle size={28} aria-hidden="true" /></div>
  <h3 className={styles.stateTitle}>We couldn’t load these listings</h3>
  <p className={styles.stateText}>{error?.status === 400 ? "One of the selected filters is no longer available. Reset the filters and try again." : "Please check your connection and try again."}</p>
  <button className={styles.stateBtn} onClick={onRetry}><RefreshCw size={15} aria-hidden="true" /> Try Again</button>
</motion.div>;

const EmptyState = ({ title, onReset }) => <motion.div className={styles.stateBox} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} role="status" aria-live="polite">
  <div className={styles.stateIconWrap}><SearchX size={28} aria-hidden="true" /></div>
  <h3 className={styles.stateTitle}>No matching listings found</h3>
  <p className={styles.stateText}>Try changing your filters or search within {title ?? "this category"}.</p>
  <button className={styles.stateBtn} onClick={onReset}>Clear filters</button>
</motion.div>;

export default function CategoryListingGrid({ listings, pagination, loading, error, onRetry, onReset, onPageChange, categoryTitle, compactGrid = false }) {
  if (loading) return <div className={`${styles.grid} ${compactGrid ? styles.compactGrid : ""}`} aria-label="Loading listings" aria-busy="true">{Array.from({ length: compactGrid ? 6 : 8 }, (_, index) => <SkeletonCard key={index} index={index} />)}</div>;
  if (error) return <ErrorState error={error} onRetry={onRetry} />;
  if (!listings?.length) return <EmptyState title={categoryTitle} onReset={onReset} />;
  return <>
    <motion.div className={`${styles.grid} ${compactGrid ? styles.compactGrid : ""}`} role="list" aria-label={`${categoryTitle ?? "Category"} listings`}>
      {listings.map((item, index) => <motion.div key={`${item.entityType}-${item.id}`} role="listitem" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, delay: (index % 8) * 0.055, ease: [0.25, 0.46, 0.45, 0.94] }}><DiscoveryCard item={item} /></motion.div>)}
    </motion.div>
    {(compactGrid || (pagination?.totalPages ?? 0) > 1) && <nav className={styles.pagination} aria-label="Category result pages">
      <button disabled={(pagination?.page ?? 1) <= 1} onClick={() => onPageChange((pagination?.page ?? 1) - 1)}><ArrowLeft size={15} aria-hidden="true" /> Previous</button>
      <span>Page {pagination?.page ?? 1} of {Math.max(1, pagination?.totalPages ?? 1)}</span>
      <button disabled={(pagination?.page ?? 1) >= Math.max(1, pagination?.totalPages ?? 1)} onClick={() => onPageChange((pagination?.page ?? 1) + 1)}>Next <ArrowRight size={15} aria-hidden="true" /></button>
    </nav>}
  </>;
}
