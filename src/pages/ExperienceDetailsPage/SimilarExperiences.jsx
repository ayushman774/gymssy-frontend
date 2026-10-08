import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Navigation } from "swiper/modules";
import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiStar,
  FiRefreshCw,
} from "react-icons/fi";

import "swiper/css";

import { fetchTrendingExperiences } from "../../services/categoryService";
import styles from "./SimilarExperiences.module.css";

const formatDuration = (minutes) => {
  const value = Number(minutes);
  if (!Number.isFinite(value)) return "Duration unavailable";
  if (value < 60) return `${value} min`;
  const hours = Math.floor(value / 60);
  const remaining = value % 60;
  return remaining ? `${hours} hr ${remaining} min` : `${hours} hr`;
};

const SimilarExperiences = ({ currentExperience }) => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [swiper, setSwiper] = useState(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(false);

      try {
        const data = await fetchTrendingExperiences();
        if (!cancelled) {
          setExperiences(Array.isArray(data) ? data : []);
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [retryKey]);

  const similar = useMemo(() => {
    const available = experiences.filter(
      (item) =>
        item.isActive !== false &&
        item.slug &&
        item.slug !== currentExperience.slug,
    );

    const sameCategory = available.filter(
      (item) =>
        item.category?.toLowerCase() ===
        currentExperience.category?.toLowerCase(),
    );

    const otherCategories = available.filter(
      (item) =>
        item.category?.toLowerCase() !==
        currentExperience.category?.toLowerCase(),
    );

    return [...sameCategory, ...otherCategories];
  }, [experiences, currentExperience]);

  const updateNavigation = (instance) => {
    setIsBeginning(instance.isBeginning);
    setIsEnd(instance.isEnd);
  };

  if (!loading && !error && similar.length === 0) {
    return null;
  }

  return (
    <section
      className={styles.section}
      aria-labelledby="similar-experiences-heading"
    >
      <div className={styles.container}>
        <div className={styles.headingRow}>
          <div>
            <span className={styles.eyebrow}>KEEP EXPLORING</span>
            <h2 id="similar-experiences-heading" className={styles.heading}>
              Similar <span>Experiences</span>
            </h2>
            <p className={styles.subtitle}>
              Discover more fitness experiences on Gymssy.
            </p>
          </div>

          {!loading && !error && similar.length > 1 && (
            <div className={styles.controls}>
              <button
                type="button"
                onClick={() => swiper?.slidePrev()}
                disabled={!swiper || isBeginning}
                aria-label="Previous experiences"
              >
                <FiChevronLeft />
              </button>
              <button
                type="button"
                onClick={() => swiper?.slideNext()}
                disabled={!swiper || isEnd}
                aria-label="Next experiences"
              >
                <FiChevronRight />
              </button>
            </div>
          )}
        </div>

        {loading && (
          <div className={styles.loading} role="status">
            Loading similar experiences...
          </div>
        )}

        {error && (
          <div className={styles.loading} role="alert">
            <p>Unable to load similar experiences.</p>
            <button
              type="button"
              className={styles.retry}
              onClick={() => setRetryKey((key) => key + 1)}
            >
              <FiRefreshCw /> Try Again
            </button>
          </div>
        )}

        {!loading && !error && similar.length > 0 && (
          <Swiper
            key={currentExperience.slug}
            modules={[Navigation, A11y]}
            slidesPerView={1}
            slidesPerGroup={1}
            spaceBetween={16}
            watchOverflow
            onSwiper={(instance) => {
              setSwiper(instance);
              updateNavigation(instance);
            }}
            onSlideChange={updateNavigation}
            onResize={updateNavigation}
            breakpoints={{
              640: {
                slidesPerView: 2,
                slidesPerGroup: 2,
                spaceBetween: 16,
              },
              1024: {
                slidesPerView: 4,
                slidesPerGroup: 4,
                spaceBetween: 20,
              },
            }}
            className={styles.swiper}
            aria-label="Similar fitness experiences"
          >
            {similar.map((item) => (
              <SwiperSlide key={item._id || item.slug} className={styles.slide}>
                <article className={styles.card}>
                  <Link
                    to={`/experiences/${encodeURIComponent(item.slug)}`}
                    className={styles.imageLink}
                    aria-label={`View ${item.title}`}
                  >
                    {item.image?.url ? (
                      <img
                        src={item.image.url}
                        alt={item.image.alt || item.title}
                        loading="lazy"
                      />
                    ) : (
                      <div className={styles.placeholder}>
                        Image unavailable
                      </div>
                    )}

                    <span className={styles.category}>{item.category}</span>
                  </Link>

                  <div className={styles.content}>
                    <h3 className={styles.cardTitle}>{item.title}</h3>

                    <div className={styles.meta}>
                      <span>
                        <FiClock />
                        {formatDuration(item.duration)}
                      </span>
                      <span>
                        <FiStar className={styles.star} />
                        {item.rating ?? "N/A"}
                      </span>
                    </div>

                    <p className={styles.level}>{item.level || "All Levels"}</p>

                    <div className={styles.footer}>
                      <div>
                        <small>From</small>
                        <strong>
                          ${Number(item.priceFrom ?? 0).toLocaleString("en-US")}
                        </strong>
                      </div>

                      <Link
                        to={`/experiences/${encodeURIComponent(item.slug)}`}
                        className={styles.viewButton}
                      >
                        View Details <FiArrowRight />
                      </Link>
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default SimilarExperiences;
