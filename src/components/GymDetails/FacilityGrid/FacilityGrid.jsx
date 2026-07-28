import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaDumbbell,
  FaRunning,
  FaUsers,
  FaUserTie,
  FaShower,
  FaLock,
  FaCar,
  FaWifi,
  FaSnowflake,
  FaTint,
  FaAppleAlt,
  FaHeartbeat,
  FaClock,
  FaFire,
  FaGlobe,
} from "react-icons/fa";
import styles from "./FacilityGrid.module.css";

const iconMap = {
  FaDumbbell,
  FaRunning,
  FaUsers,
  FaUserTie,
  FaShower,
  FaLock,
  FaCar,
  FaWifi,
  FaSnowflake,
  FaTint,
  FaAppleAlt,
  FaHeartbeat,
  FaClock,
  FaFire,
  FaGlobe,
};

const FacilityGrid = ({ facilities }) => {
  const [showAll, setShowAll] = useState(false);
  const displayFacilities = showAll ? facilities : facilities.slice(0, 8);

  return (
    <div className={styles.facilitySection}>
      <div className={styles.header}>
        <h2 className={styles.title}>Facilities & Amenities</h2>
        <span className={styles.count}>{facilities.length} amenities</span>
      </div>

      <div className={styles.grid}>
        {displayFacilities.map((facility, i) => {
          const IconComponent = iconMap[facility.icon] || FaDumbbell;
          return (
            <motion.div
              key={facility.id}
              className={`${styles.card} ${
                !facility.available ? styles.cardUnavailable : ""
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              whileHover={facility.available ? { y: -3 } : {}}
            >
              <div className={styles.iconWrap}>
                <IconComponent className={styles.icon} />
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
          );
        })}
      </div>

      {facilities.length > 8 && (
        <button
          className={styles.viewAllBtn}
          onClick={() => setShowAll(!showAll)}
          aria-expanded={showAll}
        >
          {showAll ? "Show Less" : `View All ${facilities.length} Amenities`}
          <span className={showAll ? styles.arrowUp : styles.arrowDown}>›</span>
        </button>
      )}
    </div>
  );
};

export default FacilityGrid;
