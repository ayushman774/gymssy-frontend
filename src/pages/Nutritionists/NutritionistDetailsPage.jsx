// src/pages/Nutritionists/NutritionistDetailsPage.jsx

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
  FiUsers,
  FiClock,
  FiInstagram,
  FiTwitter,
  FiLinkedin,
  FiYoutube,
  FiHeart,
  FiAward,
  FiCheck,
  FiRefreshCw,
  FiAlertCircle,
  FiShield,
  FiBookOpen,
} from "react-icons/fi";
import { MdVerified } from "react-icons/md";

import useNutritionistDetail from "../../hooks/useNutritionistDetail";
import useNutritionists from "../../hooks/useNutritionists";
import NutritionistCard from "../../components/ui/NutritionistCard/NutritionistCard";
import styles from "./NutritionistDetailsPage.module.css";

/* ── Animation variants ── */
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

/* ── Social config ── */
const SOCIAL_CONFIG = {
  instagram: { Icon: FiInstagram, label: "Instagram" },
  twitter: { Icon: FiTwitter, label: "Twitter / X" },
  linkedin: { Icon: FiLinkedin, label: "LinkedIn" },
  youtube: { Icon: FiYoutube, label: "YouTube" },
};

/* ── Stars component ── */
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

/* ═══════════════════════════════════════════════════
   CONSULTATION MODAL
═══════════════════════════════════════════════════ */
const ConsultationModal = ({ nutritionist, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
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
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
  ];

  const imgSrc = nutritionist.image?.src ?? "";
  const imgAlt = nutritionist.image?.alt ?? nutritionist.name;

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cons-title"
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
                Consultation request with <strong>{nutritionist.name}</strong>{" "}
                noted. We'll confirm shortly.
              </>
            }
            onClose={onClose}
          />
        ) : (
          <>
            <div className={styles.modalHead}>
              <h2 className={styles.modalTitle} id="cons-title">
                Book a Consultation
              </h2>
              <p className={styles.modalSub}>
                Request a session with {nutritionist.name}
              </p>
            </div>

            {/* Nutritionist strip */}
            <div className={styles.modalStrip}>
              {imgSrc && (
                <img
                  src={imgSrc}
                  alt={imgAlt}
                  className={styles.modalStripImg}
                />
              )}
              <div>
                <p className={styles.modalStripName}>{nutritionist.name}</p>
                <p className={styles.modalStripRole}>{nutritionist.role}</p>
                <p className={styles.modalStripSpec}>
                  {nutritionist.specialty}
                </p>
              </div>
            </div>

            <form
              className={styles.modalForm}
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
            >
              <div className={styles.modalField}>
                <label htmlFor="cons-date" className={styles.modalLabel}>
                  <FiCalendar aria-hidden="true" /> Preferred Date
                </label>
                <input
                  ref={inputRef}
                  id="cons-date"
                  type="date"
                  className={styles.modalInput}
                  value={date}
                  min={today}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className={styles.modalField}>
                <label htmlFor="cons-time" className={styles.modalLabel}>
                  <FiClock aria-hidden="true" /> Preferred Time
                </label>
                <select
                  id="cons-time"
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

/* ═══════════════════════════════════════════════════
   CONTACT MODAL
═══════════════════════════════════════════════════ */
const ContactModal = ({ nutritionist, onClose }) => {
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
                Your message to <strong>{nutritionist.name}</strong> has been
                received.
              </>
            }
            onClose={onClose}
          />
        ) : (
          <>
            <div className={styles.modalHead}>
              <h2 className={styles.modalTitle} id="ct-title">
                Contact {nutritionist.name}
              </h2>
              <p className={styles.modalSub}>We'll pass your message along.</p>
            </div>

            <form
              className={styles.modalForm}
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
            >
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
                  rows={4}
                  className={`${styles.modalInput} ${styles.modalTextarea}`}
                  placeholder={`Hi ${nutritionist.name}, I'd love to discuss my nutrition goals…`}
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

/* ── Modal success state ── */
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

/* ═══════════════════════════════════════════════════
   LOADING SKELETON
═══════════════════════════════════════════════════ */
const LoadingSkeleton = () => (
  <div
    className={styles.page}
    aria-label="Loading nutritionist profile"
    aria-busy="true"
  >
    <div className={styles.container}>
      <div className={styles.heroGrid} style={{ paddingTop: "80px" }}>
        <div
          style={{
            borderRadius: 20,
            background: "rgba(255,255,255,0.05)",
            aspectRatio: "3/4",
            animation: "ndpShimmer 1.5s ease-in-out infinite",
          }}
          aria-hidden="true"
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            paddingTop: 24,
          }}
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
                animation: "ndpShimmer 1.5s ease-in-out infinite",
              }}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </div>
    <style>{`
      @keyframes ndpShimmer {
        0%, 100% { opacity: 0.5; }
        50%       { opacity: 1; }
      }
    `}</style>
  </div>
);

/* ═══════════════════════════════════════════════════
   ERROR STATE
═══════════════════════════════════════════════════ */
const ErrorState = ({ onRetry }) => {
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
        <h1 className={styles.notFoundTitle}>Unable to Load Nutritionist</h1>
        <p className={styles.notFoundText}>
          Something went wrong. Please try again.
        </p>
        <div className={styles.notFoundBtns}>
          <button className={styles.btnPrimary} onClick={onRetry}>
            <FiRefreshCw aria-hidden="true" /> Try Again
          </button>
          <button
            className={styles.btnGhost}
            onClick={() => navigate("/nutritionists")}
          >
            Browse Nutritionists <FiArrowRight aria-hidden="true" />
          </button>
        </div>
      </motion.div>
    </main>
  );
};

/* ═══════════════════════════════════════════════════
   NOT FOUND
═══════════════════════════════════════════════════ */
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
          <FiBookOpen />
        </div>
        <h1 className={styles.notFoundTitle}>Nutritionist Not Found</h1>
        <p className={styles.notFoundText}>
          We couldn't find this nutritionist profile. The link may be incorrect.
        </p>
        <div className={styles.notFoundBtns}>
          <button className={styles.btnPrimary} onClick={() => navigate(-1)}>
            <FiArrowLeft aria-hidden="true" /> Go Back
          </button>
          <button
            className={styles.btnGhost}
            onClick={() => navigate("/nutritionists")}
          >
            Browse Nutritionists <FiArrowRight aria-hidden="true" />
          </button>
        </div>
      </motion.div>
    </main>
  );
};

/* ══════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════ */
const NutritionistDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const heroRef = useRef(null);

  const [showConsultation, setShowConsultation] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [isFaved, setIsFaved] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);

  /* ── Primary data fetch ── */
  const { nutritionist, loading, error, refetch } = useNutritionistDetail(slug);

  /* ── Related nutritionists (reuse featured endpoint) ── */
  const { nutritionists: allNutritionists } = useNutritionists();
  const related = allNutritionists.filter((n) => n.slug !== slug).slice(0, 3);

  /* ── Sticky bar ── */
  useEffect(() => {
    const onScroll = () => {
      if (!heroRef.current) return;
      setStickyVisible(heroRef.current.getBoundingClientRect().bottom < 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Body scroll lock ── */
  useEffect(() => {
    document.body.style.overflow =
      showConsultation || showContact ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showConsultation, showContact]);

  const openConsultation = useCallback(() => setShowConsultation(true), []);
  const openContact = useCallback(() => setShowContact(true), []);
  const closeConsultation = useCallback(() => setShowConsultation(false), []);
  const closeContact = useCallback(() => setShowContact(false), []);

  /* ── States ── */
  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState onRetry={refetch} />;
  if (!nutritionist) return <NotFound />;

  /* ── Derived ── */
  const firstName = nutritionist.name.split(" ")[0];
  const imgSrc = nutritionist.image?.src ?? "";
  const imgSrcSet = nutritionist.image?.srcSet ?? undefined;
  const imgSizes = nutritionist.image?.sizes ?? undefined;
  const imgAlt =
    nutritionist.image?.alt ?? `${nutritionist.name} — Nutritionist`;

  const socialLinks = Object.entries(nutritionist.social ?? {}).filter(
    ([, url]) => Boolean(url),
  );

  const certifications = Array.isArray(nutritionist.certifications)
    ? nutritionist.certifications
    : [];
  const specializations = Array.isArray(nutritionist.specializations)
    ? nutritionist.specializations
    : [];
  const reviews =
    typeof nutritionist.reviews === "number" ? nutritionist.reviews : 0;

  const showFee =
    nutritionist.consultationFee !== undefined &&
    nutritionist.consultationFee !== null &&
    nutritionist.consultationFee > 0;

  /* Rating bars — static distribution */
  const ratingBars = [
    { label: "5★", pct: 74 },
    { label: "4★", pct: 18 },
    { label: "3★", pct: 5 },
    { label: "2★", pct: 2 },
    { label: "1★", pct: 1 },
  ];

  /* ════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════ */
  return (
    <>
      <Helmet>
        <title>
          {nutritionist.name} — {nutritionist.role} | Gymssy
        </title>
        <meta
          name="description"
          content={`${nutritionist.specialty}. ${nutritionist.bio?.slice(0, 120) ?? ""} Rated ${nutritionist.rating}★ on Gymssy.`}
        />
        <meta
          property="og:title"
          content={`${nutritionist.name} | ${nutritionist.role} — Gymssy`}
        />
        <meta property="og:description" content={nutritionist.bio ?? ""} />
        <meta property="og:image" content={imgSrc} />
      </Helmet>

      <div className={styles.page}>
        {/* ════ STICKY BAR ════ */}
        <AnimatePresence>
          {stickyVisible && (
            <motion.div
              className={styles.stickyBar}
              initial={{ y: -64, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -64, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
              aria-label="Sticky consultation bar"
            >
              <div className={styles.stickyInner}>
                <div className={styles.stickyLeft}>
                  {imgSrc && (
                    <img
                      src={imgSrc}
                      alt={imgAlt}
                      className={styles.stickyAvatar}
                    />
                  )}
                  <div>
                    <p className={styles.stickyName}>{nutritionist.name}</p>
                    <p className={styles.stickyRole}>{nutritionist.role}</p>
                  </div>
                </div>
                <div className={styles.stickyRight}>
                  <div className={styles.stickyRating}>
                    <FiStar
                      className={styles.stickyStarIcon}
                      aria-hidden="true"
                    />
                    <span>{nutritionist.rating}</span>
                    <span className={styles.stickyReviews}>({reviews})</span>
                  </div>
                  <button
                    className={styles.btnPrimary}
                    onClick={openConsultation}
                    disabled={!nutritionist.available}
                  >
                    <FiCalendar aria-hidden="true" /> Book Consultation
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ════ HERO ════ */}
        <section
          ref={heroRef}
          className={styles.hero}
          aria-label={`${nutritionist.name} profile`}
        >
          <div className={`${styles.container} ${styles.heroGrid}`}>
            {/* ── Image column ── */}
            <motion.div
              className={styles.heroImgCol}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className={styles.heroImgWrap}>
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    srcSet={imgSrcSet}
                    sizes={imgSizes}
                    alt={imgAlt}
                    className={styles.heroImg}
                  />
                ) : (
                  <div className={styles.heroImgFallback} aria-hidden="true" />
                )}
                <div className={styles.heroImgGrad} aria-hidden="true" />

                {/* Featured badge */}
                {nutritionist.featured && (
                  <div
                    className={styles.featuredBadge}
                    aria-label="Featured nutritionist"
                  >
                    <FiAward aria-hidden="true" /> Featured
                  </div>
                )}

                {/* Availability */}
                <div
                  className={`${styles.availTag} ${
                    nutritionist.available
                      ? styles.availTagOpen
                      : styles.availTagClosed
                  }`}
                  role="status"
                >
                  <span className={styles.availDot} aria-hidden="true" />
                  {nutritionist.available ? "Available" : "Unavailable"}
                </div>

                {/* Favourite */}
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

              {/* Social links */}
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

            {/* ── Info column ── */}
            <motion.div
              className={styles.heroInfoCol}
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              {/* Top row */}
              <motion.div className={styles.heroTopRow} variants={fadeUp}>
                {nutritionist.isVerified && (
                  <span className={styles.verifiedBadge}>
                    <MdVerified aria-hidden="true" /> Verified Expert
                  </span>
                )}
                <span className={styles.roleLabel}>{nutritionist.role}</span>
              </motion.div>

              <motion.h1
                className={styles.heroName}
                variants={fadeUp}
                custom={0.04}
              >
                {nutritionist.name}
              </motion.h1>

              <motion.p
                className={styles.heroSpecialty}
                variants={fadeUp}
                custom={0.08}
              >
                {nutritionist.specialty}
              </motion.p>

              {/* Rating row */}
              <motion.div
                className={styles.heroRatingRow}
                variants={fadeUp}
                custom={0.12}
              >
                <Stars rating={nutritionist.rating} size={17} />
                <span className={styles.ratingNum}>{nutritionist.rating}</span>
                <span className={styles.ratingCount}>
                  {reviews.toLocaleString()} reviews
                </span>
                <span className={styles.ratingDivider} aria-hidden="true" />
                <span className={styles.clientCount}>
                  <FiUsers aria-hidden="true" />
                  {nutritionist.clients} clients
                </span>
              </motion.div>

              {/* Quick stats */}
              <motion.div
                className={styles.heroStats}
                variants={fadeUp}
                custom={0.16}
              >
                <div className={styles.heroStat}>
                  <FiClock className={styles.heroStatIcon} aria-hidden="true" />
                  <div>
                    <span className={styles.heroStatVal}>
                      {nutritionist.experience}
                    </span>
                    <span className={styles.heroStatLbl}>Experience</span>
                  </div>
                </div>
                <div className={styles.heroStatDivider} aria-hidden="true" />
                <div className={styles.heroStat}>
                  <FiBookOpen
                    className={styles.heroStatIcon}
                    aria-hidden="true"
                  />
                  <div>
                    <span className={styles.heroStatVal}>
                      {nutritionist.consultations ?? "—"}
                    </span>
                    <span className={styles.heroStatLbl}>Consultations</span>
                  </div>
                </div>
                <div className={styles.heroStatDivider} aria-hidden="true" />
                <div className={styles.heroStat}>
                  <FiShield
                    className={styles.heroStatIcon}
                    aria-hidden="true"
                  />
                  <div>
                    <span className={styles.heroStatVal}>
                      {certifications.length}
                    </span>
                    <span className={styles.heroStatLbl}>Certifications</span>
                  </div>
                </div>
              </motion.div>

              {/* Bio */}
              <motion.p
                className={styles.heroBio}
                variants={fadeUp}
                custom={0.2}
              >
                {nutritionist.bio}
              </motion.p>

              {/* Specialization tags */}
              {specializations.length > 0 && (
                <motion.div
                  className={styles.heroTags}
                  variants={fadeUp}
                  custom={0.24}
                >
                  {specializations.map((s) => (
                    <span key={s} className={styles.heroTag}>
                      {s}
                    </span>
                  ))}
                </motion.div>
              )}

              {/* Consultation fee */}
              {showFee && (
                <motion.div
                  className={styles.feeBox}
                  variants={fadeUp}
                  custom={0.27}
                >
                  <span className={styles.feeLabel}>Consultation Fee</span>
                  <span className={styles.feeAmount}>
                    {nutritionist.currency ?? "₹"}
                    {nutritionist.consultationFee}
                  </span>
                  <span className={styles.feePer}>/ session</span>
                </motion.div>
              )}

              {/* CTAs */}
              <motion.div
                className={styles.heroCtas}
                variants={fadeUp}
                custom={0.3}
              >
                <motion.button
                  className={styles.btnPrimary}
                  onClick={openConsultation}
                  disabled={!nutritionist.available}
                  whileHover={nutritionist.available ? { scale: 1.02 } : {}}
                  whileTap={nutritionist.available ? { scale: 0.97 } : {}}
                  aria-label={
                    nutritionist.available
                      ? `Book a consultation with ${nutritionist.name}`
                      : "Currently unavailable"
                  }
                >
                  <FiCalendar aria-hidden="true" />
                  {nutritionist.available ? "Book Consultation" : "Unavailable"}
                </motion.button>

                <motion.button
                  className={styles.btnGhost}
                  onClick={openContact}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  aria-label={`Contact ${nutritionist.name}`}
                >
                  <FiMail aria-hidden="true" /> Send a Message
                </motion.button>
              </motion.div>

              {/* Unavailable notice */}
              {!nutritionist.available && (
                <motion.div
                  className={styles.unavailNotice}
                  variants={fadeUp}
                  custom={0.34}
                  role="status"
                >
                  {firstName} isn't taking new clients right now. Send a message
                  to join the waitlist.
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        {/* ════ TRUST STRIP ════ */}
        <section
          className={styles.trustStrip}
          aria-label="Nutritionist credentials at a glance"
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
                {
                  Icon: FiClock,
                  val: nutritionist.experience,
                  lbl: "Experience",
                },
                { Icon: FiUsers, val: nutritionist.clients, lbl: "Clients" },
                { Icon: FiStar, val: nutritionist.rating, lbl: "Avg Rating" },
                {
                  Icon: FiBookOpen,
                  val: nutritionist.consultations ?? 0,
                  lbl: "Consultations",
                },
                {
                  Icon: FiShield,
                  val: certifications.length,
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

        {/* ════ ABOUT ════ */}
        <section className={styles.section} aria-labelledby="about-h">
          <div className={styles.container}>
            <div className={styles.aboutGrid}>
              {/* Bio + certifications */}
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
                  {nutritionist.bio}
                </motion.p>

                {certifications.length > 0 && (
                  <motion.div
                    className={styles.certList}
                    variants={stagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {certifications.map((cert) => (
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
                )}
              </div>

              {/* Specializations */}
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
                {specializations.length > 0 && (
                  <motion.div
                    className={styles.specGrid}
                    variants={stagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {specializations.map((spec) => (
                      <motion.div
                        key={spec}
                        className={styles.specCard}
                        variants={fadeUp}
                        whileHover={{ y: -3, transition: { duration: 0.2 } }}
                      >
                        <FiBookOpen
                          className={styles.specIcon}
                          aria-hidden="true"
                        />
                        <span className={styles.specName}>{spec}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ════ CONSULTATION SECTION ════ */}
        <section
          className={`${styles.section} ${styles.sectionDark}`}
          aria-labelledby="cons-section-h"
        >
          <div className={styles.container}>
            <motion.span
              className={styles.eyebrow}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Consultation
            </motion.span>
            <motion.h2
              id="cons-section-h"
              className={styles.sectionTitle}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.05}
            >
              Work with <span className={styles.accent}>{firstName}</span>
            </motion.h2>

            <motion.div
              className={styles.consultWrap}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.1}
            >
              <div className={styles.consultGrid}>
                {[
                  {
                    Icon: FiBookOpen,
                    title: "1-on-1 Nutrition Consultation",
                    desc: "Personalised guidance tailored to your health goals and lifestyle.",
                    tag: "Most Popular",
                  },
                  {
                    Icon: FiCalendar,
                    title: "Meal Plan Design",
                    desc: "Custom weekly meal plans based on your dietary needs and preferences.",
                    tag: null,
                  },
                  {
                    Icon: FiUsers,
                    title: "Follow-up Sessions",
                    desc: "Track progress, refine your plan, and stay accountable.",
                    tag: null,
                  },
                ].map(({ Icon, title, desc, tag }, i) => (
                  <motion.div
                    key={title}
                    className={styles.consultCard}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i * 0.08}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  >
                    {tag && <span className={styles.consultTag}>{tag}</span>}
                    <div className={styles.consultIconWrap} aria-hidden="true">
                      <Icon />
                    </div>
                    <h3 className={styles.consultCardTitle}>{title}</h3>
                    <p className={styles.consultCardDesc}>{desc}</p>
                    <button
                      className={styles.consultBtn}
                      onClick={openConsultation}
                      disabled={!nutritionist.available}
                    >
                      Book This <FiArrowRight aria-hidden="true" />
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Fee display if available */}
              {showFee && (
                <div className={styles.feeDisplay} role="note">
                  <span className={styles.feeDisplayLabel}>Starting from</span>
                  <span className={styles.feeDisplayAmount}>
                    {nutritionist.currency ?? "₹"}
                    {nutritionist.consultationFee}
                    <span className={styles.feeDisplayPer}>
                      {" "}
                      / consultation
                    </span>
                  </span>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* ════ REVIEWS ════ */}
        <section className={styles.section} aria-labelledby="reviews-h">
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
                <span className={styles.reviewBigNum}>
                  {nutritionist.rating}
                </span>
                <Stars rating={nutritionist.rating} size={20} />
                <span className={styles.reviewBigCount}>
                  {reviews.toLocaleString()} reviews
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
                  {reviews.toLocaleString()} people have reviewed {firstName}
                </p>
                <p className={styles.reviewsEmptyText}>
                  Individual review details will appear here once connected.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ════ RELATED NUTRITIONISTS ════ */}
        {related.length > 0 && (
          <section
            className={`${styles.section} ${styles.sectionDark}`}
            aria-labelledby="related-h"
          >
            <div className={styles.container}>
              <motion.span
                className={styles.eyebrow}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                More Experts
              </motion.span>
              <motion.h2
                id="related-h"
                className={styles.sectionTitle}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.05}
              >
                You May Also <span className={styles.accent}>Like</span>
              </motion.h2>

              <motion.div
                className={styles.relatedGrid}
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
              >
                {related.map((n, i) => (
                  <NutritionistCard
                    key={n._id ?? n.id ?? i}
                    nutritionist={n}
                    index={i}
                  />
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {/* ════ FINAL CTA ════ */}
        <section
          className={styles.finalCta}
          aria-label="Start nutrition journey"
        >
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
              Ready to Transform with{" "}
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
              Take your health goals to the next level with expert nutrition
              guidance that delivers real, lasting results.
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
                onClick={openConsultation}
                disabled={!nutritionist.available}
                whileHover={nutritionist.available ? { scale: 1.03 } : {}}
                whileTap={nutritionist.available ? { scale: 0.97 } : {}}
              >
                <FiCalendar aria-hidden="true" /> Book Consultation
              </motion.button>
              <motion.button
                className={styles.btnGhost}
                onClick={() => navigate("/nutritionists")}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Browse All Experts <FiArrowRight aria-hidden="true" />
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* ════ MOBILE STICKY FOOTER ════ */}
        <div className={styles.mobileCta} aria-label="Mobile consultation bar">
          <div className={styles.mobileCtaInner}>
            <div>
              <p className={styles.mobileCtaName}>{nutritionist.name}</p>
              <p className={styles.mobileCtaRole}>{nutritionist.role}</p>
            </div>
            <button
              className={styles.btnPrimary}
              onClick={openConsultation}
              disabled={!nutritionist.available}
            >
              <FiCalendar aria-hidden="true" />
              {nutritionist.available ? "Book" : "Unavailable"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {showConsultation && (
          <ConsultationModal
            nutritionist={nutritionist}
            onClose={closeConsultation}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showContact && (
          <ContactModal nutritionist={nutritionist} onClose={closeContact} />
        )}
      </AnimatePresence>
    </>
  );
};

export default NutritionistDetailsPage;
