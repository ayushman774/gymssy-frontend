import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiPlay, FiUsers, FiAward, FiZap } from "react-icons/fi";
import styles from "./HeroContent.module.css";

/**
 * SplitWord
 * Wraps each CHARACTER of a single word in a span.
 * The word itself is wrapped in a span with inline-flex
 * so characters NEVER break across lines.
 * White space between words is handled by the parent.
 */
const SplitWord = ({ word, wordIndex }) => {
  return (
    <span className={styles.word} aria-hidden="true">
      {word.split("").map((char, charIndex) => (
        <span
          key={`${wordIndex}-${charIndex}`}
          className={`char ${styles.char}`}
        >
          {char}
        </span>
      ))}
    </span>
  );
};

/**
 * SplitText
 * Splits a full string into words, each word into chars.
 * Preserves natural word wrapping — words wrap as a unit,
 * characters never split across lines.
 */
const SplitText = ({ text, className, neonWords = [] }) => {
  const words = text.split(" ");

  return (
    <span className={className} aria-label={text}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className={styles.wordWrapper}>
          <SplitWord
            word={word}
            wordIndex={wordIndex}
            isNeon={neonWords.includes(word)}
          />
          {/* Space between words (not inside word) */}
          {wordIndex < words.length - 1 && (
            <span className={styles.wordSpace} aria-hidden="true">
              {"\u00A0"}
            </span>
          )}
        </span>
      ))}
    </span>
  );
};

const HeroContent = ({ animRefs }) => {
  return (
    <div className={styles.content}>
      {/* ── HEADLINE ──────────────────────────────────── */}
      <h1
        className={styles.headline}
        aria-label="Train Hard. Transform Your Life."
      >
        {/* Line 1 */}
        <span ref={animRefs.headline1} className={styles.headlineLine}>
          <SplitText text="India's Fitness Marketplace" />
        </span>

        {/* Line 2 */}
        <span
          ref={animRefs.headline2}
          className={`${styles.headlineLine} ${styles.headlineLineNeon}`}
        >
          <SplitText text="Find, Compare & Book Fitness Classes" />
        </span>
      </h1>

      {/* ── SUBHEADLINE ───────────────────────────────── */}
      <p ref={animRefs.subheadline} className={styles.subheadline}>
        Book Gym, Yoga, Dance, Zumba & all Fitness Classes Near You
      </p>

      {/* ── CTA BUTTONS ───────────────────────────────── */}
      <div className={styles.ctaGroup}>
        <Link
          ref={animRefs.ctaPrimary}
          to="/membership"
          className={`${styles.ctaButton} ${styles.ctaPrimary}`}
        >
          <span>Join Now</span>
          <span className={styles.ctaIcon}>
            <FiArrowRight />
          </span>
          <span className={styles.ctaGlow} aria-hidden="true" />
        </Link>

        <Link
          ref={animRefs.ctaSecondary}
          to="/programs"
          className={`${styles.ctaButton} ${styles.ctaSecondary}`}
        >
          <span className={styles.ctaPlayIcon}>
            <FiPlay size={12} />
          </span>
          <span>Explore Programs</span>
        </Link>
      </div>

      {/* ── STATS ─────────────────────────────────────── */}
      <div ref={animRefs.stats} className={styles.stats}>
        <div className={styles.statItem}>
          <FiUsers className={styles.statIcon} aria-hidden="true" />
          <div className={styles.statText}>
            <span className={styles.statValue}>10K+</span>
            <span className={styles.statLabel}>Members</span>
          </div>
        </div>

        <div className={styles.statDivider} aria-hidden="true" />

        <div className={styles.statItem}>
          <FiAward className={styles.statIcon} aria-hidden="true" />
          <div className={styles.statText}>
            <span className={styles.statValue}>50+</span>
            <span className={styles.statLabel}>Elite Coaches</span>
          </div>
        </div>

        <div className={styles.statDivider} aria-hidden="true" />

        <div className={styles.statItem}>
          <FiZap className={styles.statIcon} aria-hidden="true" />
          <div className={styles.statText}>
            <span className={styles.statValue}>15</span>
            <span className={styles.statLabel}>Years Strong</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroContent;
