import { useEffect, useId, useRef, useState } from "react";
import { FiCrosshair, FiMapPin, FiSearch, FiX } from "react-icons/fi";
import { useCustomerLocation } from "../../context/CustomerLocationContext.jsx";
import {
  loadLocationSuggestions,
  LOCATION_AUTOCOMPLETE_MIN_QUERY_LENGTH,
} from "../../services/locationService.js";
import {
  autocompleteErrorMessage,
  autocompleteListState,
  isCurrentAutocompleteRequest,
  nextAutocompleteIndex,
} from "../../utils/locationAutocomplete.js";
import styles from "./CustomerLocationPicker.module.css";

export const LOCATION_AUTOCOMPLETE_DEBOUNCE_MS = 300;

export default function CustomerLocationPicker({ compact = false }) {
  const id = useId();
  const requestId = useRef(0);
  const {
    location,
    hasLocation,
    setSearchLocation,
    setDeviceLocation,
    clearLocation,
    isLocating,
    locationError,
    clearLocationError,
  } = useCustomerLocation();
  const [editing, setEditing] = useState(!hasLocation);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const showControls = compact || editing || !hasLocation;
  const listState = autocompleteListState({
    open,
    loading,
    error: searchError,
    suggestionCount: suggestions.length,
    queryLength: query.trim().length,
    minQueryLength: LOCATION_AUTOCOMPLETE_MIN_QUERY_LENGTH,
  });

  useEffect(() => {
    const normalizedQuery = query.trim();
    if (normalizedQuery.length < LOCATION_AUTOCOMPLETE_MIN_QUERY_LENGTH) return undefined;
    const controller = new AbortController();
    const currentRequest = ++requestId.current;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setSearchError("");
      try {
        const results = await loadLocationSuggestions(normalizedQuery, undefined, { signal: controller.signal });
        if (!isCurrentAutocompleteRequest(requestId.current, currentRequest)) return;
        setSuggestions(results);
        setActiveIndex(results.length ? 0 : -1);
        setOpen(true);
      } catch (error) {
        if (!isCurrentAutocompleteRequest(requestId.current, currentRequest) || error?.name === "AbortError") return;
        setSuggestions([]);
        setActiveIndex(-1);
        setOpen(true);
        setSearchError(autocompleteErrorMessage(error));
      } finally {
        if (isCurrentAutocompleteRequest(requestId.current, currentRequest)) setLoading(false);
      }
    }, LOCATION_AUTOCOMPLETE_DEBOUNCE_MS);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const resetSearch = () => {
    requestId.current += 1;
    setQuery("");
    setSuggestions([]);
    setActiveIndex(-1);
    setOpen(false);
    setLoading(false);
    setSearchError("");
  };

  const choose = (suggestion) => {
    if (!setSearchLocation(suggestion)) {
      setSearchError("That location did not include valid coordinates. Choose another result.");
      return;
    }
    resetSearch();
    setEditing(false);
  };

  const locate = async () => {
    resetSearch();
    if (await setDeviceLocation()) setEditing(false);
  };

  const handleQueryChange = (event) => {
    const nextQuery = event.target.value;
    setQuery(nextQuery);
    clearLocationError();
    if (nextQuery.trim().length < LOCATION_AUTOCOMPLETE_MIN_QUERY_LENGTH) {
      requestId.current += 1;
      setSuggestions([]);
      setActiveIndex(-1);
      setOpen(false);
      setLoading(false);
      setSearchError("");
    } else {
      setOpen(true);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      return;
    }
    if (!open || !suggestions.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => nextAutocompleteIndex(index, event.key, suggestions.length));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => nextAutocompleteIndex(index, event.key, suggestions.length));
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      choose(suggestions[activeIndex]);
    }
  };

  return <section className={`${styles.root} ${compact ? styles.compact : ""}`} aria-labelledby={`${id}-heading`}>
    <div className={styles.headingRow}>
      <div><span className={styles.eyebrow}>YOUR SEARCH AREA</span><h3 id={`${id}-heading`}>Explore by location</h3></div>
      {hasLocation && !editing && <div className={styles.activeActions}><button type="button" onClick={() => { setEditing(true); clearLocationError(); }}>Change</button><button type="button" onClick={() => { clearLocation(); setEditing(true); resetSearch(); }}>Clear</button></div>}
    </div>

    {hasLocation && !compact && <div className={styles.activeLocation} role="status" aria-live="polite"><FiMapPin aria-hidden="true" /><div><span>Near</span><strong>{location.label}</strong></div></div>}

    {showControls && <div className={styles.controls}>
      <div className={styles.combobox}>
        <FiSearch className={styles.searchIcon} aria-hidden="true" />
        <input
          id={`${id}-input`}
          value={compact && hasLocation && !editing ? location.label : query}
          readOnly={compact && hasLocation && !editing}
          onClick={() => { if (compact && hasLocation && !editing) setEditing(true); }}
          onChange={handleQueryChange}
          onFocus={() => suggestions.length && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search area, locality, or city"
          role="combobox"
          aria-label={compact && hasLocation && !editing ? `Selected location: ${location.label}` : "Search for an area or location"}
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={`${id}-listbox`}
          aria-activedescendant={activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined}
        />
        {loading && <span className={styles.loading} role="status">Searching…</span>}
        {compact && hasLocation && <button type="button" className={styles.clearQuery} aria-label="Clear selected location" title="Clear location" onClick={() => { clearLocation(); setEditing(true); resetSearch(); }}><FiX aria-hidden="true" /></button>}
        {!hasLocation && query && !loading && <button type="button" className={styles.clearQuery} aria-label="Clear location search" onClick={resetSearch}><FiX aria-hidden="true" /></button>}
        {open && <div id={`${id}-listbox`} role="listbox" className={styles.options}>
          {listState === "error" ? <div className={styles.message} role="alert"><p>{searchError}</p><button type="button" onClick={() => setQuery((value) => `${value} `)}>Retry</button></div>
            : listState === "results" ? suggestions.map((suggestion, index) => <button
              id={`${id}-option-${index}`}
              key={suggestion.id || `${suggestion.latitude}:${suggestion.longitude}`}
              type="button"
              role="option"
              aria-selected={index === activeIndex}
              className={index === activeIndex ? styles.activeOption : ""}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(suggestion)}
            ><FiMapPin aria-hidden="true" /><span><strong>{suggestion.name || suggestion.area || suggestion.city || "Location"}</strong><small>{[suggestion.area, suggestion.city, suggestion.state].filter(Boolean).join(", ") || suggestion.label}</small></span></button>)
              : listState === "empty" ? <p className={styles.message}>No matching Indian locations found.</p> : null}
        </div>}
      </div>
      {!hasLocation && <span className={styles.or} aria-hidden="true">or</span>}
      {!hasLocation && <button type="button" className={styles.deviceButton} onClick={locate} disabled={isLocating}><FiCrosshair aria-hidden="true" />{isLocating ? "Locating…" : "Use my location"}</button>}
    </div>}

    {(locationError || searchError) && !open && <p className={styles.inlineError} role="alert">{locationError || searchError}</p>}
    <p className={styles.helper}>Location is requested only when you choose it. Clear it anytime to browse all published listings.</p>
    <p className={styles.attribution}>Location data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>, powered by <a href="https://www.geoapify.com/" target="_blank" rel="noreferrer">Geoapify</a>.</p>
  </section>;
}
