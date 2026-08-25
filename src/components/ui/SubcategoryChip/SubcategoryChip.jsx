// src/ui/SubcategoryChip/SubcategoryChip.jsx

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import DynamicIcon from "../DynamicIcon/DynamicIcon";
import styles from "./SubcategoryChip.module.css";

const SubcategoryChip = ({ subcategory, accentColor, index }) => {
  const { title, slug, icon, count } = subcategory;

  /* Format count: 2400 → "2.4k", 890 → "890" */
  const formattedCount =
    count >= 1000 ? `${(count / 1000).toFixed(1)}k` : String(count ?? 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.045,
        ease: "easeOut",
      }}
    >
      <Link
        to={`/category/${slug}`}
        className={styles.chip}
        style={{ "--accent": accentColor }}
        aria-label={`${title}${count ? ` — ${formattedCount} listings` : ""}`}
      >
        {/* Icon from backend */}
        {icon && (
          <span className={styles.chipIconWrap} aria-hidden="true">
            <DynamicIcon
              name={icon}
              size={14}
              strokeWidth={2}
              className={styles.chipIcon}
            />
          </span>
        )}

        {/* Label */}
        <span className={styles.chipLabel}>{title}</span>

        {/* Count badge */}
        {count != null && (
          <span className={styles.chipCount} aria-hidden="true">
            {formattedCount}
          </span>
        )}

        {/* Trailing arrow */}
        <ChevronRight
          size={12}
          strokeWidth={2.5}
          className={styles.chipArrow}
          aria-hidden="true"
        />
      </Link>
    </motion.div>
  );
};

export default SubcategoryChip;
