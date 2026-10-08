import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import { FiArrowRight, FiList, FiMapPin } from "react-icons/fi";
import { TYPE_LABELS, listingDistance } from "../Discover/DiscoveryCard/discoveryCardUtils.js";
import {
  createNearbyPopupContent,
  mapReadyVenues,
  nextSelectedVenueId,
  safeVenueHref,
} from "../../utils/nearbyVenuesMap.js";
import styles from "./NearbyVenuesMap.module.css";

const venueIcon = (L, active) => L.divIcon({
  className: "",
  html: `<span class="${active ? "gymssy-nearby-pin gymssy-nearby-pin-active" : "gymssy-nearby-pin"}" aria-hidden="true"></span>`,
  iconSize: active ? [30, 30] : [24, 24],
  iconAnchor: active ? [15, 15] : [12, 12],
  popupAnchor: [0, -16],
});

export default function NearbyVenuesMap({ listings, customerLocation, onShowList }) {
  const reducedMotion = useReducedMotion();
  const venues = useMemo(() => mapReadyVenues(listings), [listings]);
  const [selectedId, setSelectedId] = useState(() => nextSelectedVenueId(null, venues));
  const [mapFailed, setMapFailed] = useState(false);
  const effectiveSelectedId = nextSelectedVenueId(selectedId, venues);
  const mapElementRef = useRef(null);

  useEffect(() => {
    if (!venues.length || !mapElementRef.current) return undefined;
    let mounted = true;
    let mapInstance = null;

    const initialize = async () => {
      try {
        const leaflet = await import("leaflet");
        const L = leaflet.default;
        if (!mounted || !mapElementRef.current) return;
        const map = L.map(mapElementRef.current, { center: [customerLocation.latitude, customerLocation.longitude], zoom: 13, scrollWheelZoom: false });
        mapInstance = map;

        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 20,
        }).on("tileerror", () => mounted && setMapFailed(true))
          .on("tileload", () => mounted && setMapFailed(false))
          .addTo(map);

        const points = [[customerLocation.latitude, customerLocation.longitude]];
        L.circleMarker(points[0], { radius: 8, color: "#fff", fillColor: "#4aa3ff", fillOpacity: 1, weight: 3 })
          .bindPopup(createNearbyPopupContent({ name: "Your selected location" }, { typeLabel: customerLocation.label, documentRef: document }))
          .addTo(map);

        for (const venue of venues) {
          const position = [venue.coordinates.latitude, venue.coordinates.longitude];
          points.push(position);
          const marker = L.marker(position, {
            icon: venueIcon(L, venue.id === effectiveSelectedId),
            keyboard: true,
            title: venue.name,
            alt: `Venue: ${venue.name}`,
          });
          const popup = createNearbyPopupContent(venue, {
            typeLabel: TYPE_LABELS[venue.entityType] || venue.entityType,
            distanceLabel: listingDistance(venue.distance),
            documentRef: document,
          });
          if (popup) marker.bindPopup(popup);
          marker.on("click keypress", () => setSelectedId(venue.id)).addTo(map);
        }

        map.fitBounds(L.latLngBounds(points), { padding: [40, 40], animate: !reducedMotion });
      } catch {
        if (mounted) setMapFailed(true);
      }
    };

    initialize();
    return () => {
      mounted = false;
      mapInstance?.remove();
      mapInstance = null;
    };
  }, [customerLocation, effectiveSelectedId, reducedMotion, venues]);

  if (!venues.length) {
    return <div className={styles.noPins} role="status">
      <FiMapPin aria-hidden="true" />
      <h3>No map-ready venues on this page</h3>
      <p>The current page has no listings with verified coordinates. All results remain available in List view.</p>
      <button type="button" onClick={onShowList}><FiList aria-hidden="true" /> Show List</button>
    </div>;
  }

  return <div className={styles.experience}>
    <div className={styles.scopeNote} role="note"><strong>{venues.length}</strong> of {listings.length} venues on this page are shown on the map. This map covers the current paginated result set only.</div>
    {mapFailed && <div className={styles.mapWarning} role="alert"><span>Map tiles are unavailable. Venue results are still accessible.</span><button type="button" onClick={onShowList}>Switch to List</button></div>}
    <div className={styles.mapLayout}>
      <div className={styles.mapShell}><div ref={mapElementRef} className={styles.map} role="region" aria-label="Map of venues on the current results page" /></div>
      <div className={styles.mapResults} aria-label="Venues shown on map">
        {venues.map((venue) => <article key={venue.id} className={`${styles.mapResult} ${venue.id === effectiveSelectedId ? styles.mapResultSelected : ""}`} aria-current={venue.id === effectiveSelectedId ? "true" : undefined}>
          <button type="button" onClick={() => setSelectedId(venue.id)} aria-label={`Highlight ${venue.name} on map`}>
            <span className={styles.resultPin}><FiMapPin aria-hidden="true" /></span>
            <span className={styles.resultCopy}><strong>{venue.name}</strong><span>{TYPE_LABELS[venue.entityType] || venue.entityType}</span>{listingDistance(venue.distance) && <span>{listingDistance(venue.distance)}</span>}</span>
          </button>
          <Link to={safeVenueHref(venue.href) || "/discover"} aria-label={`View details for ${venue.name}`}>View <FiArrowRight aria-hidden="true" /></Link>
        </article>)}
      </div>
    </div>
  </div>;
}
