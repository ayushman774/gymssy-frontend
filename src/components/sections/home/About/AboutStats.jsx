import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import styles from "./AboutStats.module.css";

gsap.registerPlugin(ScrollTrigger);

// ── Stats data ────────────────────────────────────────────────────────────
const STATS = [
  {
    id: "members",
    value: 5000,
    suffix: "+",
    label: "Members",
    sublabel: "Active & growing",
    color: "neon",
  },
  {
    id: "trainers",
    value: 50,
    suffix: "+",
    label: "Trainers",
    sublabel: "World certified",
    color: "blue",
  },
  {
    id: "experience",
    value: 10,
    suffix: "+",
    label: "Years",
    sublabel: "Of excellence",
    color: "neon",
  },
  {
    id: "transformations",
    value: 1000,
    suffix: "+",
    label: "Transformed",
    sublabel: "Lives changed",
    color: "blue",
  },
];

// ── useCountUp hook ───────────────────────────────────────────────────────
const useCountUp = ({ end, duration = 2, delay = 0, start = false }) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef({ value: 0 });
  const tweenRef = useRef(null);

  useEffect(() => {
    if (!start) return;

    // Kill any existing tween
    tweenRef.current?.kill();

    tweenRef.current = gsap.to(counterRef.current, {
      value: end,
      duration,
      delay,
      ease: "power2.out",
      onUpdate: () => {
        setCount(Math.round(counterRef.current.value));
      },
      onComplete: () => {
        setCount(end);
      },
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, [start, end, duration, delay]);

  return count;
};

// ── StatCard ──────────────────────────────────────────────────────────────
const StatCard = ({ stat, index, isInView }) => {
  const count = useCountUp({
    end: stat.value,
    duration: 2.2,
    delay: index * 0.15,
    start: isInView,
  });

  const isNeon = stat.color === "neon";

  return (
    <motion.div
      className={`${styles.statCard} ${isNeon ? styles.statCardNeon : styles.statCardBlue}`}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.6,
        delay: 0.4 + index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        y: -4,
        transition: { duration: 0.25 },
      }}
    >
      {/* Glow effect */}
      <div
        className={`${styles.cardGlow} ${isNeon ? styles.glowNeon : styles.glowBlue}`}
        aria-hidden="true"
      />

      {/* Top accent line */}
      <div
        className={`${styles.cardAccent} ${isNeon ? styles.accentNeon : styles.accentBlue}`}
        aria-hidden="true"
      />

      {/* Counter */}
      <div className={styles.counterWrapper}>
        <span
          className={`${styles.counter} ${isNeon ? styles.counterNeon : styles.counterBlue}`}
          aria-label={`${count}${stat.suffix} ${stat.label}`}
        >
          {count.toLocaleString()}
          <span className={styles.suffix}>{stat.suffix}</span>
        </span>
      </div>

      {/* Labels */}
      <div className={styles.labelWrapper}>
        <span className={styles.label}>{stat.label}</span>
        <span className={styles.sublabel}>{stat.sublabel}</span>
      </div>
    </motion.div>
  );
};

// ── AboutStats ────────────────────────────────────────────────────────────
const AboutStats = ({ isInView }) => {
  return (
    <div className={styles.statsWrapper}>
      {/* Section micro label */}
      <motion.p
        className={styles.statsLabel}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        By the numbers
      </motion.p>

      {/* Stats grid */}
      <div
        className={styles.statsGrid}
        role="list"
        aria-label="Gymsssy Fitness statistics"
      >
        {STATS.map((stat, index) => (
          <StatCard
            key={stat.id}
            stat={stat}
            index={index}
            isInView={isInView}
          />
        ))}
      </div>
    </div>
  );
};

export default AboutStats;
