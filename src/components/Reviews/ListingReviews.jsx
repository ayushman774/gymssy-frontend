import { useCallback, useEffect, useState } from "react";
import { useCustomerAuth } from "../../context/CustomerAuthContext.jsx";
import { fetchListingReviews, submitListingReview } from "../../services/reviewService.js";

export default function ListingReviews({ type, listingId }) {
  const { user, token } = useCustomerAuth();
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState(null);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const load = useCallback(async () => {
    if (!listingId) return;
    setLoading(true);
    try {
      const response = await fetchListingReviews(type, listingId);
      setItems(response.data || []);
      setSummary(response.summary || null);
      setError("");
    } catch (err) { setError(err.message || "Unable to load reviews."); }
    finally { setLoading(false); }
  }, [type, listingId]);
  useEffect(() => { load(); }, [load]);
  const submit = async (event) => {
    event.preventDefault();
    if (saving) return;
    setSaving(true); setError("");
    try {
      await submitListingReview(token, type, listingId, { rating, title, text: description });
      setOpen(false); setTitle(""); setDescription(""); setRating(5);
      await load();
    } catch (err) { setError(err.message || "Unable to submit review."); }
    finally { setSaving(false); }
  };
  if (!listingId) return null;
  return (
    <section aria-label="Customer reviews" style={{ margin: "40px 0", color: "inherit" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div><h2>Customer Reviews</h2><p>{summary?.reviewCount ? `${Number(summary.rating).toFixed(1)} ★ · ${summary.reviewCount} customer reviews` : "No customer reviews yet"}</p></div>
        <button type="button" onClick={() => { setError(""); setOpen(true); }} style={{ padding: "12px 20px", borderRadius: 8, background: "#39ff14", color: "#111", fontWeight: 700, cursor: "pointer" }}>Write a Review</button>
      </div>
      {loading && <p>Loading reviews…</p>}
      {!open && error && <p role="alert">{error}</p>}
      <div style={{ display: "grid", gap: 14, marginTop: 18 }}>
        {items.map((review) => (
          <article key={review.id} style={{ padding: 18, border: "1px solid rgba(128,128,128,.35)", borderRadius: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <strong>{review.user?.name || "Gymssy customer"}</strong>
              <time dateTime={review.createdAt}>{review.createdAt ? new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}</time>
            </div>
            <div aria-label={`${review.rating} out of 5 stars`} style={{ color: "#39ff14", marginTop: 8 }}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>
            {review.title && <h3 style={{ marginTop: 10 }}>{review.title}</h3>}
            <p style={{ whiteSpace: "pre-wrap" }}>{review.text}</p>
          </article>
        ))}
      </div>
      {open && (
        <div role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget && !saving) setOpen(false); }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.8)", zIndex: 10000, display: "grid", placeItems: "center", padding: 20 }}>
          <div role="dialog" aria-modal="true" aria-labelledby="listing-review-title" style={{ background: "#181818", color: "#fff", border: "1px solid #444", borderRadius: 16, padding: 26, width: "min(100%, 500px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><h2 id="listing-review-title">Write a Review</h2><button type="button" onClick={() => setOpen(false)} disabled={saving} aria-label="Close review form">✕</button></div>
            {!user ? <p>Please sign in with a customer account to submit a review.</p> : (
              <form onSubmit={submit} style={{ display: "grid", gap: 16 }}>
                <fieldset style={{ border: 0, padding: 0 }}><legend>Your rating</legend>{[1,2,3,4,5].map((n) => <button type="button" key={n} aria-label={`${n} stars`} aria-pressed={rating === n} onClick={() => setRating(n)} style={{ fontSize: 30, color: n <= rating ? "#39ff14" : "#777", background: "none", border: 0, cursor: "pointer" }}>★</button>)}</fieldset>
                <label>Title (optional)<input value={title} onChange={e => setTitle(e.target.value)} maxLength={120} style={{ display: "block", width: "100%", padding: 10 }} /></label>
                <label>Your review<textarea value={description} onChange={e => setDescription(e.target.value)} required minLength={10} maxLength={2000} rows={5} style={{ display: "block", width: "100%", padding: 10 }} /></label>
                {error && <p role="alert">{error}</p>}
                <button disabled={saving} type="submit" style={{ padding: 12, background: "#39ff14", color: "#111", fontWeight: 700 }}>{saving ? "Submitting…" : "Submit Review"}</button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
