/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCustomerAuth } from "./CustomerAuthContext.jsx";
import { fetchFavoriteIds, saveFavorite, unsaveFavorite } from "../services/favoriteService.js";
import { favoriteKey } from "../utils/favoriteIdentity.js";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { token, isAuthenticated, loading: authLoading } = useCustomerAuth();
  const [keys, setKeys] = useState(() => new Set());
  const [pending, setPending] = useState(() => new Set());
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const refreshFavorites = useCallback(async (signal) => {
    if (!token || !isAuthenticated) { setKeys(new Set()); return; }
    try {
      const payload = await fetchFavoriteIds(token, { signal });
      setKeys(new Set((payload.data || []).map((item) => favoriteKey(item.targetType, item.targetId))));
      setError("");
    } catch (err) {
      if (err?.name !== "AbortError") setError(err?.message || "Unable to load favorites.");
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (authLoading) return;
    const controller = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshFavorites(controller.signal);
    return () => controller.abort();
  }, [authLoading, refreshFavorites]);

  const isFavorite = useCallback((targetType, targetId) => keys.has(favoriteKey(targetType, targetId)), [keys]);
  const isPending = useCallback((targetType, targetId) => pending.has(favoriteKey(targetType, targetId)), [pending]);

  const toggleFavorite = useCallback(async (targetType, targetId) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `${location.pathname}${location.search}` } });
      return false;
    }
    const key = favoriteKey(targetType, targetId);
    if (!targetType || !targetId || pending.has(key)) return false;
    const removing = keys.has(key);
    setPending((current) => new Set(current).add(key));
    setKeys((current) => { const next = new Set(current); removing ? next.delete(key) : next.add(key); return next; });
    try {
      if (removing) await unsaveFavorite(token, targetType, targetId);
      else await saveFavorite(token, targetType, targetId);
      setError("");
      return true;
    } catch (err) {
      setKeys((current) => { const next = new Set(current); removing ? next.add(key) : next.delete(key); return next; });
      setError(err?.message || "Unable to update favorites.");
      return false;
    } finally {
      setPending((current) => { const next = new Set(current); next.delete(key); return next; });
    }
  }, [isAuthenticated, keys, location.pathname, location.search, navigate, pending, token]);

  const value = useMemo(() => ({ isFavorite, isPending, toggleFavorite, refreshFavorites, error }), [isFavorite, isPending, toggleFavorite, refreshFavorites, error]);
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const value = useContext(FavoritesContext);
  if (!value) throw new Error("useFavorites must be used inside FavoritesProvider");
  return value;
}
