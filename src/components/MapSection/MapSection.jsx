import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./MapSection.module.css";
import { FiMapPin, FiChevronRight } from "react-icons/fi";

// Fix leaflet default marker issue with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom neon marker
const createNeonMarker = (isActive = false) => {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
      ">
        <div style="
          width: ${isActive ? 18 : 14}px;
          height: ${isActive ? 18 : 14}px;
          background: #39FF14;
          border-radius: 50%;
          border: 2.5px solid #000000;
          box-shadow: 0 0 ${isActive ? 20 : 12}px rgba(57,255,20,${isActive ? 0.9 : 0.7}),
                      0 0 ${isActive ? 40 : 24}px rgba(57,255,20,${isActive ? 0.5 : 0.3});
          transition: all 0.3s;
        "></div>
        <div style="
          width: 1px;
          height: 10px;
          background: linear-gradient(to bottom, #39FF14, transparent);
          margin-top: 0;
        "></div>
      </div>
    `,
    iconSize: [18, 30],
    iconAnchor: [9, 30],
    popupAnchor: [0, -32],
  });
};

// Recenter map when gyms change
const MapController = ({ gyms }) => {
  const map = useMap();
  useEffect(() => {
    if (gyms.length === 0) return;
    if (gyms.length === 1) {
      map.setView(gyms[0].coordinates, 14, { animate: true });
    } else {
      const bounds = L.latLngBounds(gyms.map((g) => g.coordinates));
      map.fitBounds(bounds, { padding: [50, 50], animate: true });
    }
  }, [gyms, map]);
  return null;
};

const MapSection = ({ gyms, onMarkerClick }) => {
  const [activeMarkerId, setActiveMarkerId] = useState(null);
  const defaultCenter = [40.7128, -74.006];

  return (
    <motion.div
      className={styles.mapWrapper}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Map count badge */}
      <div className={styles.mapBadge}>
        <FiMapPin className={styles.mapBadgeIcon} />
        <span>
          {gyms.length} Location{gyms.length !== 1 ? "s" : ""}
        </span>
      </div>

      <MapContainer
        center={defaultCenter}
        zoom={12}
        className={styles.leafletMap}
        zoomControl={false}
        attributionControl={false}
      >
        {/* Dark tile layer */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        <MapController gyms={gyms} />

        {gyms.map((gym) => (
          <Marker
            key={gym.id}
            position={gym.coordinates}
            icon={createNeonMarker(activeMarkerId === gym.id)}
            eventHandlers={{
              click: () => {
                setActiveMarkerId(gym.id);
                onMarkerClick(gym);
              },
              mouseover: (e) => {
                e.target.setIcon(createNeonMarker(true));
              },
              mouseout: (e) => {
                if (activeMarkerId !== gym.id) {
                  e.target.setIcon(createNeonMarker(false));
                }
              },
            }}
          >
            <Popup
              className={styles.customPopup}
              closeButton={false}
              offset={[0, -8]}
            >
              <div className={styles.popupContent}>
                <img
                  src={gym.image}
                  alt={gym.name}
                  className={styles.popupImage}
                />
                <div className={styles.popupInfo}>
                  <h4 className={styles.popupName}>{gym.name}</h4>
                  <p className={styles.popupAddress}>{gym.city}</p>
                  <p className={styles.popupDistance}>{gym.distance}</p>
                  <button
                    className={styles.popupBtn}
                    onClick={() => onMarkerClick(gym)}
                  >
                    View Details
                    <FiChevronRight />
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map overlay frame */}
      <div className={styles.mapFrame} />
    </motion.div>
  );
};

export default MapSection;
