import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import SectionLabel from "../../../ui/SectionLabel/SectionLabel";
import { SPORTS_SUBCATEGORIES } from "../../../../assets/data/sportsData";
import styles from "./SportsCategories.module.css";

const CONTAINER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const CARD_VARIANT = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const SportsCategories = ({ sectionRef }) => {
  const navigate = useNavigate();

  return (
    <section
      id="sports-categories"
      className={styles.section}
      ref={sectionRef}
      aria-label="Explore sports categories"
    >
      <div className={styles.inner}>
        {/* Header */}
        <div className={styles.header}>
          <SectionLabel text="EXPLORE" />
          <h2 className={styles.title}>
            Explore <span className={styles.titleAccent}>Sports</span>
          </h2>
          <p className={styles.subtitle}>
            Find the sport, coach or activity that's right for you
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
          aria-label="Sports categories"
        >
          {SPORTS_SUBCATEGORIES.map((sport) => (
            <motion.div
              key={sport.id}
              className={styles.card}
              variants={CARD_VARIANT}
              whileHover="hover"
              initial="rest"
              animate="rest"
              role="listitem"
              onClick={() => navigate(`/discover?sport=${sport.slug}`)}
              onKeyDown={(e) =>
                e.key === "Enter" && navigate(`/discover?sport=${sport.slug}`)
              }
              tabIndex={0}
              aria-label={`Explore ${sport.title} — ${sport.description}`}
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
                      scale: 1.07,
                      transition: { duration: 0.5, ease: "easeOut" },
                    },
                  }}
                />
                <div className={styles.imageOverlay} />
                <motion.div
                  className={styles.imageGlow}
                  variants={{
                    rest: { opacity: 0 },
                    hover: { opacity: 1, transition: { duration: 0.3 } },
                  }}
                  aria-hidden="true"
                />
              </div>

              {/* Content */}
              <div className={styles.content}>
                <span className={styles.count}>{sport.count}</span>
                <h3 className={styles.cardTitle}>{sport.title}</h3>
                <p className={styles.cardDesc}>{sport.description}</p>
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
      </div>
    </section>
  );
};

export default SportsCategories;
