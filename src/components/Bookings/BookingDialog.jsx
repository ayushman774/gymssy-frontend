import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiCheck, FiX } from "react-icons/fi";
import { useCustomerAuth } from "../../context/CustomerAuthContext.jsx";
import { createBooking } from "../../services/bookingService.js";
import { BOOKING_TYPE_LABELS, buildScheduledFor, resolveBrowserTimezone } from "../../utils/booking.js";
import styles from "./BookingDialog.module.css";

function customerMessage(error) {
  if (error?.status === 401 || error?.status === 403) return "Your customer session has expired. Sign in and try again.";
  if (error?.status === 404) return "This listing is no longer available for booking.";
  if (error?.status === 409 && /service|ambiguous/i.test(error?.message || "")) return "This service is no longer available in its previous form. Please refresh and try again.";
  if (error?.status === 409) return error?.message || "This listing is not currently available for online booking.";
  if (error?.status === 400) return error?.message || "Check the booking details and try again.";
  return error?.message || "Unable to send your booking request. Please try again.";
}

export default function BookingDialog({ open, onClose, targetType, targetId, bookingType, listingName, serviceName = "" }) {
  const { user, token, isAuthenticated } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const firstInput = useRef(null);
  const [form, setForm] = useState({ date: "", time: "", name: "", email: "", phone: "", note: "" });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `${location.pathname}${location.search}` } });
      return;
    }
    // Opening a new request intentionally resets its independent contact snapshot.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({ date: "", time: "", name: user?.name || "", email: user?.email || "", phone: user?.phone || "", note: "" });
    setPending(false); setError(""); setSent(false);
    window.setTimeout(() => firstInput.current?.focus(), 0);
  }, [open, isAuthenticated, user, navigate, location.pathname, location.search]);

  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = (event) => { if (event.key === "Escape" && !pending) onClose(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open, onClose, pending]);

  if (!open || !isAuthenticated) return null;
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    if (pending) return;
    setError("");
    if (!form.name.trim()) { setError("Enter a contact name."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) { setError("Enter a valid contact email."); return; }
    let scheduledFor; let timezone;
    try { scheduledFor = buildScheduledFor(form.date, form.time); timezone = resolveBrowserTimezone(); }
    catch (validationError) { setError(validationError.message); return; }
    setPending(true);
    try {
      const payload = {
        targetType, targetId, bookingType, scheduledFor, timezone,
        contact: { name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() },
        note: form.note.trim(),
      };
      if (serviceName) payload.service = { name: serviceName };
      await createBooking(token, payload);
      setSent(true);
    } catch (requestError) { setError(customerMessage(requestError)); }
    finally { setPending(false); }
  };

  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return <div className={styles.backdrop} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !pending && onClose()}>
    <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="booking-title">
      <button type="button" className={styles.close} onClick={onClose} disabled={pending} aria-label="Close booking dialog"><FiX /></button>
      {sent ? <div className={styles.success} role="status">
        <FiCheck aria-hidden="true" /><h2 id="booking-title">Booking request sent</h2>
        <p>Your booking request has been sent to the provider. Track its status in My Bookings.</p>
        <div className={styles.actions}><button type="button" onClick={onClose}>Close</button><Link to="/bookings">View My Bookings</Link></div>
      </div> : <form onSubmit={submit}>
        <p className={styles.eyebrow}>BOOKING REQUEST</p><h2 id="booking-title">{BOOKING_TYPE_LABELS[bookingType] || "Booking"}</h2>
        <div className={styles.context}><strong>{listingName}</strong>{serviceName && <span>{serviceName}</span>}</div>
        <p className={styles.intro}>Select your preferred date and time. The provider will confirm your booking request.</p>
        <div className={styles.row}>
          <label>Preferred date<input ref={firstInput} type="date" name="date" min={minDate} value={form.date} onChange={update} required /></label>
          <label>Preferred time<input type="time" name="time" value={form.time} onChange={update} required /></label>
        </div>
        <label>Contact name<input name="name" value={form.name} onChange={update} maxLength={100} required /></label>
        <label>Email<input type="email" name="email" value={form.email} onChange={update} maxLength={254} required /></label>
        <label>Phone <span>(optional)</span><input name="phone" value={form.phone} onChange={update} maxLength={30} /></label>
        <label>Note <span>(optional)</span><textarea name="note" value={form.note} onChange={update} maxLength={2000} rows={4} /></label>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <button className={styles.submit} type="submit" disabled={pending} aria-busy={pending}>{pending ? "Sending request…" : "Send booking request"}</button>
      </form>}
    </section>
  </div>;
}
