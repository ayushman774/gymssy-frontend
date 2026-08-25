// src/ui/CityCard/CityCard.jsx

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiMapPin } from "react-icons/fi";
import styles from "./CityCard.module.css";

/* safety net — handles string | { url, alt } */
const resolveImage = (image, imageAlt, fallbackAlt = "") => {
  if (!image) return { src: "", alt: fallbackAlt };
  if (typeof image === "string")
    return { src: image, alt: imageAlt ?? fallbackAlt };
  return { src: image.url ?? "", alt: image.alt ?? fallbackAlt };
};

const CityCard = ({ city, index }) => {
  const { name, slug, state, image, imageAlt, gymCount, href } = city;
  const navigate = useNavigate();

  const { src: imgSrc, alt: imgAlt } = resolveImage(image, imageAlt, name);
  const destination = `/gyms/${slug}`;

  const handleCardClick = () => navigate(destination);

  const handleExploreClick = (e) => {
    /* Stop card's onClick from double-firing */
    e.stopPropagation();
    navigate(destination);
  };

  return (
    <motion.div
      className={styles.card}
      onClick={handleCardClick}
      whileHover="hover"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{
        duration: 0.55,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      role="article"
      aria-label={`${name} — ${gymCount} gyms`}
    >
      {/* ── Background image ── */}
      <div className={styles.imageWrapper}>
        {imgSrc && (
          <motion.img
            src={imgSrc}
            alt={imgAlt}
            className={styles.image}
            loading={index < 2 ? "eager" : "lazy"}
            variants={{
              hover: {
                scale: 1.08,
                transition: { duration: 0.55, ease: "easeOut" },
              },
            }}
          />
        )}
        <div className={styles.imageOverlay} />
        <div className={styles.glowLayer} />
      </div>

      {/* ── Content ── */}
      <div className={styles.content}>
        {/* City info */}
        <div className={styles.cityInfo}>
          <FiMapPin className={styles.pinIcon} aria-hidden="true" />
          <div>
            <h3 className={styles.cityName}>{name}</h3>
            <span className={styles.gymCount} aria-label={`${gymCount} gyms`}>
              {gymCount} Gyms
            </span>
          </div>
        </div>

        {/* Explore button — clearly interactive */}
        <button
          className={styles.exploreBtn}
          onClick={handleExploreClick}
          aria-label={`Explore fitness places in ${name}`}
          type="button"
        >
          Explore
          <FiArrowRight className={styles.exploreArrow} aria-hidden="true" />
        </button>
      </div>

      {/* ── Hover border glow ── */}
      <motion.div
        className={styles.borderGlow}
        initial={{ opacity: 0 }}
        variants={{
          hover: { opacity: 1, transition: { duration: 0.3 } },
        }}
        aria-hidden="true"
      />
    </motion.div>
  );
};

export default CityCard;
