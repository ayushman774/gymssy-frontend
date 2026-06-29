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
          title="APEX Market Office"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.00601568459418!3d40.71277937933115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a22a3bda30d%3A0xb89d1fe6bc499443!2sDowntown%20Manhattan%2C%20New%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1634000000000!5m2!1sen!2sus"
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
      <span className={styles.eyebrow}>APEX MARKET HQ</span>
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
              88 Platform Way, Tech District,
              <br />
              New York, NY 10001
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
            <a href="mailto:hello@apexmarket.com" className={styles.infoLink}>
              hello@apexmarket.com
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
          href="https://maps.google.com/?q=88+Platform+Way+New+York"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.btnPrimary}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          <FiNavigation />
          Get Directions
        </motion.a>
        <motion.a
          href="/locations"
          className={styles.btnSecondary}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          View Gyms Near You
          <FiChevronRight />
        </motion.a>
      </div>
    </motion.div>
  </div>
);

export default OfficeLocation;
