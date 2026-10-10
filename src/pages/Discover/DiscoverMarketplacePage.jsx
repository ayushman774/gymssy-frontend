import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiSearch, FiX, FiSliders } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import CompareBar from "../../components/Discover/CompareBar/CompareBar";
import CompareDrawer from "../../components/Discover/CompareDrawer/CompareDrawer";
import DiscoveryCard from "../../components/Discover/DiscoveryCard/DiscoveryCard";
import CustomerLocationPicker from "../../components/Location/CustomerLocationPicker.jsx";
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
  const applySearchFilters = useCallback((next) => setFilters(next), [setFilters]);
  const discoveryFilters = useMemo(() => buildLocatedDiscoveryFilters(filters, customerLocation), [customerLocation, filters]);
  const { listings, pagination, loading, error, retry } = useDiscovery(discoveryFilters, true);
  const navigate = useNavigate();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const selectedCategory = categories.find((category) => category.slug === filters.category);
  const collectionLabels = { "beginner-gyms": "Best Gyms for Beginners", "top-trainers": "Top Rated Personal Trainers", "womens-studios": "Women’s Fitness Studios", "premium-clubs": "Premium Fitness Clubs", "budget-gyms": "Budget Friendly Gyms", "luxury-wellness": "Luxury Wellness Centers" };
  const clear = () => applySearchFilters(clearDiscoveryFilters());

  useEffect(() => {
    if (previousLocationKey.current === locationKey) return;
    previousLocationKey.current = locationKey;
    if (filters.page !== 1) setFilters({ ...filters, page: 1 });
  }, [filters, locationKey, setFilters]);

  useEffect(() => {
    if (hasLocation && isProfessionalType(filters.type)) setFilters({ ...filters, type: "", page: 1 });
  }, [filters, hasLocation, setFilters]);

  return <>
    <section className={styles.marketplaceLayoutSection} aria-labelledby="discover-search-heading">
      <div className={styles.sectionContainer}>
        <div className={styles.marketplaceLayoutIntro}>
          <span className={styles.discoveryEyebrow}>DISCOVER GYMSSY</span>
          <h1 id="discover-search-heading" className={styles.discoverySearchTitle}>Find your next <span>move.</span></h1>
          <p>Explore fitness, wellness, and sports experiences tailored to your goals.</p>
        </div>
        <div className={styles.marketplaceTwoColumn}>
          <aside className={styles.marketplaceSidebar} aria-label="Search and filter listings">
            <div className={styles.marketplaceSidebarHead}>
              <h2>Search &amp; Filters</h2>
              <button type="button" className={styles.marketplaceMobileToggle} aria-expanded={filtersOpen} aria-controls="marketplace-sidebar-fields" onClick={() => setFiltersOpen((open) => !open)}><FiSliders aria-hidden="true" /> {filtersOpen ? "Hide filters" : "Filters"}</button>
            </div>
            <div id="marketplace-sidebar-fields" className={`${styles.marketplaceSidebarFields} ${filtersOpen ? styles.marketplaceSidebarFieldsOpen : ""}`}>
              <form className={styles.marketplaceSidebarSearch} role="search" onSubmit={(event) => { event.preventDefault(); applySearchFilters(changeDiscoveryFilter(filters, "search", event.currentTarget.elements.search.value.trim())); }}>
                <label htmlFor="disc-query">Search listings</label>
                <div className={styles.marketplaceSidebarSearchRow}>
                  <FiSearch aria-hidden="true" />
                  <input id="disc-query" name="search" key={filters.search} defaultValue={filters.search} placeholder="Gyms, yoga, trainers..." maxLength={100} />
                  <button type="submit" aria-label="Search listings"><FiArrowRight aria-hidden="true" /></button>
                </div>
              </form>
              <div className={styles.marketplaceLocationField}>
                <span className={styles.marketplaceFieldTitle}>Location</span>
                <CustomerLocationPicker compact />
              </div>
              <div className={styles.marketplaceCategoryField}>
                <span className={styles.marketplaceFieldTitle}>Category</span>
                <div className={styles.marketplaceCategoryGrid} role="group" aria-label="Marketplace category">
                  {[{ slug: "", name: "All" }, ...categories.filter((category) => ["fitness", "wellness", "sports"].includes(category.slug))].map((category) => (
                    <button key={category.slug || "all"} type="button" className={`${styles.discoveryCategoryChip} ${filters.category === category.slug ? styles.discoveryCategoryChipActive : ""}`} aria-pressed={filters.category === category.slug} onClick={() => applySearchFilters(changeDiscoveryFilter(filters, "category", category.slug))}>{category.name}</button>
                  ))}
                </div>
              </div>
              <div className={styles.marketplaceSelectFields}>
                <FilterSelect id="disc-subcategory" label="Subcategory" value={filters.subcategory} disabled={!selectedCategory} onChange={(value) => applySearchFilters(changeDiscoveryFilter(filters, "subcategory", value))}><option value="">All subcategories</option>{(selectedCategory?.subcategories || []).map((subcategory) => <option key={subcategory.id || subcategory._id} value={subcategory.slug}>{subcategory.name}</option>)}</FilterSelect>
                <FilterSelect id="disc-type" label="Listing type" value={filters.type} onChange={(value) => applySearchFilters(changeDiscoveryFilter(filters, "type", value))}><option value="">All listing types</option>{DISCOVERY_TYPES.map(([value, label]) => <option key={value} value={value} disabled={(Boolean(filters.city) || hasLocation) && isProfessionalType(value)}>{label}</option>)}</FilterSelect>
                <FilterSelect id="disc-city" label="City" value={filters.city} disabled={isProfessionalType(filters.type)} onChange={(value) => applySearchFilters(changeDiscoveryFilter(filters, "city", value))}><option value="">All cities</option>{cities.map((city) => <option key={city.id || city._id} value={city.slug}>{city.name}</option>)}</FilterSelect>
                <FilterSelect id="disc-sort" label="Sort by" value={filters.sort} onChange={(value) => applySearchFilters(changeDiscoveryFilter(filters, "sort", value))}>{DISCOVERY_SORTS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</FilterSelect>
              </div>
              <button type="button" className={styles.marketplaceClearAll} onClick={clear}><FiX aria-hidden="true" /> Clear all filters</button>
            </div>
          </aside>
          <div className={styles.marketplaceResultsColumn} aria-label="Marketplace listing results">
            {filters.collection && <div className={styles.marketplaceCollectionActive}><span>Collection: <strong>{collectionLabels[filters.collection]}</strong></span><button type="button" onClick={() => applySearchFilters({ ...filters, collection: "", page: 1 })} aria-label="Clear featured collection filter"><FiX aria-hidden="true" /> Clear</button></div>}
            <div aria-live="polite" aria-busy={loading}>
              {loading ? <LoadingCards /> : error ? <div className={styles.discoveryState} role="alert"><h3>We couldn’t load the marketplace.</h3><p>{error.status === 400 ? "One of these filters is no longer available. Clear the filters and try again." : "Please check your connection and try again."}</p><div><button onClick={retry} className={styles.discoverBtnFilled}>Retry</button><button onClick={clear} className={styles.discoverBtnOutline}>Clear filters</button></div></div> : listings.length === 0 ? hasLocation ? <div className={styles.discoveryState}><h3>No Gymssy venues found within this area yet.</h3><p>Change your location on the left, or clear it to browse all published marketplace listings.</p><button onClick={clearLocation} className={styles.discoverBtnFilled}>Browse all listings</button></div> : <div className={styles.discoveryState}><h3>No matching listings found.</h3><p>Try changing your filters or search.</p><button onClick={clear} className={styles.discoverBtnFilled}>Clear filters</button></div> : <div className={styles.discoverGrid}>{listings.map((item) => <DiscoveryCard key={`${item.entityType}-${item.id}`} item={item} selected={compareItems.some((entry) => entry.id === item.id)} compareDisabled={compareItems.length >= 3 && !compareItems.some((entry) => entry.id === item.id)} onCompare={onCompareToggle} onView={(href) => navigate(href)} />)}</div>}
            </div>
            {!loading && !error && pagination.totalPages > 1 && <nav className={styles.discoveryPagination} aria-label="Discovery result pages"><button disabled={pagination.page <= 1} onClick={() => applySearchFilters({ ...filters, page: pagination.page - 1 })}><FiArrowLeft aria-hidden="true" /> Previous</button><span>Page {pagination.page} of {pagination.totalPages}</span><button disabled={pagination.page >= pagination.totalPages} onClick={() => applySearchFilters({ ...filters, page: pagination.page + 1 })}>Next <FiArrowRight aria-hidden="true" /></button></nav>}
            {compareItems.length >= 2 && <button className={styles.discoveryCompareInline} onClick={onOpenDrawer}>Compare selected listings</button>}
          </div>
        </div>
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
