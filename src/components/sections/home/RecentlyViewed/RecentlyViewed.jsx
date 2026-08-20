import { useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";

/* Swiper */
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, A11y, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";

import RecentlyViewedCard from "../../../ui/RecentlyViewedCard/RecentlyViewedCard";
import SectionLabel from "../../../ui/SectionLabel/SectionLabel";
import { RECENTLY_VIEWED_GYMS } from "../../../../assets/data/recentlyViewedData";
import styles from "./RecentlyViewed.module.css";

gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════════
   RECENTLY VIEWED SECTION
══════════════════════════════════════════════════════ */
const RecentlyViewed = () => {
  const sectionRef = useRef(null);
  const neonLineRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const isInView = useInView(sectionRef, {
    once: true,
    margin: "-8% 0px",
  });

  /* ── GSAP: neon line draw ── */
  useGSAP(
    () => {
      gsap.fromTo(
        neonLineRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        },
      );
    },
    { scope: sectionRef },
  );

  /* ── Swiper nav callbacks ── */
  const handlePrev = useCallback(() => {
    prevRef.current?.click();
  }, []);

  const handleNext = useCallback(() => {
    nextRef.current?.click();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="recently-viewed-heading"
      id="recently-viewed"
    >
      {/* ── Backgrounds ── */}
      <div className={styles.bgGradient} aria-hidden="true" />
      <div className={styles.bgNoise} aria-hidden="true" />

      <div className={styles.container}>
        {/* ══ HEADER ══ */}
        <div className={styles.header}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <SectionLabel text="PICK UP WHERE YOU LEFT OFF" variant="light" />
          </motion.div>

          <div className={styles.headlineRow}>
            <motion.h2
              id="recently-viewed-heading"
              className={styles.headline}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Recently{" "}
              <span className={styles.headlineAccent}>Viewed</span>
            </motion.h2>

            <div className={styles.headerRight}>
              {/* Arrow nav — desktop */}
              <motion.div
                className={styles.arrowNav}
                initial={{ opacity: 0, x: 16 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.35 }}
                aria-hidden="true"
              >
                <button
                  className={`${styles.arrowBtn} ${styles.prevCustom}`}
                  aria-label="Scroll left"
                  onClick={handlePrev}
                >
                  <FiChevronLeft className={styles.arrowIcon} />
                </button>
                <button
                  className={`${styles.arrowBtn} ${styles.nextCustom}`}
                  aria-label="Scroll right"
                  onClick={handleNext}
                >
                  <FiChevronRight className={styles.arrowIcon} />
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Link to="/discover" className={styles.viewAll}>
                  View All
                  <FiArrowRight
                    className={styles.viewAllIcon}
                    aria-hidden="true"
                  />
                </Link>
              </motion.div>
            </div>
          </div>

          <motion.p
            className={styles.subCopy}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            Continue exploring the fitness places you&apos;ve recently viewed.
          </motion.p>

          {/* Neon line */}
          <div className={styles.neonLineWrapper} aria-hidden="true">
            <div ref={neonLineRef} className={styles.neonLine} />
          </div>
        </div>

        {/* ══ HORIZONTAL SCROLL TRACK ══ */}
        <motion.div
          className={styles.swiperWrapper}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <Swiper
            modules={[FreeMode, Navigation, A11y, Mousewheel]}
            spaceBetween={20}
            slidesPerView="auto"
            freeMode={{
              enabled: true,
              momentum: true,
              momentumRatio: 0.6,
              momentumVelocityRatio: 0.6,
            }}
            mousewheel={{
              forceToAxis: true,
              sensitivity: 1,
              releaseOnEdges: true,
            }}
            grabCursor={true}
            navigation={{
              prevEl: `.${styles.prevCustom}`,
              nextEl: `.${styles.nextCustom}`,
            }}
            a11y={{
              prevSlideMessage: "Previous gym",
              nextSlideMessage: "Next gym",
              containerMessage: "Recently viewed gyms carousel",
            }}
            className={styles.swiper}
            watchSlidesProgress={true}
          >
            {RECENTLY_VIEWED_GYMS.map((gym, index) => (
              <SwiperSlide
                key={gym.id}
                className={styles.slide}
                aria-label={`${index + 1} of ${RECENTLY_VIEWED_GYMS.length}`}
              >
                <RecentlyViewedCard gym={gym} index={index} />
              </SwiperSlide>
            ))}

            {/* End spacer slide */}
            <SwiperSlide className={styles.spacerSlide} aria-hidden="true" />
          </Swiper>

          {/* Edge fade — right side */}
          <div className={styles.scrollFadeRight} aria-hidden="true" />
        </motion.div>
      </div>

      {/* ── Edge fades ── */}
      <div className={styles.edgeFadeBottom} aria-hidden="true" />
    </section>
  );
};

export default RecentlyViewed;