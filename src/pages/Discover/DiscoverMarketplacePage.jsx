import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiSearch, FiX, FiSliders, FiChevronDown } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import CompareBar from "../../components/Discover/CompareBar/CompareBar";
import CompareDrawer from "../../components/Discover/CompareDrawer/CompareDrawer";
import DiscoveryCard from "../../components/Discover/DiscoveryCard/DiscoveryCard";
import CustomerLocationPicker from "../../components/Location/CustomerLocationPicker.jsx";
import SectionLabel from "../../components/ui/SectionLabel/SectionLabel";
import { useCustomerLocation } from "../../context/CustomerLocationContext.jsx";
import useDiscovery from "../../hooks/useDiscovery";
import useDiscoveryReferences from "../../hooks/useDiscoveryReferences";
import {
  DISCOVERY_SORTS,
  DISCOVERY_TYPES,
  changeDiscoveryFilter,
  clearDiscoveryFilters,
  discoveryUrlSearch,
  isProfessionalType,
  readDiscoveryUrl,
  validateDiscoveryState,
} from "../../utils/discoveryState";
import { buildLocatedDiscoveryFilters, customerLocationKey } from "../../utils/customerLocation.js";
import { FeaturedCollections, PageHeader, SpecialOffers, WhyGymssy } from "./DiscoverPage";
import styles from "./DiscoverPage.module.css";

const FilterSelect = ({ id, label, value, onChange, children, disabled = false }) => (
  <label className={styles.discoveryFilter} htmlFor={id}>
    <span>{label}</span>
    <select id={id} value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled}>{children}</select>
  </label>
);

const LoadingCards = () => <div className={styles.discoverGrid} aria-label="Loading marketplace listings">{Array.from({ length: 4 }, (_, index) => <div key={index} className={`${styles.discoverCard} ${styles.discoverySkeleton}`} aria-hidden="true"><div className={styles.discoverySkeletonImage} /><div className={styles.discoverySkeletonBody}><span /><span /><span /></div></div>)}</div>;

const MarketplaceResults = ({ filters, categories, cities, setFilters, compareItems, onCompareToggle, onOpenDrawer }) => {
  const { location: customerLocation, hasLocation, clearLocation } = useCustomerLocation();
  const locationKey = customerLocationKey(customerLocation);
  const previousLocationKey = useRef(locationKey);
  const resultsRef = useRef(null);
  const scrollToResults = useCallback(() => {
    resultsRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }, []);
  const applySearchFilters = useCallback((next) => {
    setFilters(next);
    window.requestAnimationFrame(scrollToResults);
  }, [scrollToResults, setFilters]);
  const discoveryFilters = useMemo(() => buildLocatedDiscoveryFilters(filters, customerLocation), [customerLocation, filters]);
  const { listings, pagination, loading, error, retry } = useDiscovery(discoveryFilters, true);
  const navigate = useNavigate();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const activeFilterCount = [filters.subcategory, filters.type, filters.city, filters.sort !== "recommended" ? filters.sort : ""].filter(Boolean).length;
  const selectedCategory = categories.find((category) => category.slug === filters.category);
  const clear = () => applySearchFilters(clearDiscoveryFilters());

  useEffect(() => {
    if (previousLocationKey.current === locationKey) return;
    previousLocationKey.current = locationKey;
    window.requestAnimationFrame(scrollToResults);
    if (filters.page !== 1) setFilters({ ...filters, page: 1 });
  }, [filters, locationKey, scrollToResults, setFilters]);

  useEffect(() => {
    if (hasLocation && isProfessionalType(filters.type)) setFilters({ ...filters, type: "", page: 1 });
  }, [filters, hasLocation, setFilters]);

  return <>
    <section className={styles.searchSection} aria-labelledby="discover-search-heading">
      <div className={styles.sectionContainer}>
        <div className={styles.discoverySearchShell}>
          <div className={styles.discoverySearchIntro}>
            <span className={styles.discoveryEyebrow}>DISCOVER GYMSSY</span>
            <h2 id="discover-search-heading" className={styles.discoverySearchTitle}>Find your next <span>move.</span></h2>
            <p>Explore fitness, wellness and sports experiences that fit your goals.</p>
          </div>
          <div className={styles.discoverySearchPanel}>
            <form className={styles.discoveryPrimarySearch} role="search" onSubmit={(event) => { event.preventDefault(); applySearchFilters(changeDiscoveryFilter(filters, "search", event.currentTarget.elements.search.value.trim())); }}>
              <FiSearch className={styles.discoveryPrimaryIcon} aria-hidden="true" />
              <div className={styles.discoveryPrimaryField}>
                <label htmlFor="disc-query">What are you looking for?</label>
                <input id="disc-query" name="search" key={filters.search} defaultValue={filters.search} placeholder="Gyms, yoga, trainers, CrossFit..." maxLength={100} />
              </div>
              <button type="submit" className={styles.discoverySearchSubmit}>Explore <FiArrowRight aria-hidden="true" /></button>
            </form>
            <div className={styles.discoveryLocationRow}>
              <CustomerLocationPicker compact />
            </div>
          </div>
          <div className={styles.discoverySearchBottom}>
            <div className={styles.discoveryCategoryChips} role="group" aria-label="Choose marketplace category">
              {[{ slug: "", name: "All" }, ...categories.filter((category) => ["fitness", "wellness", "sports"].includes(category.slug))].map((category) => (
                <button
                  key={category.slug || "all"}
                  type="button"
                  className={`${styles.discoveryCategoryChip} ${filters.category === category.slug ? styles.discoveryCategoryChipActive : ""}`}
                  aria-pressed={filters.category === category.slug}
                  onClick={() => setFilters(changeDiscoveryFilter(filters, "category", category.slug))}
                >{category.name}</button>
              ))}
            </div>
            <button type="button" className={styles.discoveryFilterToggle} aria-expanded={filtersOpen} aria-controls="discovery-advanced-filters" onClick={() => setFiltersOpen((value) => !value)}>
              <FiSliders aria-hidden="true" /> All filters {activeFilterCount > 0 && <span className={styles.discoveryFilterCount}>{activeFilterCount}</span>} <FiChevronDown className={filtersOpen ? styles.discoveryChevronOpen : ""} aria-hidden="true" />
            </button>
          </div>
          {filtersOpen && (
            <div id="discovery-advanced-filters" className={styles.discoveryAdvancedPanel} aria-label="Advanced marketplace filters">
              <div className={styles.discoveryAdvancedGrid}>
                <FilterSelect id="disc-subcategory" label="Subcategory" value={filters.subcategory} disabled={!selectedCategory} onChange={(value) => setFilters(changeDiscoveryFilter(filters, "subcategory", value))}><option value="">All subcategories</option>{(selectedCategory?.subcategories || []).map((subcategory) => <option key={subcategory.id || subcategory._id} value={subcategory.slug}>{subcategory.name}</option>)}</FilterSelect>
                <FilterSelect id="disc-type" label="Listing type" value={filters.type} onChange={(value) => setFilters(changeDiscoveryFilter(filters, "type", value))}><option value="">All listing types</option>{DISCOVERY_TYPES.map(([value, label]) => <option key={value} value={value} disabled={(Boolean(filters.city) || hasLocation) && isProfessionalType(value)}>{label}</option>)}</FilterSelect>
                <FilterSelect id="disc-city" label="City" value={filters.city} disabled={isProfessionalType(filters.type)} onChange={(value) => setFilters(changeDiscoveryFilter(filters, "city", value))}><option value="">All cities</option>{cities.map((city) => <option key={city.id || city._id} value={city.slug}>{city.name}</option>)}</FilterSelect>
                <FilterSelect id="disc-sort" label="Sort" value={filters.sort} onChange={(value) => setFilters(changeDiscoveryFilter(filters, "sort", value))}>{DISCOVERY_SORTS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</FilterSelect>
              </div>
              <button type="button" className={styles.discoveryResetLink} onClick={clear}><FiX aria-hidden="true" /> Reset filters</button>
            </div>
          )}
        </div>
      </div>
    </section>

    <section ref={resultsRef} className={`${styles.section} ${styles.sectionAlt} ${styles.discoveryResultsAnchor}`} aria-labelledby="marketplace-results-heading">
      <div className={styles.sectionContainer}>
        <div className={styles.sectionHead}><SectionLabel text="MARKETPLACE" variant="light" /><div className={styles.sectionHeadRow}><h2 id="marketplace-results-heading" className={styles.sectionHeading}>Discover <span className={styles.accentText}>Gymssy</span></h2>{!loading && !error && <span className={styles.discoveryTotal}>{pagination.total} listings</span>}</div><p className={styles.sectionSubtext}>{hasLocation ? "Physical Gymssy venues that can be matched within your selected area." : "Real gyms, wellness businesses, sports academies and professionals from across Gymssy."}</p></div>
        {loading ? <LoadingCards /> : error ? <div className={styles.discoveryState} role="alert"><h3>We couldn’t load the marketplace.</h3><p>{error.status === 400 ? "One of these filters is no longer available. Clear the filters and try again." : "Please check your connection and try again."}</p><div><button onClick={retry} className={styles.discoverBtnFilled}>Retry</button><button onClick={clear} className={styles.discoverBtnOutline}>Clear filters</button></div></div> : listings.length === 0 ? hasLocation ? <div className={styles.discoveryState}><h3>No Gymssy venues found within this area yet.</h3><p>Change your location above, or clear it to browse all published marketplace listings.</p><button onClick={clearLocation} className={styles.discoverBtnFilled}>Browse all listings</button></div> : <div className={styles.discoveryState}><h3>No matching listings found.</h3><p>Try changing your filters or search.</p><button onClick={clear} className={styles.discoverBtnFilled}>Clear filters</button></div> : <div className={styles.discoverGrid}>{listings.map((item) => <DiscoveryCard key={`${item.entityType}-${item.id}`} item={item} selected={compareItems.some((entry) => entry.id === item.id)} compareDisabled={compareItems.length >= 3 && !compareItems.some((entry) => entry.id === item.id)} onCompare={onCompareToggle} onView={(href) => navigate(href)} />)}</div>}
        {!loading && !error && pagination.totalPages > 1 && <nav className={styles.discoveryPagination} aria-label="Discovery result pages"><button disabled={pagination.page <= 1} onClick={() => applySearchFilters({ ...filters, page: pagination.page - 1 })}><FiArrowLeft aria-hidden="true" /> Previous</button><span>Page {pagination.page} of {pagination.totalPages}</span><button disabled={pagination.page >= pagination.totalPages} onClick={() => applySearchFilters({ ...filters, page: pagination.page + 1 })}>Next <FiArrowRight aria-hidden="true" /></button></nav>}
        {compareItems.length >= 2 && <button className={styles.discoveryCompareInline} onClick={onOpenDrawer}>Compare selected listings</button>}
      </div>
    </section>
  </>;
};

export default function DiscoverMarketplacePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const references = useDiscoveryReferences();
  const [compareItems, setCompareItems] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const urlFilters = useMemo(() => readDiscoveryUrl(location.search), [location.search]);
  const filters = useMemo(() => validateDiscoveryState(urlFilters, references.categories, references.cities), [urlFilters, references.categories, references.cities]);

  useEffect(() => {
    if (references.loading || references.error) return;
    const normalized = discoveryUrlSearch(filters);
    if (normalized !== location.search) navigate({ pathname: "/discover", search: normalized }, { replace: true });
  }, [filters, location.search, navigate, references.error, references.loading]);

  const setFilters = useCallback((next) => navigate({ pathname: "/discover", search: discoveryUrlSearch(next) }), [navigate]);
  const toggleCompare = (item) => setCompareItems((current) => current.some((entry) => entry.id === item.id) ? current.filter((entry) => entry.id !== item.id) : current.length < 3 ? [...current, item] : current);
  const removeCompare = (id) => setCompareItems((current) => { const next = current.filter((item) => item.id !== id); if (next.length < 2) setDrawerOpen(false); return next; });

  return <main className={styles.page}>
    <PageHeader />
    {references.loading ? <section className={styles.searchSection}><div className={styles.sectionContainer}><div className={styles.discoveryState} role="status">Loading marketplace filters…</div></div></section> : references.error ? <section className={styles.searchSection}><div className={styles.sectionContainer}><div className={styles.discoveryState} role="alert"><h3>We couldn’t load marketplace filters.</h3><button className={styles.discoverBtnFilled} onClick={references.retry}>Retry</button></div></div></section> : <MarketplaceResults filters={filters} categories={references.categories} cities={references.cities} setFilters={setFilters} compareItems={compareItems} onCompareToggle={toggleCompare} onOpenDrawer={() => setDrawerOpen(true)} />}
    <FeaturedCollections />
    <SpecialOffers />
    <WhyGymssy />
    <CompareBar items={compareItems} onRemove={removeCompare} onCompare={() => compareItems.length >= 2 && setDrawerOpen(true)} onClear={() => { setCompareItems([]); setDrawerOpen(false); }} />
    {drawerOpen && <CompareDrawer items={compareItems} onClose={() => setDrawerOpen(false)} onRemove={removeCompare} />}
  </main>;
}
