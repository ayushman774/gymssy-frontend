import React from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiChevronRight } from "react-icons/fi";
import { MdHandshake } from "react-icons/md";
import styles from "./PartnerCTA.module.css";

const stats = [
  { value: "500+", label: "Partner Gyms" },
  { value: "50K+", label: "Active Members" },
  { value: "98%", label: "Partner Satisfaction" },
];

const PartnerCTA = ({ image }) => (
  <section className={styles.section}>
    {/* Background */}
    <div className={styles.bgWrapper}>
      <img
        src={image}
        alt="Premium gym"
        className={styles.bgImage}
        loading="lazy"
      />
    </div>
    <div className={styles.overlay} />
    <div className={styles.glowLeft} />
    <div className={styles.glowRight} />

    <div className={styles.inner}>
      {/* Left — Content */}
      <div className={styles.content}>
        <motion.div
          className={styles.badge}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <MdHandshake className={styles.badgeIcon} />
          FOR GYM OWNERS
        </motion.div>

        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Own a Gym?{" "}
          <span className={styles.accentText}>Partner With Our Platform.</span>
        </motion.h2>

        <motion.p
          className={styles.description}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Join hundreds of fitness businesses already growing with our
          marketplace. Get discovered by thousands of fitness seekers, manage
          memberships online, and grow your community — all in one place.
        </motion.p>

        {/* Stat row */}
        <motion.div
          className={styles.statsRow}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {stats.map((s) => (
            <div key={s.label} className={styles.stat}>
              <span className={styles.statVal}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          className={styles.buttons}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.a
            href="#form"
            className={styles.btnPrimary}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            List Your Gym
            <FiArrowRight className={styles.btnIcon} />
          </motion.a>
          <motion.a
            href="#form"
            className={styles.btnSecondary}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Become a Partner
            <FiChevronRight className={styles.btnIcon} />
          </motion.a>
        </motion.div>
      </div>

      {/* Right — Feature list */}
      <motion.div
        className={styles.featureList}
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {[
          "Free gym listing profile",
          "Membership management dashboard",
          "Direct member messaging",
          "Analytics & performance reports",
          "Dedicated partner support",
          "Trainer roster management",
        ].map((f, i) => (
          <div key={f} className={styles.featureItem}>
            <span className={styles.featureDot} />
            <span className={styles.featureText}>{f}</span>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default PartnerCTA;
