// ============================================================
// GYMSSY — GYM DETAILS PAGE
// Premium marketplace listing page for individual gyms
// ============================================================

import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FiArrowLeft,
  FiHome,
  FiChevronRight,
  FiShare2,
  FiHeart,
  FiMapPin,
  FiStar,
  FiClock,
  FiCheck,
  FiX,
  FiPhone,
  FiMail,
  FiExternalLink,
  FiChevronLeft,
  FiCamera,
  FiFilter,
} from "react-icons/fi";

import { getGymBySlug, getSimilarGyms } from "../../data/gymsData";

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

const GymDetailsPage = () => {
  const { slug } = useParams();
  console.log("slug", slug)
  const navigate = useNavigate();

  // State
  const [gym, setGym] = useState(null);
  const [similarGyms, setSimilarGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [activePhotoCategory, setActivePhotoCategory] = useState("all");
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Refs
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const shareMenuRef = useRef(null);

  // ─── Data Loading ────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    setNotFound(false);
      console.log("found--------");

    // Simulate async data fetch — replace with API call
    const timer = setTimeout(() => {
      console.log("found");

      const found = getGymBySlug(slug);
      console.log("found", found);
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

  // ─── Scroll detection for sticky bar ─────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ─── GSAP Page Entrance ───────────────────────────────────────
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

  // ─── Close share menu on outside click ───────────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target)) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ─── Saved state from localStorage ───────────────────────────
  useEffect(() => {
    if (!gym) return;
    const saved = JSON.parse(localStorage.getItem("gymssy_saved") || "[]");
    setIsSaved(saved.includes(gym.id));
  }, [gym]);

  // ─── Handlers ─────────────────────────────────────────────────
  const handleSave = () => {
    const saved = JSON.parse(localStorage.getItem("gymssy_saved") || "[]");
    let updated;
    if (isSaved) {
      updated = saved.filter((id) => id !== gym.id);
    } else {
      updated = [...saved, gym.id];
    }
    localStorage.setItem("gymssy_saved", JSON.stringify(updated));
    setIsSaved(!isSaved);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${gym.name} | Gymssy`,
          text: `Check out ${gym.name} on Gymssy — India's Complete Fitness Marketplace`,
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

  const handleBookVisit = () => {
    setShowBookingModal(true);
  };

  const handleSelectMembership = (membership) => {
    setSelectedMembership(membership);
    setShowBookingModal(true);
  };

  const scrollToMemberships = () => {
    document
      .getElementById("memberships")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  // ─── Loading State ─────────────────────────────────────────────
if (loading) {
  return <div>Loading gym details...</div>;
}

// ─── Not Found State ───────────────────────────────────────────
if (notFound || !gym) {
  return <div>Gym not found</div>;
}

// ─── Format timing display ─────────────────────────────────────
const formatTime = (t) => {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;

  return `${hour}:${m.toString().padStart(2, "0")} ${suffix}`;
};

const getCurrentDayTiming = () => {
  if (!gym?.timings) {
    return null;
  }

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

  console.log("todayTiming", gym);

  return gym.timings.find((t) => t.day === today) ?? null;
};

const todayTiming = getCurrentDayTiming();

  const isOpenNow = () => {
    if (!todayTiming || !todayTiming.isOpen) return false;
    const now = new Date();
    const [openH, openM] = todayTiming.open.split(":").map(Number);
    const [closeH, closeM] = todayTiming.close.split(":").map(Number);
    const currentMins = now.getHours() * 60 + now.getMinutes();
    const openMins = openH * 60 + openM;
    const closeMins = closeH * 60 + closeM;
    return currentMins >= openMins && currentMins <= closeMins;
  };

  const openStatus = isOpenNow();

  // ─── Lowest membership price ───────────────────────────────────
  const lowestPrice = gym.memberships
    ? Math.min(...gym.memberships.map((m) => m.price))
    : null;

  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>{gym.name} | Memberships, Trainers & Reviews | Gymssy</title>
        <meta
          name="description"
          content={`Join ${gym.name} in ${gym.location.area}, ${gym.location.city}. 
          Explore memberships from ₹${lowestPrice}/month, ${gym.reviewCount} reviews, 
          certified trainers & classes. Book a free visit on Gymssy.`}
        />
        <meta property="og:title" content={`${gym.name} | Gymssy`} />
        <meta
          property="og:description"
          content={`${gym.category} in ${gym.location.area}, ${gym.location.city}. 
          Rated ${gym.rating}/5 by ${gym.reviewCount} members.`}
        />
        <meta property="og:image" content={gym.images.cover} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="business.business" />
      </Helmet>

      <div className={styles.page} ref={pageRef}>
        {/* ── BREADCRUMB ───────────────────────────────────────── */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <div className={styles.breadcrumbInner}>
            <Link to="/" className={styles.breadcrumbItem}>
              <FiHome size={13} />
              <span>Home</span>
            </Link>
            <FiChevronRight className={styles.breadcrumbSep} />
            <Link to="/gyms" className={styles.breadcrumbItem}>
              Gyms
            </Link>
            <FiChevronRight className={styles.breadcrumbSep} />
            <Link
              to={`/gyms?city=${gym.location.city}`}
              className={styles.breadcrumbItem}
            >
              {gym.location.city}
            </Link>
            <FiChevronRight className={styles.breadcrumbSep} />
            <span className={styles.breadcrumbCurrent}>{gym.name}</span>
          </div>
        </nav>

        {/* ── GYM HEADER ──────────────────────────────────────── */}
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

        {/* ── IMAGE GALLERY ─────────────────────────────────────── */}
        <section className={styles.gallerySection} ref={heroRef}>
          <GymGallery
            images={gym.images.gallery}
            gymName={gym.name}
            onViewAll={() => setShowAllPhotos(true)}
          />
        </section>

        {/* ── QUICK INFO BAR ───────────────────────────────────── */}
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

        {/* ── MAIN CONTENT ─────────────────────────────────────── */}
        <div className={styles.mainContent}>
          <div className={styles.contentGrid}>
            {/* LEFT COLUMN */}
            <div className={styles.leftColumn}>
              {/* About */}
              <section className={styles.section} id="about">
                <AboutGym gym={gym} />
              </section>

              {/* Facilities */}
              <section className={styles.section} id="facilities">
                <FacilityGrid facilities={gym.facilities} />
              </section>

              {/* Memberships */}
              <section className={styles.section} id="memberships">
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Membership Plans</h2>
                  <p className={styles.sectionSubtitle}>
                    Choose the plan that works best for your fitness goals.
                  </p>
                </div>
                <div className={styles.membershipGrid}>
                  {gym.memberships.map((plan) => (
                    <MembershipCard
                      key={plan.id}
                      plan={plan}
                      onSelect={() => handleSelectMembership(plan)}
                    />
                  ))}
                </div>
              </section>

              {/* Trainers */}
              {gym.trainers && gym.trainers.length > 0 && (
                <section className={styles.section} id="trainers">
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Meet The Trainers</h2>
                    <p className={styles.sectionSubtitle}>
                      Certified professionals dedicated to your progress.
                    </p>
                  </div>
                  <div className={styles.trainerGrid}>
                    {gym.trainers.map((trainer) => (
                      <GymTrainerCard key={trainer.id} trainer={trainer} />
                    ))}
                  </div>
                </section>
              )}

              {/* Classes */}
              {gym.classes && gym.classes.length > 0 && (
                <section className={styles.section} id="classes">
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Classes & Programs</h2>
                    <p className={styles.sectionSubtitle}>
                      Structured classes led by certified professionals.
                    </p>
                  </div>
                  <div className={styles.classGrid}>
                    {gym.classes.map((cls) => (
                      <ClassCard
                        key={cls.id}
                        cls={cls}
                        onBook={handleBookVisit}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Timings */}
              <section className={styles.section} id="timings">
                <GymTimings
                  timings={gym.timings}
                  openStatus={openStatus}
                  formatTime={formatTime}
                />
              </section>

              {/* Location */}
              <section className={styles.section} id="location">
                <LocationMap gym={gym} />
              </section>

              {/* Reviews */}
              <section className={styles.section} id="reviews">
                <ReviewSection
                  rating={gym.rating}
                  reviewCount={gym.reviewCount}
                  ratingBreakdown={gym.ratingBreakdown}
                  reviews={gym.reviews}
                  onWriteReview={handleBookVisit}
                />
              </section>

              {/* Photo Gallery */}
              <section className={styles.section} id="photos">
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Photo Gallery</h2>
                  <button
                    className={styles.viewAllLink}
                    onClick={() => setShowAllPhotos(true)}
                  >
                    <FiCamera size={14} />
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

            {/* RIGHT COLUMN — Desktop Booking Card */}
            <aside className={styles.rightColumn}>
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
                    <FiStar className={styles.starIcon} />
                    <span>{gym.rating}</span>
                    <span className={styles.reviewCount}>
                      ({gym.reviewCount.toLocaleString("en-IN")})
                    </span>
                  </div>
                </div>

                <div
                  className={`${styles.openBadge} ${
                    openStatus ? styles.openBadgeOpen : styles.openBadgeClosed
                  }`}
                >
                  <span className={styles.openDot} />
                  {openStatus
                    ? `Open until ${
                        todayTiming ? formatTime(todayTiming.close) : ""
                      }`
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
                    <FiMapPin size={13} />
                    <span>{gym.location.area}</span>
                  </div>
                  <div className={styles.bookingMetaItem}>
                    <FiPhone size={13} />
                    <a href={`tel:${gym.phone}`}>{gym.phone}</a>
                  </div>
                  {gym.email && (
                    <div className={styles.bookingMetaItem}>
                      <FiMail size={13} />
                      <a href={`mailto:${gym.email}`}>{gym.email}</a>
                    </div>
                  )}
                </div>

                <div className={styles.bookingNote}>
                  <FiCheck size={12} />
                  Free cancellation · No commitment
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* ── SIMILAR GYMS ─────────────────────────────────────── */}
        <section className={styles.similarSection}>
          <SimilarGyms gyms={similarGyms} onBookVisit={handleBookVisit} />
        </section>

        {/* ── STICKY BOOKING BAR ───────────────────────────────── */}
        {/* <StickyBookingBar
          gym={gym}
          visible={showStickyBar}
          lowestPrice={lowestPrice}
          openStatus={openStatus}
          onBookVisit={handleBookVisit}
          onViewMemberships={scrollToMemberships}
        /> */}

        {/* ── BOOKING MODAL ───────────────────────────────────────
        <AnimatePresence>
          {showBookingModal && (
            <BookingModal
              gym={gym}
              selectedMembership={selectedMembership}
              onClose={() => {
                setShowBookingModal(false);
                setSelectedMembership(null);
              }}
            />
          )}
        </AnimatePresence> */}
      </div>
    </>
  );
};

// ─── Inline About Section (within page file) ──────────────────
const AboutGym = ({ gym }) => {
  const [expanded, setExpanded] = useState(false);
  const descriptionParagraphs = gym.description
    .trim()
    .split("\n\n")
    .filter(Boolean);

  return (
    <motion.div
      className={styles.aboutSection}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className={styles.aboutGrid}>
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
              <span className={expanded ? styles.arrowUp : styles.arrowDown}>
                ›
              </span>
            </button>
          )}
        </div>

        <div className={styles.aboutRight}>
          <h3 className={styles.highlightsTitle}>Highlights</h3>
          <ul className={styles.highlightsList}>
            {gym.highlights.map((h, i) => (
              <motion.li
                key={i}
                className={styles.highlightItem}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <FiCheck className={styles.highlightIcon} />
                <span>{h}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default GymDetailsPage;
