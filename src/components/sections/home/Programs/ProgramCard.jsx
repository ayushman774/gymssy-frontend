import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import {
  FiClock,
  FiZap,
  FiCalendar,
  FiArrowUpRight,
  FiCheck,
} from "react-icons/fi";
import styles from "./ProgramCard.module.css";

// ── Card entrance variants ────────────────────────────────────────────────
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.96,
  },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      delay: i * 0.1,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

// ── Tag color map ─────────────────────────────────────────────────────────
const TAG_STYLES = {
  neon: styles.tagNeon,
  blue: styles.tagBlue,
};

const ProgramCard = ({ program, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  // ── 3D tilt effect via mouse position ──────────────────────────────────
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring smooth the raw mouse values
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  // Map mouse position to rotation
  const rotateX = useTransform(springY, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-6deg", "6deg"]);

  // Map to subtle highlight position
  const glareX = useTransform(springX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(springY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set((e.clientX - centerX) / (rect.width / 2));
    mouseY.set((e.clientY - centerY) / (rect.height / 2));
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.div
      ref={cardRef}
      className={styles.cardOuter}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-5% 0px" }}
      custom={index}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        to={program.href}
        className={styles.card}
        aria-label={`Learn more about ${program.title}`}
        tabIndex={0}
      >
        {/* ── IMAGE LAYER ───────────────────────────── */}
        <div className={styles.imageWrapper}>
          {/* Background image */}
          <img
            src={program.image.src}
            srcSet={program.image.srcSet}
            sizes={program.image.sizes}
            alt={program.image.alt}
            className={styles.image}
            loading="lazy"
            decoding="async"
          />

          {/* Hover image (crossfade) */}
          {program.hoverImage && (
            <img
              src={program.hoverImage.src}
              alt=""
              aria-hidden="true"
              className={`${styles.image} ${styles.imageHover}`}
              loading="lazy"
              decoding="async"
              style={{ opacity: isHovered ? 1 : 0 }}
            />
          )}

          {/* Base dark overlay */}
          <div className={styles.overlay} aria-hidden="true" />

          {/* Hover gradient overlay */}
          <div className={styles.hoverOverlay} aria-hidden="true" />

          {/* Neon glow border on hover */}
          <div className={styles.neonBorder} aria-hidden="true" />

          {/* Mouse glare effect */}
          <motion.div
            className={styles.glare}
            style={{
              background: isHovered
                ? `radial-gradient(circle at ${glareX.get()}% ${glareY.get()}%, rgba(57,255,20,0.12) 0%, transparent 60%)`
                : "none",
            }}
            aria-hidden="true"
          />
        </div>

        {/* ── CONTENT LAYER ─────────────────────────── */}
        <div className={styles.content}>
          {/* ── TOP ROW: category + tag ─────────────── */}
          <div className={styles.topRow}>
            <span className={styles.category}>{program.category}</span>

            {program.tag && (
              <span
                className={`${styles.tag} ${TAG_STYLES[program.tagColor] || ""}`}
              >
                {program.tag}
              </span>
            )}
          </div>

          {/* ── ICON ────────────────────────────────── */}
          <div className={styles.iconWrapper} aria-hidden="true">
            <span className={styles.icon}>{program.icon}</span>
          </div>

          {/* ── TITLE BLOCK ─────────────────────────── */}
          <div className={styles.titleBlock}>
            <h3 className={styles.title}>{program.title}</h3>
            <p className={styles.subtitle}>{program.subtitle}</p>
          </div>

          {/* ── DESCRIPTION ─────────────────────────── */}
          <p className={styles.description}>{program.description}</p>

          {/* ── META INFO ───────────────────────────── */}
          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <FiClock className={styles.metaIcon} />
              <span>{program.duration}</span>
            </div>
            <div className={styles.metaItem}>
              <FiZap className={styles.metaIcon} />
              <span>{program.level}</span>
            </div>
            <div className={styles.metaItem}>
              <FiCalendar className={styles.metaIcon} />
              <span>{program.sessions}</span>
            </div>
          </div>

          {/* ── HIGHLIGHTS ──────────────────────────── */}
          <ul className={styles.highlights} role="list">
            {program.highlights.map((item, i) => (
              <li key={i} className={styles.highlightItem}>
                <FiCheck className={styles.highlightIcon} />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* ── CTA ROW ─────────────────────────────── */}
          <div className={styles.ctaRow}>
            <span className={styles.ctaText}>View Program</span>
            <span className={styles.ctaArrow}>
              <FiArrowUpRight />
            </span>
          </div>
        </div>

        {/* ── BOTTOM NEON LINE ────────────────────────── */}
        <div className={styles.bottomLine} aria-hidden="true" />
      </Link>
    </motion.div>
  );
};

export default ProgramCard;
