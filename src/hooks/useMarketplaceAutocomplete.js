import { useEffect, useMemo, useState } from "react";
import { searchMarketplace } from "../services/discoveryService";
import { GLOBAL_SEARCH_DEBOUNCE_MS, GLOBAL_SEARCH_MIN_LENGTH, normalizeGlobalSearch } from "../utils/globalSearch";

export default function useMarketplaceAutocomplete(value, enabled = true) {
  const query = useMemo(() => normalizeGlobalSearch(value), [value]);
  const [state, setState] = useState({ query: "", listings: [], error: null });
  const valid = enabled && query.length >= GLOBAL_SEARCH_MIN_LENGTH;

  useEffect(() => {
    if (!valid) return undefined;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      searchMarketplace(query, { signal: controller.signal })
        .then(({ listings }) => setState({ query, listings, error: null }))
        .catch((error) => {
          if (error?.name !== "AbortError") setState({ query, listings: [], error });
        });
    }, GLOBAL_SEARCH_DEBOUNCE_MS);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query, valid]);

  const resolved = valid && state.query === query;
  return {
    query,
    listings: resolved ? state.listings : [],
    error: resolved ? state.error : null,
    loading: valid && !resolved,
    ready: valid && resolved,
    valid,
  };
}
