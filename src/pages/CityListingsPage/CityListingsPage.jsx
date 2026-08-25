// src/pages/CityListingsPage/CityListingsPage.jsx

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiFilter,
  FiX,
  FiStar,
  FiMapPin,
  FiChevronRight,
  FiAlertCircle,
  FiRefreshCw,
  FiHome,
  FiSliders,
} from "react-icons/fi";
import { MdLocalFireDepartment } from "react-icons/md";

import useCityListings from "../../hooks/useCityListings";
import ListingCard from "../../components/CityListings/ListingCard/ListingCard";
import styles from "./CityListingsPage.module.css";

/* ══════════════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════════════ */

/* Marketplace categories matching the Gymssy hierarchy */
const CATEGORY_OPTIONS = [
  { label: "All", value: "" },
  /* FITNESS */
  { label: "Gyms", value: "gyms" },
  { label: "Personal Trainers", value: "personal-trainers" },
  { label: "CrossFit", value: "crossfit" },
  { label: "Pilates", value: "pilates" },
  { label: "Cardio", value: "cardio" },
  { label: "HIIT", value: "hiit" },
  { label: "Fitness Classes", value: "fitness-classes" },
  /* WELLNESS */
  { label: "Yoga", value: "yoga" },
  { label: "Meditation", value: "meditation" },
  { label: "Spa & Recovery", value: "spa-recovery" },
  { label: "Nutrition", value: "nutrition" },
  { label: "Wellness Centers", value: "wellness-centers" },
  { label: "Recovery", value: "recovery" },
  { label: "Mobility", value: "mobility" },
  /* SPORTS */
  { label: "Swimming", value: "swimming" },
  { label: "Martial Arts", value: "martial-arts" },
  { label: "Boxing", value: "boxing" },
  { label: "Sports Coaching", value: "sports-coaching" },
  { label: "Running Clubs", value: "running-clubs" },
  { label: "Tennis", value: "tennis" },
  { label: "Badminton", value: "badminton" },
  { label: "Football", value: "football" },
];

const SORT_OPTIONS = [
  { label: "Recommended", value: "recommended" },
  { label: "Top Rated", value: "rating" },
  { label: "Most Reviewed", value: "reviews" },
  { label: "Price: Low", value: "price_asc" },
  { label: "Price: High", value: "price_desc" },
];

const RATING_OPTIONS = [
  { label: "Any Rating", value: 0 },
  { label: "4.5+", value: 4.5 },
  { label: "4.0+", value: 4.0 },
  { label: "3.5+", value: 3.5 },
];

/* ══════════════════════════════════════════════════════════════
   SORT HELPER (frontend-only — backend doesn't support sort yet)
══════════════════════════════════════════════════════════════ */
const sortListings = (listings, sortBy) => {
  const copy = [...listings];
  switch (sortBy) {
    case "rating":
      return copy.sort((a, b) => b.rating - a.rating);
    case "reviews":
      return copy.sort((a, b) => b.reviewCount - a.reviewCount);
    case "price_asc":
      return copy.sort(
        (a, b) => (a.priceFrom ?? Infinity) - (b.priceFrom ?? Infinity),
      );
    case "price_desc":
      return copy.sort((a, b) => (b.priceFrom ?? 0) - (a.priceFrom ?? 0));
    default:
      return copy; // recommended = API order
  }
};

/* ══════════════════════════════════════════════════════════════
   SKELETON CARD
══════════════════════════════════════════════════════════════ */
const SkeletonCard = () => (
  <div className={styles.skeletonCard} aria-hidden="true">
    <div className={styles.skeletonImg} />
    <div className={styles.skeletonBody}>
      <div
        className={styles.skeletonLine}
        style={{ width: "30%", height: 13 }}
      />
      <div
        className={styles.skeletonLine}
        style={{ width: "70%", height: 20, marginTop: 6 }}
      />
      <div
        className={styles.skeletonLine}
        style={{ width: "55%", height: 13, marginTop: 8 }}
      />
      <div className={styles.skeletonMeta}>
        <div
          className={styles.skeletonLine}
          style={{ width: 60, height: 13 }}
        />
        <div
          className={styles.skeletonLine}
          style={{ width: 60, height: 13 }}
        />
      </div>
      <div className={styles.skeletonFooter}>
        <div
          className={styles.skeletonLine}
          style={{ width: "35%", height: 18 }}
        />
        <div className={styles.skeletonBtn} />
      </div>
    </div>
  </div>
);

const SkeletonGrid = ({ count = 6 }) => (
  <div
    className={styles.listingsGrid}
    aria-label="Loading listings"
    aria-busy="true"
  >
    {Array.from({ length: count }, (_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

/* ══════════════════════════════════════════════════════════════
   ERROR STATE
══════════════════════════════════════════════════════════════ */
const ErrorState = ({ message, onRetry }) => (
  <motion.div
    className={styles.errorState}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    role="alert"
  >
    <FiAlertCircle className={styles.errorIcon} aria-hidden="true" />
    <h3 className={styles.errorTitle}>Unable to load listings</h3>
    <p className={styles.errorMsg}>
      {message ?? "Something went wrong. Please try again."}
    </p>
    <button className={styles.retryBtn} onClick={onRetry}>
      <FiRefreshCw size={14} aria-hidden="true" />
      Try Again
    </button>
  </motion.div>
);

/* ══════════════════════════════════════════════════════════════
   EMPTY STATE
══════════════════════════════════════════════════════════════ */
const EmptyState = ({ cityName, category }) => (
  <motion.div
    className={styles.emptyState}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    role="status"
  >
    <span className={styles.emptyEmoji} aria-hidden="true">
      🏙️
    </span>
    <h3 className={styles.emptyTitle}>
      No fitness places found
      {category ? ` for "${category}"` : ""} in {cityName}
    </h3>
    <p className={styles.emptyMsg}>
      We're growing fast — new listings are added every week.
    </p>
    <Link to="/cities" className={styles.emptyBtn}>
      Explore All Cities
    </Link>
  </motion.div>
);

/* ══════════════════════════════════════════════════════════════
   MOBILE FILTER DRAWER
══════════════════════════════════════════════════════════════ */
const FilterDrawer = ({
  open,
  onClose,
  selectedCategory,
  onCategoryChange,
  selectedRating,
  onRatingChange,
  openNow,
  onOpenNowChange,
  onReset,
}) => (
  <AnimatePresence>
    {open && (
      <>
        {/* Backdrop */}
        <motion.div
          className={styles.drawerBackdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Drawer */}
        <motion.div
          className={styles.drawer}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 280 }}
          role="dialog"
          aria-modal="true"
          aria-label="Filter options"
        >
          <div className={styles.drawerHeader}>
            <h3 className={styles.drawerTitle}>Filters</h3>
            <button
              className={styles.drawerClose}
              onClick={onClose}
              aria-label="Close filters"
            >
              <FiX size={18} />
            </button>
          </div>

          <div className={styles.drawerBody}>
            <FilterPanel
              selectedCategory={selectedCategory}
              onCategoryChange={onCategoryChange}
              selectedRating={selectedRating}
              onRatingChange={onRatingChange}
              openNow={openNow}
              onOpenNowChange={onOpenNowChange}
            />
          </div>

          <div className={styles.drawerFooter}>
            <button className={styles.resetBtn} onClick={onReset}>
              Reset All
            </button>
            <button className={styles.applyBtn} onClick={onClose}>
              Apply Filters
            </button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

/* ══════════════════════════════════════════════════════════════
   FILTER PANEL (shared by sidebar + drawer)
══════════════════════════════════════════════════════════════ */
const FilterPanel = ({
  selectedCategory,
  onCategoryChange,
  selectedRating,
  onRatingChange,
  openNow,
  onOpenNowChange,
}) => (
  <div className={styles.filterPanel}>
    {/* Category */}
    <div className={styles.filterGroup}>
      <h4 className={styles.filterGroupTitle}>Category</h4>
      <div className={styles.categoryList}>
        {CATEGORY_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={`${styles.categoryBtn} ${
              selectedCategory === opt.value ? styles.categoryBtnActive : ""
            }`}
            onClick={() => onCategoryChange(opt.value)}
            aria-pressed={selectedCategory === opt.value}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>

    {/* Rating */}
    <div className={styles.filterGroup}>
      <h4 className={styles.filterGroupTitle}>Minimum Rating</h4>
      <div className={styles.ratingOptions}>
        {RATING_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={`${styles.ratingBtn} ${
              selectedRating === opt.value ? styles.ratingBtnActive : ""
            }`}
            onClick={() => onRatingChange(opt.value)}
            aria-pressed={selectedRating === opt.value}
          >
            {opt.value > 0 && (
              <FiStar
                size={11}
                className={styles.ratingBtnStar}
                aria-hidden="true"
              />
            )}
            {opt.label}
          </button>
        ))}
      </div>
    </div>

    {/* Open Now */}
    <div className={styles.filterGroup}>
      <label className={styles.toggleRow}>
        <span className={styles.toggleLabel}>Open Now</span>
        <button
          className={`${styles.toggle} ${openNow ? styles.toggleOn : ""}`}
          onClick={() => onOpenNowChange(!openNow)}
          role="switch"
          aria-checked={openNow}
          aria-label="Show only open listings"
        >
          <span className={styles.toggleThumb} />
        </button>
      </label>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════
   CITY LISTINGS PAGE — Main Component
══════════════════════════════════════════════════════════════ */
const CityListingsPage = () => {
  const { citySlug } = useParams();
  const navigate = useNavigate();

  /* ── Filter/UI state ── */
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [openNow, setOpenNow] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDrawer, setShowDrawer] = useState(false);
  const [showStickyFilter, setShowStickyFilter] = useState(false);

  const searchRef = useRef(null);

  /* ── API — category triggers a new backend fetch ── */
  const { listings, cityInfo, total, loading, error, refetch } =
    useCityListings(citySlug, selectedCategory);

  /* ── Sticky filter bar on scroll ── */
  useEffect(() => {
    const onScroll = () => setShowStickyFilter(window.scrollY > 340);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Reset to page top when city changes ── */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setSelectedCategory("");
    setSearchQuery("");
    setSortBy("recommended");
    setSelectedRating(0);
    setOpenNow(false);
  }, [citySlug]);

  /* ── Derived city name ── */
  const cityName =
    cityInfo?.name ??
    citySlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  /* ── Frontend filters applied on top of API results ── */
  const filteredListings = useMemo(() => {
    let result = [...listings];

    /* Search */
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.category.toLowerCase().includes(q) ||
          (typeof l.location === "object"
            ? l.location.area?.toLowerCase().includes(q)
            : l.location?.toLowerCase().includes(q)),
      );
    }

    /* Rating */
    if (selectedRating > 0) {
      result = result.filter((l) => l.rating >= selectedRating);
    }

    /* Open Now */
    if (openNow) {
      result = result.filter((l) => l.isOpen);
    }

    /* Sort */
    return sortListings(result, sortBy);
  }, [listings, searchQuery, selectedRating, openNow, sortBy]);

  /* ── Active filter count (for mobile badge) ── */
  const activeFilterCount = [
    selectedCategory !== "",
    selectedRating > 0,
    openNow,
  ].filter(Boolean).length;

  /* ── Reset all filters ── */
  const handleReset = useCallback(() => {
    setSelectedCategory("");
    setSelectedRating(0);
    setOpenNow(false);
    setSortBy("recommended");
    setSearchQuery("");
  }, []);

  /* ── Category change — triggers new API call ── */
  const handleCategoryChange = useCallback((value) => {
    setSelectedCategory(value);
  }, []);

  /* ══ RENDER ══ */
  return (
    <>
      <Helmet>
        <title>{`Fitness & Wellness in ${cityName} | Gymssy`}</title>
        <meta
          name="description"
          content={`Discover gyms, yoga studios, fitness centers, wellness places and sports facilities in ${cityName}. Browse ${total}+ listings on Gymssy.`}
        />
      </Helmet>

      <div className={styles.page}>
        {/* ── Backgrounds ── */}
        <div className={styles.bgBase} aria-hidden="true" />
        <div className={styles.bgGradient} aria-hidden="true" />

        {/* ════════════════════════════════════════════════════
            HERO
        ════════════════════════════════════════════════════ */}
        <div className={styles.hero}>
          {/* City cover image */}
          {cityInfo?.image?.url && (
            <div className={styles.heroBg} aria-hidden="true">
              <img
                src={cityInfo.image.url}
                alt={cityInfo.image.alt}
                className={styles.heroBgImg}
              />
              <div className={styles.heroBgOverlay} />
            </div>
          )}

          <div className={styles.heroContent}>
            {/* Breadcrumb */}
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              <Link to="/" className={styles.breadcrumbLink}>
                <FiHome size={12} aria-hidden="true" />
                Home
              </Link>
              <FiChevronRight
                size={12}
                className={styles.breadcrumbSep}
                aria-hidden="true"
              />
              <Link to="/cities" className={styles.breadcrumbLink}>
                Cities
              </Link>
              <FiChevronRight
                size={12}
                className={styles.breadcrumbSep}
                aria-hidden="true"
              />
              <span className={styles.breadcrumbCurrent} aria-current="page">
                {cityName}
              </span>
            </nav>

            {/* City name + subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <h1 className={styles.heroTitle}>{cityName}</h1>

              <p className={styles.heroSubtitle}>
                Explore gyms, fitness studios, wellness centers, trainers and
                sports experiences in {cityName}.
              </p>

              {/* Listing count pill */}
              {!loading && !error && (
                <motion.div
                  className={styles.heroCount}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <span className={styles.heroCountDot} aria-hidden="true" />
                  {total.toLocaleString("en-IN")} fitness &amp; wellness places
                </motion.div>
              )}

              {cityInfo?.state && (
                <div className={styles.heroLocation}>
                  <FiMapPin size={13} aria-hidden="true" />
                  {cityInfo.state}, {cityInfo.country}
                </div>
              )}
            </motion.div>

            {/* Search bar */}
            <motion.div
              className={styles.searchWrap}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <FiSearch className={styles.searchIcon} aria-hidden="true" />
              <input
                ref={searchRef}
                type="search"
                className={styles.searchInput}
                placeholder="Search gyms, yoga, trainers, sports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search listings"
              />
              {searchQuery && (
                <button
                  className={styles.searchClear}
                  onClick={() => {
                    setSearchQuery("");
                    searchRef.current?.focus();
                  }}
                  aria-label="Clear search"
                >
                  <FiX size={14} />
                </button>
              )}
            </motion.div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════
            STICKY CATEGORY STRIP (desktop — appears on scroll)
        ════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {showStickyFilter && (
            <motion.div
              className={styles.stickyStrip}
              initial={{ y: -60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -60, opacity: 0 }}
              transition={{ duration: 0.3 }}
              aria-label="Quick category filter"
            >
              <div className={styles.stickyStripInner}>
                {CATEGORY_OPTIONS.slice(0, 10).map((opt) => (
                  <button
                    key={opt.value}
                    className={`${styles.stripBtn} ${
                      selectedCategory === opt.value
                        ? styles.stripBtnActive
                        : ""
                    }`}
                    onClick={() => handleCategoryChange(opt.value)}
                    aria-pressed={selectedCategory === opt.value}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ════════════════════════════════════════════════════
            MAIN CONTENT — sidebar + grid
        ════════════════════════════════════════════════════ */}
        <div className={styles.mainWrap}>
          {/* ── SIDEBAR (desktop) ── */}
          <aside className={styles.sidebar} aria-label="Filters">
            <div className={styles.sidebarInner}>
              <div className={styles.sidebarHeader}>
                <FiSliders size={14} aria-hidden="true" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <button
                    className={styles.sidebarReset}
                    onClick={handleReset}
                    aria-label="Reset all filters"
                  >
                    Reset
                  </button>
                )}
              </div>

              <FilterPanel
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                selectedRating={selectedRating}
                onRatingChange={setSelectedRating}
                openNow={openNow}
                onOpenNowChange={setOpenNow}
              />
            </div>
          </aside>

          {/* ── RIGHT COLUMN ── */}
          <div className={styles.rightCol}>
            {/* Results header */}
            <div className={styles.resultsHeader}>
              <div className={styles.resultsLeft}>
                <h2 className={styles.resultsTitle}>
                  {selectedCategory
                    ? CATEGORY_OPTIONS.find((o) => o.value === selectedCategory)
                        ?.label
                    : "Fitness & Wellness"}{" "}
                  in {cityName}
                </h2>
                <span className={styles.resultsCount}>
                  {loading
                    ? "Loading..."
                    : `${filteredListings.length.toLocaleString("en-IN")} result${
                        filteredListings.length !== 1 ? "s" : ""
                      }`}
                </span>
              </div>

              <div className={styles.resultsRight}>
                {/* Mobile filter button */}
                <button
                  className={styles.mobileFilterBtn}
                  onClick={() => setShowDrawer(true)}
                  aria-label={`Open filters${activeFilterCount > 0 ? ` (${activeFilterCount} active)` : ""}`}
                >
                  <FiFilter size={14} aria-hidden="true" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className={styles.filterBadge} aria-hidden="true">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Sort */}
                <div className={styles.sortWrap}>
                  <label htmlFor="sort-select" className={styles.sortLabel}>
                    Sort:
                  </label>
                  <select
                    id="sort-select"
                    className={styles.sortSelect}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label="Sort listings"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {(selectedCategory || selectedRating > 0 || openNow) && (
              <div className={styles.activeFilters} aria-label="Active filters">
                {selectedCategory && (
                  <button
                    className={styles.filterChip}
                    onClick={() => setSelectedCategory("")}
                    aria-label={`Remove category filter: ${selectedCategory}`}
                  >
                    {
                      CATEGORY_OPTIONS.find((o) => o.value === selectedCategory)
                        ?.label
                    }
                    <FiX size={11} aria-hidden="true" />
                  </button>
                )}
                {selectedRating > 0 && (
                  <button
                    className={styles.filterChip}
                    onClick={() => setSelectedRating(0)}
                    aria-label="Remove rating filter"
                  >
                    <FiStar size={11} aria-hidden="true" />
                    {selectedRating}+
                    <FiX size={11} aria-hidden="true" />
                  </button>
                )}
                {openNow && (
                  <button
                    className={styles.filterChip}
                    onClick={() => setOpenNow(false)}
                    aria-label="Remove open now filter"
                  >
                    Open Now
                    <FiX size={11} aria-hidden="true" />
                  </button>
                )}
                <button className={styles.clearAllChip} onClick={handleReset}>
                  Clear all
                </button>
              </div>
            )}

            {/* ── CONTENT STATES ── */}

            {/* Loading */}
            {loading && <SkeletonGrid count={6} />}

            {/* Error */}
            {!loading && error && (
              <ErrorState message={error} onRetry={refetch} />
            )}

            {/* Empty */}
            {!loading && !error && filteredListings.length === 0 && (
              <EmptyState
                cityName={cityName}
                category={
                  selectedCategory
                    ? CATEGORY_OPTIONS.find((o) => o.value === selectedCategory)
                        ?.label
                    : ""
                }
              />
            )}

            {/* Success — listing grid */}
            {!loading && !error && filteredListings.length > 0 && (
              <motion.div
                className={styles.listingsGrid}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                role="list"
                aria-label={`Fitness listings in ${cityName}`}
              >
                {filteredListings.map((listing, index) => (
                  <div key={listing.id} role="listitem">
                    <ListingCard listing={listing} index={index} />
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* ── Mobile filter drawer ── */}
        <FilterDrawer
          open={showDrawer}
          onClose={() => setShowDrawer(false)}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          selectedRating={selectedRating}
          onRatingChange={setSelectedRating}
          openNow={openNow}
          onOpenNowChange={setOpenNow}
          onReset={handleReset}
        />
      </div>
    </>
  );
};

export default CityListingsPage;
