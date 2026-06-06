import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import styles from "./Gallery.module.css";

const GalleryItem = ({ image, index }) => {
  const itemRef = useRef(null);
  const imgRef = useRef(null);
  const shineRef = useRef(null);
  const overlayRef = useRef(null);

  // ── Light sweep effect on hover ────────────────────────
  useEffect(() => {
    const item = itemRef.current;
    const shine = shineRef.current;
    const img = imgRef.current;
    const overlay = overlayRef.current;
    if (!item || !shine || !img) return;

    let shineAnim = null;

    const handleEnter = () => {
      // Kill existing
      if (shineAnim) shineAnim.kill();

      // Zoom image
      gsap.to(img, {
        scale: 1.08,
        duration: 0.6,
        ease: "power3.out",
      });

      // Darken overlay
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });

      // Light sweep
      gsap.fromTo(
        shine,
        { x: "-120%", opacity: 0 },
        {
          x: "120%",
          opacity: 0.6,
          duration: 0.7,
          ease: "power2.inOut",
        },
      );
    };

    const handleLeave = () => {
      // Reset image
      gsap.to(img, {
        scale: 1,
        duration: 0.6,
        ease: "power3.out",
      });

      // Reset overlay
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    item.addEventListener("mouseenter", handleEnter);
    item.addEventListener("mouseleave", handleLeave);

    return () => {
      item.removeEventListener("mouseenter", handleEnter);
      item.removeEventListener("mouseleave", handleLeave);
      if (shineAnim) shineAnim.kill();
    };
  }, []);

  return (
    <motion.div
      ref={itemRef}
      className={`${styles.item} ${styles[`item--${image.span}`]}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      role="img"
      aria-label={image.alt}
    >
      {/* Image */}
      <div className={styles.imgWrapper}>
        <img
          ref={imgRef}
          src={image.src}
          alt={image.alt}
          className={styles.img}
          loading={index < 3 ? "eager" : "lazy"}
          draggable={false}
        />

        {/* Permanent dark overlay */}
        <div className={styles.darkOverlay} aria-hidden="true" />

        {/* Hover overlay (darkens more) */}
        <div
          ref={overlayRef}
          className={styles.hoverOverlay}
          aria-hidden="true"
        />

        {/* Light sweep */}
        <div ref={shineRef} className={styles.lightSweep} aria-hidden="true" />

        {/* Neon border on hover */}
        <div className={styles.neonBorder} aria-hidden="true" />

        {/* Category tag */}
        <div className={styles.categoryTag}>
          <span className={styles.categoryDot} />
          <span className={styles.categoryLabel}>{image.category}</span>
        </div>

        {/* Hover content */}
        <div className={styles.hoverContent}>
          <p className={styles.hoverAlt}>{image.alt}</p>
          <div className={styles.hoverIcon}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 3h6v6M14 10l6.1-6.1M9 21H3v-6M10 14l-6.1 6.1" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GalleryItem;
