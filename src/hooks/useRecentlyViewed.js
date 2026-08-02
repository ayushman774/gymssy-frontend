import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getRawRecentlyViewed,
  recordGymView,
  removeFromRecentlyViewed,
  clearRecentlyViewed,
} from "../utils/recentlyViewed";
import { FEATURED_GYMS_RECENT } from "../assets/data/marketplace";

const DISPLAY_LIMIT = 6;

const useRecentlyViewed = () => {
  const [rawList, setRawList] = useState([]);

  /* ── Read from localStorage on mount ── */
  useEffect(() => {
    setRawList(getRawRecentlyViewed());
  }, []);

  /* ── Listen for storage changes across tabs ── */
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "recentlyViewedGyms") {
        setRawList(getRawRecentlyViewed());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  /* ── Match slugs → full gym objects ── */
  const gyms = useMemo(() => {
    if (!rawList.length) return [];

    // Build a lookup map from the dataset
    const gymMap = Object.fromEntries(
      FEATURED_GYMS_RECENT.map((gym) => [gym.slug, gym]),
    );

    return rawList
      .filter((item) => gymMap[item.slug])
      .map((item) => ({
        ...gymMap[item.slug],
        viewedAt: item.viewedAt,
      }))
      .slice(0, DISPLAY_LIMIT);
  }, [rawList]);

  /* ── Actions ── */
  const refresh = useCallback(() => {
    setRawList(getRawRecentlyViewed());
  }, []);

  const recordView = useCallback(
    (slug) => {
      recordGymView(slug);
      refresh();
    },
    [refresh],
  );

  const removeItem = useCallback(
    (slug) => {
      removeFromRecentlyViewed(slug);
      refresh();
    },
    [refresh],
  );

  const clearAll = useCallback(() => {
    clearRecentlyViewed();
    refresh();
  }, [refresh]);

  return {
    gyms,
    isEmpty: gyms.length === 0,
    recordView,
    removeItem,
    clearAll,
    refresh,
  };
};

export default useRecentlyViewed;
