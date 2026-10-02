import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowRight, FiCheck, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import useMarketplaceAutocomplete from "../../hooks/useMarketplaceAutocomplete";
import { TYPE_LABELS, FALLBACK_IMAGE } from "../Discover/DiscoveryCard/discoveryCardUtils";
import { globalSearchUrl, moveSuggestionIndex, suggestionMeta } from "../../utils/globalSearch";
import styles from "../sections/home/Hero/HeroContent.module.css";

export default function GlobalMarketplaceSearch({ accent = "#39ff14" }) {
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const autocomplete = useMarketplaceAutocomplete(value, focused);
  const open = focused && autocomplete.valid;

  useEffect(() => {
    const close = (event) => { if (!rootRef.current?.contains(event.target)) { setFocused(false); setActiveIndex(-1); } };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const submit = () => navigate(globalSearchUrl(value));
  const select = (item) => navigate(item.href);
  const onKeyDown = (event) => {
    if (event.key === "Escape") { setFocused(false); setActiveIndex(-1); return; }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (!autocomplete.listings.length) return;
      event.preventDefault();
      setActiveIndex((current) => moveSuggestionIndex(current, event.key === "ArrowDown" ? "next" : "previous", autocomplete.listings.length));
      return;
    }
    if (event.key === "Enter" && activeIndex >= 0 && autocomplete.listings[activeIndex]) {
      event.preventDefault();
      select(autocomplete.listings[activeIndex]);
    }
  };

  return <form ref={rootRef} className={styles.searchBar} role="search" onSubmit={(event) => { event.preventDefault(); submit(); }}>
    <div className={styles.globalSearchField}>
      <FiSearch className={styles.searchFieldIcon} style={{ color: accent }} aria-hidden="true" />
      <div className={styles.searchFieldText}>
        <input id="global-marketplace-search" type="search" value={value} onChange={(event) => { setValue(event.target.value); setActiveIndex(-1); }} onFocus={() => setFocused(true)} onKeyDown={onKeyDown} placeholder="Search gyms, trainers, yoga, boxing…" className={styles.searchInput} autoComplete="off" role="combobox" aria-expanded={open} aria-controls="global-search-suggestions" aria-autocomplete="list" aria-activedescendant={activeIndex >= 0 ? `global-search-option-${activeIndex}` : undefined} />
        <span className={styles.searchFieldSub}>Search the complete Gymssy marketplace</span>
      </div>
    </div>
    <button className={styles.searchBtn} style={{ background: accent }} aria-label="Search marketplace"><span>Search Gymssy</span><FiArrowRight aria-hidden="true" /></button>
    <AnimatePresence>{open && <motion.div id="global-search-suggestions" className={styles.marketplaceSuggestions} role="listbox" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
      {autocomplete.loading ? <div className={styles.marketplaceSuggestionState}>Searching marketplace…</div> : autocomplete.error ? <div className={styles.marketplaceSuggestionState}>Unable to load suggestions. Press Enter to search all.</div> : autocomplete.ready && autocomplete.listings.length === 0 ? <div className={styles.marketplaceSuggestionState}>No matching listings. Press Enter to search all.</div> : autocomplete.listings.map((item, index) => <button id={`global-search-option-${index}`} key={`${item.entityType}-${item.id}`} type="button" role="option" aria-selected={index === activeIndex} className={`${styles.marketplaceSuggestion} ${index === activeIndex ? styles.marketplaceSuggestionActive : ""}`} onMouseEnter={() => setActiveIndex(index)} onMouseDown={(event) => { event.preventDefault(); select(item); }}>
        <img src={item.image?.url || FALLBACK_IMAGE} alt="" onError={(event) => { event.currentTarget.src = FALLBACK_IMAGE; }} />
        <span className={styles.marketplaceSuggestionCopy}><strong>{item.name}</strong><small>{suggestionMeta(item) || "View marketplace listing"}</small></span>
        <span className={styles.marketplaceSuggestionType}>{item.verified && <FiCheck aria-label="Verified" />}{TYPE_LABELS[item.entityType] || item.entityType}</span>
      </button>)}
    </motion.div>}</AnimatePresence>
  </form>;
}
