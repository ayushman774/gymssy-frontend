import { useCallback, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useCustomerAuth } from "../../context/CustomerAuthContext.jsx";
import { getBookings } from "../../services/bookingService.js";
import { BOOKING_TYPE_LABELS, formatBookingDateTime } from "../../utils/booking.js";
import BookingStatus from "../../components/Bookings/BookingStatus.jsx";
import styles from "./BookingsPage.module.css";

const FILTERS = [
  { id: "all", label: "All bookings" },
  { id: "requested", label: "Pending" },
  { id: "confirmed", label: "Confirmed" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
  { id: "rejected", label: "Rejected" },
];

export default function BookingsPage() {
  const { token, loading: authLoading, isAuthenticated } = useCustomerAuth();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      setPayload(await getBookings(token, { page, limit: 12 }));
    } catch (requestError) {
      setError(requestError?.message || "Unable to load your bookings.");
    } finally {
      setLoading(false);
    }
  }, [token, page]);

  useEffect(() => { load(); }, [load]);

  if (authLoading) return <main className={styles.page}><div className={styles.state}>Restoring your account…</div></main>;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: "/profile/bookings" }} />;

  const bookings = payload?.data || [];
  const pagination = payload?.pagination;
  const visible = filter === "all" ? bookings : bookings.filter((item) => item.status === filter);
  const total = pagination?.total ?? pagination?.totalItems ?? bookings.length;
  const counts = {
    requested: bookings.filter((item) => item.status === "requested").length,
    confirmed: bookings.filter((item) => item.status === "confirmed").length,
  };

  return <main className={styles.page}>
    <header className={styles.header}>
      <div><p className={styles.eyebrow}>MY ACCOUNT / BOOKINGS</p><h1>My Bookings</h1><p className={styles.subtitle}>Your fitness experiences, all in one place.</p></div>
      <span className={styles.headerIcon} aria-hidden="true">▦</span>
    </header>

    {!error && <div className={styles.stats}>
      <div className={styles.stat}><span>Total bookings</span><strong>{total}</strong></div>
      <div className={styles.stat}><span>Pending on this page</span><strong className={styles.pendingNumber}>{counts.requested}</strong></div>
      <div className={styles.stat}><span>Confirmed on this page</span><strong className={styles.confirmedNumber}>{counts.confirmed}</strong></div>
    </div>}

    <div className={styles.toolbar}>
      <div className={styles.filters} aria-label="Filter bookings by status">
        {FILTERS.map(({ id, label }) => <button key={id} type="button" aria-pressed={filter === id} className={filter === id ? styles.activeFilter : ""} onClick={() => setFilter(id)}>{label}</button>)}
      </div>
      <button className={styles.refresh} onClick={load} disabled={loading}>↻ Refresh</button>
    </div>

    {loading ? <div className={styles.state}>Loading bookings…</div> :
      error ? <div className={styles.state} role="alert"><p>{error}</p><button onClick={load}>Try again</button></div> :
      bookings.length === 0 ? <div className={styles.state}><h2>No bookings yet</h2><p>Discover a gym, class, or trainer and send your first booking request.</p><Link to="/discover">Explore listings →</Link></div> :
      visible.length === 0 ? <div className={styles.state}><h2>No {filter === "all" ? "" : filter} bookings on this page</h2><p>Try another filter or navigate to another page.</p><button onClick={() => setFilter("all")}>Show all bookings</button></div> :
      <div className={styles.list}>{visible.map((item) => <article className={styles.card} key={item.id}>
        <div className={styles.cardMain}>
          {item.listing?.image?.url ? <img className={styles.thumbnail} src={item.listing.image.url} alt={item.listing.image.alt || ""} loading="lazy" /> : <div className={styles.placeholder} aria-hidden="true">▦</div>}
          <div className={styles.content}>
            <div className={styles.cardTop}><span className={styles.type}>{BOOKING_TYPE_LABELS[item.bookingType] || item.bookingType}</span><BookingStatus status={item.status} resolution={item.resolution} /></div>
            <h2>{item.service?.name || BOOKING_TYPE_LABELS[item.bookingType] || "Booking request"}</h2>
            <p className={styles.listingName}>{item.listing?.name || "Listing unavailable"}</p>
            <div className={styles.meta}><span>▦ {formatBookingDateTime(item.scheduledFor, item.timezone)}</span>{item.service?.displayPrice != null && <span>{item.service.currency || "₹"}{Number(item.service.displayPrice).toLocaleString("en-IN")}</span>}</div>
          </div>
        </div>
        <div className={styles.cardFooter}><span>{item.status === "requested" ? "Awaiting confirmation" : "Requested " + new Date(item.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span><Link to={`/bookings/${item.id}`}>View details ↗</Link></div>
      </article>)}</div>}

    {pagination?.totalPages > 1 && <nav className={styles.pagination} aria-label="Booking pages"><button disabled={page === 1 || loading} onClick={() => { setPage((value) => value - 1); setFilter("all"); }}>← Previous</button><span>Page {page} of {pagination.totalPages}</span><button disabled={page === pagination.totalPages || loading} onClick={() => { setPage((value) => value + 1); setFilter("all"); }}>Next →</button></nav>}
  </main>;
}
