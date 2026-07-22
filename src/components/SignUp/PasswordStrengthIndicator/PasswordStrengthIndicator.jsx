import React, { useMemo } from "react";
import { motion } from "framer-motion";
import styles from "./PasswordStrengthIndicator.module.css";

// ─── Strength calculator ──────────────────────────────────────────────────────

const getStrength = (password) => {
  if (!password) return { score: 0, label: "", color: "" };

  let score = 0;
  const checks = {
    length: password.length >= 8,
    longLength: password.length >= 12,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    symbols: /[^a-zA-Z0-9]/.test(password),
  };

  if (checks.length) score += 1;
  if (checks.longLength) score += 1;
  if (checks.lowercase) score += 1;
  if (checks.uppercase) score += 1;
  if (checks.numbers) score += 1;
  if (checks.symbols) score += 1;

  // Map to 4 levels
  let level, label, color;
  if (score <= 1) {
    level = 1;
    label = "Weak";
    color = "#ef4444";
  } else if (score <= 3) {
    level = 2;
    label = "Fair";
    color = "#f59e0b";
  } else if (score <= 4) {
    level = 3;
    label = "Good";
    color = "#3b82f6";
  } else {
    level = 4;
    label = "Strong";
    color = "#39ff14";
  }

  return { score: level, label, color, checks };
};

// ─── Component ────────────────────────────────────────────────────────────────

const PasswordStrengthIndicator = ({ password }) => {
  const { score, label, color, checks } = useMemo(
    () => getStrength(password),
    [password],
  );

  const hints = [
    { text: "At least 8 characters", met: checks?.length },
    { text: "Uppercase letter", met: checks?.uppercase },
    { text: "Number", met: checks?.numbers },
    { text: "Special character", met: checks?.symbols },
  ];

  return (
    <div className={styles.wrapper}>
      {/* Strength bars */}
      <div className={styles.barsRow}>
        <div className={styles.bars}>
          {[1, 2, 3, 4].map((level) => (
            <div key={level} className={styles.barTrack}>
              <motion.div
                className={styles.barFill}
                animate={{
                  width: score >= level ? "100%" : "0%",
                  backgroundColor: score >= level ? color : "transparent",
                }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              />
            </div>
          ))}
        </div>

        {label && (
          <motion.span
            className={styles.strengthLabel}
            animate={{ color }}
            transition={{ duration: 0.3 }}
          >
            {label}
          </motion.span>
        )}
      </div>

      {/* Hints */}
      <div className={styles.hints}>
        {hints.map((hint, i) => (
          <motion.span
            key={i}
            className={`${styles.hint} ${hint.met ? styles.hintMet : ""}`}
            animate={{ opacity: 1 }}
          >
            <span className={styles.hintDot} />
            {hint.text}
          </motion.span>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
