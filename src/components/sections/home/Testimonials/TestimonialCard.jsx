import { useRef } from "react";
import { motion } from "framer-motion";
import styles from "./Testimonials.module.css";

const StarRating = ({ rating }) => {
  return (
    <div className={styles.stars}>
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.span
          key={i}
          className={`${styles.star} ${i < rating ? styles.starFilled : styles.starEmpty}`}
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{
            delay: i * 0.1,
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
        >
          ★
        </motion.span>
      ))}
    </div>
  );
};

const TestimonialCard = ({ testimonial, isActive, index }) => {
  const cardRef = useRef(null);

  return (
    <motion.div
      ref={cardRef}
      className={`${styles.card} ${isActive ? styles.cardActive : ""}`}
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {/* Floating glow orb */}
      <div className={styles.cardGlow} aria-hidden="true" />

      {/* Quote mark */}
      <div className={styles.quoteMark} aria-hidden="true">
        &ldquo;
      </div>

      {/* Rating */}
      <StarRating rating={testimonial.rating} />

      {/* Quote text */}
      <blockquote className={styles.quote}>{testimonial.quote}</blockquote>

      {/* Achievement badge */}
      <div className={styles.achievement}>
        <span className={styles.achievementIcon}>⚡</span>
        <span className={styles.achievementText}>
          {testimonial.achievement}
        </span>
      </div>

      {/* Member info */}
      <div className={styles.memberInfo}>
        <div className={styles.avatarWrapper}>
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className={styles.avatar}
            loading="lazy"
            width={56}
            height={56}
          />
          <div className={styles.avatarRing} aria-hidden="true" />
        </div>
        <div className={styles.memberDetails}>
          <p className={styles.memberName}>{testimonial.name}</p>
          <p className={styles.memberRole}>{testimonial.role}</p>
          <p className={styles.memberDuration}>{testimonial.duration}</p>
        </div>
      </div>

      {/* Card border shine */}
      <div className={styles.cardShine} aria-hidden="true" />
    </motion.div>
  );
};

export default TestimonialCard;
