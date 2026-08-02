import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FiHome,
  FiChevronRight,
  FiHeart,
  FiMapPin,
  FiStar,
  FiCheck,
  FiPhone,
  FiMail,
  FiCamera,
} from "react-icons/fi";

import { getGymBySlug, getSimilarGyms } from "../../data/gymsData";
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
   GYM DETAILS PAGE
══════════════════════════════════════════════════════════════ */
const GymDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  /* ── State ── */
  const [gym, setGym] = useState(null);
  const [similarGyms, setSimilarGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
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

  /* ── Data loading ── */
  useEffect(() => {
    setLoading(true);
    setNotFound(false);

    const timer = setTimeout(() => {
      const found = getGymBySlug(slug);
      if (found) {
        setGym(found);
        setSimilarGyms(getSimilarGyms(slug, 4));
        setNotFound(false);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [slug]);

  /* ── Sticky bar on scroll ── */
  useEffect(() => {
    const handleScroll = () => setShowStickyBar(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── GSAP entrance ── */
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
          scrollTrigger: {
            trigger: pageRef.current,
            start: "top 80%",
          },
        },
      );
    }, pageRef);
    return () => ctx.revert();
  }, [gym, loading]);

  /* ── Close share menu on outside click ── */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target)) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ── Saved state ── */
  useEffect(() => {
    if (!gym) return;
    const saved = JSON.parse(localStorage.getItem("gymssy_saved") || "[]");
    setIsSaved(saved.includes(gym.id));
  }, [gym]);

  /* ── Handlers ── */
  const handleSave = () => {
    const saved = JSON.parse(localStorage.getItem("gymssy_saved") || "[]");
    const updated = isSaved
      ? saved.filter((id) => id !== gym.id)
      : [...saved, gym.id];
    localStorage.setItem("gymssy_saved", JSON.stringify(updated));
    setIsSaved(!isSaved);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${gym.name} | Gymssy`,
          text: `Check out ${gym.name} on Gymssy`,
          url: window.location.href,
        });
      } catch {
        setShowShareMenu(true);
      }
    } else {
      setShowShareMenu((prev) => !prev);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareMenu(false);
  };

  const handleBookVisit = () => setShowBookingModal(true);

  const handleSelectMembership = (membership) => {
    setSelectedMembership(membership);
    setShowBookingModal(true);
  };

  const scrollToMemberships = () => {
    document
      .getElementById("memberships")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className={styles.page}>
        <LoadingState />
      </div>
    );
  }

  /* ── Not found ── */
  if (notFound || !gym) {
    return (
      <div className={styles.page}>
        <NotFoundState onBack={() => navigate(-1)} />
      </div>
    );
  }

  /* ── Helpers ── */
  const formatTime = (t) => {
    const [h, m] = t.split(":").map(Number);
    const suffix = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, "0")} ${suffix}`;
  };

  const getCurrentDayTiming = () => {
    if (!gym?.timings) return null;
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
    return gym.timings.find((t) => t.day === today) ?? null;
  };

  const todayTiming = getCurrentDayTiming();

  const isOpenNow = () => {
    if (!todayTiming || !todayTiming.isOpen) return false;
    const now = new Date();
    const [openH, openM] = todayTiming.open.split(":").map(Number);
    const [closeH, closeM] = todayTiming.close.split(":").map(Number);
    const curr = now.getHours() * 60 + now.getMinutes();
    return curr >= openH * 60 + openM && curr <= closeH * 60 + closeM;
  };

  const openStatus = isOpenNow();

  const lowestPrice = gym.memberships
    ? Math.min(...gym.memberships.map((m) => m.price))
    : null;

  /* ══════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════ */
  return (
    <>
      {/* ── SEO ── */}
      <Helmet>
        <title>{gym.name} | Memberships, Trainers & Reviews | Gymssy</title>
        <meta
          name="description"
          content={`Join ${gym.name} in ${gym.location.area}, ${gym.location.city}. Memberships from ₹${lowestPrice}/month. Book a free visit on Gymssy.`}
        />
        <meta property="og:title" content={`${gym.name} | Gymssy`} />
        <meta
          property="og:description"
          content={`${gym.category} in ${gym.location.area}, ${gym.location.city}. Rated ${gym.rating}/5 by ${gym.reviewCount} members.`}
        />
        <meta property="og:image" content={gym.images.cover} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="business.business" />
      </Helmet>

      <div className={styles.page} ref={pageRef}>
  
        {/* ══ GYM HEADER ══ */}
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

        {/* ══ IMAGE GALLERY ══ */}
        <div className={styles.gallerySection} ref={heroRef}>
          <GymGallery
            images={gym.images.gallery}
            gymName={gym.name}
            onViewAll={() => setShowAllPhotos(true)}
          />
        </div>

        {/* ══ QUICK INFO BAR ══ */}
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

        {/* ══════════════════════════════════════════════════════
            MAIN CONTENT WRAPPER
            All sections share this max-width container
        ══════════════════════════════════════════════════════ */}
        <div className={styles.mainContent}>
          {/* ════════════════════════════════════════════════════
              ZONE A — TWO-COLUMN GRID
              About Gym (left) + Sticky Booking Card (right)
              Only this zone has the two-column layout.
          ════════════════════════════════════════════════════ */}
          <div className={styles.contentGrid}>
            {/* ── About — left column ── */}
            <div className={styles.leftColumn}>
              <section className={styles.section} id="about">
                <AboutGym gym={gym} />
              </section>
            </div>

            {/* ── Sticky Booking Card — right column ── */}
            <aside
              className={styles.rightColumn}
              aria-label="Booking information"
            >
              <div className={styles.desktopBookingCard}>
                {/* Price + Rating */}
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

                {/* Open/Closed */}
                <div
                  className={`${styles.openBadge} ${
                    openStatus ? styles.openBadgeOpen : styles.openBadgeClosed
                  }`}
                >
                  <span className={styles.openDot} aria-hidden="true" />
                  {openStatus
                    ? `Open until ${
                        todayTiming ? formatTime(todayTiming.close) : ""
                      }`
                    : "Currently Closed"}
                </div>

                {/* CTAs */}
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

                {/* Meta */}
                <div className={styles.bookingMeta}>
                  <div className={styles.bookingMetaItem}>
                    <FiMapPin size={13} aria-hidden="true" />
                    <span>{gym.location.area}</span>
                  </div>
                  <div className={styles.bookingMetaItem}>
                    <FiPhone size={13} aria-hidden="true" />
                    <a href={`tel:${gym.phone}`}>{gym.phone}</a>
                  </div>
                  {gym.email && (
                    <div className={styles.bookingMetaItem}>
                      <FiMail size={13} aria-hidden="true" />
                      <a href={`mailto:${gym.email}`}>{gym.email}</a>
                    </div>
                  )}
                </div>

                {/* Note */}
                <div className={styles.bookingNote}>
                  <FiCheck size={12} aria-hidden="true" />
                  Free cancellation · No commitment
                </div>
              </div>
            </aside>
          </div>
          {/* ── END ZONE A ── */}

          {/* ════════════════════════════════════════════════════
              ZONE B — FULL WIDTH SECTIONS
              Every section from Facilities onwards.
              No column constraint — spans full mainContent width.
          ════════════════════════════════════════════════════ */}

          {/* ── Facilities ── */}
          <section
            className={`${styles.section} ${styles.fullWidthSection}`}
            id="facilities"
          >
            <FacilityGrid facilities={gym.facilities} />
          </section>

          {/* ── Trainers ── */}
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

          {/* ── Classes ── */}
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

          {/* ── Timings ── */}
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

          {/* ── Location ── */}
          <section
            className={`${styles.section} ${styles.fullWidthSection}`}
            id="location"
          >
            <LocationMap gym={gym} />
          </section>

          {/* ── Reviews ── */}
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

          {/* ── Photo Gallery ── */}
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
        </div>
        {/* ══ END MAIN CONTENT ══ */}

        {/* ══ SIMILAR GYMS ══ */}
        <div className={styles.similarSection}>
          <SimilarGyms gyms={similarGyms} onBookVisit={handleBookVisit} />
        </div>
      </div>
    </>
  );
};

/* ══════════════════════════════════════════════════════════════
   ABOUT GYM — inline sub-component
══════════════════════════════════════════════════════════════ */
const AboutGym = ({ gym }) => {
  const [expanded, setExpanded] = useState(false);

  const descriptionParagraphs = gym.description
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
        {/* Text */}
        <div className={styles.aboutLeft}>
          <h2 className={styles.sectionTitle}>About {gym.name}</h2>

          <div
            className={`${styles.aboutText} ${
              expanded ? styles.aboutTextExpanded : ""
            }`}
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

        {/* Highlights */}
        <div className={styles.aboutRight}>
          <h3 className={styles.highlightsTitle}>Highlights</h3>
          <ul className={styles.highlightsList} aria-label="Gym highlights">
            {gym.highlights.map((h, i) => (
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
      gap: "16px",
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
   NOT FOUND STATE
══════════════════════════════════════════════════════════════ */
const NotFoundState = ({ onBack }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
      flexDirection: "column",
      gap: "20px",
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
      We couldn&apos;t find the gym you&apos;re looking for. It may have been
      removed or the link is incorrect.
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
