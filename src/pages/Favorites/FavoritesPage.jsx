import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DiscoveryCard from "../../components/Discover/DiscoveryCard/DiscoveryCard.jsx";
import { useCustomerAuth } from "../../context/CustomerAuthContext.jsx";
import { useFavorites } from "../../context/FavoritesContext.jsx";
import { fetchFavorites } from "../../services/favoriteService.js";
import styles from "./FavoritesPage.module.css";

export default function FavoritesPage() {
  const { token, isAuthenticated, loading: authLoading } = useCustomerAuth();
  const { refreshFavorites } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [state, setState] = useState({ loading: true, error: "", data: [], pagination: null });
  useEffect(() => { if (!authLoading && !isAuthenticated) navigate("/login", { replace: true, state: { from: location.pathname } }); }, [authLoading, isAuthenticated, location.pathname, navigate]);
  const load = useCallback(async () => {
    if (!token) return;
    setState((current) => ({ ...current, loading: true, error: "" }));
    try { const payload = await fetchFavorites(token, { page, limit: 20 }); setState({ loading: false, error: "", data: payload.data || [], pagination: payload.pagination }); }
    catch (error) { setState((current) => ({ ...current, loading: false, error: error?.message || "Unable to load favorites." })); }
  }, [page, token]);
  useEffect(() => { load(); }, [load]);
  if (authLoading || !isAuthenticated) return null;
  return <main className={styles.page}>
    <header className={styles.header}><p>YOUR GYMSSY</p><h1>Favorites</h1><span>Saved venues and professionals, all in one place.</span></header>
    {state.loading ? <div className={styles.state} role="status">Loading favorites…</div> : state.error ? <div className={styles.state} role="alert"><p>{state.error}</p><button onClick={load}>Retry</button></div> : state.data.length === 0 ? <div className={styles.state}><h2>No favorites yet</h2><p>Save venues and professionals while browsing Gymssy.</p><button onClick={() => navigate("/discover")}>Explore marketplace</button></div> : <>
      <div className={styles.grid}>{state.data.map((favorite) => <DiscoveryCard key={favorite.favoriteId} item={favorite.listing} onView={(href) => navigate(href)} />)}</div>
      <div className={styles.pagination}><button disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Previous</button><span>Page {page} of {state.pagination?.totalPages || 1}</span><button disabled={page >= (state.pagination?.totalPages || 1)} onClick={() => setPage((value) => value + 1)}>Next</button></div>
      <button className={styles.refresh} onClick={async () => { await refreshFavorites(); await load(); }}>Refresh saved state</button>
    </>}
  </main>;
}
