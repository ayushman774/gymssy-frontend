import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomerAuth } from "../../context/CustomerAuthContext.jsx";
import { getNotifications, markAllNotificationsRead, markNotificationRead } from "../../services/notificationService.js";
import styles from "./NotificationsPage.module.css";

export default function NotificationsPage() {
  const { token } = useCustomerAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try { const result = await getNotifications(token, page); setItems(result.data || []); setPages(result.pagination?.totalPages || 1); setUnread(result.unreadCount || 0); setError(""); }
    catch (err) { setError(err.message || "Unable to load notifications."); }
    finally { setLoading(false); }
  }, [token, page]);
  useEffect(() => { const timeout = setTimeout(load, 0); return () => clearTimeout(timeout); }, [load]);
  const select = async (item) => {
    if (!item.readAt) {
      try { await markNotificationRead(token, item.id); setItems(previous => previous.map(entry => entry.id === item.id ? { ...entry, readAt: new Date().toISOString() } : entry)); setUnread(count => Math.max(0, count - 1)); }
      catch (err) { setError(err.message || "Could not mark notification as read."); }
    }
    if (item.href?.startsWith("/bookings/")) navigate(item.href);
  };
  const markAll = async () => {
    try { await markAllNotificationsRead(token); await load(); }
    catch (err) { setError(err.message || "Unable to mark notifications read."); }
  };
  return <section className={styles.page}>
    <div className={styles.heading}><div><p>STAY UPDATED</p><h1>Notifications</h1><span>{unread} unread</span></div>{unread > 0 && <button type="button" onClick={markAll}>Mark all as read</button>}</div>
    {error && <p role="alert" className={styles.error}>{error}</p>}
    {loading ? <p className={styles.empty}>Loading notifications…</p> : items.length ? <div className={styles.list}>{items.map(item => <button key={item.id} type="button" className={`${styles.item} ${!item.readAt ? styles.unread : ""}`} onClick={() => select(item)}><span className={styles.icon}>♧</span><span><strong>{item.title}</strong><span>{item.message}</span><small>{new Date(item.createdAt).toLocaleString("en-IN")}</small></span>{!item.readAt && <i aria-label="Unread" />}</button>)}</div> : <p className={styles.empty}>You're all caught up. Booking updates will appear here.</p>}
    <div className={styles.pagination}><button disabled={page <= 1 || loading} onClick={() => setPage(value => value - 1)}>Previous</button><span>Page {page} of {pages}</span><button disabled={page >= pages || loading} onClick={() => setPage(value => value + 1)}>Next</button></div>
  </section>;
}
