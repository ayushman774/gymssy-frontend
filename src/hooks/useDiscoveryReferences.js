import { useCallback, useEffect, useState } from "react";
import { fetchDiscoveryReferences } from "../services/discoveryService";

export default function useDiscoveryReferences() {
  const [version, setVersion] = useState(0);
  const [state, setState] = useState({ categories: [], cities: [], resolvedVersion: null, error: null });
  const retry = useCallback(() => setVersion((current) => current + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    fetchDiscoveryReferences({ signal: controller.signal })
      .then((data) => setState({ ...data, resolvedVersion: version, error: null }))
      .catch((error) => {
        if (error?.name !== "AbortError") setState((current) => ({ ...current, resolvedVersion: version, error }));
      });
    return () => controller.abort();
  }, [version]);

  return { ...state, loading: state.resolvedVersion !== version, retry };
}
