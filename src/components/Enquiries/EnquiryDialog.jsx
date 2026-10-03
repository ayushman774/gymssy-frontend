import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiCheck, FiX } from "react-icons/fi";
import { useCustomerAuth } from "../../context/CustomerAuthContext.jsx";
import { createEnquiry } from "../../services/enquiryService.js";
import styles from "./EnquiryDialog.module.css";

const DEFAULT_MESSAGES = {
  general: "I'd like to know more about this listing.", membership: "I'd like to know more about this membership.",
  class: "I'd like to know more about this class.", trial: "I'd like to request a trial visit.",
  training: "I'd like to know more about personal training sessions.", consultation: "I'd like to request a nutrition consultation.",
};

export default function EnquiryDialog({ open, onClose, targetType, targetId, intent, listingName, context = {} }) {
  const { user, token, isAuthenticated } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `${location.pathname}${location.search}` } });
      return;
    }
    // Opening a new request intentionally resets the independent enquiry snapshot.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "", message: DEFAULT_MESSAGES[intent] || DEFAULT_MESSAGES.general });
    setError(""); setSent(false);
  }, [open, isAuthenticated, user, intent, navigate, location.pathname, location.search]);

  if (!open || !isAuthenticated) return null;
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    if (pending) return;
    setPending(true); setError("");
    try {
      await createEnquiry(token, { targetType, targetId, intent, message: form.message, contact: { name: form.name, email: form.email, phone: form.phone }, context });
      setSent(true);
    } catch (requestError) { setError(requestError?.message || "Unable to send your enquiry. Please try again."); }
    finally { setPending(false); }
  };

  return <div className={styles.backdrop} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="enquiry-title">
      <button className={styles.close} onClick={onClose} aria-label="Close enquiry"><FiX /></button>
      {sent ? <div className={styles.success} role="status">
        <FiCheck /><h2 id="enquiry-title">Enquiry sent</h2>
        <p>The provider can follow up using the contact details you supplied.</p>
        <div className={styles.actions}><button onClick={onClose}>Close</button><Link to="/enquiries">View My Enquiries</Link></div>
      </div> : <form onSubmit={submit}>
        <p className={styles.eyebrow}>Request information</p><h2 id="enquiry-title">Enquire about {listingName}</h2>
        <p className={styles.intro}>This sends an enquiry to the provider. It does not confirm a booking or payment.</p>
        <label>Name<input name="name" value={form.name} onChange={update} maxLength={100} required /></label>
        <label>Email<input type="email" name="email" value={form.email} onChange={update} maxLength={254} required /></label>
        <label>Phone <span>(optional)</span><input name="phone" value={form.phone} onChange={update} maxLength={30} /></label>
        <label>Message<textarea name="message" value={form.message} onChange={update} maxLength={2000} rows={5} required /></label>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <button className={styles.submit} type="submit" disabled={pending}>{pending ? "Sending…" : "Send enquiry"}</button>
      </form>}
    </section>
  </div>;
}
