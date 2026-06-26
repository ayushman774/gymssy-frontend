import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiMapPin, FiX } from "react-icons/fi";
import styles from "./SearchBar.module.css";
import { gymsData } from "../../data/gymsData";

const suggestions = [
  ...new Set(gymsData.map((g) => g.city)),
  ...gymsData.map((g) => g.name),
];

const SearchBar = ({ value, onChange }) => {
  const [focused, setFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  const filteredSuggestions = value.trim()
    ? suggestions
        .filter((s) => s.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5)
    : suggestions.slice(0, 5);

  const handleSelect = (suggestion) => {
    onChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div className={styles.searchWrapper}>
      <div
        className={`${styles.searchBox} ${focused ? styles.searchBoxFocused : ""}`}
      >
        {/* Location pulse icon */}
        <div className={styles.locationIcon}>
          <FiMapPin className={styles.locationIconSvg} />
          <span className={styles.locationPulse} />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => {
            setFocused(true);
            setShowSuggestions(true);
          }}
          onBlur={() => {
            setFocused(false);
            setTimeout(() => setShowSuggestions(false), 180);
          }}
          placeholder="Search by city, area, or gym name…"
          className={styles.input}
          autoComplete="off"
          spellCheck={false}
        />

        <div className={styles.rightActions}>
          <AnimatePresence>
            {value && (
              <motion.button
                key="clear"
                className={styles.clearBtn}
                onClick={handleClear}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.2 }}
                aria-label="Clear search"
              >
                <FiX />
              </motion.button>
            )}
          </AnimatePresence>

          <button className={styles.searchBtn} aria-label="Search">
            <FiSearch className={styles.searchBtnIcon} />
            <span className={styles.searchBtnText}>Search</span>
          </button>
        </div>

        {/* Glow border */}
        <div
          className={`${styles.focusGlow} ${focused ? styles.focusGlowActive : ""}`}
        />
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <motion.div
            className={styles.suggestions}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <span className={styles.suggestionsLabel}>
              {value ? "Matching locations" : "Popular locations"}
            </span>
            {filteredSuggestions.map((s, i) => (
              <button
                key={s + i}
                className={styles.suggestionItem}
                onMouseDown={() => handleSelect(s)}
              >
                <FiMapPin className={styles.suggestionIcon} />
                <span className={styles.suggestionText}>{s}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
