import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import SectionLabel from "../../../ui/SectionLabel/SectionLabel";
import { POPULAR_SPORTS } from "../../../../assets/data/sportsData";
import styles from "./PopularSports.module.css";

const PopularSports = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.section} aria-label="Popular sports">
      <div className={styles.inner}>
        {/* Header */}
        <div className={styles.header}>
          <SectionLabel text="POPULAR" />
          <div className={styles.headerRow}>
            <h2 className={styles.title}>
              Popular <span className={styles.titleAccent}>Sports</span>
            </h2>
            <button
              className={styles.viewAll}
              onClick={() => navigate("/discover?type=sports")}
              aria-label="View all sports"
            >
              View All
              <FiArrowRight aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className={styles.grid} role="list" aria-label="Popular sports">
          {POPULAR_SPORTS.map((sport, index) => (
            <motion.div
              key={sport.id}
              className={styles.card}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{
                duration: 0.6,
                delay: (index % 4) * 0.08,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              whileHover="hover"
              animate="rest"
              role="listitem"
              onClick={() => navigate(`/discover?sport=${sport.slug}`)}
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" && navigate(`/discover?sport=${sport.slug}`)
              }
              aria-label={`Explore ${sport.title}`}
            >
              {/* Image */}
              <div className={styles.imageWrapper}>
                <motion.img
                  src={sport.image}
                  alt={sport.title}
                  className={styles.image}
                  loading="lazy"
                  variants={{
                    rest: { scale: 1 },
                    hover: {
                      scale: 1.08,
                      transition: { duration: 0.55, ease: "easeOut" },
                    },
                  }}
                />
                <div className={styles.overlay} />
                <motion.div
                  className={styles.hoverGlow}
                  variants={{
                    rest: { opacity: 0 },
                    hover: { opacity: 1, transition: { duration: 0.3 } },
                  }}
                  aria-hidden="true"
                />
              </div>

              {/* Content */}
              <div className={styles.content}>
                <div className={styles.contentMain}>
                  <h3 className={styles.sportName}>{sport.title}</h3>
                  <p className={styles.tagline}>{sport.tagline}</p>
                </div>
                <motion.span
                  className={styles.arrow}
                  variants={{
                    rest: { opacity: 0.4, x: -4 },
                    hover: { opacity: 1, x: 0, transition: { duration: 0.25 } },
                  }}
                  aria-hidden="true"
                >
                  <FiArrowRight />
                </motion.span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularSports;
