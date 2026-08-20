import { useRef } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  FiClock,
  FiUsers,
  FiStar,
  FiArrowRight,
  FiAlertCircle,
  FiMapPin,
  FiNavigation,
} from "react-icons/fi";
import { MdLocalFireDepartment } from "react-icons/md";
import { useNavigate } from "react-router-dom";

/* ── Reused across all three category pages ── */
import FitnessSection from "../../components/sections/fitness/FitnessSection/FitnessSection";
import { SkeletonRow } from "../../components/ui/SkeletonCard/SkeletonCard";
import SectionLabel from "../../components/ui/SectionLabel/SectionLabel";

/* ── Sports-specific sections ── */
import SportsHero from "../../components/sections/sports/SportsHero/SportsHero";
import SportsCategories from "../../components/sections/sports/SportsCategories/SportsCategories";
import PopularSports from "../../components/sections/sports/PopularSports/PopularSports";
import SportsGoals from "../../components/sections/sports/SportsGoals/SportsGoals";
import SportsBenefits from "../../components/sections/sports/SportsBenefits/SportsBenefits";
import SportsCities from "../../components/sections/sports/SportsCities/SportsCities";
import SportsFacilities from "../../components/sections/sports/SportsFacilities/SportsFacilities";
import SportsForKids from "../../components/sections/sports/SportsForKids/SportsForKids";

/* ── Data hook ── */
import useSportsData from "../../hooks/useSportsData";

import styles from "./Sports.module.css";

/* ══════════════════════════════════════════════════════
   SPORTS EXPERIENCE CARD
   Same structure as Fitness/Wellness ExperienceCard.
   Uses neon green accent to match Sports theme.
══════════════════════════════════════════════════════ */
const SportsExperienceCard = ({ exp, index }) => {
  const navigate = useNavigate();

  return (
    <motion.article
      className={styles.expCard}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-4%" }}
      transition={{
        duration: 0.6,
        delay: (index % 3) * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
    >
      {/* Image */}
      <div className={styles.expImageWrapper}>
        <img
          src={exp.image}
          alt={exp.title}
          className={styles.expImage}
          loading="lazy"
        />
        <div className={styles.expImageOverlay} aria-hidden="true" />
        {exp.trending && (
          <div className={styles.trendBadge} aria-label="Trending">
            <MdLocalFireDepartment aria-hidden="true" />
            Trending
          </div>
        )}
        <div className={styles.expCategoryBadge}>{exp.category}</div>
      </div>

      {/* Content */}
      <div className={styles.expContent}>
        <h3 className={styles.expTitle}>{exp.title}</h3>

        <div className={styles.expMeta}>
          <span className={styles.expMetaItem}>
            <FiClock aria-hidden="true" /> {exp.duration}
          </span>
          <span className={styles.expMetaItem}>
            <FiUsers aria-hidden="true" /> {exp.spots} spots
          </span>
          <span className={styles.expMetaItem}>
            <FiStar aria-hidden="true" /> {exp.rating}
          </span>
        </div>

        <span className={styles.expLevel}>{exp.level}</span>

        <div className={styles.expFooter}>
          <div className={styles.expPrice}>
            <span className={styles.expFrom}>From</span>
            <span className={styles.expVal}>₹{exp.priceFrom}</span>
          </div>
          <motion.button
            className={styles.expBookBtn}
            onClick={() => navigate("/discover?type=sports")}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            aria-label={`Explore ${exp.title}`}
          >
            View Experience
            <FiArrowRight aria-hidden="true" />
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};

/* ══════════════════════════════════════════════════════
   SPORTS ACADEMY CARD
   Inline — matches prop shape returned by /api/gyms/featured
   and the fallback FALLBACK_ACADEMIES shape.
   NOT the standalone GymCard (different prop shape).
══════════════════════════════════════════════════════ */
const SportsAcademyCard = ({ academy, index }) => {
  const navigate = useNavigate();

  const price = academy.priceFrom
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(academy.priceFrom)
    : null;

  return (
    <motion.article
      className={styles.academyCard}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-4%" }}
      transition={{
        duration: 0.6,
        delay: (index % 4) * 0.09,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -5, transition: { duration: 0.25 } }}
    >
      {/* Image */}
      <div className={styles.academyImageWrapper}>
        <img
          src={academy.image}
          alt={academy.name}
          className={styles.academyImage}
          loading="lazy"
        />
        <div className={styles.academyImageOverlay} aria-hidden="true" />

        {/* Badges */}
        <div className={styles.academyBadges}>
          {academy.isVerified && (
            <span className={styles.verifiedBadge} aria-label="Verified">
              ✓ Verified
            </span>
          )}
          <span
            className={`${styles.statusBadge} ${
              academy.isOpen ? styles.statusOpen : styles.statusClosed
            }`}
            aria-label={academy.isOpen ? "Open" : "Closed"}
          >
            {academy.isOpen ? "Open" : "Closed"}
          </span>
        </div>

        {/* Distance */}
        {academy.distance && (
          <div
            className={styles.distanceBadge}
            aria-label={`${academy.distance} away`}
          >
            <FiNavigation aria-hidden="true" />
            {academy.distance}
          </div>
        )}

        {/* Rating */}
        <div className={styles.ratingBadge}>
          <FiStar className={styles.ratingStar} aria-hidden="true" />
          <span className={styles.ratingVal}>{academy.rating}</span>
          <span className={styles.ratingCount}>
            ({academy.reviews?.toLocaleString()})
          </span>
        </div>
      </div>

      {/* Content */}
      <div className={styles.academyContent}>
        <h3 className={styles.academyName}>{academy.name}</h3>
        {academy.category && (
          <span className={styles.academyCategory}>{academy.category}</span>
        )}

        {academy.location && (
          <div className={styles.academyLocation}>
            <FiMapPin aria-hidden="true" />
            {academy.location}
          </div>
        )}

        <div className={styles.academyFooter}>
          {price && (
            <div className={styles.academyPrice}>
              <span className={styles.academyFrom}>From</span>
              <span className={styles.academyPriceVal}>{price}</span>
            </div>
          )}
          <motion.button
            className={styles.academyBtn}
            onClick={() => navigate(`/gym-detail/${academy.slug}`)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            aria-label={`View ${academy.name}`}
          >
            View Academy
            <FiArrowRight aria-hidden="true" />
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};

/* ══════════════════════════════════════════════════════
   SPORTS COACH CARD
   Inline — matches prop shape of FALLBACK_COACHES /
   /api/trainers/featured response.
   NOT the standalone TrainerCard (expects social, certs etc.)
   NOTE: API returns general fitness trainers. Sports-specific
   filter not yet available. Missing: /api/trainers/featured?type=sports
══════════════════════════════════════════════════════ */
const SportsCoachCard = ({ coach, index }) => {
  const navigate = useNavigate();

  const price = coach.pricePerSession
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(coach.pricePerSession)
    : null;

  return (
    <motion.article
      className={styles.coachCard}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-4%" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -5, transition: { duration: 0.25 } }}
    >
      {/* Image */}
      <div className={styles.coachImageWrapper}>
        <img
          src={coach.image}
          alt={coach.name}
          className={styles.coachImage}
          loading="lazy"
        />
        <div
          className={`${styles.coachAvailBadge} ${
            coach.isAvailable ? styles.coachAvailOpen : styles.coachAvailClosed
          }`}
          aria-label={coach.isAvailable ? "Available" : "Unavailable"}
        >
          <span className={styles.coachAvailDot} aria-hidden="true" />
          {coach.isAvailable ? "Available" : "Busy"}
        </div>
      </div>

      {/* Info */}
      <div className={styles.coachInfo}>
        <h3 className={styles.coachName}>{coach.name}</h3>
        <p className={styles.coachSpec}>{coach.specialization}</p>
        <p className={styles.coachExp}>{coach.experience} experience</p>

        <div className={styles.coachRating}>
          <FiStar className={styles.coachStar} aria-hidden="true" />
          <span>{coach.rating}</span>
          <span className={styles.coachReviews}>({coach.reviews})</span>
        </div>

        <div className={styles.coachFooter}>
          {price && (
            <span className={styles.coachPrice}>{price} / session</span>
          )}
          <motion.button
            className={styles.coachBtn}
            onClick={() => navigate(`/trainer/${coach.slug}`)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            aria-label={`View ${coach.name}'s profile`}
          >
            View Coach
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};

/* ── Error State (mirrors Wellness) ── */
const ErrorState = ({ message, onRetry }) => (
  <div className={styles.errorState} role="alert">
    <FiAlertCircle className={styles.errorIcon} aria-hidden="true" />
    <p>{message}</p>
    {onRetry && (
      <button className={styles.retryBtn} onClick={onRetry}>
        Try Again
      </button>
    )}
  </div>
);

/* ── Empty State (mirrors Fitness) ── */
const EmptyState = ({ message }) => (
  <div className={styles.emptyState} role="status" aria-live="polite">
    <p>{message}</p>
  </div>
);

/* ══════════════════════════════════════════════════════
   SPORTS PAGE
══════════════════════════════════════════════════════ */
const Sports = () => {
  const categoriesRef = useRef(null);
  const { academies, coaches, experiences, cities, loading, error } =
    useSportsData();

  const scrollToCategories = () => {
    document
      .getElementById("sports-categories")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* ── SEO ── */}
      <Helmet>
        <title>Sports — Academies, Coaches & Sports Experiences | Gymssy</title>
        <meta
          name="description"
          content="Discover sports academies, expert coaches, courts, swimming, martial arts and sports experiences near you with Gymssy — India's #1 sports and fitness marketplace."
        />
        <meta
          property="og:title"
          content="Sports on Gymssy — Academies, Coaches & Experiences"
        />
        <meta
          property="og:description"
          content="Find sports academies, coaches and facilities near you."
        />
      </Helmet>

      <main className={styles.page}>
        {/* ══ HERO ══ */}
        <SportsHero onExploreClick={scrollToCategories} />

        {/* ══ SPORTS SUBCATEGORIES ══ */}
        <SportsCategories sectionRef={categoriesRef} />

        {/* ══ FEATURED SPORTS ACADEMIES ══ */}
        <FitnessSection
          id="featured-academies"
          label="TOP RATED"
          title="Featured Sports"
          titleAccent="Academies"
          subtitle="Train with trusted academies and expert coaches — verified and reviewed by real members."
          viewAllHref="/discover?type=sports&category=academies"
          viewAllText="View All Academies"
        >
          {loading.academies ? (
            <SkeletonRow count={4} variant="gym" />
          ) : error.academies ? (
            <ErrorState message="Unable to load sports academies. Please try again." />
          ) : academies.length === 0 ? (
            <EmptyState message="No sports academies available right now. Check back soon." />
          ) : (
            <div
              className={styles.academiesGrid}
              role="list"
              aria-label="Featured sports academies"
            >
              {academies.map((academy, index) => (
                <div key={academy.id || academy._id} role="listitem">
                  <SportsAcademyCard academy={academy} index={index} />
                </div>
              ))}
            </div>
          )}
        </FitnessSection>

        {/* ══ POPULAR SPORTS ══ */}
        <PopularSports />

        {/* ══ EXPERT SPORTS COACHES ══ */}
        {/*
          NOTE: /api/trainers/featured returns general fitness trainers.
          Sports-specific coaching filter not yet available on backend.
          Missing API: /api/trainers/featured?type=sports
          Currently displaying all featured trainers with sports coach labels.
        */}
        <FitnessSection
          id="sports-coaches"
          label="EXPERT COACHES"
          title="Expert Sports"
          titleAccent="Coaches"
          subtitle="Learn from coaches who know how to take your game further."
          viewAllHref="/discover?type=sports&category=coaches"
          viewAllText="View All Coaches"
        >
          {loading.coaches ? (
            <SkeletonRow count={4} variant="trainer" />
          ) : error.coaches ? (
            <ErrorState message="Unable to load sports coaches. Please try again." />
          ) : coaches.length === 0 ? (
            <EmptyState message="No sports coaches available right now." />
          ) : (
            <div
              className={styles.coachesGrid}
              role="list"
              aria-label="Expert sports coaches"
            >
              {coaches.map((coach, index) => (
                <div key={coach.id || coach._id} role="listitem">
                  <SportsCoachCard coach={coach} index={index} />
                </div>
              ))}
            </div>
          )}
        </FitnessSection>

        {/* ══ TRENDING SPORTS EXPERIENCES ══ */}
        <FitnessSection
          id="trending-sports-experiences"
          label="TRENDING NOW"
          title="Trending Sports"
          titleAccent="Experiences"
          subtitle="Popular sports activities people are booking right now."
          viewAllHref="/discover?type=sports&sort=trending"
          viewAllText="View All"
          neonColor="#39ff14"
        >
          {loading.experiences ? (
            <SkeletonRow count={3} variant="experience" />
          ) : error.experiences ? (
            <ErrorState message="Unable to load sports experiences. Please try again." />
          ) : experiences.length === 0 ? (
            <EmptyState message="No trending sports experiences right now." />
          ) : (
            <div
              className={styles.experiencesGrid}
              role="list"
              aria-label="Trending sports experiences"
            >
              {experiences.map((exp, index) => (
                <div key={exp.id || exp._id} role="listitem">
                  <SportsExperienceCard exp={exp} index={index} />
                </div>
              ))}
            </div>
          )}
        </FitnessSection>

        {/* ══ SPORTS FACILITIES ══ */}
        <SportsFacilities />

        {/* ══ SPORTS BY GOAL ══ */}
        <SportsGoals />

        {/* ══ SPORTS FOR KIDS ══ */}
        <SportsForKids />

        {/* ══ POPULAR CITIES ══ */}
        <SportsCities cities={cities} loading={loading} />

        {/* ══ WHY GYMSSY FOR SPORTS ══ */}
        <SportsBenefits />

        {/* ══ FINAL CTA ══ */}
        <SportsFinalCta />
      </main>
    </>
  );
};

/* ══════════════════════════════════════════════════════
   SPORTS FINAL CTA
   Inline — mirrors Wellness/Fitness final CTA pattern
══════════════════════════════════════════════════════ */
const SportsFinalCta = () => {
  const navigate = useNavigate();

  return (
    <section
      className={styles.finalCta}
      aria-label="Get started with sports on Gymssy"
    >
      {/* Background */}
      <div className={styles.finalCtaBg} aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1800&q=80&fit=crop&auto=format"
          alt=""
          className={styles.finalCtaBgImage}
        />
        <div className={styles.finalCtaOverlay} />
        <div className={styles.finalCtaGradient} />
      </div>

      <div className={styles.finalCtaInner}>
        <motion.span
          className={styles.finalCtaEyebrow}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          🏆 Get Started
        </motion.span>

        <motion.h2
          className={styles.finalCtaHeading}
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.08 }}
        >
          Ready to Find{" "}
          <span className={styles.finalCtaAccent}>Your Game?</span>
        </motion.h2>

        <motion.p
          className={styles.finalCtaSubtitle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.14 }}
        >
          Discover sports, coaches and facilities near you.
        </motion.p>

        <motion.div
          className={styles.finalCtaBtns}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.2 }}
        >
          <motion.button
            className={styles.finalCtaPrimary}
            onClick={() =>
              document
                .getElementById("sports-categories")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            aria-label="Explore sports"
          >
            Explore Sports
            <FiArrowRight aria-hidden="true" />
          </motion.button>

          <motion.button
            className={styles.finalCtaSecondary}
            onClick={() => navigate("/partner-with-us")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            aria-label="Become a partner"
          >
            Become a Partner
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Sports;
