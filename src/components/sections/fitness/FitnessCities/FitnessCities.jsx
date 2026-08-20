import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import FitnessSection from "../FitnessSection/FitnessSection";
import styles from "./FitnessCities.module.css";
import { SkeletonRow } from "../../../ui/SkeletonCard/SkeletonCard";

const CityCard = ({ city, index }) => {
  const navigate = useNavigate();

  return (
    <motion.article
      className={styles.card}
      onClick={() =>
        navigate(`/discover?city=${encodeURIComponent(city.name)}`)
      }
      role="button"
      tabIndex={0}
      aria-label={`${city.name} — ${city.count} fitness centers`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/discover?city=${encodeURIComponent(city.name)}`);
        }
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-4%" }}
      transition={{
        duration: 0.55,
        delay: (index % 6) * 0.07,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover="hover"
    >
      <div className={styles.imageWrapper} aria-hidden="true">
        <motion.div
          className={styles.image}
          style={{ backgroundImage: `url(${city.image})` }}
          variants={{
            hover: { scale: 1.07, transition: { duration: 0.5 } },
          }}
        />
        <div className={styles.overlay} />
      </div>

      <div className={styles.content}>
        <h3 className={styles.cityName}>{city.name}</h3>
        <p className={styles.cityCount}>{city.count} fitness centers</p>
      </div>
    </motion.article>
  );
};

const FitnessCities = ({ cities, loading }) => (
  <FitnessSection
    id="fitness-cities"
    label="EXPLORE BY CITY"
    title="Popular Cities"
    titleAccent="for Fitness"
    subtitle="Find gyms, trainers and fitness experiences in your city."
    viewAllHref="/discover"
    viewAllText="All Cities"
  >
    {loading.cities ? (
      <SkeletonRow count={6} variant="city" />
    ) : (
      <div
        className={styles.grid}
        role="list"
        aria-label="Popular fitness cities"
      >
        {cities.map((city, index) => (
          <div key={city.id} role="listitem">
            <CityCard city={city} index={index} />
          </div>
        ))}
      </div>
    )}
  </FitnessSection>
);

export default FitnessCities;
