import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import styles from "./SubcategoryChip.module.css";

/* ══════════════════════════════════════════════════════
   SUBCATEGORY CHIP
   Small navigable pill shown in the expanded panel.
══════════════════════════════════════════════════════ */
const SubcategoryChip = ({ subcategory, accentColor, index }) => {
  const { title, slug, icon, count } = subcategory;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.045,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <Link
        to={`/category/${slug}`}
        className={styles.chip}
        style={{ "--accent": accentColor }}
        aria-label={`Browse ${title} — ${count} options`}
      >
        {/* Icon */}
        {icon && (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        )}

        {/* Label */}
        <span className={styles.label}>{title}</span>

        {/* Count */}
        {count && <span className={styles.count}>{count}</span>}
      </Link>
    </motion.div>
  );
};

export default SubcategoryChip;
