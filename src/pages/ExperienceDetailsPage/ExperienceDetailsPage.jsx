import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiClock,
  FiStar,
  FiUsers,
  FiActivity,
  FiRefreshCw,
} from "react-icons/fi";

import { fetchExperienceBySlug } from "../../services/categoryService";
import SimilarExperiences from "./SimilarExperiences";
import styles from "./ExperienceDetailsPage.module.css";

const ExperienceDetailsPage = () => {
  const { slug } = useParams();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      setExperience(null);

      try {
        const data = await fetchExperienceBySlug(slug);
        if (!cancelled) setExperience(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message?.startsWith("API 404:")
              ? "not-found"
              : "Unable to load this experience.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [slug, retryKey]);

  if (loading) {
    return (
      <main className={styles.state} role="status">
        Loading experience details...
      </main>
    );
  }

  if (error || !experience) {
    return (
      <main className={styles.state}>
        <h1>
          {error === "not-found" || (!experience && !error)
            ? "Experience not found"
            : "Something went wrong"}
        </h1>
        <p>
          {error === "not-found"
            ? "This experience is unavailable or no longer exists."
            : error || "Experience information is unavailable."}
        </p>
        <div className={styles.actions}>
          {error !== "not-found" && (
            <button
              className={styles.primaryButton}
              onClick={() => setRetryKey((value) => value + 1)}
            >
              <FiRefreshCw /> Try Again
            </button>
          )}
          <Link to="/#trending" className={styles.secondaryButton}>
            Back to Experiences
          </Link>
        </div>
      </main>
    );
  }

  const duration = Number(experience.duration);
  const durationLabel = Number.isFinite(duration)
    ? duration >= 60
      ? `${Math.floor(duration / 60)} hr${
          duration % 60 ? ` ${duration % 60} min` : ""
        }`
      : `${duration} min`
    : experience.duration || "Not specified";

  const imageUrl = experience.image?.url || "";
  const price = Number(experience.priceFrom);

  return (
    <main className={styles.page}>
      <Helmet>
        <title>{experience.title} | Gymssy</title>
        <meta
          name="description"
          content={`Explore ${experience.title} on Gymssy. View experience details and pricing.`}
        />
      </Helmet>

      <div className={styles.container}>
        <Link to="/#trending" className={styles.backLink}>
          <FiArrowLeft aria-hidden="true" />
          Back to Experiences
        </Link>

        <motion.div
          className={styles.layout}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.imagePanel}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={experience.image?.alt || experience.title}
                className={styles.image}
              />
            ) : (
              <div className={styles.imagePlaceholder}>
                <FiActivity aria-hidden="true" />
                <span>Experience image unavailable</span>
              </div>
            )}

            {experience.trending && (
              <span className={styles.trendingBadge}>Trending Experience</span>
            )}
          </div>

          <div className={styles.details}>
            <span className={styles.category}>{experience.category}</span>

            <h1 className={styles.title}>{experience.title}</h1>

            <div className={styles.rating}>
              <FiStar aria-hidden="true" />
              <strong>{experience.rating ?? "N/A"}</strong>
              <span>Experience rating</span>
            </div>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <FiClock aria-hidden="true" />
                <div>
                  <strong>{durationLabel}</strong>
                  <span>Duration</span>
                </div>
              </div>

              <div className={styles.stat}>
                <FiActivity aria-hidden="true" />
                <div>
                  <strong>{experience.level || "All Levels"}</strong>
                  <span>Difficulty</span>
                </div>
              </div>

              <div className={styles.stat}>
                <FiUsers aria-hidden="true" />
                <div>
                  <strong>{experience.spots ?? "N/A"}</strong>
                  <span>Listed spots</span>
                </div>
              </div>
            </div>

            <div className={styles.bookingPanel}>
              <span className={styles.priceLabel}>Starting from</span>

              <div className={styles.price}>
                {Number.isFinite(price)
                  ? `$${price.toLocaleString("en-US")}`
                  : "Contact for pricing"}
              </div>

              <p className={styles.bookingNotice}>
                Online booking for this experience is not available yet. Session
                dates and provider details will be shown when booking is
                enabled.
              </p>

              <button type="button" className={styles.disabledButton} disabled>
                Booking Coming Soon
              </button>
            </div>
          </div>
        </motion.div>
      </div>
      <SimilarExperiences currentExperience={experience} />
    </main>
  );
};

export default ExperienceDetailsPage;
