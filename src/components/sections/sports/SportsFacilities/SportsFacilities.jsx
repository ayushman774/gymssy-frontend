/* ══════════════════════════════════════════════════════
   SportsFacilities
   UI-ready. No facilities booking API exists yet.
   Missing API: /api/facilities
══════════════════════════════════════════════════════ */
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import SectionLabel from "../../../ui/SectionLabel/SectionLabel";
import { SPORTS_FACILITIES } from "../../../../assets/data/sportsData";
import styles from "./SportsFacilities.module.css";

const CONTAINER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const ITEM = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const SportsFacilities = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.section} aria-label="Find sports facilities">
      <div className={styles.inner}>
        {/* Header */}
        <div className={styles.header}>
          <SectionLabel text="FACILITIES" />
          <h2 className={styles.title}>
            Find Sports Facilities{" "}
            <span className={styles.titleAccent}>Near You</span>
          </h2>
          <p className={styles.subtitle}>
            Book courts, pools and sports facilities for your next game
          </p>
        </div>

        {/* Grid */}
        <motion.div
          className={styles.grid}
          variants={CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-5%" }}
          role="list"
          aria-label="Sports facility types"
        >
          {SPORTS_FACILITIES.map((facility) => (
            <motion.div
              key={facility.id}
              className={styles.card}
              variants={ITEM}
              whileHover="hover"
              animate="rest"
              role="listitem"
              onClick={() =>
                navigate(`/discover?facility=${facility.slug}&type=sports`)
              }
              onKeyDown={(e) =>
                e.key === "Enter" &&
                navigate(`/discover?facility=${facility.slug}&type=sports`)
              }
              tabIndex={0}
              aria-label={`Find ${facility.title}`}
            >
              {/* Image */}
              <div className={styles.imageWrapper}>
                <motion.img
                  src={facility.image}
                  alt={facility.title}
                  className={styles.image}
                  loading="lazy"
                  variants={{
                    rest: { scale: 1 },
                    hover: {
                      scale: 1.07,
                      transition: { duration: 0.5, ease: "easeOut" },
                    },
                  }}
                />
                <div className={styles.overlay} />
                <motion.div
                  className={styles.hoverOverlay}
                  variants={{
                    rest: { opacity: 0 },
                    hover: { opacity: 1, transition: { duration: 0.3 } },
                  }}
                  aria-hidden="true"
                />
              </div>

              {/* Content */}
              <div className={styles.content}>
                <span className={styles.icon} aria-hidden="true">
                  {facility.icon}
                </span>
                <h3 className={styles.facilityName}>{facility.title}</h3>
                <motion.span
                  className={styles.arrow}
                  variants={{
                    rest: { x: -4, opacity: 0 },
                    hover: { x: 0, opacity: 1, transition: { duration: 0.25 } },
                  }}
                  aria-hidden="true"
                >
                  <FiArrowRight />
                </motion.span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <div className={styles.ctaRow}>
          <motion.button
            className={styles.ctaBtn}
            onClick={() => navigate("/discover?type=sports")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Find Facilities
            <FiArrowRight aria-hidden="true" />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default SportsFacilities;
