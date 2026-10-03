import { useCallback, useEffect, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiChevronLeft, FiChevronRight, FiClock, FiSearch, FiShield, FiStar, FiUsers, FiZap } from "react-icons/fi";
import { MdFitnessCenter } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import DiscoveryCard from "../../components/Discover/DiscoveryCard/DiscoveryCard";
import LocationsFAQ from "../../components/LocationsFAQ/LocationsFAQ";
import useDiscovery from "../../hooks/useDiscovery";
import useDiscoveryReferences from "../../hooks/useDiscoveryReferences";
import { DISCOVERY_SORTS } from "../../utils/discoveryState";
import {
  VENUE_TYPES,
  buildGymsNearYouFilters,
  changeGymsNearYouFilter,
  clearGymsNearYouFilters,
  gymsNearYouUrlSearch,
  readGymsNearYouUrl,
  validateGymsNearYouState,
} from "../../utils/gymsNearYouState";
import { locationImages } from "../../assets/data/locationImages";
import styles from "./GymsNearYouPage.module.css";

gsap.registerPlugin(ScrollTrigger);

const whyFeatures = [
  { icon: <MdFitnessCenter />, title: "Premium Equipment", description: "Discover fitness venues with spaces and equipment suited to your training goals." },
  { icon: <FiStar />, title: "Trusted Listings", description: "Compare real marketplace ratings, reviews, and verified listing information." },
  { icon: <FiClock />, title: "Train Your Way", description: "Explore gyms, studios, wellness centres, fitness centres, and sports academies." },
  { icon: <FiUsers />, title: "Local Communities", description: "Find physical fitness businesses operating in a City you choose." },
  { icon: <FiShield />, title: "Clear Details", description: "Open each listing to review the venue information currently available on Gymssy." },
  { icon: <FiZap />, title: "Focused Search", description: "Narrow real marketplace inventory by City, taxonomy, venue type, and search." },
];

const SelectFilter = ({ id, label, value, onChange, disabled = false, children }) => <label className={styles.filterField} htmlFor={id}><span>{label}</span><select id={id} value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled}>{children}</select></label>;

const LoadingGrid = () => <div className={styles.gymsGrid} aria-label="Loading venues" aria-busy="true">{Array.from({ length: 6 }, (_, index) => <div key={index} className={styles.skeletonCard} aria-hidden="true"><div className={styles.skeletonImage} /><div className={styles.skeletonBody}><span /><span /><span /></div></div>)}</div>;

export default function GymsNearYouPage() {
  const headerRef = useRef(null);
  const headerBgRef = useRef(null);
  const whyCardsRef = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();
  const references = useDiscoveryReferences();
  const rawFilters = useMemo(() => readGymsNearYouUrl(location.search), [location.search]);
  const filters = useMemo(() => validateGymsNearYouState(rawFilters, references.categories, references.cities), [rawFilters, references.categories, references.cities]);
  const discoveryFilters = useMemo(() => buildGymsNearYouFilters(filters), [filters]);
  const discovery = useDiscovery(discoveryFilters, !references.loading && !references.error);
  const selectedCategory = references.categories.find((category) => category.slug === filters.category);

  useEffect(() => {
    if (references.loading || references.error) return;
    const normalized = gymsNearYouUrlSearch(filters);
    if (normalized !== location.search) navigate({ pathname: "/gyms-near-you", search: normalized }, { replace: true });
  }, [filters, location.search, navigate, references.error, references.loading]);

  const setFilters = useCallback((next) => navigate({ pathname: "/gyms-near-you", search: gymsNearYouUrlSearch(next) }), [navigate]);
  const changeFilter = useCallback((field, value) => setFilters(changeGymsNearYouFilter(filters, field, value)), [filters, setFilters]);
  const clearFilters = useCallback(() => setFilters(clearGymsNearYouFilters()), [setFilters]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!headerBgRef.current) return;
      gsap.to(headerBgRef.current, { yPercent: 25, ease: "none", scrollTrigger: { trigger: headerRef.current, start: "top top", end: "bottom top", scrub: true } });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = whyCardsRef.current.filter(Boolean);
      if (!cards.length) return;
      gsap.fromTo(cards, { y: 55, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: cards[0], start: "top 82%", once: true } });
    });
    return () => ctx.revert();
  }, []);

  const loading = references.loading || discovery.loading;
  const hasFilters = Boolean(filters.search || filters.city || filters.category || filters.subcategory || filters.type || filters.sort !== "recommended");

  return <main className={styles.page}>
    <section ref={headerRef} className={styles.pageHeader}>
      <div ref={headerBgRef} className={styles.headerBg}><img src={locationImages.pageHeader} alt="Fitness venue interior" className={styles.headerBgImage} loading="eager" /></div>
      <div className={styles.headerOverlay} /><div className={styles.headerGlow} />
      <div className={styles.headerContent}><motion.div className={styles.headerText} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.35 }}><motion.span className={styles.headerEyebrow} initial={{ opacity: 0, letterSpacing: "0.1em" }} animate={{ opacity: 1, letterSpacing: "0.4em" }} transition={{ duration: 1, delay: 0.4 }}>REAL MARKETPLACE VENUES</motion.span><h1 className={styles.headerTitle}>FIND A GYM NEAR YOU</h1><p className={styles.headerSubtitle}>Explore gyms and physical fitness, wellness, and sports businesses in a City you choose.</p></motion.div></div>
      <div className={styles.scrollIndicator}><span className={styles.scrollLine} /></div>
    </section>

    <section className={styles.searchSection} aria-labelledby="venue-search-heading"><div className={styles.sectionContainer}>
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
        <h2 id="venue-search-heading" className={styles.visuallyHidden}>Search physical fitness venues</h2>
        <form className={styles.marketplaceSearch} onSubmit={(event) => { event.preventDefault(); changeFilter("search", event.currentTarget.elements.search.value.trim()); }}><FiSearch aria-hidden="true" /><input name="search" key={filters.search} defaultValue={filters.search} placeholder="Search venues, areas, or activities" aria-label="Search venues" /><button type="submit">Search</button></form>
      </motion.div>
      {references.error ? <div className={styles.referenceError} role="alert"><p>We couldn’t load City and Category filters.</p><button onClick={references.retry}>Retry</button></div> : <div className={styles.marketplaceFilters} aria-label="Venue filters">
        <SelectFilter id="near-city" label="City" value={filters.city} onChange={(value) => changeFilter("city", value)}><option value="">All cities</option>{references.cities.map((city) => <option key={city.id || city._id} value={city.slug}>{city.name}</option>)}</SelectFilter>
        <SelectFilter id="near-category" label="Category" value={filters.category} onChange={(value) => changeFilter("category", value)}><option value="">All categories</option>{references.categories.map((category) => <option key={category.id || category._id} value={category.slug}>{category.name}</option>)}</SelectFilter>
        <SelectFilter id="near-subcategory" label="Activity" value={filters.subcategory} disabled={!selectedCategory} onChange={(value) => changeFilter("subcategory", value)}><option value="">All activities</option>{(selectedCategory?.subcategories || []).map((subcategory) => <option key={subcategory.id || subcategory._id} value={subcategory.slug}>{subcategory.name}</option>)}</SelectFilter>
        <SelectFilter id="near-type" label="Venue type" value={filters.type} onChange={(value) => changeFilter("type", value)}><option value="">All venue types</option>{VENUE_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</SelectFilter>
        <SelectFilter id="near-sort" label="Sort" value={filters.sort} onChange={(value) => changeFilter("sort", value)}>{DISCOVERY_SORTS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</SelectFilter>
      </div>}
      <div className={styles.locationNote}>City-based discovery · Customer GPS distance is not calculated.</div>
      <div className={styles.resultsCount}><span className={styles.resultsNumber}>{loading ? "—" : discovery.pagination.total}</span><span className={styles.resultsText}>{discovery.pagination.total === 1 ? "venue found" : "venues found"}</span>{hasFilters && <button className={styles.clearAll} onClick={clearFilters}>Clear all</button>}</div>
    </div></section>

    <section className={styles.gridSection}><div className={styles.sectionContainer}>
      {loading ? <LoadingGrid /> : discovery.error ? <div className={styles.emptyState} role="alert"><span className={styles.emptyIcon}><MdFitnessCenter /></span><h3 className={styles.emptyTitle}>We couldn’t load venues</h3><p className={styles.emptyText}>Please check your connection and try again.</p><button className={styles.emptyBtn} onClick={discovery.retry}>Retry</button></div> : discovery.listings.length === 0 ? <div className={styles.emptyState} role="status"><span className={styles.emptyIcon}><MdFitnessCenter /></span><h3 className={styles.emptyTitle}>No gyms or fitness venues found</h3><p className={styles.emptyText}>{filters.city ? "Try another City or clear some filters." : "Try changing your search or clearing the filters."}</p><button className={styles.emptyBtn} onClick={clearFilters}>Clear filters</button></div> : <AnimatePresence mode="wait"><motion.div key={`${filters.page}-${location.search}`} className={styles.gymsGrid} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>{discovery.listings.map((listing) => <DiscoveryCard key={`${listing.entityType}-${listing.id}`} item={listing} />)}</motion.div></AnimatePresence>}
      {!loading && !discovery.error && discovery.pagination.totalPages > 1 && <nav className={styles.pagination} aria-label="Venue result pages"><button disabled={discovery.pagination.page <= 1} onClick={() => setFilters({ ...filters, page: discovery.pagination.page - 1 })}><FiChevronLeft /> Previous</button><span>Page {discovery.pagination.page} of {discovery.pagination.totalPages}</span><button disabled={discovery.pagination.page >= discovery.pagination.totalPages} onClick={() => setFilters({ ...filters, page: discovery.pagination.page + 1 })}>Next <FiChevronRight /></button></nav>}
    </div></section>

    <section className={styles.whySection}><div className={styles.sectionContainer}><motion.div className={styles.sectionHeader} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7 }}><span className={styles.sectionEyebrow}>EXPLORE GYMSSY</span><h2 className={styles.sectionTitle}>Find Your <span className={styles.accentText}>Venue</span></h2><p className={styles.sectionSubtitle}>Browse real physical marketplace businesses without simulated distance or location claims.</p></motion.div><div className={styles.whyGrid}>{whyFeatures.map((feature, index) => <div key={feature.title} ref={(element) => { whyCardsRef.current[index] = element; }} className={styles.whyCard}><div className={styles.whyIconWrapper}><span className={styles.whyIcon}>{feature.icon}</span></div><div className={styles.whyContent}><h3 className={styles.whyTitle}>{feature.title}</h3><p className={styles.whyDescription}>{feature.description}</p></div><div className={styles.whyCardAccent} /></div>)}</div></div></section>
    <section className={styles.faqSection}><div className={styles.sectionContainer}><motion.div className={styles.sectionHeader} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7 }}><span className={styles.sectionEyebrow}>COMMON QUESTIONS</span><h2 className={styles.sectionTitle}>Frequently Asked <span className={styles.accentText}>Questions</span></h2></motion.div><LocationsFAQ /></div></section>
  </main>;
}
