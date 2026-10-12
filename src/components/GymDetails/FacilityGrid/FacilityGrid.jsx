import React, { useState } from "react";
import { motion } from "framer-motion";
import DynamicIcon from "../../ui/DynamicIcon/DynamicIcon";
import { Dumbbell } from "lucide-react"; // fallback
import styles from "./FacilityGrid.module.css";

// Preserve explicit backend icons. Infer an icon only for legacy facilities
// that were saved without one; do not change booking or listing data.
const FACILITY_ICON_BY_NAME = {
  "strength equipment": "FaDumbbell", "free weights": "Weight", "cardio equipment": "FaRunning",
  "treadmills": "FaRunning", "exercise bikes": "Bike", "functional training": "Activity",
  "hiit zone": "Flame", "crossfit area": "Dumbbell", "boxing area": "Target",
  "yoga studio": "Flower2", "pilates studio": "PersonStanding", "stretching area": "Move",
  "group classes": "FaUsers", "personal training": "FaUserTie", "indoor cycling": "Bike",
  "sports training": "Trophy", "swimming pool": "Waves", "changing rooms": "FaLock",
  "locker rooms": "FaLock", "shower rooms": "FaShower", "parking": "FaCar",
  "wi-fi": "FaWifi", "air conditioning": "FaSnowflake", "drinking water": "FaTint",
  "nutrition bar": "FaAppleAlt", "cafe": "Salad", "waiting lounge": "House",
  "rest area": "Moon", "steam room": "Droplets", "sauna": "Flame",
  "towel service": "Droplets", "body analysis": "FaHeartbeat",
  "fitness assessment": "HeartPulse", "nutrition consultation": "Salad",
  "physiotherapy": "HandHeart", "recovery zone": "HeartPulse",
  "meditation room": "Flower2", "personal coaching": "UserRound",
  "certified trainers": "GraduationCap", "first aid": "HeartPulse",
  "security": "Shield", "24/7 access": "FaClock", "outdoor training": "Sun",
  "accessibility": "PersonStanding",
};
const resolveFacilityIcon = (facility) =>
  facility.icon || FACILITY_ICON_BY_NAME[String(facility.name || "").trim().toLowerCase()] || "Grid";

const FacilityGrid = ({ facilities }) => {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? facilities : facilities.slice(0, 8);

  return (
    <div className={styles.facilitySection}>
      <div className={styles.header}>
        <h2 className={styles.title}>Facilities & Amenities</h2>
        <span className={styles.count}>{facilities.length} amenities</span>
      </div>

      <div className={styles.grid}>
        {displayed.map((facility, i) => (
          <motion.div
            key={facility.id ?? i}
            className={`${styles.card} ${!facility.available ? styles.cardUnavailable : ""}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            whileHover={facility.available ? { y: -3 } : {}}
          >
            <div className={styles.iconWrap}>
              <DynamicIcon
                name={resolveFacilityIcon(facility)}
                fallback={Dumbbell}
                size={20}
                className={styles.icon}
              />
            </div>
            <div className={styles.info}>
              <span className={styles.name}>{facility.name}</span>
              {facility.description && (
                <span className={styles.desc}>{facility.description}</span>
              )}
            </div>
            {!facility.available && (
              <span className={styles.unavailableBadge}>Coming Soon</span>
            )}
          </motion.div>
        ))}
      </div>

      {facilities.length > 8 && (
        <button
          className={styles.viewAllBtn}
          onClick={() => setShowAll(!showAll)}
          aria-expanded={showAll}
        >
          {showAll ? "Show Less" : `View All ${facilities.length} Amenities`}
          <span
            className={showAll ? styles.arrowUp : styles.arrowDown}
            aria-hidden="true"
          >
            ›
          </span>
        </button>
      )}
    </div>
  );
};

export default FacilityGrid;
