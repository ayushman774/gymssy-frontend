import React from "react";
import { motion } from "framer-motion";
import {
  FiStar,
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiAward,
} from "react-icons/fi";
import styles from "./GymQuickInfo.module.css";

const GymQuickInfo = ({
  rating,
  reviewCount,
  distance,
  todayTiming,
  openStatus,
  formatTime,
  lowestPrice,
  currency = "₹",
}) => {
  const timingText = todayTiming
    ? openStatus
      ? `Open until ${formatTime(todayTiming.close)}`
      : `Opens at ${formatTime(todayTiming.open)}`
    : "Hours unavailable";

  const items = [
    {
      icon: <FiStar className={styles.infoIcon} />,
      label: "Rating",
      value: `${rating} / 5`,
      sub: `${reviewCount.toLocaleString("en-IN")} reviews`,
      accent: true,
    },
    {
      icon: <FiMapPin className={styles.infoIcon} />,
      label: "Distance",
      value: distance,
      sub: "from your location",
    },
    {
      icon: <FiClock className={styles.infoIcon} />,
      label: "Timing",
      value: timingText,
      sub: openStatus ? "Open right now" : "Currently closed",
      statusColor: openStatus ? "#39ff14" : "#ef4444",
    },
    {
      icon: <FiDollarSign className={styles.infoIcon} />,
      label: "Starting From",
      value: lowestPrice
        ? `${currency}${lowestPrice.toLocaleString("en-IN")}/mo`
        : "Contact gym",
      sub: "Best available plan",
    },
    {
      icon: <FiAward className={styles.infoIcon} />,
      label: "Equipment",
      value: "Premium",
      sub: "Technogym certified",
    },
  ];

  return (
    <div className={styles.quickInfoBar}>
      <div className={styles.quickInfoInner}>
        {items.map((item, i) => (
          <motion.div
            key={i}
            className={styles.infoItem}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
          >
            <div
              className={`${styles.iconWrap} ${
                item.accent ? styles.iconWrapAccent : ""
              }`}
            >
              {item.icon}
            </div>
            <div className={styles.infoText}>
              <span className={styles.infoLabel}>{item.label}</span>
              <span
                className={styles.infoValue}
                style={
                  item.statusColor ? { color: item.statusColor } : undefined
                }
              >
                {item.value}
              </span>
              <span className={styles.infoSub}>{item.sub}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GymQuickInfo;
