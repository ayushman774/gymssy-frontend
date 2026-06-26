import React, { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FiChevronRight,
  FiZap,
  FiShield,
  FiUsers,
  FiClock,
  FiTrendingUp,
  FiStar,
} from "react-icons/fi";
import { MdFitnessCenter } from "react-icons/md";

import SearchBar from "../../components/SearchBar/SearchBar";
import FilterChips from "../../components/FilterChips/FilterChips";
import GymCard from "../../components/GymCard/GymCard";
import GymDetailsModal from "../../components/GymDetailsModal/GymDetailsModal";
import MapSection from "../../components/MapSection/MapSection";
import LocationsFAQ from "../../components/LocationsFAQ/LocationsFAQ";
import styles from "./GymsNearYouPage.module.css";
import { locationImages } from "../../assets/data/locationImages";
import { gymsData, filterOptions } from "../../data/gymsData";

gsap.registerPlugin(ScrollTrigger);

// ─── Why Choose Data ──────────────────────────────────────────────────────────
const whyFeatures = [
  {
    icon: <MdFitnessCenter />,
    title: "Premium Equipment",
    description:
      "Every branch is fitted with world-class machines, free weights, and functional training rigs sourced from the industry's top brands.",
  },
  {
    icon: <FiStar />,
    title: "Certified Trainers",
    description:
      "Our coaches hold the highest industry certifications and bring years of real-world transformation experience.",
  },
  {
    icon: <FiClock />,
    title: "24/7 Access",
    description:
      "Train on your schedule. Select locations never close — because peak performance doesn't follow business hours.",
  },
  {
    icon: <FiUsers />,
    title: "Group Classes",
    description:
      "50+ weekly sessions spanning HIIT, yoga, boxing, pilates, and more. Community training that keeps you accountable.",
  },
  {
    icon: <FiShield />,
    title: "Modern Facilities",
    description:
      "Luxury changing rooms, recovery suites, and pristine training floors maintained to the highest standards.",
  },
  {
    icon: <FiZap />,
    title: "Safe Environment",
    description:
      "Full-time staff, advanced security, and a welcoming culture that makes every member feel respected.",
  },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
const GymsNearYouPage = () => {
  const headerRef = useRef(null);
  const headerBgRef = useRef(null);
  const whyCardsRef = useRef([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [selectedGym, setSelectedGym] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [highlightedGymId, setHighlightedGymId] = useState(null);

  // Filtered gyms
  const filteredGyms = useMemo(() => {
    let result = gymsData;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.city.toLowerCase().includes(q) ||
          g.address.toLowerCase().includes(q),
      );
    }

    if (activeFilters.length > 0) {
      result = result.filter((g) =>
        activeFilters.every((f) => g.tags.includes(f)),
      );
    }

    return result;
  }, [searchQuery, activeFilters]);

  const handleOpenModal = (gym) => {
    setSelectedGym(gym);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedGym(null), 300);
  };

  const handleMapMarkerClick = (gym) => {
    setHighlightedGymId(gym.id);
    setSelectedGym(gym);
    setModalOpen(true);
    setTimeout(() => setHighlightedGymId(null), 2000);
  };

  // Header parallax
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!headerBgRef.current) return;
      gsap.to(headerBgRef.current, {
        yPercent: 25,
        ease: "none",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  // Why cards stagger
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = whyCardsRef.current.filter(Boolean);
      if (!cards.length) return;
      gsap.fromTo(
        cards,
        { y: 55, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cards[0],
            start: "top 82%",
            once: true,
          },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <main className={styles.page}>
      {/* ── PAGE BANNER ──────────────────────────────────────── */}
      <section ref={headerRef} className={styles.pageHeader}>
        <div ref={headerBgRef} className={styles.headerBg}>
          <img
            src={locationImages.pageHeader}
            alt="Premium gym interior"
            className={styles.headerBgImage}
            loading="eager"
          />
        </div>
        <div className={styles.headerOverlay} />
        <div className={styles.headerGlow} />

        <div className={styles.headerContent}>

          <motion.div
            className={styles.headerText}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
          >
            <motion.span
              className={styles.headerEyebrow}
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              animate={{ opacity: 1, letterSpacing: "0.4em" }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              WORLD-CLASS FACILITIES
            </motion.span>
            <h1 className={styles.headerTitle}>FIND A GYM NEAR YOU</h1>
            <p className={styles.headerSubtitle}>
              Discover world-class facilities, expert coaching, and a fitness
              community that helps you achieve more.
            </p>
          </motion.div>
        </div>

        <div className={styles.scrollIndicator}>
          <span className={styles.scrollLine} />
        </div>
      </section>

      {/* ── SEARCH + FILTERS ─────────────────────────────────── */}
      <section className={styles.searchSection}>
        <div className={styles.sectionContainer}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <FilterChips
              options={filterOptions}
              activeFilters={activeFilters}
              onChange={setActiveFilters}
            />
          </motion.div>

          {/* Results count */}
          <motion.div
            className={styles.resultsCount}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <span className={styles.resultsNumber}>{filteredGyms.length}</span>
            <span className={styles.resultsText}>
              {filteredGyms.length === 1 ? "location found" : "locations found"}
            </span>
            {(searchQuery || activeFilters.length > 0) && (
              <button
                className={styles.clearAll}
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilters([]);
                }}
              >
                Clear all
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── GYM CARDS GRID ───────────────────────────────────── */}
      <section className={styles.gridSection}>
        <div className={styles.sectionContainer}>
          <AnimatePresence mode="wait">
            {filteredGyms.length > 0 ? (
              <motion.div
                key="grid"
                className={styles.gymsGrid}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {filteredGyms.map((gym, index) => (
                  <GymCard
                    key={gym.id}
                    gym={gym}
                    index={index}
                    isHighlighted={highlightedGymId === gym.id}
                    onViewDetails={() => handleOpenModal(gym)}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                className={styles.emptyState}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <span className={styles.emptyIcon}>
                  <MdFitnessCenter />
                </span>
                <h3 className={styles.emptyTitle}>No locations found</h3>
                <p className={styles.emptyText}>
                  Try adjusting your search or clearing some filters.
                </p>
                <button
                  className={styles.emptyBtn}
                  onClick={() => {
                    setSearchQuery("");
                    setActiveFilters([]);
                  }}
                >
                  Show All Locations
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── MAP SECTION ──────────────────────────────────────── */}
      <section className={styles.mapSection}>
        <div className={styles.sectionContainer}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <span className={styles.sectionEyebrow}>EXPLORE LOCATIONS</span>
            <h2 className={styles.sectionTitle}>
              Find Us on the <span className={styles.accentText}>Map</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Click a marker to explore that branch's details.
            </p>
          </motion.div>

          <MapSection
            gyms={filteredGyms}
            onMarkerClick={handleMapMarkerClick}
          />
        </div>
      </section>

      {/* ── WHY OUR LOCATIONS ────────────────────────────────── */}
      <section className={styles.whySection}>
        <div className={styles.sectionContainer}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <span className={styles.sectionEyebrow}>THE APEX DIFFERENCE</span>
            <h2 className={styles.sectionTitle}>
              Why Choose Our{" "}
              <span className={styles.accentText}>Locations</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Every APEX branch delivers the same uncompromising standard of
              excellence.
            </p>
          </motion.div>

          <div className={styles.whyGrid}>
            {whyFeatures.map((feature, index) => (
              <div
                key={feature.title}
                ref={(el) => (whyCardsRef.current[index] = el)}
                className={styles.whyCard}
              >
                <div className={styles.whyIconWrapper}>
                  <span className={styles.whyIcon}>{feature.icon}</span>
                </div>
                <div className={styles.whyContent}>
                  <h3 className={styles.whyTitle}>{feature.title}</h3>
                  <p className={styles.whyDescription}>{feature.description}</p>
                </div>
                <div className={styles.whyCardAccent} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className={styles.faqSection}>
        <div className={styles.sectionContainer}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <span className={styles.sectionEyebrow}>COMMON QUESTIONS</span>
            <h2 className={styles.sectionTitle}>
              Frequently Asked{" "}
              <span className={styles.accentText}>Questions</span>
            </h2>
          </motion.div>

          <LocationsFAQ />
        </div>
      </section>

      {/* ── MODAL ────────────────────────────────────────────── */}
      <GymDetailsModal
        gym={selectedGym}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />
    </main>
  );
};

export default GymsNearYouPage;
