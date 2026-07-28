import React from "react";
import { motion } from "framer-motion";
import { FiClock } from "react-icons/fi";
import styles from "./GymTimings.module.css";

const GymTimings = ({ timings, openStatus, formatTime }) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const todayName = days[new Date().getDay()];

  return (
    <motion.div
      className={styles.timingsSection}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <FiClock className={styles.titleIcon} />
          <h2 className={styles.title}>Operating Hours</h2>
        </div>
        <span
          className={`${styles.statusBadge} ${
            openStatus ? styles.statusOpen : styles.statusClosed
          }`}
        >
          <span className={styles.statusDot} />
          {openStatus ? "Open Right Now" : "Currently Closed"}
        </span>
      </div>

      <div className={styles.timingsList}>
        {timings.map((timing, i) => {
          const isToday = timing.day === todayName;
          const is247 = timing.open === "00:00" && timing.close === "23:59";

          return (
            <motion.div
              key={timing.day}
              className={`${styles.timingRow} ${
                isToday ? styles.timingRowToday : ""
              }`}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <div className={styles.dayWrap}>
                {isToday && <span className={styles.todayDot} />}
                <span
                  className={`${styles.dayName} ${
                    isToday ? styles.dayNameToday : ""
                  }`}
                >
                  {timing.day}
                </span>
                {isToday && <span className={styles.todayLabel}>Today</span>}
              </div>

              <div className={styles.timeWrap}>
                {!timing.isOpen ? (
                  <span className={styles.closedLabel}>Closed</span>
                ) : is247 ? (
                  <span className={styles.alwaysOpen}>Open 24 Hours</span>
                ) : (
                  <span
                    className={`${styles.timeRange} ${
                      isToday ? styles.timeRangeToday : ""
                    }`}
                  >
                    {formatTime(timing.open)} — {formatTime(timing.close)}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default GymTimings;
