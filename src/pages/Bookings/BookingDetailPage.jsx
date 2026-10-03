import { useCallback, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useCustomerAuth } from "../../context/CustomerAuthContext.jsx";
import { cancelBooking, getBooking } from "../../services/bookingService.js";
import { BOOKING_TYPE_LABELS, formatBookingDateTime, isCustomerCancellable } from "../../utils/booking.js";
import BookingStatus from "../../components/Bookings/BookingStatus.jsx";
import CancelBookingDialog from "../../components/Bookings/CancelBookingDialog.jsx";
import styles from "./BookingDetailPage.module.css";

export default function BookingDetailPage() {
  const { id } = useParams(); const { token, loading: authLoading, isAuthenticated } = useCustomerAuth();
  const [booking, setBooking] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const [showCancel, setShowCancel] = useState(false); const [cancelPending, setCancelPending] = useState(false); const [cancelError, setCancelError] = useState("");
  const load = useCallback(async () => { if (!token) return; setLoading(true); setError(""); try { const result = await getBooking(token, id); setBooking(result.data); } catch (requestError) { setError(requestError?.status === 404 ? "Booking not found." : requestError?.message || "Unable to load this booking."); } finally { setLoading(false); } }, [token, id]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);
  if (authLoading) return <main className={styles.page}><div className={styles.state}>Restoring your account…</div></main>;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: `/bookings/${id}` }} />;
  const confirmCancel = async (reason) => { if (cancelPending) return; setCancelPending(true); setCancelError(""); try { const result = await cancelBooking(token, id, { reason }); setBooking(result.data); setShowCancel(false); } catch (requestError) { setCancelError(requestError?.message || "Unable to cancel this booking."); } finally { setCancelPending(false); } };
  if (loading) return <main className={styles.page}><div className={styles.state}>Loading booking…</div></main>;
  if (error || !booking) return <main className={styles.page}><div className={styles.state} role="alert"><p>{error || "Booking not found."}</p><button onClick={load}>Try again</button><Link to="/bookings">Back to My Bookings</Link></div></main>;
  const resolutionTitle = booking.status === "rejected" ? "Provider response" : booking.resolution?.byRole === "provider" ? "Cancelled by provider" : booking.resolution?.byRole === "customer" ? "Cancelled by you" : "Resolution";
  return <main className={styles.page}><div className={styles.wrap}>
    <Link className={styles.back} to="/bookings">← My Bookings</Link>
    <header><div><p>BOOKING REQUEST</p><h1>{booking.listing?.name}</h1></div><BookingStatus status={booking.status} resolution={booking.resolution} detailed /></header>
    {booking.resolution && <section className={styles.resolution}><h2>{resolutionTitle}</h2><p>{booking.resolution.reason || "No reason was provided."}</p></section>}
    <div className={styles.grid}>
      <section><h2>Booking</h2><dl><div><dt>Type</dt><dd>{BOOKING_TYPE_LABELS[booking.bookingType] || booking.bookingType}</dd></div><div><dt>Preferred date and time</dt><dd>{formatBookingDateTime(booking.scheduledFor, booking.timezone)}</dd></div><div><dt>Stored timezone</dt><dd>{booking.timezone}</dd></div><div><dt>Submitted</dt><dd>{formatBookingDateTime(booking.createdAt, booking.timezone)}</dd></div></dl></section>
      <section><h2>Listing</h2>{booking.listing?.image?.url && <img src={booking.listing.image.url} alt={booking.listing.image.alt || ""} />}<h3>{booking.listing?.name}</h3><p>{booking.listing?.entityType?.replaceAll("_", " ")}</p><p>This historical snapshot is preserved even if the current listing changes.</p></section>
      <section><h2>Service</h2><h3>{booking.service?.name}</h3>{booking.service?.description && <p>{booking.service.description}</p>}{booking.service?.duration && <p>Duration: {booking.service.duration}</p>}{booking.service?.schedule && <p>{booking.service.schedule} {booking.service.time}</p>}</section>
      <section><h2>Contact submitted</h2><dl><div><dt>Name</dt><dd>{booking.contact?.name}</dd></div><div><dt>Email</dt><dd>{booking.contact?.email}</dd></div>{booking.contact?.phone && <div><dt>Phone</dt><dd>{booking.contact.phone}</dd></div>}</dl></section>
    </div>
    {booking.note && <section className={styles.note}><h2>Your note</h2><p>{booking.note}</p></section>}
    <section className={styles.timeline}><h2>Status history</h2><ol>{booking.statusHistory?.map((entry, index) => <li key={`${entry.status}-${entry.changedAt}-${index}`}><BookingStatus status={entry.status} /><div><time>{formatBookingDateTime(entry.changedAt, booking.timezone)}</time><span>Changed by {entry.changedByRole === "customer" ? "you" : entry.changedByRole}</span>{entry.reason && <p>{entry.reason}</p>}</div></li>)}</ol></section>
    {isCustomerCancellable(booking) && <div className={styles.cancelArea}><button onClick={() => setShowCancel(true)}>Cancel Booking</button><p>You can cancel this request without changing your account or listing details.</p></div>}
  </div><CancelBookingDialog open={showCancel} pending={cancelPending} error={cancelError} onClose={() => !cancelPending && setShowCancel(false)} onConfirm={confirmCancel} /></main>;
}
