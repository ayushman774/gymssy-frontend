import { useRef } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { FiClock, FiUsers, FiStar, FiArrowRight } from "react-icons/fi";
import { MdLocalFireDepartment } from "react-icons/md";
import { useNavigate } from "react-router-dom";

/* ── Existing reusable components ── */
import GymCard from "../../components/ui/RecentlyViewedCard/RecentlyViewedCard";
import TrainerCard from "../../components/ui/TrainerCard/TrainerCard";
import SectionLabel from "../../components/ui/SectionLabel/SectionLabel";
import { SkeletonRow } from "../../components/ui/SkeletonCard/SkeletonCard";

/* ── New fitness-specific sections ── */
import FitnessHero from "../../components/sections/fitness/FitnessHero/FitnessHero";
import FitnessCategories from "../../components/sections/fitness/FitnessCategories/FitnessCategories";
import FitnessGoals from "../../components/sections/fitness/FitnessGoals/FitnessGoals";
import FitnessBenefits from "../../components/sections/fitness/FitnessBenefits/FitnessBenefits";
import FitnessCities from "../../components/sections/fitness/FitnessCities/FitnessCities";
import FitnessSection from "../../components/sections/fitness/FitnessSection/FitnessSection";

/* ── Data hook ── */
import useFitnessData from "../../hooks/useFitnessData";

import styles from "./Fitness.module.css";

/* ══════════════════════════════════════════════════════
   EXPERIENCE CARD (inline — mirrors TrendingExperiences)
══════════════════════════════════════════════════════ */
const ExperienceCard = ({ exp, index }) => {
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
            onClick={() => navigate("/discover")}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            aria-label={`Book ${exp.title}`}
          >
            Book Now
            <FiArrowRight aria-hidden="true" />
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};

/* ══════════════════════════════════════════════════════
   TRAINER CARD — inline fallback if TrainerCard prop
   shape differs from what we have in fallback data
══════════════════════════════════════════════════════ */
const FitnessTrainerCard = ({ trainer, index }) => {
  const navigate = useNavigate();
  const price = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(trainer.pricePerSession);

  return (
    <motion.article
      className={styles.trainerCard}
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
      <div className={styles.trainerImageWrapper}>
        <img
          src={trainer.image}
          alt={trainer.name}
          className={styles.trainerImage}
          loading="lazy"
        />
        <div
          className={`${styles.availabilityBadge} ${
            trainer.isAvailable
              ? styles.availabilityOpen
              : styles.availabilityClosed
          }`}
          aria-label={trainer.isAvailable ? "Available" : "Unavailable"}
        >
          <span className={styles.availabilityDot} aria-hidden="true" />
          {trainer.isAvailable ? "Available" : "Busy"}
        </div>
      </div>

      {/* Info */}
      <div className={styles.trainerInfo}>
        <h3 className={styles.trainerName}>{trainer.name}</h3>
        <p className={styles.trainerSpec}>{trainer.specialization}</p>
        <p className={styles.trainerExp}>{trainer.experience} experience</p>

        <div className={styles.trainerRating}>
          <FiStar className={styles.trainerStar} aria-hidden="true" />
          <span>{trainer.rating}</span>
          <span className={styles.trainerReviews}>({trainer.reviews})</span>
        </div>

        <div className={styles.trainerFooter}>
          <span className={styles.trainerPrice}>{price} / session</span>
          <button
            className={styles.trainerBtn}
            onClick={() => navigate(`/trainer/${trainer.slug}`)}
            aria-label={`View ${trainer.name}'s profile`}
          >
            View Trainer
          </button>
        </div>
      </div>
    </motion.article>
  );
};

/* ══════════════════════════════════════════════════════
   FITNESS PAGE
══════════════════════════════════════════════════════ */
const Fitness = () => {
  const categoriesRef = useRef(null);
  const { gyms, trainers, experiences, cities, loading } = useFitnessData();

  /* Scroll to categories when hero CTA is clicked */
  const scrollToCategories = () => {
    document
      .getElementById("fitness-categories")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* ── SEO ── */}
      <Helmet>
        <title>Fitness — Gyms, Trainers & Fitness Classes | Gymssy</title>
        <meta
          name="description"
          content="Discover gyms, personal trainers, CrossFit, Pilates, HIIT and fitness classes near you with Gymssy — India's #1 fitness marketplace."
        />
        <meta
          property="og:title"
          content="Fitness on Gymssy — India's #1 Fitness Marketplace"
        />
        <meta
          property="og:description"
          content="Find gyms, trainers and fitness experiences near you."
        />
      </Helmet>

      <main className={styles.page}>
        {/* ══ HERO ══ */}
        <FitnessHero onExploreClick={scrollToCategories} />

        {/* ══ SUBCATEGORIES ══ */}
        <FitnessCategories sectionRef={categoriesRef} />

        {/* ══ FEATURED GYMS ══ */}
        <FitnessSection
          id="featured-gyms"
          label="TOP RATED"
          title="Featured"
          titleAccent="Gyms"
          subtitle="Top-rated gyms on Gymssy — verified and reviewed by real members."
          viewAllHref="/discover?category=gyms"
          viewAllText="View All Gyms"
        >
          {loading.gyms ? (
            <SkeletonRow count={4} variant="gym" />
          ) : gyms.length === 0 ? (
            <EmptyState message="No gyms available right now. Check back soon." />
          ) : (
            <div
              className={styles.scrollRow}
              role="list"
              aria-label="Featured gyms"
            >
              {gyms.map((gym, index) => (
                <div key={gym.id} className={styles.scrollItem} role="listitem">
                  <GymCard gym={gym} index={index} />
                </div>
              ))}
            </div>
          )}
        </FitnessSection>

        {/* ══ TRAINERS ══ */}
        <FitnessSection
          id="top-trainers"
          label="EXPERT COACHES"
          title="Top Personal"
          titleAccent="Trainers"
          subtitle="Train with experts who understand your goals and deliver results."
          viewAllHref="/discover?category=trainers"
          viewAllText="View All Trainers"
        >
          {loading.trainers ? (
            <SkeletonRow count={4} variant="trainer" />
          ) : trainers.length === 0 ? (
            <EmptyState message="No trainers available right now." />
          ) : (
            <div
              className={styles.trainersGrid}
              role="list"
              aria-label="Top personal trainers"
            >
              {trainers.map((trainer, index) => (
                <div key={trainer.id} role="listitem">
                  <FitnessTrainerCard trainer={trainer} index={index} />
                </div>
              ))}
            </div>
          )}
        </FitnessSection>

        {/* ══ TRENDING EXPERIENCES ══ */}
        <FitnessSection
          id="trending-experiences"
          label="HOT RIGHT NOW"
          title="Trending Fitness"
          titleAccent="Experiences"
          subtitle="Popular classes and experiences people are booking right now."
          viewAllHref="/discover?sort=trending"
          viewAllText="View All"
        >
          {loading.experiences ? (
            <SkeletonRow count={3} variant="experience" />
          ) : experiences.length === 0 ? (
            <EmptyState message="No trending experiences right now." />
          ) : (
            <div
              className={styles.experiencesGrid}
              role="list"
              aria-label="Trending fitness experiences"
            >
              {experiences.map((exp, index) => (
                <div key={exp.id} role="listitem">
                  <ExperienceCard exp={exp} index={index} />
                </div>
              ))}
            </div>
          )}
        </FitnessSection>

        {/* ══ BENEFITS ══ */}
        <FitnessBenefits />

        {/* ══ FITNESS GOALS ══ */}
        <FitnessGoals />

        {/* ══ CITIES ══ */}
        <FitnessCities cities={cities} loading={loading} />
      </main>
    </>
  );
};

/* ── Empty state ── */
const EmptyState = ({ message }) => (
  <div className={styles.emptyState} role="status" aria-live="polite">
    <p>{message}</p>
  </div>
);

export default Fitness;
