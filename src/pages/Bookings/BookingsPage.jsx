import { useCallback, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useCustomerAuth } from "../../context/CustomerAuthContext.jsx";
import { getBookings } from "../../services/bookingService.js";
import { BOOKING_TYPE_LABELS, formatBookingDateTime } from "../../utils/booking.js";
import BookingStatus from "../../components/Bookings/BookingStatus.jsx";
import styles from "./BookingsPage.module.css";

export default function BookingsPage() {
  const { token, loading: authLoading, isAuthenticated } = useCustomerAuth();
  const [page, setPage] = useState(1); const [payload, setPayload] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const load = useCallback(async () => { if (!token) return; setLoading(true); setError(""); try { setPayload(await getBookings(token, { page, limit: 12 })); } catch (requestError) { setError(requestError?.message || "Unable to load your bookings."); } finally { setLoading(false); } }, [token, page]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);
  if (authLoading) return <main className={styles.page}><div className={styles.state}>Restoring your account…</div></main>;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: "/bookings" }} />;
  const bookings = payload?.data || []; const pagination = payload?.pagination;
  return <main className={styles.page}>
    <header><p>YOUR BOOKINGS</p><h1>My Bookings</h1><span>Track requests and provider confirmations. Preferred times are not reserved until confirmed.</span></header>
    {loading ? <div className={styles.state}>Loading bookings…</div> : error ? <div className={styles.state} role="alert"><p>{error}</p><button onClick={load}>Try again</button></div> : bookings.length === 0 ? <div className={styles.state}><h2>No bookings yet</h2><p>Explore Gymssy and send a booking request when you find the right venue or professional.</p><Link to="/discover">Explore listings</Link></div> : <>
      <div className={styles.list}>{bookings.map((item) => <article className={styles.card} key={item.id}>
        {item.listing?.image?.url ? <img src={item.listing.image.url} alt={item.listing.image.alt || ""} /> : <div className={styles.placeholder} aria-hidden="true" />}
        <div className={styles.content}><BookingStatus status={item.status} resolution={item.resolution} detailed /><h2>{item.listing?.name}</h2>
          <p>{item.service?.name || BOOKING_TYPE_LABELS[item.bookingType]}</p><dl><div><dt>Preferred time</dt><dd>{formatBookingDateTime(item.scheduledFor, item.timezone)}</dd></div><div><dt>Requested</dt><dd>{new Date(item.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</dd></div></dl>
          <Link to={`/bookings/${item.id}`}>View booking</Link>
        </div>
      </article>)}</div>
      {pagination?.totalPages > 1 && <nav className={styles.pagination} aria-label="Booking pages"><button disabled={page === 1} onClick={() => setPage((value) => value - 1)}>Previous</button><span>Page {page} of {pagination.totalPages}</span><button disabled={page === pagination.totalPages} onClick={() => setPage((value) => value + 1)}>Next</button></nav>}
    </>}
  </main>;
}
