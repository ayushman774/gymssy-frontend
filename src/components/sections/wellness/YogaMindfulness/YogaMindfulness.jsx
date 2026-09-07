import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import FitnessSection from "../../fitness/FitnessSection/FitnessSection";
import { YOGA_MINDFULNESS_ITEMS } from "../../../../assets/data/wellnessData";
import styles from "./YogaMindfulness.module.css";

const YogaCard = ({ item, index }) => {
  const navigate = useNavigate();

  return (
    <motion.article
      className={styles.card}
      onClick={() => navigate("/category/yoga")}
      role="button"
      tabIndex={0}
      aria-label={`${item.title} — ${item.description}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate("/category/yoga");
        }
      }}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-4%" }}
      transition={{
        duration: 0.6,
        delay: (index % 3) * 0.09,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover="hover"
    >
      <div className={styles.imageWrapper} aria-hidden="true">
        <motion.div
          className={styles.image}
          style={{ backgroundImage: `url(${item.image})` }}
          variants={{
            hover: { scale: 1.07, transition: { duration: 0.55 } },
          }}
        />
        <div className={styles.overlay} />
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{item.title}</h3>
        <p className={styles.description}>{item.description}</p>
        <div className={styles.link}>
          <span>Explore</span>
          <FiArrowRight className={styles.linkIcon} aria-hidden="true" />
        </div>
      </div>
    </motion.article>
  );
};

const YogaMindfulness = () => (
  <FitnessSection
    id="yoga-mindfulness"
    label="MIND & BODY"
    title="Yoga &"
    titleAccent="Mindfulness"
    subtitle="Slow down, reconnect and find your balance through mindful movement and meditation."
    viewAllHref="/category/yoga"
    viewAllText="View All Yoga"
    neonColor="#39ff14"
  >
    <div
      className={styles.grid}
      role="list"
      aria-label="Yoga and mindfulness experiences"
    >
      {YOGA_MINDFULNESS_ITEMS.map((item, index) => (
        <div key={item.id} role="listitem">
          <YogaCard item={item} index={index} />
        </div>
      ))}
    </div>
  </FitnessSection>
);

export default YogaMindfulness;