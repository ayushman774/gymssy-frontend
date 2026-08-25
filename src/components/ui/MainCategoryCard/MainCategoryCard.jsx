// src/ui/MainCategoryCard/MainCategoryCard.jsx

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import DynamicIcon from "../DynamicIcon/DynamicIcon";
import styles from "./MainCategoryCard.module.css";

/**
 * resolveImage — unchanged
 */
const resolveImage = (image, fallbackAlt = "") => {
  if (!image) return { src: "", alt: fallbackAlt };
  if (typeof image === "string") return { src: image, alt: fallbackAlt };
  return { src: image.url ?? "", alt: image.alt ?? fallbackAlt };
};

const MainCategoryCard = ({ category, isActive, onClick, index }) => {
  const {
    title,
    description,
    image,
    accentColor,
    count,
    icon, // e.g. "Dumbbell" | "HeartPulse" | "Trophy"
    iconSize, // optional override from backend (rarely set)
  } = category;

  const { src: imgSrc, alt: imgAlt } = resolveImage(image, title);

  return (
    <motion.article
      className={`${styles.card} ${isActive ? styles.cardActive : ""}`}
      style={{ "--accent": accentColor }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      aria-label={`${title} — ${description}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{
        duration: 0.65,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover="hover"
    >
      {/* ── Background Image ── */}
      <div className={styles.imageWrapper} aria-hidden="true">
        <motion.div
          className={styles.image}
          style={{ backgroundImage: imgSrc ? `url(${imgSrc})` : "none" }}
          variants={{
            hover: {
              scale: 1.06,
              transition: { duration: 0.6, ease: "easeOut" },
            },
          }}
        />

        {imgSrc && (
          <img
            src={imgSrc}
            alt={imgAlt}
            className={styles.srOnlyImg}
            aria-hidden="false"
            fetchPriority={index === 0 ? "high" : "auto"}
            loading={index === 0 ? "eager" : "lazy"}
          />
        )}

        <div className={styles.overlay} />
        <div className={styles.accentGradient} />
      </div>

      {/* ── Active indicator line ── */}
      {isActive && (
        <motion.div
          className={styles.activeLine}
          layoutId="activeCategoryLine"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      )}

      {/* ── Content ── */}
      <div className={styles.content}>
        {/* ── Category icon badge ── */}
        {icon && (
          <div className={styles.iconBadge} aria-hidden="true">
            <DynamicIcon
              name={icon}
              size={iconSize ?? 22}
              strokeWidth={1.6}
              className={styles.iconBadgeSvg}
            />
          </div>
        )}

        {/* Count pill */}
        <span className={styles.countPill}>{count}</span>

        {/* Title */}
        <h3 className={styles.title}>{title}</h3>

        {/* Description */}
        <p className={styles.description}>{description}</p>

        {/* Footer */}
        <div className={styles.footer}>
          <span className={styles.exploreText}>
            {isActive ? "Browsing" : "Explore"}
          </span>

          <motion.div
            className={`${styles.arrowBtn} ${
              isActive ? styles.arrowBtnActive : ""
            }`}
            variants={{
              hover: {
                x: 4,
                scale: 1.1,
                transition: { duration: 0.25 },
              },
            }}
            aria-hidden="true"
          >
            <ArrowRight className={styles.arrowIcon} size={16} />
          </motion.div>
        </div>
      </div>

      {/* ── Hover border glow ── */}
      <motion.div
        className={styles.borderGlow}
        variants={{
          hover: { opacity: 1, transition: { duration: 0.3 } },
        }}
        initial={{ opacity: isActive ? 0.6 : 0 }}
        animate={{ opacity: isActive ? 0.6 : 0 }}
        aria-hidden="true"
      />
    </motion.article>
  );
};

export default MainCategoryCard;
