import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiCrosshair, FiMapPin } from "react-icons/fi";
import { MdFitnessCenter } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DiscoveryCard from "../../components/Discover/DiscoveryCard/DiscoveryCard.jsx";
import { useCustomerLocation } from "../../context/CustomerLocationContext.jsx";
import useDiscovery from "../../hooks/useDiscovery.js";
import { CUSTOMER_LOCATION_DEFAULT_RADIUS_KM, customerLocationKey } from "../../utils/customerLocation.js";
import { buildGymsNearYouFilters, gymsNearYouUrlSearch, readGymsNearYouPage } from "../../utils/gymsNearYouState.js";
import { locationImages } from "../../assets/data/locationImages.js";
import styles from "./GymsNearYouPage.module.css";

const LoadingGrid = () => <div className={styles.gymsGrid} aria-label="Loading nearby venues" aria-busy="true">{Array.from({ length: 6 }, (_, index) => <div key={index} className={styles.skeletonCard} aria-hidden="true"><div className={styles.skeletonImage} /><div className={styles.skeletonBody}><span /><span /><span /></div></div>)}</div>;

export default function GymsNearYouPage() {
  const routeLocation = useLocation();
  const navigate = useNavigate();
  const { location, hasLocation, setDeviceLocation, clearLocation, isLocating, locationError, clearLocationError } = useCustomerLocation();
  const page = readGymsNearYouPage(routeLocation.search);
  const locationKey = customerLocationKey(location);
  const previousLocationKey = useRef(locationKey);
  const discoveryFilters = useMemo(() => buildGymsNearYouFilters(location, page), [location, page]);
  const discovery = useDiscovery(discoveryFilters, hasLocation);

  useEffect(() => {
    const normalized = gymsNearYouUrlSearch(page);
    if (normalized !== routeLocation.search) navigate({ pathname: "/gyms-near-you", search: normalized }, { replace: true });
  }, [navigate, page, routeLocation.search]);

  useEffect(() => {
    if (previousLocationKey.current !== locationKey) {
      previousLocationKey.current = locationKey;
      if (page > 1) navigate({ pathname: "/gyms-near-you", search: "" }, { replace: true });
    }
  }, [locationKey, navigate, page]);

  const goToPage = (nextPage) => navigate({ pathname: "/gyms-near-you", search: gymsNearYouUrlSearch(nextPage) });
  const useDeviceLocation = async () => {
    clearLocationError();
    await setDeviceLocation();
  };

  return <main className={styles.page}>
    <section className={styles.pageHeader}>
      <img src={locationImages.pageHeader} alt="" className={styles.headerBgImage} aria-hidden="true" />
      <div className={styles.headerOverlay} />
      <motion.div className={styles.headerContent} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
        <span className={styles.headerEyebrow}>REAL MARKETPLACE VENUES</span>
        <h1>Gyms Near You</h1>
        <p>Discover physical fitness, wellness, and sports venues within {CUSTOMER_LOCATION_DEFAULT_RADIUS_KM} km of your chosen location.</p>
      </motion.div>
    </section>

    <section className={styles.nearbySection} aria-labelledby="nearby-heading"><div className={styles.sectionContainer}>
      {!hasLocation ? <div className={styles.locationState}>
        <span className={styles.stateIcon}><FiMapPin aria-hidden="true" /></span>
        <h2 id="nearby-heading">Choose where to search nearby</h2>
        <p>Set a location to see real venues ordered by distance. Gymssy only requests device location when you choose it.</p>
        <div className={styles.stateActions}>
          <button type="button" className={styles.primaryButton} onClick={useDeviceLocation} disabled={isLocating}><FiCrosshair aria-hidden="true" />{isLocating ? "Locating…" : "Use My Location"}</button>
          <Link className={styles.secondaryButton} to="/discover">Choose Location</Link>
        </div>
        {locationError && <p className={styles.inlineError} role="alert">{locationError}</p>}
        <Link className={styles.browseLink} to="/discover">Browse all marketplace listings</Link>
      </div> : <>
        <div className={styles.activeHeader}>
          <div><span className={styles.activeLabel}>SEARCHING WITHIN {CUSTOMER_LOCATION_DEFAULT_RADIUS_KM} KM OF</span><h2 id="nearby-heading"><FiMapPin aria-hidden="true" />{location.label}</h2><p>Nearest available venues appear first.</p></div>
          <div className={styles.activeActions}><Link className={styles.secondaryButton} to="/discover">Change Location</Link><button type="button" className={styles.textButton} onClick={clearLocation}>Clear</button></div>
        </div>

        {discovery.loading ? <LoadingGrid /> : discovery.error ? <div className={styles.resultState} role="alert"><span className={styles.stateIcon}><MdFitnessCenter aria-hidden="true" /></span><h3>We couldn’t load nearby venues</h3><p>Please check your connection and try again.</p><button className={styles.primaryButton} onClick={discovery.retry}>Retry</button></div> : discovery.listings.length === 0 ? <div className={styles.resultState} role="status"><span className={styles.stateIcon}><FiMapPin aria-hidden="true" /></span><h3>No venues found within {CUSTOMER_LOCATION_DEFAULT_RADIUS_KM} km</h3><p>Try another location or browse all published marketplace listings. The search radius is not expanded automatically.</p><div className={styles.stateActions}><Link className={styles.primaryButton} to="/discover">Change Location</Link><Link className={styles.secondaryButton} to="/discover">Browse All</Link></div></div> : <>
          <div className={styles.resultsSummary} aria-live="polite"><strong>{discovery.pagination.total}</strong> {discovery.pagination.total === 1 ? "venue" : "venues"} found</div>
          <div className={styles.gymsGrid}>{discovery.listings.map((listing) => <DiscoveryCard key={`${listing.entityType}-${listing.id}`} item={listing} />)}</div>
          {discovery.pagination.totalPages > 1 && <nav className={styles.pagination} aria-label="Nearby venue result pages"><button disabled={page <= 1} onClick={() => goToPage(page - 1)}><FiChevronLeft aria-hidden="true" /> Previous</button><span>Page {discovery.pagination.page} of {discovery.pagination.totalPages}</span><button disabled={page >= discovery.pagination.totalPages} onClick={() => goToPage(page + 1)}>Next <FiChevronRight aria-hidden="true" /></button></nav>}
        </>}
      </>}
    </div></section>
  </main>;
}
