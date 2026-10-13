import { useCallback, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useCustomerAuth } from "../../context/CustomerAuthContext.jsx";
import { cancelBooking, getBooking } from "../../services/bookingService.js";
import {
  BOOKING_TYPE_LABELS,
  formatBookingDateTime,
  isCustomerCancellable,
} from "../../utils/booking.js";
import BookingStatus from "../../components/Bookings/BookingStatus.jsx";
import CancelBookingDialog from "../../components/Bookings/CancelBookingDialog.jsx";
import styles from "./BookingDetailPage.module.css";

export default function BookingDetailPage() {
  const { id } = useParams();
  const { token, loading: authLoading, isAuthenticated } = useCustomerAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCancel, setShowCancel] = useState(false);
  const [cancelPending, setCancelPending] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const result = await getBooking(token, id);
      setBooking(result.data);
    } catch (requestError) {
      setError(
        requestError?.status === 404
          ? "Booking not found."
          : requestError?.message || "Unable to load this booking.",
      );
    } finally {
      setLoading(false);
    }
  }, [token, id]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);
  if (authLoading)
    return (
      <main className={styles.page}>
        <div className={styles.state}>Restoring your account…</div>
      </main>
    );
  if (!isAuthenticated)
    return <Navigate to="/login" replace state={{ from: `/bookings/${id}` }} />;
  const confirmCancel = async (reason) => {
    if (cancelPending) return;
    setCancelPending(true);
    setCancelError("");
    try {
      const result = await cancelBooking(token, id, { reason });
      setBooking(result.data);
      setShowCancel(false);
    } catch (requestError) {
      setCancelError(requestError?.message || "Unable to cancel this booking.");
    } finally {
      setCancelPending(false);
    }
  };
  if (loading)
    return (
      <main className={styles.page}>
        <div className={styles.state}>Loading booking…</div>
      </main>
    );
  if (error || !booking)
    return (
      <main className={styles.page}>
        <div className={styles.state} role="alert">
          <p>{error || "Booking not found."}</p>
          <button onClick={load}>Try again</button>
          <Link to="/bookings">Back to My Bookings</Link>
        </div>
      </main>
    );
  const typeLabel =
    BOOKING_TYPE_LABELS[booking.bookingType] || booking.bookingType;
  const serviceName = booking.service?.name || typeLabel;
  const status = booking.status;
  const resolutionTitle =
    status === "rejected"
      ? "Booking declined"
      : booking.resolution?.byRole === "provider"
        ? "Cancelled by provider"
        : booking.resolution?.byRole === "customer"
          ? "Cancelled by you"
          : "Booking update";
  const isRequested = status === "requested";
  const isConfirmed = status === "confirmed" || status === "completed";
  const progressStep = isRequested
    ? 1
    : isConfirmed
      ? status === "completed"
        ? 3
        : 2
      : 0;
  const progressLabels =
    status === "completed"
      ? ["Requested", "Confirmed", "Completed"]
      : ["Requested", "Confirmed", "Completed"];
  const copyReference = async () => {
    try {
      await navigator.clipboard.writeText(booking.id || id);
    } catch {
      /* Clipboard may be unavailable. */
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <nav className={styles.breadcrumb}>
          <Link to="/profile/bookings">← My Bookings</Link>
          <span>/</span>
          <span>Booking details</span>
        </nav>

        <section className={styles.hero}>
          <div className={styles.heroHeading}>
            <div className={styles.heroSymbol} aria-hidden="true">
              {isRequested ? "◷" : isConfirmed ? "✓" : "!"}
            </div>
            <div className={styles.heroTitle}>
              <p className={styles.eyebrow}>{typeLabel} · Booking details</p>
              <h1>{serviceName}</h1>
              <p className={styles.venueName}>
                {booking.listing?.name || "Listing unavailable"}
              </p>
            </div>
            <BookingStatus status={status} resolution={booking.resolution} />
          </div>
          <div className={styles.heroBottom}>
            <div>
              <span className={styles.miniLabel}>PREFERRED DATE & TIME</span>
              <strong>
                {formatBookingDateTime(booking.scheduledFor, booking.timezone)}
              </strong>
            </div>
            <p>
              {isRequested
                ? "Your request has been submitted. Your preferred time is not reserved until confirmed."
                : status === "confirmed"
                  ? "Your booking has been confirmed."
                  : status === "completed"
                    ? "This booking is complete."
                    : "See the booking update below for details."}
            </p>
          </div>
        </section>

        {booking.resolution && (
          <section className={styles.resolution}>
            <h2>{resolutionTitle}</h2>
            <p>{booking.resolution.reason || "No reason was provided."}</p>
          </section>
        )}

        <div className={styles.grid}>
          <section className={styles.panel}>
            <h2>Booking details</h2>
            <dl className={styles.detailList}>
              <div>
                <dt>Booking type</dt>
                <dd>{typeLabel}</dd>
              </div>
              {booking.service?.trainer && (
                <div>
                  <dt>Trainer</dt>
                  <dd>{booking.service.trainer}</dd>
                </div>
              )}
              {booking.service?.duration && (
                <div>
                  <dt>Duration</dt>
                  <dd>{booking.service.duration}</dd>
                </div>
              )}
              {booking.service?.schedule && (
                <div>
                  <dt>Class schedule</dt>
                  <dd>{booking.service.schedule}</dd>
                </div>
              )}
              {booking.service?.time && (
                <div>
                  <dt>Advertised class time</dt>
                  <dd>{booking.service.time}</dd>
                </div>
              )}
              {booking.service?.displayPrice != null && (
                <div>
                  <dt>Listed price when requested</dt>
                  <dd>
                    {booking.service.currency || "₹"}
                    {Number(booking.service.displayPrice).toLocaleString(
                      "en-IN",
                    )}
                  </dd>
                </div>
              )}
            </dl>
            {booking.service?.description && (
              <p className={styles.description}>
                {booking.service.description}
              </p>
            )}
            {booking.service?.time && (
              <p className={styles.hint}>
                The advertised class time may differ from your preferred booking
                time. Confirm the final schedule with the provider.
              </p>
            )}
          </section>

          <section className={styles.panel}>
            <h2>Venue details</h2>
            <div className={styles.venue}>
              {booking.listing?.image?.url ? (
                <img
                  src={booking.listing.image.url}
                  alt={booking.listing.image.alt || ""}
                />
              ) : (
                <div className={styles.venuePlaceholder} aria-hidden="true">
                  ▦
                </div>
              )}
              <div>
                <h3>{booking.listing?.name}</h3>
                <p>
                  {booking.listing?.entityType?.replaceAll("_", " ") ||
                    "Fitness listing"}
                </p>
              </div>
            </div>
            <div className={styles.venueInfo}>
              <span>Preferred date & time</span>
              <strong>
                {formatBookingDateTime(booking.scheduledFor, booking.timezone)}
              </strong>
            </div>
          </section>
        </div>

        <section className={styles.progressPanel}>
          <div className={styles.sectionHeading}>
            <h2>Booking progress</h2>
            <span className={styles.progressState}>
              {status === "requested"
                ? "Awaiting confirmation"
                : status === "confirmed"
                  ? "Confirmed"
                  : status === "completed"
                    ? "Completed"
                    : typeLabel + " · " + status}
            </span>
          </div>
          {progressStep > 0 ? (
            <div className={styles.progressSteps}>
              {progressLabels.map((label, index) => (
                <div key={label} className={styles.progressItem}>
                  <span
                    className={
                      index < progressStep
                        ? styles.stepDone
                        : styles.stepWaiting
                    }
                  >
                    {index < progressStep ? "✓" : index + 1}
                  </span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.description}>
              This booking is {status}. Review the update and status history
              below.
            </p>
          )}
        </section>

        <section className={styles.panel + " " + styles.contactPanel}>
          <h2>Your contact information</h2>
          <dl className={styles.contactGrid}>
            <div>
              <dt>Name</dt>
              <dd>{booking.contact?.name || "—"}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{booking.contact?.email || "—"}</dd>
            </div>
            {booking.contact?.phone && (
              <div>
                <dt>Phone</dt>
                <dd>{booking.contact.phone}</dd>
              </div>
            )}
          </dl>
          {booking.note && (
            <div className={styles.note}>
              <h3>Your note</h3>
              <p>{booking.note}</p>
            </div>
          )}
        </section>

        <details className={styles.moreDetails}>
          <summary>
            Booking reference & status history <span>⌄</span>
          </summary>
          <div className={styles.reference}>
            <div>
              <span className={styles.miniLabel}>BOOKING REFERENCE</span>
              <strong>{booking.id || id}</strong>
            </div>
            <button type="button" onClick={copyReference}>
              Copy ID
            </button>
          </div>
          <div className={styles.reference}>
            <div>
              <span className={styles.miniLabel}>STORED TIMEZONE</span>
              <strong>{booking.timezone || "—"}</strong>
            </div>
          </div>
          <div className={styles.reference}>
            <div>
              <span className={styles.miniLabel}>REQUESTED AT</span>
              <strong>
                {formatBookingDateTime(booking.createdAt, booking.timezone)}
              </strong>
            </div>
          </div>
          <h3>Status history</h3>
          {booking.statusHistory?.length ? (
            <ol className={styles.history}>
              {booking.statusHistory.map((entry, index) => (
                <li key={`${entry.status}-${entry.changedAt}-${index}`}>
                  <strong>{entry.status}</strong>
                  <span>
                    {formatBookingDateTime(entry.changedAt, booking.timezone)} ·{" "}
                    {entry.changedByRole === "customer"
                      ? "you"
                      : entry.changedByRole}
                  </span>
                  {entry.reason && <p>{entry.reason}</p>}
                </li>
              ))}
            </ol>
          ) : (
            <p className={styles.description}>No status history available.</p>
          )}
          <p className={styles.hint}>
            Booking details are preserved as they were when your request was
            submitted.
          </p>
        </details>

        {isCustomerCancellable(booking) && (
          <div className={styles.cancelArea}>
            <button type="button" onClick={() => setShowCancel(true)}>
              Cancel booking
            </button>
            <p>Cancellation is subject to the current booking status.</p>
          </div>
        )}
      </div>
      <CancelBookingDialog
        open={showCancel}
        pending={cancelPending}
        error={cancelError}
        onClose={() => !cancelPending && setShowCancel(false)}
        onConfirm={confirmCancel}
      />
    </main>
  );
}
