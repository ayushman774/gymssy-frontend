// src/pages/GymDetailsPage/GymDetailsPage.jsx

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FiCheck,
  FiPhone,
  FiMail,
  FiMapPin,
  FiStar,
  FiCamera,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";

import useGymDetails from "../../hooks/useGymDetails";
import { recordGymView } from "../../utils/recentlyViewed";

import styles from "./GymDetailsPage.module.css";
import GymHeader from "../../components/GymDetails/GymHeader/GymHeader";
import GymGallery from "../../components/GymDetails/GymGallery/GymGallery";
import GymQuickInfo from "../../components/GymDetails/GymQuickInfo/GymQuickInfo";
import GymTrainerCard from "../../components/GymDetails/GymTrainerCard/GymTrainerCard";
import GymTimings from "../../components/GymDetails/GymTimings/GymTimings";
import LocationMap from "../../components/GymDetails/LocationMap/LocationMap";
import ReviewSection from "../../components/GymDetails/ReviewSection/ReviewSection";
import PhotoGallery from "../../components/GymDetails/PhotoGallery/PhotoGallery";
import SimilarGyms from "../../components/GymDetails/SimilarGyms/SimilarGyms";
import FacilityGrid from "../../components/GymDetails/FacilityGrid/FacilityGrid";
import MembershipCard from "../../components/GymDetails/MembershipCard/MembershipCard";
import ClassCard from "../../components/GymDetails/ClassCard/ClassCard";

gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════ */
const formatTime = (t) => {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${suffix}`;
};

const getCurrentDayTiming = (timings = []) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = days[new Date().getDay()];
  return timings.find((t) => t.day === today) ?? null;
};

const computeOpenStatus = (todayTiming) => {
  if (!todayTiming?.isOpen) return false;
  const now = new Date();
  const [openH, openM] = todayTiming.open.split(":").map(Number);
  const [closeH, closeM] = todayTiming.close.split(":").map(Number);
  const curr = now.getHours() * 60 + now.getMinutes();
  return curr >= openH * 60 + openM && curr <= closeH * 60 + closeM;
};

/* ══════════════════════════════════════════════════════════════
   GYM DETAILS PAGE
══════════════════════════════════════════════════════════════ */
const GymDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  /* ── API ── */
  const { gym, similarGyms, loading, error, refetch } = useGymDetails(slug);

  /* ── UI state ── */
  const [isSaved, setIsSaved] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  /* ── Refs ── */
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const shareMenuRef = useRef(null);

  /* ── Record view ── */
  useEffect(() => {
    if (slug) recordGymView(slug);
  }, [slug]);

  /* ── Sticky bar ── */
  useEffect(() => {
    const onScroll = () => setShowStickyBar(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── GSAP entrance (runs after gym loads) ── */
  useEffect(() => {
    if (!gym || loading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".gsap-fade-up",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: pageRef.current, start: "top 80%" },
        },
      );
    }, pageRef);
    return () => ctx.revert();
  }, [gym, loading]);

  /* ── Close share menu on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target)) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Saved state ── */
  useEffect(() => {
    if (!gym) return;
    const saved = JSON.parse(localStorage.getItem("gymssy_saved") || "[]");
    setIsSaved(saved.includes(gym.id));
  }, [gym]);

  /* ── Handlers ── */
  const handleSave = useCallback(() => {
    if (!gym) return;
    const saved = JSON.parse(localStorage.getItem("gymssy_saved") || "[]");
    const updated = isSaved
      ? saved.filter((id) => id !== gym.id)
      : [...saved, gym.id];
    localStorage.setItem("gymssy_saved", JSON.stringify(updated));
    setIsSaved(!isSaved);
  }, [gym, isSaved]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${gym?.name} | Gymssy`,
          text: `Check out ${gym?.name} on Gymssy`,
          url: window.location.href,
        });
        return;
      } catch {
        /* fall through */
      }
    }
    setShowShareMenu((p) => !p);
  }, [gym]);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareMenu(false);
  }, []);

  const handleBookVisit = useCallback(() => setShowBookingModal(true), []);

  const handleSelectMembership = useCallback((membership) => {
    setSelectedMembership(membership);
    setShowBookingModal(true);
  }, []);

  const scrollToMemberships = useCallback(() => {
    document
      .getElementById("memberships")
      ?.scrollIntoView({ behavior: "smooth" });
  }, []);

  /* ══ EARLY RETURNS ══ */
  if (loading)
    return (
      <div className={styles.page}>
        <LoadingState />
      </div>
    );

  if (error) {
    return (
      <div className={styles.page}>
        <ErrorState message={error} onRetry={refetch} />
      </div>
    );
  }

  if (!gym) {
    return (
      <div className={styles.page}>
        <NotFoundState onBack={() => navigate(-1)} />
      </div>
    );
  }

  /* ── Derived values ── */
  const todayTiming = getCurrentDayTiming(gym.timings);
  const openStatus = computeOpenStatus(todayTiming);
  const lowestPrice = gym.memberships?.length
    ? Math.min(...gym.memberships.map((m) => m.price))
    : gym.priceFrom;

  /* ══ RENDER ══ */
  return (
    <>
      <Helmet>
        <title>{gym.name} | Memberships, Trainers & Reviews | Gymssy</title>
        <meta
          name="description"
          content={`Join ${gym.name} in ${gym.location?.area}, ${gym.location?.city}. Memberships from ₹${lowestPrice}/month. Book a free visit on Gymssy.`}
        />
        <meta property="og:title" content={`${gym.name} | Gymssy`} />
        <meta
          property="og:description"
          content={`${gym.category} in ${gym.location?.area}, ${gym.location?.city}. Rated ${gym.rating}/5 by ${gym.reviewCount} members.`}
        />
        <meta property="og:image" content={gym.images?.cover} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="business.business" />
      </Helmet>

      <div className={styles.page} ref={pageRef}>
        {/* ══ HEADER ══ */}
        <GymHeader
          gym={gym}
          isSaved={isSaved}
          onSave={handleSave}
          onShare={handleShare}
          onBookVisit={handleBookVisit}
          onViewMemberships={scrollToMemberships}
          showShareMenu={showShareMenu}
          shareMenuRef={shareMenuRef}
          onCopyLink={handleCopyLink}
          openStatus={openStatus}
          todayTiming={todayTiming}
          formatTime={formatTime}
          lowestPrice={lowestPrice}
        />

        {/* ══ GALLERY ══ */}
        {gym.images?.gallery?.length > 0 && (
          <div className={styles.gallerySection} ref={heroRef}>
            <GymGallery
              images={gym.images.gallery}
              gymName={gym.name}
              onViewAll={() => setShowAllPhotos(true)}
            />
          </div>
        )}

        {/* ══ QUICK INFO ══ */}
        <GymQuickInfo
          rating={gym.rating}
          reviewCount={gym.reviewCount}
          distance={gym.distance}
          todayTiming={todayTiming}
          openStatus={openStatus}
          formatTime={formatTime}
          lowestPrice={lowestPrice}
          currency="₹"
        />

        {/* ══ MAIN CONTENT ══ */}
        <div className={styles.mainContent}>
          {/* ── Zone A: Two-column ── */}
          <div className={styles.contentGrid}>
            {/* About — left */}
            <div className={styles.leftColumn}>
              <section className={styles.section} id="about">
                <AboutGym gym={gym} />
              </section>
            </div>

            {/* Booking card — right */}
            <aside
              className={styles.rightColumn}
              aria-label="Booking information"
            >
              <div className={styles.desktopBookingCard}>
                <div className={styles.bookingCardHeader}>
                  <div>
                    <span className={styles.bookingPrice}>
                      ₹{lowestPrice?.toLocaleString("en-IN")}
                    </span>
                    <span className={styles.bookingPricePer}>
                      /month onwards
                    </span>
                  </div>
                  <div className={styles.bookingRating}>
                    <FiStar className={styles.starIcon} aria-hidden="true" />
                    <span>{gym.rating}</span>
                    <span className={styles.reviewCount}>
                      ({gym.reviewCount.toLocaleString("en-IN")})
                    </span>
                  </div>
                </div>

                <div
                  className={`${styles.openBadge} ${openStatus ? styles.openBadgeOpen : styles.openBadgeClosed}`}
                >
                  <span className={styles.openDot} aria-hidden="true" />
                  {openStatus
                    ? `Open until ${todayTiming ? formatTime(todayTiming.close) : ""}`
                    : "Currently Closed"}
                </div>

                <button
                  className={styles.bookingPrimary}
                  onClick={handleBookVisit}
                  aria-label={`Book free visit at ${gym.name}`}
                >
                  Book Free Visit
                </button>
                <button
                  className={styles.bookingSecondary}
                  onClick={scrollToMemberships}
                  aria-label="View membership plans"
                >
                  View Memberships
                </button>

                <div className={styles.bookingMeta}>
                  <div className={styles.bookingMetaItem}>
                    <FiMapPin size={13} aria-hidden="true" />
                    <span>{gym.location?.area}</span>
                  </div>
                  {gym.phone && (
                    <div className={styles.bookingMetaItem}>
                      <FiPhone size={13} aria-hidden="true" />
                      <a href={`tel:${gym.phone}`}>{gym.phone}</a>
                    </div>
                  )}
                  {gym.email && (
                    <div className={styles.bookingMetaItem}>
                      <FiMail size={13} aria-hidden="true" />
                      <a href={`mailto:${gym.email}`}>{gym.email}</a>
                    </div>
                  )}
                </div>

                <div className={styles.bookingNote}>
                  <FiCheck size={12} aria-hidden="true" />
                  Free cancellation · No commitment
                </div>
              </div>
            </aside>
          </div>

          {/* ── Zone B: Full-width sections ── */}

          {/* Memberships */}
          {gym.memberships?.length > 0 && (
            <section
              className={`${styles.section} ${styles.fullWidthSection}`}
              id="memberships"
            >
              <div className={styles.sectionHeader}>
                <div className={styles.sectionHeaderLeft}>
                  <h2 className={styles.sectionTitle}>Membership Plans</h2>
                  <p className={styles.sectionSubtitle}>
                    Choose the plan that fits your goals.
                  </p>
                </div>
              </div>
              <div className={styles.membershipGrid}>
                {gym.memberships.map((plan, i) => (
                  <MembershipCard
                    key={i}
                    membership={plan}
                    onSelect={handleSelectMembership}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Facilities */}
          {gym.facilities?.length > 0 && (
            <section
              className={`${styles.section} ${styles.fullWidthSection}`}
              id="facilities"
            >
              <FacilityGrid facilities={gym.facilities} />
            </section>
          )}

          {/* Trainers */}
          {gym.trainers?.length > 0 && (
            <section
              className={`${styles.section} ${styles.fullWidthSection}`}
              id="trainers"
            >
              <div className={styles.sectionHeader}>
                <div className={styles.sectionHeaderLeft}>
                  <h2 className={styles.sectionTitle}>Meet The Trainers</h2>
                  <p className={styles.sectionSubtitle}>
                    Certified professionals dedicated to your progress.
                  </p>
                </div>
              </div>
              <div className={styles.trainerGrid}>
                {gym.trainers.map((trainer) => (
                  <GymTrainerCard key={trainer.id} trainer={trainer} />
                ))}
              </div>
            </section>
          )}

          {/* Classes */}
          {gym.classes?.length > 0 && (
            <section
              className={`${styles.section} ${styles.fullWidthSection}`}
              id="classes"
            >
              <div className={styles.sectionHeader}>
                <div className={styles.sectionHeaderLeft}>
                  <h2 className={styles.sectionTitle}>Classes & Programs</h2>
                  <p className={styles.sectionSubtitle}>
                    Structured classes led by certified professionals.
                  </p>
                </div>
              </div>
              <div className={styles.classGrid}>
                {gym.classes.map((cls) => (
                  <ClassCard key={cls.id} cls={cls} onBook={handleBookVisit} />
                ))}
              </div>
            </section>
          )}

          {/* Timings */}
          {gym.timings?.length > 0 && (
            <section
              className={`${styles.section} ${styles.fullWidthSection}`}
              id="timings"
            >
              <GymTimings
                timings={gym.timings}
                openStatus={openStatus}
                formatTime={formatTime}
              />
            </section>
          )}

          {/* Location */}
          {gym.coordinates && (
            <section
              className={`${styles.section} ${styles.fullWidthSection}`}
              id="location"
            >
              <LocationMap gym={gym} />
            </section>
          )}

          {/* Reviews */}
          {gym.reviews?.length > 0 && (
            <section
              className={`${styles.section} ${styles.fullWidthSection}`}
              id="reviews"
            >
              <ReviewSection
                rating={gym.rating}
                reviewCount={gym.reviewCount}
                ratingBreakdown={gym.ratingBreakdown}
                reviews={gym.reviews}
                onWriteReview={handleBookVisit}
              />
            </section>
          )}

          {/* Photo Gallery */}
          {gym.images?.gallery?.length > 0 && (
            <section
              className={`${styles.section} ${styles.fullWidthSection}`}
              id="photos"
            >
              <div className={styles.sectionHeader}>
                <div className={styles.sectionHeaderLeft}>
                  <h2 className={styles.sectionTitle}>Photo Gallery</h2>
                </div>
                <button
                  className={styles.viewAllLink}
                  onClick={() => setShowAllPhotos(true)}
                  aria-label="View all gym photos"
                >
                  <FiCamera size={13} aria-hidden="true" />
                  View All Photos
                </button>
              </div>
              <PhotoGallery
                images={gym.images.gallery}
                gymName={gym.name}
                showAll={showAllPhotos}
                onClose={() => setShowAllPhotos(false)}
              />
            </section>
          )}
        </div>

        {/* ══ SIMILAR GYMS ══ */}
        {similarGyms.length > 0 && (
          <div className={styles.similarSection}>
            <SimilarGyms gyms={similarGyms} onBookVisit={handleBookVisit} />
          </div>
        )}
      </div>
    </>
  );
};

/* ══════════════════════════════════════════════════════════════
   ABOUT GYM — unchanged logic, just uses normalised field names
══════════════════════════════════════════════════════════════ */
const AboutGym = ({ gym }) => {
  const [expanded, setExpanded] = useState(false);

  const descriptionParagraphs = (gym.description ?? "")
    .trim()
    .split("\n\n")
    .filter(Boolean);

  return (
    <motion.div
      className={styles.aboutSection}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className={styles.aboutGrid}>
        <div className={styles.aboutLeft}>
          <h2 className={styles.sectionTitle}>About {gym.name}</h2>

          <div
            className={`${styles.aboutText} ${expanded ? styles.aboutTextExpanded : ""}`}
          >
            {descriptionParagraphs.map((para, i) => (
              <p key={i}>{para.trim()}</p>
            ))}
          </div>

          {descriptionParagraphs.length > 1 && (
            <button
              className={styles.readMoreBtn}
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
            >
              {expanded ? "Show Less" : "Read More"}
              <span
                className={expanded ? styles.arrowUp : styles.arrowDown}
                aria-hidden="true"
              >
                ›
              </span>
            </button>
          )}
        </div>

        <div className={styles.aboutRight}>
          <h3 className={styles.highlightsTitle}>Highlights</h3>
          <ul className={styles.highlightsList} aria-label="Gym highlights">
            {(gym.highlights ?? []).map((h, i) => (
              <motion.li
                key={i}
                className={styles.highlightItem}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.055 }}
              >
                <FiCheck className={styles.highlightIcon} aria-hidden="true" />
                <span>{h}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════════
   LOADING STATE
══════════════════════════════════════════════════════════════ */
const LoadingState = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
      flexDirection: "column",
      gap: 16,
      color: "rgba(255,255,255,0.4)",
      fontFamily: "Inter, sans-serif",
      fontSize: "0.9rem",
    }}
    role="status"
    aria-live="polite"
  >
    <div
      style={{
        width: 36,
        height: 36,
        border: "2.5px solid rgba(255,255,255,0.08)",
        borderTop: "2.5px solid #39ff14",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }}
      aria-hidden="true"
    />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    Loading gym details…
  </div>
);

/* ══════════════════════════════════════════════════════════════
   ERROR STATE
══════════════════════════════════════════════════════════════ */
const ErrorState = ({ message, onRetry }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
      flexDirection: "column",
      gap: 16,
      padding: "40px 24px",
      textAlign: "center",
    }}
    role="alert"
  >
    <FiAlertCircle size={36} color="#ef4444" aria-hidden="true" />
    <p
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: "0.95rem",
        color: "rgba(255,255,255,0.6)",
        margin: 0,
        maxWidth: 380,
        lineHeight: 1.6,
      }}
    >
      {message}
    </p>
    <button
      onClick={onRetry}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "#39ff14",
        color: "#000",
        border: "none",
        borderRadius: 12,
        padding: "12px 24px",
        fontFamily: "Poppins, sans-serif",
        fontSize: "0.875rem",
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      <FiRefreshCw size={14} aria-hidden="true" />
      Try Again
    </button>
  </div>
);

/* ══════════════════════════════════════════════════════════════
   NOT FOUND STATE — unchanged
══════════════════════════════════════════════════════════════ */
const NotFoundState = ({ onBack }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
      flexDirection: "column",
      gap: 20,
      padding: "40px 24px",
      textAlign: "center",
    }}
  >
    <p
      style={{ fontSize: "3rem", margin: 0, lineHeight: 1 }}
      aria-hidden="true"
    >
      🏋️
    </p>
    <h2
      style={{
        fontFamily: "Poppins, sans-serif",
        fontSize: "1.4rem",
        color: "#fff",
        margin: 0,
      }}
    >
      Gym Not Found
    </h2>
    <p
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: "0.875rem",
        color: "rgba(255,255,255,0.45)",
        margin: 0,
        maxWidth: 360,
        lineHeight: 1.6,
      }}
    >
      We couldn&apos;t find the gym you&apos;re looking for.
    </p>
    <button
      onClick={onBack}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "#39ff14",
        color: "#000",
        border: "none",
        borderRadius: 12,
        padding: "12px 24px",
        fontFamily: "Poppins, sans-serif",
        fontSize: "0.875rem",
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      ← Go Back
    </button>
  </div>
);

export default GymDetailsPage;
