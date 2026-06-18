import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GalleryItem from "./GalleryItem";
import SectionLabel from "../../../ui/SectionLabel/SectionLabel";
import {
  galleryImages,
  galleryCategories,
} from "../../../../assets/data/gallery";
import styles from "./Gallery.module.css";

gsap.registerPlugin(ScrollTrigger);

const Gallery = () => {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState("all");

  // ── GSAP Entrance ──────────────────────────────────────
  useGSAP(
    () => {
      // Header entrance
      gsap.fromTo(
        `.${styles.header}`,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        },
      );

      // Parallax on grid items
      gsap.utils.toArray(`.${styles.item}`).forEach((item, i) => {
        const speed = i % 3 === 0 ? -30 : i % 3 === 1 ? -15 : -45;
        gsap.to(item, {
          y: speed,
          ease: "none",
          scrollTrigger: {
            trigger: item,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      });
    },
    { scope: sectionRef },
  );

  // ── Filter logic ───────────────────────────────────────
  const filteredImages =
    activeCategory === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-label="Facility Gallery"
    >
      {/* Background */}
      <div className={styles.bgNoise} aria-hidden="true" />
      <div className={styles.bgGradient} aria-hidden="true" />

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <SectionLabel text="GALLERY" variant="light" />
          <h2 className={styles.heading}>
            Inside
            <span className={styles.headingAccent}> Gymsssy</span>
          </h2>
          <p className={styles.subheading}>
            State-of-the-art facilities engineered for peak performance. Every
            detail designed with purpose.
          </p>
        </div>

        {/* Category Filter */}
        <div
          className={styles.filterBar}
          role="tablist"
          aria-label="Filter gallery by category"
        >
          {galleryCategories.map((cat) => (
            <motion.button
              key={cat.id}
              role="tab"
              aria-selected={activeCategory === cat.id}
              className={`${styles.filterBtn} ${
                activeCategory === cat.id ? styles.filterBtnActive : ""
              }`}
              onClick={() => setActiveCategory(cat.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {cat.label}
              {activeCategory === cat.id && (
                <motion.span
                  className={styles.filterBtnUnderline}
                  layoutId="filterUnderline"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Masonry Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            ref={gridRef}
            className={styles.grid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredImages.map((image, index) => (
              <GalleryItem key={image.id} image={image} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* View All CTA */}
        <motion.div
          className={styles.viewAllWrapper}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <button className={styles.viewAllBtn}>
            <span>View Full Gallery</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Gallery;
