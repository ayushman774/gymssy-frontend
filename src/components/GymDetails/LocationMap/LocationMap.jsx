import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FiMapPin, FiNavigation, FiPhone } from "react-icons/fi";
import {
  createSafeLocationPopup,
  googleMapsDirectionsUrl,
  normalizeVenueCoordinates,
} from "../../../utils/gymDetailLocation";
import styles from "./LocationMap.module.css";

let L;

const readableLocationPart = (value) => {
  if (typeof value === "string") return value.trim();
  return typeof value?.name === "string" ? value.name.trim() : "";
};

const LocationMap = ({ gym, distance = null }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const coordinates = normalizeVenueCoordinates(gym?.coordinates);
  const latitude = coordinates?.latitude;
  const longitude = coordinates?.longitude;
  const directionsUrl = googleMapsDirectionsUrl(gym?.coordinates);
  const address =
    readableLocationPart(gym?.location?.address) ||
    [
      readableLocationPart(gym?.location?.area),
      readableLocationPart(gym?.location?.city),
    ]
      .filter(Boolean)
      .join(", ") ||
    "Address unavailable";
  const landmark = readableLocationPart(gym?.location?.landmark);
  const parking = readableLocationPart(gym?.location?.parking);

  useEffect(() => {
    if (latitude === undefined || longitude === undefined) return undefined;
    let mounted = true;

    const initMap = async () => {
      try {
        const leaflet = await import("leaflet");
        await import("leaflet/dist/leaflet.css");
        L = leaflet.default;

        if (!mounted || !mapRef.current || mapInstanceRef.current) return;

        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
          iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        });

        const map = L.map(mapRef.current, {
          center: [latitude, longitude],
          zoom: 15,
          zoomControl: true,
          scrollWheelZoom: false,
          attributionControl: true,
        });

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
          maxZoom: 19,
        }).addTo(map);

        const customIcon = L.divIcon({
          className: "",
          html: `
            <div style="width:36px;height:36px;background:#39ff14;border:3px solid #000;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 20px rgba(57,255,20,0.4);position:relative">
              <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;transform:rotate(45deg)">
                <svg width="14" height="14" fill="#000" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
            </div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          popupAnchor: [0, -40],
        });

        const marker = L.marker([latitude, longitude], {
          icon: customIcon,
        }).addTo(map);
        const popupContent = createSafeLocationPopup(gym);
        if (popupContent) {
          marker
            .bindPopup(popupContent, {
              className: styles.customPopup,
              closeButton: false,
            })
            .openPopup();
        }

        mapInstanceRef.current = map;
      } catch (err) {
        console.warn("Map failed to load:", err);
      }
    };

    initMap();

    return () => {
      mounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, gym]);

  return (
    <motion.div
      className={styles.locationSection}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h2 className={styles.title}>Location & Directions</h2>

      <div
        className={`${styles.locationGrid} ${!coordinates ? styles.infoOnly : ""}`}
      >
        {coordinates && (
          <div className={styles.mapContainer}>
            <div
              ref={mapRef}
              className={styles.map}
              aria-label={`Map showing the location of ${gym?.name || "this venue"}`}
              role="region"
            />
          </div>
        )}

        <div className={styles.locationInfo}>
          <div className={styles.addressCard}>
            <div className={styles.addressHeader}>
              <FiMapPin className={styles.addressIcon} aria-hidden="true" />
              <h3 className={styles.addressTitle}>Address</h3>
            </div>
            <p className={styles.address}>{address}</p>
            {landmark && <p className={styles.landmark}>{landmark}</p>}
            {distance && (
              <div className={styles.distanceBlock}>
                <span className={styles.distance}>{distance.label}</span>
                <span className={styles.distanceQualifier}>
                  {distance.qualifier}
                </span>
              </div>
            )}
          </div>

          {parking && (
            <div className={styles.parkingCard}>
              <div>
                <span className={styles.parkingTitle}>Parking</span>
                <p className={styles.parkingInfo}>{parking}</p>
              </div>
            </div>
          )}

          {(directionsUrl || gym?.phone) && (
            <div className={styles.actionButtons}>
              {directionsUrl && (
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.actionBtn}
                  aria-label={`Get directions to ${gym?.name || "this venue"} in Google Maps`}
                >
                  <FiNavigation size={15} aria-hidden="true" />
                  Get Directions
                </a>
              )}
              {gym?.phone && (
                <a
                  href={`tel:${gym.phone}`}
                  className={styles.actionBtnSecondary}
                  aria-label={`Call ${gym?.name || "this venue"}`}
                >
                  <FiPhone size={15} aria-hidden="true" />
                  Call Gym
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LocationMap;
