import { motion } from "framer-motion";
import { FiArrowRight, FiMapPin } from "react-icons/fi";
import styles from "./CityCard.module.css";

const CityCard = ({ city, index }) => {
  const { name, gymCount, image } = city;

  return (
    <motion.div
      className={styles.card}
      whileHover="hover"
      initial="rest"
      animate="rest"
    >
      {/* Image */}
      <div className={styles.imageWrapper}>
        <motion.img
          src={image}
          alt={`Fitness centers in ${name}`}
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
        <div className={styles.imageOverlay} />
        <motion.div
          className={styles.glowLayer}
          variants={{
            rest: { opacity: 0 },
            hover: { opacity: 1, transition: { duration: 0.35 } },
          }}
        />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.cityInfo}>
          <FiMapPin className={styles.pinIcon} />
          <div>
            <h3 className={styles.cityName}>{name}</h3>
            <span className={styles.gymCount}>{gymCount} gyms & studios</span>
          </div>
        </div>

        <motion.button
          className={styles.exploreBtn}
          variants={{
            rest: { x: -6, opacity: 0.6 },
            hover: { x: 0, opacity: 1, transition: { duration: 0.3 } },
          }}
          whileTap={{ scale: 0.97 }}
        >
          Explore
          <FiArrowRight className={styles.exploreArrow} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CityCard;
