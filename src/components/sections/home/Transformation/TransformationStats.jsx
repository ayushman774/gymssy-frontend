import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { useEffect, useState } from "react";
import { TRANSFORMATION_STATS } from "../../../../assets/data/transformations";
import styles from "./TransformationStats.module.css";

// ── Animated counter ──────────────────────────────────────────────────────
const AnimatedCounter = ({ value, suffix, start }) => {
  const [display, setDisplay] = useState(0);
  const counterRef = useRef({ val: 0 });
  const tweenRef = useRef(null);

  useEffect(() => {
    if (!start) return;

    tweenRef.current?.kill();
    tweenRef.current = gsap.to(counterRef.current, {
      val: value,
      duration: 2.5,
      ease: "power2.out",
      onUpdate: () => {
        setDisplay(Math.round(counterRef.current.val));
      },
    });

    return () => tweenRef.current?.kill();
  }, [start, value]);

  return (
    <span className={styles.counterValue}>
      {display.toLocaleString()}
      <span className={styles.counterSuffix}>{suffix}</span>
    </span>
  );
};

// ── Single stat item ──────────────────────────────────────────────────────
const StatItem = ({ stat, index, start }) => {
  const isNeon = stat.color === "neon";

  return (
    <motion.div
      className={`
        ${styles.statItem}
        ${isNeon ? styles.statItemNeon : styles.statItemBlue}
      `}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={start ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {/* Top accent */}
      <div
        className={`
          ${styles.itemAccent}
          ${isNeon ? styles.accentNeon : styles.accentBlue}
        `}
        aria-hidden="true"
      />

      {/* Counter */}
      <AnimatedCounter value={stat.value} suffix={stat.suffix} start={start} />

      {/* Labels */}
      <span className={styles.itemLabel}>{stat.label}</span>
      <span className={styles.itemSublabel}>{stat.sublabel}</span>

      {/* Background glow */}
      <div
        className={`
          ${styles.itemGlow}
          ${isNeon ? styles.glowNeon : styles.glowBlue}
        `}
        aria-hidden="true"
      />
    </motion.div>
  );
};

const TransformationStats = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      className={styles.statsWrapper}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
    >
      {/* Label */}
      <motion.p
        className={styles.statsLabel}
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Real results. Real people.
      </motion.p>

      {/* Grid */}
      <div
        className={styles.statsGrid}
        role="list"
        aria-label="Transformation statistics"
      >
        {TRANSFORMATION_STATS.map((stat, i) => (
          <div key={stat.id} role="listitem">
            <StatItem stat={stat} index={i} start={isInView} />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default TransformationStats;
