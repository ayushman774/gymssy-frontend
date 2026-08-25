/**
 * CategoryListingPage.jsx
 * Route: /category/:slug
 *
 * Fix: CategoryFilters rendered ONCE only.
 * The component itself handles desktop sidebar vs mobile toolbar
 * display via its own internal CSS.
 */

import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { LayoutGrid, ArrowLeft } from "lucide-react";

import useCategoryListing from "../../hooks/useCategoryListing";
import CategoryHero from "../../components/CategoryHero/CategoryHero";
import CategoryFilters from "../../components/CategoryFilters/CategoryFilters";
import CategoryListingGrid from "../../components/CategoryListingGrid/CategoryListingGrid";

import styles from "./CategoryListingPage.module.css";

/* ─────────────────────────────────────────────────────
   Safe string extractor — prevents object-as-child errors
───────────────────────────────────────────────────── */
const safeStr = (val, fallback = "") => {
  if (val === null || val === undefined) return fallback;
  if (typeof val === "string") return val.trim() || fallback;
  if (typeof val === "number") return String(val);
  if (typeof val === "object") {
    return val.name ?? val.title ?? val.label ?? fallback;
  }
  return fallback;
};

const slugToTitle = (slug = "") =>
  slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

/* ─────────────────────────────────────────────────────
   Default filter state
───────────────────────────────────────────────────── */
const DEFAULT_FILTERS = {
  sort: "recommended",
  minRating: null,
  openNow: false,
};

/* ─────────────────────────────────────────────────────
   Client-side filter + sort
───────────────────────────────────────────────────── */
const applyClientFilters = (listings, filters) => {
  let result = [...listings];

  if (filters.minRating !== null) {
    result = result.filter(
      (g) => g.rating != null && Number(g.rating) >= filters.minRating,
    );
  }

  if (filters.openNow) {
    result = result.filter((g) => g.isOpen === true);
  }

  switch (filters.sort) {
    case "rating":
      result.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
      break;
    case "price_asc":
      result.sort(
        (a, b) =>
          (Number(a.price ?? a.priceFrom ?? a.membershipFrom) || Infinity) -
          (Number(b.price ?? b.priceFrom ?? b.membershipFrom) || Infinity),
      );
      break;
    case "price_desc":
      result.sort(
        (a, b) =>
          (Number(b.price ?? b.priceFrom ?? b.membershipFrom) || 0) -
          (Number(a.price ?? a.priceFrom ?? a.membershipFrom) || 0),
      );
      break;
    default:
      break;
  }

  return result;
};

/* ─────────────────────────────────────────────────────
   NOT FOUND
───────────────────────────────────────────────────── */
const CategoryNotFound = () => {
  const navigate = useNavigate();
  return (
    <main className={styles.notFoundPage}>
      <motion.div
        className={styles.notFoundBox}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className={styles.notFoundIcon} aria-hidden="true">
          <LayoutGrid size={32} />
        </div>
        <h1 className={styles.notFoundTitle}>Category Not Found</h1>
        <p className={styles.notFoundText}>
          The category you're looking for doesn't exist or may have moved.
        </p>
        <div className={styles.notFoundBtns}>
          <button className={styles.btnPrimary} onClick={() => navigate(-1)}>
            <ArrowLeft size={15} aria-hidden="true" />
            Go Back
          </button>
          <Link to="/" className={styles.btnGhost}>
            Explore Categories
          </Link>
        </div>
      </motion.div>
    </main>
  );
};

/* ══════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════ */
const CategoryListingPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  /* ── Fetch ── */
  const { category, listings, total, loading, error, retry } =
    useCategoryListing(slug);

  /* ── Safe page title — always a plain string ── */
  const pageTitle = safeStr(category?.name, slugToTitle(slug ?? ""));

  /* ── Safe description — always a plain string ── */
  const pageDesc = safeStr(
    category?.description,
    `Find the best ${pageTitle} near you on Gymssy.`,
  );

  /* ── Client-side filtering ── */
  const displayListings = applyClientFilters(listings, filters);

  /* ── Handlers ── */
  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleFilterReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  /* ── Scroll to top on slug change ── */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  /* ── Guard: no slug ── */
  if (!slug) return <CategoryNotFound />;

  /* ── Guard: definite 404 ── */
  const isInvalidSlug = !loading && error && listings.length === 0 && !category;
  if (isInvalidSlug) return <CategoryNotFound />;

  return (
    <>
      <Helmet>
        <title>
          {pageTitle} — Gymssy | Fitness, Wellness & Sports Marketplace
        </title>
        <meta name="description" content={pageDesc} />
        <meta property="og:title" content={`${pageTitle} on Gymssy`} />
        <meta property="og:description" content={pageDesc} />
      </Helmet>

      <div className={styles.page}>
        {/* ════ HERO ════ */}
        <CategoryHero
          category={category}
          slug={slug}
          total={total}
          loading={loading}
          resolvedTitle={pageTitle}
          resolvedDesc={pageDesc}
        />

        {/* ════ MAIN CONTENT ════ */}
        <div className={styles.mainWrap}>
          <div className={styles.container}>
            {/* ════════════════════════════════════════════
                LAYOUT: sidebar (desktop) + grid
                
                CategoryFilters is rendered ONCE here.
                Internally it shows either:
                  • the sidebar     (desktop > 900px)
                  • the toolbar     (mobile  ≤ 900px)
                via its own CSS — not duplicated in the page.
            ════════════════════════════════════════════ */}
            <div className={styles.layout}>
              {/* ── LEFT: filter sidebar (desktop only) ──
                  Hidden on mobile via CSS inside CategoryFilters.
                  CategoryFilters renders its own mobile toolbar
                  OUTSIDE this layout div via a portal-like pattern,
                  OR we use the approach below: one instance,
                  the component itself decides what to show.       */}
              <CategoryFilters
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleFilterReset}
                totalResults={displayListings.length}
              />

              {/* ── RIGHT: results ── */}
              <div className={styles.gridArea}>
                {/* Listing grid */}
                <CategoryListingGrid
                  listings={displayListings}
                  loading={loading}
                  error={error}
                  onRetry={retry}
                  categoryTitle={pageTitle}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryListingPage;
