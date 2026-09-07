import { useRef } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  FiClock,
  FiUsers,
  FiStar,
  FiArrowRight,
  FiAlertCircle,
} from "react-icons/fi";
import { MdLocalFireDepartment } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import GymCard from "../../components/ui/RecentlyViewedCard/RecentlyViewedCard";
import { SkeletonRow } from "../../components/ui/SkeletonCard/SkeletonCard";
import FitnessSection from "../../components/sections/fitness/FitnessSection/FitnessSection";

import WellnessHero from "../../components/sections/wellness/WellnessHero/WellnessHero";
import WellnessCategories from "../../components/sections/wellness/WellnessCategories/WellnessCategories";
import YogaMindfulness from "../../components/sections/wellness/YogaMindfulness/YogaMindfulness";
import WellnessNutrition from "../../components/sections/wellness/WellnessNutrition/WellnessNutrition";
import WellnessRecovery from "../../components/sections/wellness/WellnessRecovery/WellnessRecovery";
import WellnessGoals from "../../components/sections/wellness/WellnessGoals/WellnessGoals";
// import WellnessCities from "../../components/sections/wellness/WellnessCities/WellnessCities";
import WellnessBenefits from "../../components/sections/wellness/WellnessBenefits/WellnessBenefits";

import useWellnessData from "../../hooks/useWellnessData";
import styles from "./Wellness.module.css";

/* ══════════════════════════════════════════════════════
   WELLNESS EXPERIENCE CARD — unchanged
══════════════════════════════════════════════════════ */
const WellnessExperienceCard = ({ exp, index }) => {
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
            onClick={() => navigate(`/discover?type=wellness`)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            aria-label={`View ${exp.title}`}
          >
            View Experience
            <FiArrowRight aria-hidden="true" />
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};

/* ── Error State ── */
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

/* ── Empty State ── */
const EmptyState = ({ message }) => (
  <div className={styles.emptyState} role="status" aria-live="polite">
    <p>{message}</p>
  </div>
);

/* ══════════════════════════════════════════════════════
   WELLNESS PAGE
══════════════════════════════════════════════════════ */
const Wellness = () => {
  const categoriesRef = useRef(null);

  // ── nutritionists added to destructure ──
  const { centers, experiences, cities, nutritionists, loading, error } =
    useWellnessData();

  const scrollToCategories = () => {
    document
      .getElementById("wellness-categories")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Helmet>
        <title>
          Wellness — Yoga, Meditation & Wellness Experiences | Gymssy
        </title>
        <meta
          name="description"
          content="Discover yoga, meditation, wellness centers, nutrition, recovery and mindful experiences near you with Gymssy — India's #1 fitness and wellness marketplace."
        />
        <meta
          property="og:title"
          content="Wellness on Gymssy — India's #1 Wellness Marketplace"
        />
        <meta
          property="og:description"
          content="Find yoga, meditation, spa, nutrition and wellness experiences near you."
        />
      </Helmet>

      <main className={styles.page}>
        <WellnessHero onExploreClick={scrollToCategories} />

        <WellnessCategories sectionRef={categoriesRef} />

        {/* ══ FEATURED WELLNESS EXPERIENCES — unchanged ══ */}
        <FitnessSection
          id="featured-wellness-experiences"
          label="HIGHLY RATED"
          title="Featured Wellness"
          titleAccent="Experiences"
          subtitle="Discover highly rated wellness experiences on Gymssy."
          viewAllHref="/discover?type=wellness"
          viewAllText="View All"
          neonColor="#39ff14"
        >
          {loading.experiences ? (
            <SkeletonRow count={3} variant="experience" />
          ) : error.experiences ? (
            <ErrorState message="Unable to load wellness experiences. Please try again." />
          ) : experiences.length === 0 ? (
            <EmptyState message="No wellness experiences available right now." />
          ) : (
            <div
              className={styles.experiencesGrid}
              role="list"
              aria-label="Featured wellness experiences"
            >
              {experiences.map((exp, index) => (
                <div key={exp.id} role="listitem">
                  <WellnessExperienceCard exp={exp} index={index} />
                </div>
              ))}
            </div>
          )}
        </FitnessSection>

        <YogaMindfulness />

        {/* ══ WELLNESS CENTERS — unchanged ══ */}
        <FitnessSection
          id="wellness-centers"
          label="TOP RATED"
          title="Top Wellness"
          titleAccent="Centers"
          subtitle="Explore trusted wellness spaces near you — verified and reviewed by real members."
          viewAllHref="/discover?type=wellness&category=centers"
          viewAllText="View All Centers"
        >
          {loading.centers ? (
            <SkeletonRow count={4} variant="gym" />
          ) : error.centers ? (
            <ErrorState message="Unable to load wellness centers. Please try again." />
          ) : centers.length === 0 ? (
            <EmptyState message="No wellness centers available right now." />
          ) : (
            <div
              className={styles.centersRow}
              role="list"
              aria-label="Top wellness centers"
            >
              {centers.map((center, index) => (
                <div
                  key={center.id}
                  className={styles.centersItem}
                  role="listitem"
                >
                  <GymCard gym={center} index={index} />
                </div>
              ))}
            </div>
          )}
        </FitnessSection>

        {/* ══ NUTRITION — now receives API data ══ */}
        <WellnessNutrition
          nutritionists={nutritionists}
          loading={loading.nutritionists}
          error={error.nutritionists}
        />

        <WellnessRecovery />
        <WellnessGoals />

        {/* ══ TRENDING — unchanged ══ */}
        <FitnessSection
          id="trending-wellness"
          label="TRENDING NOW"
          title="Trending in"
          titleAccent="Wellness"
          subtitle="Wellness experiences people are discovering right now."
          viewAllHref="/discover?type=wellness&sort=trending"
          viewAllText="View All"
          neonColor="#39ff14"
        >
          {loading.experiences ? (
            <SkeletonRow count={3} variant="experience" />
          ) : (
            <div
              className={styles.trendingGrid}
              role="list"
              aria-label="Trending wellness experiences"
            >
              {(experiences.filter((e) => e.trending).length > 0
                ? experiences.filter((e) => e.trending)
                : experiences
              )
                .slice(0, 3)
                .map((exp, index) => (
                  <div key={`trend-${exp.id}`} role="listitem">
                    <WellnessExperienceCard exp={exp} index={index} />
                  </div>
                ))}
            </div>
          )}
        </FitnessSection>

        {/* <WellnessCities cities={cities} loading={loading} /> */}
        <WellnessBenefits />
      </main>
    </>
  );
};

export default Wellness;
