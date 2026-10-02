import { useCallback, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, LayoutGrid, RefreshCw } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import CategoryFilters from "../../components/CategoryFilters/CategoryFilters";
import CategoryHero from "../../components/CategoryHero/CategoryHero";
import CategoryListingGrid from "../../components/CategoryListingGrid/CategoryListingGrid";
import useDiscovery from "../../hooks/useDiscovery";
import useDiscoveryReferences from "../../hooks/useDiscoveryReferences";
import {
  buildCategoryDiscoveryFilters,
  categoryDiscoveryUrlSearch,
  changeCategoryDiscoveryFilter,
  clearCategoryDiscoveryFilters,
  readCategoryDiscoveryUrl,
  resolveCategorySlug,
  validateCategoryDiscoveryState,
} from "../../utils/categoryDiscovery";
import styles from "./CategoryListingPage.module.css";

const safeStr = (value, fallback = "") => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") return value.trim() || fallback;
  if (typeof value === "number") return String(value);
  if (typeof value === "object") return value.name ?? value.title ?? value.label ?? fallback;
  return fallback;
};

const slugToTitle = (slug = "") => slug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

const CategoryNotFound = () => {
  const navigate = useNavigate();
  return <main className={styles.notFoundPage}><motion.div className={styles.notFoundBox} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
    <div className={styles.notFoundIcon} aria-hidden="true"><LayoutGrid size={32} /></div>
    <h1 className={styles.notFoundTitle}>Category Not Found</h1>
    <p className={styles.notFoundText}>The category you’re looking for doesn’t exist or is not currently available.</p>
    <div className={styles.notFoundBtns}><button className={styles.btnPrimary} onClick={() => navigate(-1)}><ArrowLeft size={15} aria-hidden="true" /> Go Back</button><Link to="/" className={styles.btnGhost}>Explore Categories</Link></div>
  </motion.div></main>;
};

const TaxonomyError = ({ onRetry }) => <main className={styles.notFoundPage}><motion.div className={styles.notFoundBox} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
  <div className={styles.notFoundIcon} aria-hidden="true"><RefreshCw size={30} /></div>
  <h1 className={styles.notFoundTitle}>Categories are temporarily unavailable</h1>
  <p className={styles.notFoundText}>We couldn’t confirm this category right now. Please try again.</p>
  <button className={styles.btnPrimary} onClick={onRetry}><RefreshCw size={15} aria-hidden="true" /> Retry</button>
</motion.div></main>;

export default function CategoryListingPage() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const references = useDiscoveryReferences();
  const resolution = useMemo(() => resolveCategorySlug(slug, references.categories), [slug, references.categories]);
  const rawFilters = useMemo(() => readCategoryDiscoveryUrl(location.search), [location.search]);
  const filters = useMemo(() => validateCategoryDiscoveryState(rawFilters, references.cities), [rawFilters, references.cities]);
  const discoveryFilters = useMemo(() => buildCategoryDiscoveryFilters(resolution, filters), [resolution, filters]);
  const discovery = useDiscovery(discoveryFilters, Boolean(resolution) && !references.loading && !references.error);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [slug]);
  useEffect(() => {
    if (references.loading || references.error) return;
    const normalized = categoryDiscoveryUrlSearch(filters);
    if (normalized !== location.search) navigate({ pathname: `/category/${slug}`, search: normalized }, { replace: true });
  }, [filters, location.search, navigate, references.error, references.loading, slug]);

  const setFilters = useCallback((next) => navigate({ pathname: `/category/${slug}`, search: categoryDiscoveryUrlSearch(next) }), [navigate, slug]);
  const handleFilterChange = useCallback((field, value) => setFilters(changeCategoryDiscoveryFilter(filters, field, value)), [filters, setFilters]);
  const handleReset = useCallback(() => setFilters(clearCategoryDiscoveryFilters()), [setFilters]);
  const handlePageChange = useCallback((page) => setFilters({ ...filters, page }), [filters, setFilters]);

  if (!slug) return <CategoryNotFound />;
  if (references.error) return <TaxonomyError onRetry={references.retry} />;
  if (!references.loading && !resolution) return <CategoryNotFound />;

  const category = resolution?.category;
  const pageTitle = safeStr(category?.name, slugToTitle(slug));
  const pageDesc = safeStr(category?.description, `Find the best ${pageTitle} on Gymssy.`);
  const total = discovery.pagination?.total ?? 0;
  const loading = references.loading || discovery.loading;

  return <>
    <Helmet><title>{pageTitle} — Gymssy | Fitness, Wellness & Sports Marketplace</title><meta name="description" content={pageDesc} /><meta property="og:title" content={`${pageTitle} on Gymssy`} /><meta property="og:description" content={pageDesc} /></Helmet>
    <div className={styles.page}>
      <CategoryHero category={category} slug={slug} total={total} loading={loading} resolvedTitle={pageTitle} resolvedDesc={pageDesc} />
      <div className={styles.mainWrap}><div className={styles.container}><div className={styles.layout}>
        <CategoryFilters filters={filters} cities={references.cities} onChange={handleFilterChange} onReset={handleReset} totalResults={total} />
        <div className={styles.gridArea}><CategoryListingGrid listings={discovery.listings} pagination={discovery.pagination} loading={loading} error={discovery.error} onRetry={discovery.retry} onReset={handleReset} onPageChange={handlePageChange} categoryTitle={pageTitle} /></div>
      </div></div></div>
    </div>
  </>;
}
