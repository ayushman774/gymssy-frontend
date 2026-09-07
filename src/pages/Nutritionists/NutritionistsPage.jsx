import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { FiSearch, FiRefreshCw, FiAlertCircle } from "react-icons/fi";

import useNutritionists from "../../hooks/useNutritionists";
import NutritionistCard from "../../components/ui/NutritionistCard/NutritionistCard";
import styles from "./NutritionistsPage.module.css";

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

/* ── Skeleton card ── */
const SkeletonCard = () => (
  <div className={styles.skeletonCard} aria-hidden="true">
    <div className={styles.skeletonImg} />
    <div className={styles.skeletonBody}>
      {[
        { w: "40%", h: 10 },
        { w: "68%", h: 20 },
        { w: "85%", h: 13 },
        { w: "52%", h: 13 },
        { w: "75%", h: 30 },
      ].map((s, i) => (
        <div
          key={i}
          className={styles.skeletonLine}
          style={{ width: s.w, height: s.h }}
        />
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════ */
const NutritionistsPage = () => {
  const { nutritionists, loading, error, refetch } = useNutritionists();

  return (
    <>
      <Helmet>
        <title>Nutritionists — Find Nutrition Experts | Gymssy</title>
        <meta
          name="description"
          content="Find certified nutritionists on Gymssy. Get personalized meal plans, weight management support, and expert nutrition coaching."
        />
        <meta property="og:title" content="Nutritionists | Gymssy" />
        <meta
          property="og:description"
          content="Connect with top nutrition experts for personalized wellness guidance."
        />
      </Helmet>

      <div className={styles.page}>
        {/* ════ HERO ════ */}
        <section className={styles.hero} aria-labelledby="np-hero-title">
          <div className={styles.heroBg} aria-hidden="true" />
          <div className={styles.container}>
            <motion.div
              className={styles.heroInner}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <span className={styles.eyebrow}>Nutrition Experts</span>
              <h1 className={styles.heroTitle} id="np-hero-title">
                Find Your{" "}
                <span className={styles.accent}>Nutrition Expert</span>
              </h1>
              <p className={styles.heroSub}>
                Connect with certified nutritionists for personalized meal
                plans, metabolic health, weight management, and sustainable
                lifestyle coaching.
              </p>

              {/* Search — cosmetic / future-ready */}
              <div className={styles.searchWrap} role="search">
                <FiSearch className={styles.searchIcon} aria-hidden="true" />
                <input
                  type="search"
                  className={styles.searchInput}
                  placeholder="Search nutritionists, specialties…"
                  aria-label="Search nutritionists"
                  readOnly
                  title="Search coming soon"
                />
                <span className={styles.searchComingSoon}>Coming soon</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ════ LISTING ════ */}
        <section className={styles.listing} aria-labelledby="np-listing-title">
          <div className={styles.container}>
            <motion.div
              className={styles.listingHeader}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className={styles.listingTitle} id="np-listing-title">
                Featured <span className={styles.accent}>Nutritionists</span>
              </h2>
              {!loading && !error && nutritionists.length > 0 && (
                <p className={styles.listingCount}>
                  {nutritionists.length} expert
                  {nutritionists.length !== 1 ? "s" : ""} available
                </p>
              )}
            </motion.div>

            {/* Loading */}
            {loading && (
              <div
                className={styles.grid}
                aria-label="Loading nutritionists"
                aria-busy="true"
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <motion.div
                className={styles.stateBox}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                role="alert"
              >
                <div className={styles.stateIconWrap} aria-hidden="true">
                  <FiAlertCircle />
                </div>
                <h3 className={styles.stateTitle}>
                  Unable to Load Nutritionists
                </h3>
                <p className={styles.stateText}>
                  Something went wrong. Please try again.
                </p>
                <button className={styles.retryBtn} onClick={refetch}>
                  <FiRefreshCw aria-hidden="true" /> Try Again
                </button>
              </motion.div>
            )}

            {/* Empty */}
            {!loading && !error && nutritionists.length === 0 && (
              <motion.div
                className={styles.stateBox}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
              >
                <h3 className={styles.stateTitle}>No Nutritionists Found</h3>
                <p className={styles.stateText}>
                  Check back soon — we're adding more experts.
                </p>
              </motion.div>
            )}

            {/* Cards */}
            {!loading && !error && nutritionists.length > 0 && (
              <motion.div
                className={styles.grid}
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
              >
                {nutritionists.map((n, i) => (
                  <NutritionistCard
                    key={n._id ?? n.id ?? i}
                    nutritionist={n}
                    index={i}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* ════ BOTTOM CTA STRIP ════ */}
        <section className={styles.ctaStrip} aria-label="Wellness navigation">
          <div className={styles.container}>
            <motion.div
              className={styles.ctaStripInner}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div>
                <p className={styles.ctaStripLabel}>
                  Looking for fitness trainers?
                </p>
                <p className={styles.ctaStripSub}>
                  Browse our certified personal trainers.
                </p>
              </div>
              <a href="/trainers" className={styles.ctaStripLink}>
                View Trainers →
              </a>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default NutritionistsPage;
