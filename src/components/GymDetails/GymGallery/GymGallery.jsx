import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import {
  FiCamera,
  FiMaximize2,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "./GymGallery.module.css";

const GymGallery = ({ images, gymName, onViewAll }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const mainImage = images[0];
  const gridImages = images.slice(1, 5);
  const totalImages = images.length;

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  };

  const prevImage = () =>
    setLightboxIndex((i) => (i === 0 ? images.length - 1 : i - 1));

  const nextImage = () =>
    setLightboxIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  // Keyboard navigation
  React.useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e) => {
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen]);

  return (
    <div className={styles.galleryWrapper}>
      {/* ── DESKTOP GRID ─────────────────────────────────────── */}
      <div className={styles.desktopGallery}>
        {/* Main image */}
        <div
          className={styles.mainImageWrap}
          onClick={() => openLightbox(0)}
          role="button"
          tabIndex={0}
          aria-label={`View ${mainImage?.alt || gymName} full size`}
          onKeyPress={(e) => e.key === "Enter" && openLightbox(0)}
        >
          <img
            src={mainImage?.url}
            alt={mainImage?.alt || gymName}
            className={styles.mainImage}
            loading="lazy"
          />
          <div className={styles.imageOverlay}>
            <FiMaximize2 className={styles.overlayIcon} />
          </div>
        </div>

        {/* Grid images */}
        <div className={styles.imageGrid}>
          {gridImages.map((img, i) => (
            <div
              key={img.id}
              className={`${styles.gridImageWrap} ${
                i === 3 ? styles.lastGridImage : ""
              }`}
              onClick={() => openLightbox(i + 1)}
              role="button"
              tabIndex={0}
              aria-label={`View ${img.alt || gymName} full size`}
              onKeyPress={(e) => e.key === "Enter" && openLightbox(i + 1)}
            >
              <img
                src={img.url}
                alt={img.alt || gymName}
                className={styles.gridImage}
                loading="lazy"
              />
              <div className={styles.imageOverlay}>
                <FiMaximize2 className={styles.overlayIcon} />
              </div>
              {/* View All overlay on last image */}
              {i === 3 && totalImages > 5 && (
                <button
                  className={styles.viewAllOverlay}
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewAll?.();
                  }}
                  aria-label={`View all ${totalImages} photos`}
                >
                  <FiCamera size={18} />
                  <span>+{totalImages - 5} Photos</span>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* View All button */}
        <button
          className={styles.viewAllBtn}
          onClick={onViewAll}
          aria-label={`View all ${totalImages} photos`}
        >
          <FiCamera size={14} />
          View All {totalImages} Photos
        </button>
      </div>

      {/* ── MOBILE SWIPER ─────────────────────────────────────── */}
      <div className={styles.mobileGallery}>
        <Swiper
          modules={[Navigation, Pagination, A11y]}
          pagination={{ clickable: true }}
          a11y={{ enabled: true }}
          className={styles.swiper}
          loop={images.length > 1}
        >
          {images.map((img, i) => (
            <SwiperSlide key={img.id}>
              <div
                className={styles.mobileSlide}
                onClick={() => openLightbox(i)}
                role="button"
                tabIndex={0}
                aria-label={`View ${img.alt || gymName}`}
              >
                <img
                  src={img.url}
                  alt={img.alt || gymName}
                  className={styles.mobileImage}
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className={styles.mobileImageCount}>
          <FiCamera size={12} />
          {totalImages} Photos
        </div>
      </div>

      {/* ── LIGHTBOX ──────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label="Image gallery"
          >
            {/* Backdrop */}
            <div className={styles.lightboxBackdrop} onClick={closeLightbox} />

            {/* Content */}
            <div className={styles.lightboxContent}>
              {/* Close */}
              <button
                className={styles.lightboxClose}
                onClick={closeLightbox}
                aria-label="Close gallery"
              >
                <FiX size={20} />
              </button>

              {/* Counter */}
              <div className={styles.lightboxCounter}>
                {lightboxIndex + 1} / {images.length}
              </div>

              {/* Image */}
              <motion.div
                key={lightboxIndex}
                className={styles.lightboxImageWrap}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src={images[lightboxIndex]?.url}
                  alt={images[lightboxIndex]?.alt || gymName}
                  className={styles.lightboxImage}
                />
                {images[lightboxIndex]?.alt && (
                  <p className={styles.lightboxCaption}>
                    {images[lightboxIndex].alt}
                  </p>
                )}
              </motion.div>

              {/* Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    className={`${styles.lightboxNav} ${styles.lightboxNavPrev}`}
                    onClick={prevImage}
                    aria-label="Previous image"
                  >
                    <FiChevronLeft size={24} />
                  </button>
                  <button
                    className={`${styles.lightboxNav} ${styles.lightboxNavNext}`}
                    onClick={nextImage}
                    aria-label="Next image"
                  >
                    <FiChevronRight size={24} />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GymGallery;
