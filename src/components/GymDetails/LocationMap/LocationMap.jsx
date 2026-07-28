import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  FiMapPin,
  FiNavigation,
  FiPhone,
  FiShare2,
  
} from "react-icons/fi";
import styles from "./LocationMap.module.css";

// Leaflet is loaded dynamically to avoid SSR issues
let L;

const LocationMap = ({ gym }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const initMap = async () => {
      try {
        // Dynamic import for Leaflet
        const leaflet = await import("leaflet");
        await import("leaflet/dist/leaflet.css");
        L = leaflet.default;

        if (!mounted || !mapRef.current || mapInstanceRef.current) return;

        // Fix default icons
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
          center: [gym.coordinates.lat, gym.coordinates.lng],
          zoom: 15,
          zoomControl: true,
          scrollWheelZoom: false,
          attributionControl: true,
        });

        // Dark tile layer
        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
          {
            attribution:
              '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/">CARTO</a>',
            subdomains: "abcd",
            maxZoom: 20,
          },
        ).addTo(map);

        // Custom green marker
        const customIcon = L.divIcon({
          className: "",
          html: `
            <div style="
              width: 36px;
              height: 36px;
              background: #39ff14;
              border: 3px solid #000;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              box-shadow: 0 4px 20px rgba(57,255,20,0.4);
              position: relative;
            ">
              <div style="
                position: absolute;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                transform: rotate(45deg);
              ">
                <svg width="14" height="14" fill="#000" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          popupAnchor: [0, -40],
        });

        const marker = L.marker([gym.coordinates.lat, gym.coordinates.lng], {
          icon: customIcon,
        }).addTo(map);

        marker
          .bindPopup(
            `
          <div style="
            background:#111;
            color:#fff;
            border-radius:10px;
            padding:12px 16px;
            font-family:Inter,sans-serif;
            border:1px solid rgba(255,255,255,0.1);
            min-width:180px;
          ">
            <strong style="font-size:0.9rem;display:block;margin-bottom:4px;">${gym.name}</strong>
            <span style="font-size:0.75rem;color:rgba(255,255,255,0.5);">${gym.location.address}</span>
          </div>
        `,
            {
              className: styles.customPopup,
              closeButton: false,
            },
          )
          .openPopup();

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
  }, [gym.coordinates.lat, gym.coordinates.lng]);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${gym.coordinates.lat},${gym.coordinates.lng}`;

  return (
    <motion.div
      className={styles.locationSection}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h2 className={styles.title}>Location & Directions</h2>

      <div className={styles.locationGrid}>
        {/* Map */}
        <div className={styles.mapContainer}>
          <div
            ref={mapRef}
            className={styles.map}
            aria-label={`Map showing location of ${gym.name}`}
            role="application"
          />
        </div>

        {/* Info */}
        <div className={styles.locationInfo}>
          <div className={styles.addressCard}>
            <div className={styles.addressHeader}>
              <FiMapPin className={styles.addressIcon} />
              <h3 className={styles.addressTitle}>Address</h3>
            </div>
            <p className={styles.address}>{gym.location.address}</p>
            <p className={styles.landmark}>{gym.location.landmark}</p>
            <span className={styles.distance}>{gym.distance} from you</span>
          </div>

          <div className={styles.parkingCard}>
            {/* <FiCar className={styles.parkingIcon} /> */}
            <div>
              <span className={styles.parkingTitle}>Parking</span>
              <p className={styles.parkingInfo}>{gym.location.parking}</p>
            </div>
          </div>

          <div className={styles.actionButtons}>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.actionBtn}
              aria-label="Get directions to gym"
            >
              <FiNavigation size={15} />
              Get Directions
            </a>
            <a
              href={`tel:${gym.phone}`}
              className={styles.actionBtnSecondary}
              aria-label={`Call ${gym.name}`}
            >
              <FiPhone size={15} />
              Call Gym
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LocationMap;
