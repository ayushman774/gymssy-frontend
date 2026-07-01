import { useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import styles from "./CategoryCard.module.css";

const CategoryCard = ({ category }) => {
  const { id, icon, title, description, image, count } = category;

  return (
    <motion.div
      className={styles.card}
      whileHover="hover"
      initial="rest"
      animate="rest"
    >
      <Link
        to={`/categories/${id}`}
        className={styles.cardLink}
        aria-label={`Explore ${title}`}
      >
        {/* Image */}
        <div className={styles.imageWrapper}>
          <motion.img
            src={image}
            alt={title}
            className={styles.image}
            loading="lazy"
            variants={{
              rest: { scale: 1 },
              hover: {
                scale: 1.1,
                transition: { duration: 0.5, ease: "easeOut" },
              },
            }}
          />
          <div className={styles.imageOverlay} />

          {/* Neon glow border */}
          <motion.div
            className={styles.glowBorder}
            variants={{
              rest: { opacity: 0 },
              hover: { opacity: 1, transition: { duration: 0.3 } },
            }}
          />

          {/* Count badge */}
          <div className={styles.countBadge}>{count}</div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>

          <motion.div
            className={styles.explore}
            variants={{
              rest: { opacity: 0, x: -8 },
              hover: { opacity: 1, x: 0, transition: { duration: 0.3 } },
            }}
          >
            <span>Explore</span>
            <FiArrowRight />
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
