import { useEffect, useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import styles from "./CancelBookingDialog.module.css";

export default function CancelBookingDialog({ open, pending, error, onClose, onConfirm }) {
  const [reason, setReason] = useState(""); const input = useRef(null);
  useEffect(() => { if (open) window.setTimeout(() => { setReason(""); input.current?.focus(); }, 0); }, [open]);
  useEffect(() => { if (!open) return undefined; const key = (event) => event.key === "Escape" && !pending && onClose(); window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key); }, [open, pending, onClose]);
  if (!open) return null;
  return <div className={styles.backdrop} onMouseDown={(event) => event.target === event.currentTarget && !pending && onClose()}>
    <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="cancel-title">
      <button className={styles.close} onClick={onClose} disabled={pending} aria-label="Close cancellation dialog"><FiX /></button>
      <h2 id="cancel-title">Cancel booking?</h2><p>This action cannot be undone. You can submit a new request later if needed.</p>
      <label>Reason <span>(optional)</span><textarea ref={input} value={reason} onChange={(event) => setReason(event.target.value)} maxLength={500} rows={4} /></label>
      {error && <p className={styles.error} role="alert">{error}</p>}
      <div className={styles.actions}><button onClick={onClose} disabled={pending}>Keep booking</button><button className={styles.danger} onClick={() => onConfirm(reason.trim())} disabled={pending}>{pending ? "Cancelling…" : "Cancel booking"}</button></div>
    </section>
  </div>;
}
