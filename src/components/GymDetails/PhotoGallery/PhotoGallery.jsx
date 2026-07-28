import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import styles from "./PhotoGallery.module.css";

const CATEGORIES = [
  "All",
  "Gym",
  "Equipment",
  "Classes",
  "Trainers",
  "Facilities",
];

const PhotoGallery = ({ images, gymName, showAll, onClose }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filtered =
    activeCategory === "All"
      ? images
      : images.filter(
          (img) => img.category?.toLowerCase() === activeCategory.toLowerCase(),
        );

  const openLightbox = (i) => {
    setLightboxIndex(i);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = "";
  };

  const prevImage = () =>
    setLightboxIndex((i) => (i === 0 ? filtered.length - 1 : i - 1));
  const nextImage = () =>
    setLightboxIndex((i) => (i === filtered.length - 1 ? 0 : i + 1));

  React.useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e) => {
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex]);

  return (
    <>
      {/* Inline Gallery (first 6 images) */}
      <div className={styles.inlineGallery}>
        {images.slice(0, 6).map((img, i) => (
          <motion.div
            key={img.id}
            className={styles.thumbWrap}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            onClick={() => openLightbox(i)}
            role="button"
            tabIndex={0}
            aria-label={`View photo: ${img.alt}`}
            onKeyPress={(e) => e.key === "Enter" && openLightbox(i)}
          >
            <img
              src={img.url}
              alt={img.alt || gymName}
              className={styles.thumb}
              loading="lazy"
            />
            <div className={styles.thumbOverlay} />
          </motion.div>
        ))}
      </div>

      {/* Full Gallery Modal */}
      <AnimatePresence>
        {showAll && (
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label={`All photos of ${gymName}`}
          >
            {/* Header */}
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>All Photos — {gymName}</h3>
              <button
                className={styles.closeBtn}
                onClick={onClose}
                aria-label="Close photo gallery"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Filter */}
            <div className={styles.filterRow}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`${styles.filterBtn} ${
                    activeCategory === cat ? styles.filterBtnActive : ""
                  }`}
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={activeCategory === cat}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className={styles.modalGrid}>
              {filtered.map((img, i) => (
                <motion.div
                  key={img.id}
                  className={styles.modalThumbWrap}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  onClick={() => openLightbox(i)}
                  role="button"
                  tabIndex={0}
                  aria-label={img.alt}
                  onKeyPress={(e) => e.key === "Enter" && openLightbox(i)}
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src={img.url}
                    alt={img.alt || gymName}
                    className={styles.modalThumb}
                    loading="lazy"
                  />
                  <div className={styles.thumbOverlay} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
          >
            <div className={styles.lightboxBackdrop} onClick={closeLightbox} />

            <button
              className={styles.lightboxClose}
              onClick={closeLightbox}
              aria-label="Close"
            >
              <FiX size={20} />
            </button>

            <div className={styles.lightboxCounter}>
              {lightboxIndex + 1} / {filtered.length}
            </div>

            <motion.div
              key={lightboxIndex}
              className={styles.lightboxImageWrap}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <img
                src={filtered[lightboxIndex]?.url}
                alt={filtered[lightboxIndex]?.alt || gymName}
                className={styles.lightboxImage}
              />
              {filtered[lightboxIndex]?.alt && (
                <p className={styles.lightboxCaption}>
                  {filtered[lightboxIndex].alt}
                </p>
              )}
            </motion.div>

            {filtered.length > 1 && (
              <>
                <button
                  className={`${styles.lightboxNav} ${styles.lightboxNavPrev}`}
                  onClick={prevImage}
                  aria-label="Previous"
                >
                  <FiChevronLeft size={24} />
                </button>
                <button
                  className={`${styles.lightboxNav} ${styles.lightboxNavNext}`}
                  onClick={nextImage}
                  aria-label="Next"
                >
                  <FiChevronRight size={24} />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PhotoGallery;
