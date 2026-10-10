import { useCallback, useEffect, useState } from "react";
import { fetchDiscovery } from "../services/discoveryService";

export default function useDiscovery(filters, enabled = true) {
  const [state, setState] = useState({ listings: [], pagination: { page: 1, limit: 6, total: 0, totalPages: 0 }, resolvedKey: null, error: null });
  const [requestVersion, setRequestVersion] = useState(0);
  const retry = useCallback(() => setRequestVersion((value) => value + 1), []);
  const requestKey = JSON.stringify([filters, requestVersion]);

  useEffect(() => {
    if (!enabled) return undefined;
    const controller = new AbortController();
    let active = true;
    fetchDiscovery(filters, { signal: controller.signal })
      .then((result) => {
        if (active) setState({ ...result, resolvedKey: requestKey, error: null });
      })
      .catch((error) => {
        if (active && error?.name !== "AbortError") setState((current) => ({ ...current, resolvedKey: requestKey, error }));
      });
    return () => { active = false; controller.abort(); };
  }, [filters, enabled, requestKey]);

  return { ...state, loading: enabled && state.resolvedKey !== requestKey, retry };
}
