import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomerAuth } from "../../context/CustomerAuthContext.jsx";
import { getNotifications, markAllNotificationsRead, markNotificationRead } from "../../services/notificationService.js";
import styles from "./NotificationBell.module.css";

export default function NotificationBell() {
  const { token, isAuthenticated } = useCustomerAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const root = useRef(null);
  const load = useCallback(async () => {
    if (!token) return;
    try {
      const result = await getNotifications(token);
      setItems(result.data || []);
      setUnread(result.unreadCount || 0);
      setError("");
    } catch (err) { setError(err.message || "Unable to load notifications."); }
  }, [token]);
  useEffect(() => {
    if (!isAuthenticated) return;
    const initial = setTimeout(load, 0);
    const interval = setInterval(load, 60000);
    return () => { clearTimeout(initial); clearInterval(interval); };
  }, [isAuthenticated, load]);
  useEffect(() => {
    if (!open) return;
    const close = (event) => { if (!root.current?.contains(event.target)) setOpen(false); };
    const escape = (event) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", close); document.removeEventListener("keydown", escape); };
  }, [open]);
  if (!isAuthenticated) return null;
  const openNotification = async (item) => {
    setOpen(false);
    if (!item.readAt) {
      try { await markNotificationRead(token, item.id); setItems(previous => previous.map(entry => entry.id === item.id ? { ...entry, readAt: new Date().toISOString() } : entry)); setUnread(count => Math.max(0, count - 1)); }
      catch { /* Navigation should still work if marking read fails. */ }
    }
    if (item.href?.startsWith("/bookings/")) navigate(item.href);
  };
  const markAll = async () => {
    setBusy(true);
    try { await markAllNotificationsRead(token); setItems(previous => previous.map(item => ({ ...item, readAt: item.readAt || new Date().toISOString() }))); setUnread(0); setError(""); }
    catch (err) { setError(err.message || "Unable to update notifications."); }
    finally { setBusy(false); }
  };
  return <div className={styles.root} ref={root}>
    <button type="button" className={styles.bell} aria-label={`Notifications, ${unread} unread`} aria-expanded={open} onClick={() => { setOpen(value => !value); if (!open) load(); }}>
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></svg>
      {unread > 0 && <span className={styles.count}>{unread > 99 ? "99+" : unread}</span>}
    </button>
    {open && <section className={styles.panel} aria-label="Recent notifications">
      <div className={styles.heading}><h2>Notifications</h2>{unread > 0 && <button type="button" disabled={busy} onClick={markAll}>Mark all read</button>}</div>
      {error && <p className={styles.error} role="alert">{error}</p>}
      {!items.length ? <p className={styles.empty}>No notifications yet.</p> : <div className={styles.list}>{items.map(item => <button key={item.id} type="button" className={`${styles.item} ${!item.readAt ? styles.unread : ""}`} onClick={() => openNotification(item)}>
        <span className={styles.dot} aria-hidden="true" /><span className={styles.copy}><strong>{item.title}</strong><span>{item.message}</span><small>{new Date(item.createdAt).toLocaleString("en-IN")}</small></span>
      </button>)}</div>}
      <button type="button" className={styles.allLink} onClick={() => { setOpen(false); navigate("/profile/notifications"); }}>View all notifications →</button>
    </section>}
  </div>;
}
