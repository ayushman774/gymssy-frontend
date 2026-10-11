import React from "react";
import { motion } from "framer-motion";
import {
  FiMapPin,
  FiClock,
  FiMail,
  FiPhone,
  FiNavigation,
  FiChevronRight,
} from "react-icons/fi";
import styles from "./OfficeLocation.module.css";

const hours = [
  { day: "Monday – Friday", time: "9:00 AM – 6:00 PM" },
  { day: "Saturday", time: "10:00 AM – 4:00 PM" },
  { day: "Sunday", time: "Closed" },
];

const OfficeLocation = () => (
  <div className={styles.grid}>
    {/* Map */}
    <motion.div
      className={styles.mapCol}
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className={styles.mapFrame}>
        <iframe
          title="Bhopal, Madhya Pradesh map"
          src="https://maps.google.com/maps?q=Bhopal%2C%20Madhya%20Pradesh%2C%20India&z=12&output=embed"
          className={styles.mapIframe}
          loading="lazy"
          allowFullScreen=""
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className={styles.mapCornerTL} />
        <div className={styles.mapCornerBR} />
      </div>
    </motion.div>

    {/* Details */}
    <motion.div
      className={styles.detailsCol}
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
    >
      <span className={styles.eyebrow}>Gymssy MARKET HQ</span>
      <h3 className={styles.heading}>Our Office</h3>

      <div className={styles.infoList}>
        {/* Address */}
        <div className={styles.infoItem}>
          <div className={styles.infoIcon}>
            <FiMapPin />
          </div>
          <div>
            <span className={styles.infoLabel}>Address</span>
            <span className={styles.infoValue}>
              Bhopal, Madhya Pradesh, India
            </span>
          </div>
        </div>

        {/* Hours */}
        <div className={styles.infoItem}>
          <div className={styles.infoIcon}>
            <FiClock />
          </div>
          <div className={styles.hoursBlock}>
            <span className={styles.infoLabel}>Business Hours</span>
            {hours.map((h) => (
              <div key={h.day} className={styles.hourRow}>
                <span className={styles.hourDay}>{h.day}</span>
                <span
                  className={`${styles.hourTime} ${h.time === "Closed" ? styles.closed : ""}`}
                >
                  {h.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Email */}
        <div className={styles.infoItem}>
          <div className={styles.infoIcon}>
            <FiMail />
          </div>
          <div>
            <span className={styles.infoLabel}>Email</span>
            <a href="mailto:hello@Gymssymarket.com" className={styles.infoLink}>
              hello@Gymssymarket.com
            </a>
          </div>
        </div>

        {/* Phone */}
        <div className={styles.infoItem}>
          <div className={styles.infoIcon}>
            <FiPhone />
          </div>
          <div>
            <span className={styles.infoLabel}>Phone</span>
            <a href="tel:+15552000000" className={styles.infoLink}>
              +1 (555) 200-0000
            </a>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <motion.a
          href="https://www.google.com/maps/search/?api=1&query=Bhopal%2C%20Madhya%20Pradesh%2C%20India"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.btnPrimary}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          <FiNavigation />
          Get Directions
        </motion.a>
      </div>
    </motion.div>
  </div>
);

export default OfficeLocation;
