import { useCallback, useEffect, useState } from "react";
import { useCustomerAuth } from "../context/CustomerAuthContext.jsx";
import { fetchRecentlyViewed, recordRecentlyViewed, removeRecentlyViewed } from "../services/recentlyViewedService.js";

const DISPLAY_LIMIT = 6;

function toCard(gym) {
  const location = typeof gym.location === "string" ? gym.location : [gym.location?.area, gym.location?.city].filter(Boolean).join(", ");
  return {
    id: gym._id, slug: gym.slug, name: gym.name, category: gym.category || "Gym", location,
    distance: gym.distance || "", rating: Number(gym.rating) || 0,
    reviews: Number(gym.reviewCount) || (Array.isArray(gym.reviews) ? gym.reviews.length : 0),
    priceFrom: Number(gym.priceFrom) || 0, isOpen: Boolean(gym.openNow), isVerified: Boolean(gym.verified),
    image: { url: gym.images?.cover || "", alt: gym.name || "Gym" }, viewedAt: gym.viewedAt,
  };
}

export default function useRecentlyViewed() {
  const { token, isAuthenticated } = useCustomerAuth();
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async (signal) => {
    if (!token || !isAuthenticated) { setGyms([]); return; }
    setLoading(true); setError("");
    try {
      const payload = await fetchRecentlyViewed(token, { signal });
      setGyms((Array.isArray(payload?.data) ? payload.data : []).slice(0, DISPLAY_LIMIT).map(toCard));
    } catch (err) {
      if (err?.name !== "AbortError") setError(err?.message || "Unable to load recently viewed gyms.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    const controller = new AbortController();
    // The effect intentionally starts the external API synchronization.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh(controller.signal);
    return () => controller.abort();
  }, [refresh]);

  const recordView = useCallback(async (gymId) => {
    if (token && isAuthenticated && gymId) await recordRecentlyViewed(token, gymId);
  }, [isAuthenticated, token]);

  const removeItem = useCallback(async (gymId) => {
    if (!token || !gymId) return;
    await removeRecentlyViewed(token, gymId);
    setGyms((current) => current.filter((gym) => gym.id !== gymId));
  }, [token]);

  return { gyms, loading, error, isEmpty: !loading && gyms.length === 0, recordView, removeItem, refresh };
}
