import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import {
  FiInstagram,
  FiTwitter,
  FiLinkedin,
  FiYoutube,
  FiStar,
  FiAward,
  FiUsers,
  FiArrowUpRight,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";
import styles from "./TrainerCard.module.css";

// ── Social icon map ───────────────────────────────────────────────────────
const SOCIAL_ICONS = {
  instagram: { icon: FiInstagram, label: "Instagram", color: "#E1306C" },
  twitter: { icon: FiTwitter, label: "Twitter", color: "#1DA1F2" },
  linkedin: { icon: FiLinkedin, label: "LinkedIn", color: "#0A66C2" },
  youtube: { icon: FiYoutube, label: "YouTube", color: "#FF0000" },
};

// ── Star rating ───────────────────────────────────────────────────────────
const StarRating = ({ rating, reviews }) => (
  <div
    className={styles.rating}
    aria-label={`${rating} stars from ${reviews} reviews`}
  >
    <FiStar className={styles.starIcon} aria-hidden="true" />
    <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
    <span className={styles.ratingCount}>({reviews})</span>
  </div>
);

// ── Social button ─────────────────────────────────────────────────────────
const SocialButton = ({ platform, href, index }) => {
  const config = SOCIAL_ICONS[platform];
  if (!href || !config) return null;
  const Icon = config.icon;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.socialBtn}
      aria-label={`${config.label} profile`}
      initial={{ opacity: 0, y: 12, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.85 }}
      transition={{
        duration: 0.25,
        delay: index * 0.06,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      whileHover={{ scale: 1.15, y: -2 }}
      whileTap={{ scale: 0.92 }}
      onClick={(e) => e.stopPropagation()}
      style={{ "--social-color": config.color }}
    >
      <Icon aria-hidden="true" />
    </motion.a>
  );
};

// ── TrainerCard ───────────────────────────────────────────────────────────
const TrainerCard = ({ trainer, index, layout = "grid" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  // 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 120, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 18 });
  const rotateX = useTransform(springY, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-5deg", "5deg"]);

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

  // Social links filter
  const socialLinks = Object.entries(trainer.social).filter(
    ([, href]) => href !== null,
  );

  // Card entrance
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.div
      ref={cardRef}
      className={`${styles.cardOuter} ${layout === "featured" ? styles.cardFeatured : ""}`}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-5%" }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        to={trainer.href}
        className={styles.card}
        aria-label={`View ${trainer.name}'s profile`}
      >
        {/* ── IMAGE SECTION ─────────────────────────── */}
        <div className={styles.imageSection}>
          {/* Photo */}
          <div className={styles.imageWrapper}>
            <img
              src={trainer.image.src}
              srcSet={trainer.image.srcSet}
              sizes={trainer.image.sizes}
              alt={trainer.image.alt}
              className={styles.image}
              loading="lazy"
              decoding="async"
            />

            {/* Grayscale overlay — removed on hover */}
            <div
              className={styles.grayscaleOverlay}
              style={{ opacity: isHovered ? 0 : 1 }}
              aria-hidden="true"
            />

            {/* Dark gradient overlay */}
            <div className={styles.imageGradient} aria-hidden="true" />

            {/* Neon rim light effect */}
            <div
              className={styles.neonRim}
              style={{ opacity: isHovered ? 1 : 0 }}
              aria-hidden="true"
            />
          </div>

          {/* ── SOCIAL ICONS (reveal on hover) ──────── */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className={styles.socialOverlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                aria-label={`${trainer.name}'s social media links`}
              >
                <div className={styles.socialGroup}>
                  {socialLinks.map(([platform, href], i) => (
                    <SocialButton
                      key={platform}
                      platform={platform}
                      href={href}
                      index={i}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── STATUS BADGE ─────────────────────────── */}
          <div
            className={`
              ${styles.statusBadge}
              ${trainer.available ? styles.statusAvailable : styles.statusFull}
            `}
            aria-label={
              trainer.available ? "Accepting clients" : "Fully booked"
            }
          >
            <span className={styles.statusDot} aria-hidden="true" />
            <span>
              {trainer.available ? "Accepting Clients" : "Fully Booked"}
            </span>
          </div>

          {/* ── FEATURED BADGE ────────────────────────── */}
          {trainer.featured && (
            <div className={styles.featuredBadge} aria-label="Featured trainer">
              <FiAward aria-hidden="true" />
              <span>Featured</span>
            </div>
          )}
        </div>

        {/* ── CONTENT SECTION ───────────────────────── */}
        <div className={styles.contentSection}>
          {/* Header */}
          <div className={styles.contentHeader}>
            <div className={styles.nameBlock}>
              <h3 className={styles.name}>{trainer.name}</h3>
              <span className={styles.role}>{trainer.role}</span>
            </div>
            <StarRating rating={trainer.rating} reviews={trainer.reviews} />
          </div>

          {/* Specialty tag */}
          <div className={styles.specialtyTag}>
            <span className={styles.specialtyDot} aria-hidden="true" />
            <span>{trainer.specialty}</span>
          </div>

          {/* Stats row */}
          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <FiClock className={styles.statIcon} aria-hidden="true" />
              <div className={styles.statText}>
                <span className={styles.statValue}>{trainer.experience}</span>
                <span className={styles.statLabel}>Experience</span>
              </div>
            </div>
            <div className={styles.statDivider} aria-hidden="true" />
            <div className={styles.statItem}>
              <FiUsers className={styles.statIcon} aria-hidden="true" />
              <div className={styles.statText}>
                <span className={styles.statValue}>{trainer.clients}</span>
                <span className={styles.statLabel}>Clients</span>
              </div>
            </div>
            <div className={styles.statDivider} aria-hidden="true" />
            <div className={styles.statItem}>
              <FiAward className={styles.statIcon} aria-hidden="true" />
              <div className={styles.statText}>
                <span className={styles.statValue}>{trainer.sessions}</span>
                <span className={styles.statLabel}>Sessions</span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <p className={styles.bio}>{trainer.bio}</p>

          {/* Specializations */}
          <div className={styles.specList}>
            {trainer.specializations.map((spec, i) => (
              <span key={i} className={styles.specTag}>
                <FiCheckCircle className={styles.specIcon} aria-hidden="true" />
                {spec}
              </span>
            ))}
          </div>

          {/* Certifications */}
          <div className={styles.certRow}>
            {trainer.certifications.map((cert, i) => (
              <span key={i} className={styles.certBadge}>
                {cert}
              </span>
            ))}
          </div>

          {/* CTA row */}
          <div className={styles.ctaRow}>
            <span className={styles.ctaText}>View Full Profile</span>
            <span className={styles.ctaIcon}>
              <FiArrowUpRight />
            </span>
          </div>
        </div>

        {/* ── NEON BORDER GLOW ──────────────────────── */}
        <div
          className={styles.neonBorder}
          style={{ opacity: isHovered ? 1 : 0 }}
          aria-hidden="true"
        />

        {/* ── BOTTOM ACCENT LINE ────────────────────── */}
        <div className={styles.bottomLine} aria-hidden="true" />
      </Link>
    </motion.div>
  );
};

export default TrainerCard;
