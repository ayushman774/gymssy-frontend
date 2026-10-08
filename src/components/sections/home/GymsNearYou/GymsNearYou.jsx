import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { FiAlertCircle, FiArrowRight, FiRefreshCw } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import "swiper/css";
import "swiper/css/navigation";

import SectionLabel from "../../../ui/SectionLabel/SectionLabel";
import useHomeVenues from "../../../../hooks/useHomeVenues.js";
import HomeVenueCard from "./HomeVenueCard.jsx";
import styles from "./GymsNearYou.module.css";

gsap.registerPlugin(ScrollTrigger);

const GymsNearYou = () => {
  const sectionRef = useRef(null);
  const neonLineRef = useRef(null);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const { listings: venues, loading, error, retry } = useHomeVenues();

  const isInView = useInView(sectionRef, {
    once: true,
    margin: "-8% 0px",
  });

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
    { scope: sectionRef, dependencies: [loading, error, venues.length] },
  );

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="gyms-heading"
      id="gyms-near-you"
    >
      <div className={styles.bgGradient} aria-hidden="true" />
      <div className={styles.bgNoise} aria-hidden="true" />

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <SectionLabel text="RECOMMENDED VENUES" variant="light" />
          </motion.div>

          <div className={styles.headlineRow}>
            <motion.h2
              id="gyms-heading"
              className={styles.headline}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Explore Gyms &amp;{" "}
              <span className={styles.headlineAccent}>Fitness Venues</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link to="/gyms-near-you" className={styles.viewAll}>
                Browse by City
                <FiArrowRight className={styles.viewAllIcon} />
              </Link>
            </motion.div>
          </div>

          <motion.p
            className={styles.subCopy}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            Browse published physical venues from across the Gymssy marketplace.
          </motion.p>

          <div className={styles.neonLineWrapper} aria-hidden="true">
            <div ref={neonLineRef} className={styles.neonLine} />
          </div>
        </div>

        {/* Cards */}
        {loading && (
          <div
            className={styles.grid}
            aria-label="Loading recommended venues"
            aria-busy="true"
          >
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className={styles.skeletonCard}
                aria-hidden="true"
              >
                <div className={styles.skeletonImage} />
                <div className={styles.skeletonBody}>
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className={styles.sectionState} role="alert">
            <FiAlertCircle aria-hidden="true" />
            <p>Unable to load venues right now.</p>
            <button type="button" onClick={retry}>
              <FiRefreshCw aria-hidden="true" /> Try Again
            </button>
          </div>
        )}

        {!loading && !error && venues.length > 0 && (
          <div className={styles.carouselWrapper}>
            <div className={styles.carouselControls}>
              <span className={styles.carouselCount}>
                Explore up to 10 recommended venues
              </span>

              <div className={styles.carouselArrows}>
                <button
                  type="button"
                  className={styles.carouselArrow}
                  onClick={() => swiperInstance?.slidePrev()}
                  disabled={!swiperInstance || isBeginning}
                  aria-label="Previous venues"
                >
                  <FiChevronLeft />
                </button>

                <button
                  type="button"
                  className={styles.carouselArrow}
                  onClick={() => swiperInstance?.slideNext()}
                  disabled={!swiperInstance || isEnd}
                  aria-label="Next venues"
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>

            <Swiper
              modules={[Navigation, A11y]}
              className={styles.venueSwiper}
              slidesPerView={1}
              slidesPerGroup={1}
              spaceBetween={16}
              watchOverflow
              onSwiper={(swiper) => {
                setSwiperInstance(swiper);
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              onSlideChange={(swiper) => {
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              onResize={(swiper) => {
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
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
              aria-label="Recommended fitness venues"
            >
              {venues.map((venue) => (
                <SwiperSlide key={venue.id} className={styles.venueSlide}>
                  <div className={styles.cardSlot}>
                    <HomeVenueCard venue={venue} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {!loading && !error && venues.length === 0 && (
          <div className={styles.sectionState} role="status">
            <p>No published venues are available right now.</p>
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          className={styles.bottomCTA}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-5%" }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className={styles.ctaContent}>
            <p className={styles.ctaHeadline}>
              Explore fitness venues by City.
            </p>
            <p className={styles.ctaBody}>
              Filter by location, facilities, price, and more.
            </p>
          </div>
          <div className={styles.ctaActions}>
            <Link to="/gyms-near-you" className={styles.ctaPrimary}>
              <span>Browse Venues</span>
              <FiArrowRight />
            </Link>
            <Link to="/contact" className={styles.ctaSecondary}>
              List Your Gym
            </Link>
          </div>
          <div className={styles.ctaGlow} aria-hidden="true" />
        </motion.div>
      </div>

      <div className={styles.edgeFadeBottom} aria-hidden="true" />
    </section>
  );
};

export default GymsNearYou;
