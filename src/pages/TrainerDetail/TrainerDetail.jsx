// src/pages/TrainerDetail/TrainerDetail.jsx

/**
 * CHANGES FROM PREVIOUS VERSION:
 *   - Removed: import { TRAINERS } from "../../assets/data/trainers"
 *   - Removed: import { slugify } from "../../utils/slugify"
 *   - Removed: TRAINERS.find(...) static lookup
 *   - Removed: similar = TRAINERS.filter(...) static lookup
 *   - Added:   import useTrainerDetail hook
 *   - Added:   loading state (skeleton)
 *   - Added:   error state with retry
 *   - Added:   API-driven trainer data
 *   - Similar trainers section: hidden until a similar trainers API exists
 *   - All UI, animations, modals, styling — COMPLETELY UNCHANGED
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiStar,
  FiArrowRight,
  FiArrowLeft,
  FiCheckCircle,
  FiX,
  FiCalendar,
  FiMail,
  FiUser,
  FiMessageSquare,
  FiShield,
  FiUsers,
  FiClock,
  FiInstagram,
  FiTwitter,
  FiLinkedin,
  FiYoutube,
  FiTarget,
  FiZap,
  FiHeart,
  FiAward,
  FiCheck,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";
import { MdFitnessCenter, MdVerified } from "react-icons/md";

import useTrainerDetail from "../../hooks/useTrainerDetail"; // ← NEW
import styles from "./TrainerDetail.module.css";

/* ─────────────────────────────────────────────
   ANIMATION VARIANTS — UNCHANGED
───────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (d = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: d, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

/* ─────────────────────────────────────────────
   STAR COMPONENT — UNCHANGED
───────────────────────────────────────────── */
const Stars = ({ rating, size = 14 }) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className={styles.stars} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <FiStar
          key={i}
          aria-hidden="true"
          className={`${styles.star} ${
            i < full
              ? styles.starFull
              : i === full && half
                ? styles.starHalf
                : styles.starEmpty
          }`}
          style={{ width: size, height: size }}
        />
      ))}
    </span>
  );
};

/* ─────────────────────────────────────────────
   SOCIAL ICONS — UNCHANGED
───────────────────────────────────────────── */
const SOCIAL_CONFIG = {
  instagram: { Icon: FiInstagram, label: "Instagram" },
  twitter: { Icon: FiTwitter, label: "Twitter / X" },
  linkedin: { Icon: FiLinkedin, label: "LinkedIn" },
  youtube: { Icon: FiYoutube, label: "YouTube" },
};

/* ─────────────────────────────────────────────
   TRAINING OPTIONS — UNCHANGED
───────────────────────────────────────────── */
const TRAINING_OPTIONS = [
  {
    Icon: FiTarget,
    title: "1-on-1 Personal Training",
    description: "Sessions built around your goals, body, and schedule.",
    tag: "Most Popular",
  },
  {
    Icon: FiZap,
    title: "Goal-Focused Programming",
    description: "Structured plans with measurable milestones.",
    tag: null,
  },
  {
    Icon: FiCalendar,
    title: "Flexible Scheduling",
    description: "Mornings, evenings, weekends — train on your terms.",
    tag: null,
  },
];

/* ─────────────────────────────────────────────
   BOOKING MODAL — UNCHANGED
───────────────────────────────────────────── */
const BookingModal = ({ trainer, onClose }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    const fn = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  const today = new Date().toISOString().split("T")[0];
  const SLOTS = [
    "06:00 AM",
    "07:00 AM",
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
    "08:00 PM",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  /* resolve image for modal strip — API uses image.src */
  const imgSrc = trainer.image?.src ?? trainer.image ?? "";
  const imgAlt = trainer.image?.alt ?? trainer.name;

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="bk-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className={styles.modal}
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.96 }}
        transition={{ duration: 0.26, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <button
          className={styles.modalClose}
          onClick={onClose}
          aria-label="Close"
        >
          <FiX />
        </button>

        {submitted ? (
          <ModalSuccess
            title="Request Received"
            body={
              <>
                Booking request with <strong>{trainer.name}</strong> noted.
                We'll confirm shortly.
              </>
            }
            onClose={onClose}
          />
        ) : (
          <>
            <div className={styles.modalHead}>
              <h2 className={styles.modalTitle} id="bk-title">
                Book a Session
              </h2>
              <p className={styles.modalSub}>
                Request a session with {trainer.name}
              </p>
            </div>

            <div className={styles.modalStrip}>
              <img src={imgSrc} alt={imgAlt} className={styles.modalStripImg} />
              <div>
                <p className={styles.modalStripName}>{trainer.name}</p>
                <p className={styles.modalStripRole}>{trainer.role}</p>
                <p className={styles.modalStripSpec}>{trainer.specialty}</p>
              </div>
            </div>

            <form className={styles.modalForm} onSubmit={handleSubmit}>
              <div className={styles.modalField}>
                <label htmlFor="bk-date" className={styles.modalLabel}>
                  <FiCalendar aria-hidden="true" /> Preferred Date
                </label>
                <input
                  ref={inputRef}
                  id="bk-date"
                  type="date"
                  className={styles.modalInput}
                  value={date}
                  min={today}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className={styles.modalField}>
                <label htmlFor="bk-time" className={styles.modalLabel}>
                  <FiClock aria-hidden="true" /> Preferred Time
                </label>
                <select
                  id="bk-time"
                  className={styles.modalInput}
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                >
                  <option value="">Choose a slot</option>
                  {SLOTS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              <p className={styles.modalNotice}>
                Live booking is coming soon. Your request will be confirmed
                manually within 24 hours.
              </p>

              <button type="submit" className={styles.modalBtn}>
                Confirm Request <FiArrowRight aria-hidden="true" />
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   CONTACT MODAL — UNCHANGED
───────────────────────────────────────────── */
const ContactModal = ({ trainer, onClose }) => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    const fn = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ct-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className={styles.modal}
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.96 }}
        transition={{ duration: 0.26, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <button
          className={styles.modalClose}
          onClick={onClose}
          aria-label="Close"
        >
          <FiX />
        </button>

        {submitted ? (
          <ModalSuccess
            title="Message Sent"
            body={
              <>
                Your message to <strong>{trainer.name}</strong> has been
                received.
              </>
            }
            onClose={onClose}
          />
        ) : (
          <>
            <div className={styles.modalHead}>
              <h2 className={styles.modalTitle} id="ct-title">
                Contact {trainer.name}
              </h2>
              <p className={styles.modalSub}>We'll pass your message along.</p>
            </div>

            <form className={styles.modalForm} onSubmit={handleSubmit}>
              {[
                {
                  id: "ct-name",
                  name: "name",
                  type: "text",
                  label: "Your Name",
                  Icon: FiUser,
                  placeholder: "Jane Doe",
                  ref: inputRef,
                },
                {
                  id: "ct-email",
                  name: "email",
                  type: "email",
                  label: "Email Address",
                  Icon: FiMail,
                  placeholder: "you@example.com",
                },
              ].map(({ id, name, type, label, Icon, placeholder, ref }) => (
                <div key={id} className={styles.modalField}>
                  <label htmlFor={id} className={styles.modalLabel}>
                    <Icon aria-hidden="true" /> {label}
                  </label>
                  <input
                    ref={ref}
                    id={id}
                    name={name}
                    type={type}
                    className={styles.modalInput}
                    placeholder={placeholder}
                    value={form[name]}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, [name]: e.target.value }))
                    }
                    required
                  />
                </div>
              ))}

              <div className={styles.modalField}>
                <label htmlFor="ct-msg" className={styles.modalLabel}>
                  <FiMessageSquare aria-hidden="true" /> Message
                </label>
                <textarea
                  id="ct-msg"
                  name="message"
                  rows={4}
                  className={`${styles.modalInput} ${styles.modalTextarea}`}
                  placeholder={`Hi ${trainer.name}, I'd love to train with you…`}
                  value={form.message}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, message: e.target.value }))
                  }
                  required
                />
              </div>

              <p className={styles.modalNotice}>
                Direct messaging is coming soon. Your message will be delivered
                manually.
              </p>

              <button type="submit" className={styles.modalBtn}>
                Send Message <FiArrowRight aria-hidden="true" />
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

const ModalSuccess = ({ title, body, onClose }) => (
  <div className={styles.successWrap}>
    <div className={styles.successIcon} aria-hidden="true">
      <FiCheckCircle />
    </div>
    <h2 className={styles.successTitle}>{title}</h2>
    <p className={styles.successBody}>{body}</p>
    <button className={styles.modalBtn} onClick={onClose}>
      Done
    </button>
  </div>
);

/* ─────────────────────────────────────────────
   LOADING SKELETON
───────────────────────────────────────────── */
const LoadingSkeleton = () => (
  <div
    className={styles.page}
    aria-label="Loading trainer profile"
    aria-busy="true"
  >
    <div className={styles.container}>
      <div className={styles.heroGrid} style={{ paddingTop: "80px" }}>
        {/* Image skeleton */}
        <div
          style={{
            borderRadius: 20,
            background: "rgba(255,255,255,0.05)",
            aspectRatio: "3/4",
            animation: "trainerSkeletonShimmer 1.5s ease-in-out infinite",
          }}
          aria-hidden="true"
        />
        {/* Info skeleton */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            paddingTop: 24,
          }}
          aria-hidden="true"
        >
          {[
            { w: "30%", h: 14 },
            { w: "70%", h: 36 },
            { w: "50%", h: 20 },
            { w: "60%", h: 14 },
            { w: "100%", h: 80 },
            { w: "40%", h: 48 },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                width: s.w,
                height: s.h,
                borderRadius: 8,
                background: "rgba(255,255,255,0.06)",
                animation: "trainerSkeletonShimmer 1.5s ease-in-out infinite",
              }}
            />
          ))}
        </div>
      </div>
    </div>
    <style>{`
      @keyframes trainerSkeletonShimmer {
        0%, 100% { opacity: 0.5; }
        50%       { opacity: 1; }
      }
    `}</style>
  </div>
);

/* ─────────────────────────────────────────────
   ERROR STATE
───────────────────────────────────────────── */
const ErrorState = ({ message, onRetry }) => {
  const navigate = useNavigate();
  return (
    <main className={styles.notFoundPage} role="alert">
      <motion.div
        className={styles.notFoundBox}
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.notFoundIconWrap} aria-hidden="true">
          <FiAlertCircle />
        </div>
        <h1 className={styles.notFoundTitle}>Unable to Load Trainer</h1>
        <p className={styles.notFoundText}>
          Something went wrong. Please try again.
        </p>
        <div className={styles.notFoundBtns}>
          <button className={styles.btnPrimary} onClick={onRetry}>
            <FiRefreshCw aria-hidden="true" /> Try Again
          </button>
          <button
            className={styles.btnGhost}
            onClick={() => navigate("/fitness")}
          >
            Browse Trainers <FiArrowRight aria-hidden="true" />
          </button>
        </div>
      </motion.div>
    </main>
  );
};

/* ─────────────────────────────────────────────
   NOT FOUND — UNCHANGED
───────────────────────────────────────────── */
const NotFound = () => {
  const navigate = useNavigate();
  return (
    <main className={styles.notFoundPage}>
      <motion.div
        className={styles.notFoundBox}
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.notFoundIconWrap} aria-hidden="true">
          <MdFitnessCenter />
        </div>
        <h1 className={styles.notFoundTitle}>Trainer Not Found</h1>
        <p className={styles.notFoundText}>
          We couldn't find this trainer profile. The link may be incorrect.
        </p>
        <div className={styles.notFoundBtns}>
          <button className={styles.btnPrimary} onClick={() => navigate(-1)}>
            <FiArrowLeft aria-hidden="true" /> Go Back
          </button>
          <button
            className={styles.btnGhost}
            onClick={() => navigate("/fitness")}
          >
            Browse Trainers <FiArrowRight aria-hidden="true" />
          </button>
        </div>
      </motion.div>
    </main>
  );
};

/* ══════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════ */
const TrainerDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const heroRef = useRef(null);

  const [showBooking, setShowBooking] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [isFaved, setIsFaved] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);

  /* ── API fetch — replaces TRAINERS.find() ── */
  const { trainer, loading, error, refetch } = useTrainerDetail(slug);

  /* ── Sticky bar trigger — UNCHANGED ── */
  useEffect(() => {
    const onScroll = () => {
      if (!heroRef.current) return;
      setStickyVisible(heroRef.current.getBoundingClientRect().bottom < 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Body scroll lock — UNCHANGED ── */
  useEffect(() => {
    document.body.style.overflow = showBooking || showContact ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showBooking, showContact]);

  const openBooking = useCallback(() => setShowBooking(true), []);
  const openContact = useCallback(() => setShowContact(true), []);
  const closeBooking = useCallback(() => setShowBooking(false), []);
  const closeContact = useCallback(() => setShowContact(false), []);

  /* ── Content states ── */
  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!trainer) return <NotFound />;

  /* ── Derived values — API fields used directly ── */
  const firstName = trainer.name.split(" ")[0];

  /*
   * image.src  — API provides this (not image.url)
   * image.srcSet, image.sizes — API provides these for responsive images
   */
  const imgSrc = trainer.image?.src ?? "";
  const imgSrcSet = trainer.image?.srcSet ?? undefined;
  const imgSizes = trainer.image?.sizes ?? undefined;
  const imgAlt = trainer.image?.alt ?? `${trainer.name} trainer photo`;

  /*
   * social — only render links where URL is non-null
   * API may return null for some platforms
   */
  const socialLinks = Object.entries(trainer.social ?? {}).filter(([, url]) =>
    Boolean(url),
  );

  /* Rating bar distribution — static UI, unchanged */
  const ratingBars = [
    { label: "5★", pct: 76 },
    { label: "4★", pct: 16 },
    { label: "3★", pct: 5 },
    { label: "2★", pct: 2 },
    { label: "1★", pct: 1 },
  ];

  /* ── RENDER — all JSX identical to original ── */
  return (
    <>
      <Helmet>
        <title>
          {trainer.name} — {trainer.role} | Gymssy
        </title>
        <meta
          name="description"
          content={`${trainer.bio} Rated ${trainer.rating}★ by ${trainer.reviews} clients on Gymssy.`}
        />
        <meta
          property="og:title"
          content={`${trainer.name} | ${trainer.role} — Gymssy`}
        />
        <meta property="og:description" content={trainer.bio} />
        <meta property="og:image" content={imgSrc} />
      </Helmet>

      <div className={styles.page}>
        {/* ════ STICKY BAR — UNCHANGED ════ */}
        <AnimatePresence>
          {stickyVisible && (
            <motion.div
              className={styles.stickyBar}
              initial={{ y: -64, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -64, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
              aria-label="Sticky booking bar"
            >
              <div className={styles.stickyInner}>
                <div className={styles.stickyLeft}>
                  <img
                    src={imgSrc}
                    alt={imgAlt}
                    className={styles.stickyAvatar}
                  />
                  <div>
                    <p className={styles.stickyName}>{trainer.name}</p>
                    <p className={styles.stickyRole}>{trainer.role}</p>
                  </div>
                </div>
                <div className={styles.stickyRight}>
                  <div className={styles.stickyRating}>
                    <FiStar
                      className={styles.stickyStarIcon}
                      aria-hidden="true"
                    />
                    <span>{trainer.rating}</span>
                    <span className={styles.stickyReviews}>
                      ({trainer.reviews})
                    </span>
                  </div>
                  <button
                    className={styles.btnPrimary}
                    onClick={openBooking}
                    disabled={!trainer.available}
                  >
                    <FiCalendar aria-hidden="true" /> Book a Session
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ════ HERO — UNCHANGED ════ */}
        <section
          ref={heroRef}
          className={styles.hero}
          aria-label={`${trainer.name} profile`}
        >
          <div className={`${styles.container} ${styles.heroGrid}`}>
            {/* Image column */}
            <motion.div
              className={styles.heroImgCol}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className={styles.heroImgWrap}>
                <img
                  src={imgSrc}
                  srcSet={imgSrcSet}
                  sizes={imgSizes}
                  alt={imgAlt}
                  className={styles.heroImg}
                />
                <div className={styles.heroImgGrad} aria-hidden="true" />

                <div className={styles.heroImgBadges}>
                  {trainer.featured && (
                    <span
                      className={styles.featuredBadge}
                      aria-label="Featured trainer"
                    >
                      <FiAward aria-hidden="true" /> Featured
                    </span>
                  )}
                </div>

                <div
                  className={`${styles.availTag} ${
                    trainer.available
                      ? styles.availTagOpen
                      : styles.availTagClosed
                  }`}
                  role="status"
                >
                  <span className={styles.availDot} aria-hidden="true" />
                  {trainer.available ? "Available" : "Unavailable"}
                </div>

                <motion.button
                  className={`${styles.faveBtn} ${isFaved ? styles.faveBtnActive : ""}`}
                  onClick={() => setIsFaved((p) => !p)}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={
                    isFaved ? "Remove from favourites" : "Add to favourites"
                  }
                  aria-pressed={isFaved}
                >
                  <FiHeart aria-hidden="true" />
                </motion.button>
              </div>

              {/* Social links — only renders non-null URLs */}
              {socialLinks.length > 0 && (
                <div className={styles.socialRow} aria-label="Social profiles">
                  {socialLinks.map(([platform, url]) => {
                    const cfg = SOCIAL_CONFIG[platform];
                    if (!cfg) return null;
                    return (
                      <motion.a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.socialLink}
                        whileHover={{ y: -2 }}
                        aria-label={cfg.label}
                      >
                        <cfg.Icon aria-hidden="true" />
                      </motion.a>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* Info column */}
            <motion.div
              className={styles.heroInfoCol}
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              {/* Verified + role */}
              <motion.div className={styles.heroTopRow} variants={fadeUp}>
                {/* isVerified from API */}
                {trainer.isVerified && (
                  <span className={styles.verifiedBadge}>
                    <MdVerified aria-hidden="true" /> Verified Trainer
                  </span>
                )}
                <span className={styles.roleLabel}>{trainer.role}</span>
              </motion.div>

              <motion.h1
                className={styles.heroName}
                variants={fadeUp}
                custom={0.04}
              >
                {trainer.name}
              </motion.h1>

              {/* specialty — API field name (not specialization) */}
              <motion.p
                className={styles.heroSpecialty}
                variants={fadeUp}
                custom={0.08}
              >
                {trainer.specialty}
              </motion.p>

              {/* Rating — reviews is the API field (not reviewCount) */}
              <motion.div
                className={styles.heroRatingRow}
                variants={fadeUp}
                custom={0.12}
              >
                <Stars rating={trainer.rating} size={17} />
                <span className={styles.ratingNum}>{trainer.rating}</span>
                <span className={styles.ratingCount}>
                  {(typeof trainer.reviews === "number"
                    ? trainer.reviews
                    : 0
                  ).toLocaleString()}{" "}
                  reviews
                </span>
                <span className={styles.ratingDivider} aria-hidden="true" />
                <span className={styles.clientCount}>
                  <FiUsers aria-hidden="true" /> {trainer.clients} clients
                </span>
              </motion.div>

              {/* Stats */}
              <motion.div
                className={styles.heroStats}
                variants={fadeUp}
                custom={0.16}
              >
                <div className={styles.heroStat}>
                  <FiClock className={styles.heroStatIcon} aria-hidden="true" />
                  <div>
                    <span className={styles.heroStatVal}>
                      {trainer.experience}
                    </span>
                    <span className={styles.heroStatLbl}>Experience</span>
                  </div>
                </div>
                <div className={styles.heroStatDivider} aria-hidden="true" />
                <div className={styles.heroStat}>
                  <MdFitnessCenter
                    className={styles.heroStatIcon}
                    aria-hidden="true"
                  />
                  <div>
                    <span className={styles.heroStatVal}>
                      {trainer.sessions}
                    </span>
                    <span className={styles.heroStatLbl}>Sessions</span>
                  </div>
                </div>
                <div className={styles.heroStatDivider} aria-hidden="true" />
                <div className={styles.heroStat}>
                  <FiAward className={styles.heroStatIcon} aria-hidden="true" />
                  <div>
                    <span className={styles.heroStatVal}>
                      {trainer.certifications.length}
                    </span>
                    <span className={styles.heroStatLbl}>Certifications</span>
                  </div>
                </div>
              </motion.div>

              <motion.p
                className={styles.heroBio}
                variants={fadeUp}
                custom={0.2}
              >
                {trainer.bio}
              </motion.p>

              {/* specializations — API field (array of strings) */}
              <motion.div
                className={styles.heroTags}
                variants={fadeUp}
                custom={0.24}
              >
                {(trainer.specializations ?? []).map((s) => (
                  <span key={s} className={styles.heroTag}>
                    {s}
                  </span>
                ))}
              </motion.div>

              {/* CTAs */}
              <motion.div
                className={styles.heroCtas}
                variants={fadeUp}
                custom={0.28}
              >
                <motion.button
                  className={styles.btnPrimary}
                  onClick={openBooking}
                  disabled={!trainer.available}
                  whileHover={trainer.available ? { scale: 1.02 } : {}}
                  whileTap={trainer.available ? { scale: 0.97 } : {}}
                  aria-label={
                    trainer.available
                      ? `Book a session with ${trainer.name}`
                      : "Currently unavailable"
                  }
                >
                  <FiCalendar aria-hidden="true" />
                  {trainer.available ? "Book a Session" : "Unavailable"}
                </motion.button>

                <motion.button
                  className={styles.btnGhost}
                  onClick={openContact}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  aria-label={`Contact ${trainer.name}`}
                >
                  <FiMail aria-hidden="true" /> Contact Trainer
                </motion.button>
              </motion.div>

              {!trainer.available && (
                <motion.div
                  className={styles.unavailNotice}
                  variants={fadeUp}
                  custom={0.32}
                  role="status"
                >
                  {firstName} isn't taking new clients right now. Contact them
                  to join the waitlist.
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        {/* ════ TRUST STRIP — UNCHANGED ════ */}
        <section
          className={styles.trustStrip}
          aria-label="Trainer credentials at a glance"
        >
          <div className={styles.container}>
            <motion.div
              className={styles.trustGrid}
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              {[
                { Icon: FiClock, val: trainer.experience, lbl: "Experience" },
                { Icon: FiUsers, val: trainer.clients, lbl: "Clients Trained" },
                { Icon: FiStar, val: trainer.rating, lbl: "Average Rating" },
                {
                  Icon: MdFitnessCenter,
                  val: trainer.sessions,
                  lbl: "Sessions Done",
                },
                {
                  Icon: FiShield,
                  val: trainer.certifications.length,
                  lbl: "Certifications",
                },
              ].map(({ Icon, val, lbl }) => (
                <motion.div
                  key={lbl}
                  className={styles.trustItem}
                  variants={fadeUp}
                >
                  <Icon className={styles.trustIcon} aria-hidden="true" />
                  <span className={styles.trustVal}>{val}</span>
                  <span className={styles.trustLbl}>{lbl}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ════ ABOUT — UNCHANGED ════ */}
        <section className={styles.section} aria-labelledby="about-h">
          <div className={styles.container}>
            <div className={styles.aboutGrid}>
              <div>
                <motion.span
                  className={styles.eyebrow}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  About
                </motion.span>
                <motion.h2
                  id="about-h"
                  className={styles.sectionTitle}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={0.05}
                >
                  Meet <span className={styles.accent}>{firstName}</span>
                </motion.h2>
                <motion.p
                  className={styles.aboutBio}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={0.1}
                >
                  {trainer.bio}
                </motion.p>
                <motion.div
                  className={styles.certList}
                  variants={stagger}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {(trainer.certifications ?? []).map((cert) => (
                    <motion.div
                      key={cert}
                      className={styles.certRow}
                      variants={fadeUp}
                    >
                      <FiCheck
                        className={styles.certCheck}
                        aria-hidden="true"
                      />
                      <span className={styles.certName}>{cert}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <div>
                <motion.span
                  className={styles.eyebrow}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  Areas of Expertise
                </motion.span>
                <motion.div
                  className={styles.specGrid}
                  variants={stagger}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {(trainer.specializations ?? []).map((spec) => (
                    <motion.div
                      key={spec}
                      className={styles.specCard}
                      variants={fadeUp}
                      whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    >
                      <MdFitnessCenter
                        className={styles.specIcon}
                        aria-hidden="true"
                      />
                      <span className={styles.specName}>{spec}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ════ TRAINING OPTIONS — UNCHANGED ════ */}
        <section
          className={`${styles.section} ${styles.sectionDark}`}
          aria-labelledby="options-h"
        >
          <div className={styles.container}>
            <motion.span
              className={styles.eyebrow}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              What You Get
            </motion.span>
            <motion.h2
              id="options-h"
              className={styles.sectionTitle}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.05}
            >
              Training <span className={styles.accent}>Options</span>
            </motion.h2>
            <div className={styles.optionsGrid}>
              {TRAINING_OPTIONS.map(({ Icon, title, description, tag }, i) => (
                <motion.div
                  key={title}
                  className={styles.optionCard}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i * 0.08}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  {tag && <span className={styles.optionTag}>{tag}</span>}
                  <div className={styles.optionIconWrap} aria-hidden="true">
                    <Icon />
                  </div>
                  <h3 className={styles.optionTitle}>{title}</h3>
                  <p className={styles.optionDesc}>{description}</p>
                  <button
                    className={styles.optionBtn}
                    onClick={openBooking}
                    disabled={!trainer.available}
                    aria-label={`Book ${title} with ${trainer.name}`}
                  >
                    Book This <FiArrowRight aria-hidden="true" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════ AVAILABILITY — UNCHANGED ════ */}
        <section className={styles.section} aria-labelledby="avail-h">
          <div className={styles.container}>
            <motion.span
              className={styles.eyebrow}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Availability
            </motion.span>
            <motion.h2
              id="avail-h"
              className={styles.sectionTitle}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.05}
            >
              Schedule & <span className={styles.accent}>Booking</span>
            </motion.h2>
            <motion.div
              className={styles.availWrap}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.1}
            >
              <div
                className={`${styles.availStatus} ${
                  trainer.available
                    ? styles.availStatusOpen
                    : styles.availStatusClosed
                }`}
                role="status"
              >
                <span className={styles.availDot} aria-hidden="true" />
                {trainer.available
                  ? `${firstName} is currently accepting new clients`
                  : `${firstName} is not accepting new clients right now`}
              </div>

              <div
                className={styles.weekGrid}
                aria-label="Weekly schedule placeholder"
                aria-hidden="true"
              >
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day) => (
                    <div key={day} className={styles.weekDay}>
                      <span className={styles.weekDayName}>{day}</span>
                      <div className={styles.weekDaySlots}>
                        <span className={styles.weekSlotEmpty}>—</span>
                      </div>
                    </div>
                  ),
                )}
              </div>

              <p className={styles.availNote}>
                Detailed weekly schedules will display here once the booking
                system is connected. Book a session or contact {firstName} to
                discuss specific time slots.
              </p>

              {trainer.available && (
                <motion.button
                  className={styles.btnPrimary}
                  onClick={openBooking}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <FiCalendar aria-hidden="true" /> Book a Session
                </motion.button>
              )}
            </motion.div>
          </div>
        </section>

        {/* ════ REVIEWS — UNCHANGED ════ */}
        <section
          className={`${styles.section} ${styles.sectionDark}`}
          aria-labelledby="reviews-h"
        >
          <div className={styles.container}>
            <motion.span
              className={styles.eyebrow}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Client Reviews
            </motion.span>
            <motion.h2
              id="reviews-h"
              className={styles.sectionTitle}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.05}
            >
              What Clients <span className={styles.accent}>Say</span>
            </motion.h2>
            <motion.div
              className={styles.reviewsWrap}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.1}
            >
              <div className={styles.reviewSummary}>
                <span className={styles.reviewBigNum}>{trainer.rating}</span>
                <Stars rating={trainer.rating} size={20} />
                <span className={styles.reviewBigCount}>
                  {(typeof trainer.reviews === "number"
                    ? trainer.reviews
                    : 0
                  ).toLocaleString()}{" "}
                  reviews
                </span>
                <div className={styles.barList} aria-hidden="true">
                  {ratingBars.map(({ label, pct }) => (
                    <div key={label} className={styles.barRow}>
                      <span className={styles.barLabel}>{label}</span>
                      <div className={styles.barTrack}>
                        <motion.div
                          className={styles.barFill}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.75, ease: "easeOut" }}
                        />
                      </div>
                      <span className={styles.barPct}>{pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.reviewsEmpty}>
                <div className={styles.reviewsEmptyIcon} aria-hidden="true">
                  <FiMessageSquare />
                </div>
                <p className={styles.reviewsEmptyTitle}>
                  {(typeof trainer.reviews === "number"
                    ? trainer.reviews
                    : 0
                  ).toLocaleString()}{" "}
                  people have reviewed {firstName}
                </p>
                <p className={styles.reviewsEmptyText}>
                  Individual review details will appear here once connected.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ════ FINAL CTA — UNCHANGED ════ */}
        <section className={styles.finalCta} aria-label="Start training">
          <div className={styles.finalCtaInner}>
            <motion.span
              className={styles.finalEyebrow}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Start Today
            </motion.span>
            <motion.h2
              className={styles.finalTitle}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.07}
            >
              Ready to Train with{" "}
              <span className={styles.accent}>{firstName}?</span>
            </motion.h2>
            <motion.p
              className={styles.finalSub}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.13}
            >
              Take your fitness goals to the next level with an expert who
              delivers results.
            </motion.p>
            <motion.div
              className={styles.finalBtns}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.19}
            >
              <motion.button
                className={styles.btnPrimary}
                onClick={openBooking}
                disabled={!trainer.available}
                whileHover={trainer.available ? { scale: 1.03 } : {}}
                whileTap={trainer.available ? { scale: 0.97 } : {}}
              >
                <FiCalendar aria-hidden="true" /> Book a Session
              </motion.button>
              <motion.button
                className={styles.btnGhost}
                onClick={() => navigate("/fitness")}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Browse All Trainers <FiArrowRight aria-hidden="true" />
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* ════ MOBILE STICKY FOOTER — UNCHANGED ════ */}
        <div className={styles.mobileCta} aria-label="Mobile booking bar">
          <div className={styles.mobileCtaInner}>
            <div>
              <p className={styles.mobileCtaName}>{trainer.name}</p>
              <p className={styles.mobileCtaRole}>{trainer.role}</p>
            </div>
            <button
              className={styles.btnPrimary}
              onClick={openBooking}
              disabled={!trainer.available}
              aria-label="Book a session"
            >
              <FiCalendar aria-hidden="true" />
              {trainer.available ? "Book" : "Unavailable"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Modals — UNCHANGED ── */}
      <AnimatePresence>
        {showBooking && (
          <BookingModal trainer={trainer} onClose={closeBooking} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showContact && (
          <ContactModal trainer={trainer} onClose={closeContact} />
        )}
      </AnimatePresence>
    </>
  );
};

export default TrainerDetail;
