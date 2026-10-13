import ReviewSection from "../GymDetails/ReviewSection/ReviewSection.jsx";
import styles from "./ListingReviews.module.css";
import { useCallback, useEffect, useState } from "react";
import { useCustomerAuth } from "../../context/CustomerAuthContext.jsx";
import {
  fetchListingReviews,
  submitListingReview,
} from "../../services/reviewService.js";

export default function ListingReviews({
  type,
  listingId,
  legacyReviews = [],
  legacyRating = 0,
  legacyReviewCount = 0,
  legacyBreakdown = [],
  onSummaryChange,
}) {
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
      onSummaryChange?.(response.summary || null);
      setError("");
    } catch (err) {
      setError(err.message || "Unable to load reviews.");
    } finally {
      setLoading(false);
    }
  }, [type, listingId, onSummaryChange]);
  useEffect(() => {
    load();
  }, [load]);
  const submit = async (event) => {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      await submitListingReview(token, type, listingId, {
        rating,
        title,
        text: description,
      });
      setOpen(false);
      setTitle("");
      setDescription("");
      setRating(5);
      await load();
    } catch (err) {
      setError(err.message || "Unable to submit review.");
    } finally {
      setSaving(false);
    }
  };
  if (!listingId) return null;
  return (
    <section aria-label="Customer reviews" className={styles.container}>
      <ReviewSection
        rating={
          summary?.reviewCount
            ? Number(summary.rating).toFixed(1)
            : legacyRating
        }
        reviewCount={
          summary?.reviewCount ? summary.reviewCount : legacyReviewCount
        }
        ratingBreakdown={
          summary?.reviewCount
            ? [5, 4, 3, 2, 1].map((stars) => ({
                stars,
                percentage: Math.round(
                  (items.filter((r) => r.rating === stars).length /
                    Math.max(1, items.length)) *
                    100,
                ),
              }))
            : legacyBreakdown
        }
        reviews={[
          ...items.map((review) => ({
            id: review.id,
            user: {
              name: review.user?.name || "Gymssy customer",
              initials: (review.user?.name || "GC")
                .split(" ")
                .map((word) => word[0])
                .slice(0, 2)
                .join("")
                .toUpperCase(),
            },
            date: review.createdAt,
            rating: review.rating,
            title: review.title,
            text: review.text,
            verifiedVisit: false,
            helpfulCount: 0,
          })),
          ...legacyReviews,
        ]}
        onWriteReview={() => {
          setError("");
          setOpen(true);
        }}
      />
      {loading && <p>Loading customer reviews…</p>}
      {!open && error && <p role="alert">{error}</p>}
      {open && (
        <div className={styles.overlay} role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget && !saving) setOpen(false);
        }}>
          <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="listing-review-title">
            <div className={styles.modalHeader}>
              <div>
                <span className={styles.eyebrow}>GYMSSY COMMUNITY</span>
                <h2 id="listing-review-title">Write a Review</h2>
                <p>Share your experience and help others choose confidently.</p>
              </div>
              <button type="button" className={styles.closeButton} onClick={() => setOpen(false)} disabled={saving} aria-label="Close review form">✕</button>
            </div>
            {!user ? (
              <div className={styles.guestNotice}>Please sign in with your customer account to write a review.</div>
            ) : (
              <form className={styles.reviewForm} onSubmit={submit}>
                <fieldset className={styles.ratingField}>
                  <legend>Your rating <span>*</span></legend>
                  <div className={styles.ratingRow}>
                    <div className={styles.starButtons}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button key={n} type="button" aria-label={`${n} stars`} aria-pressed={rating === n}
                          onClick={() => setRating(n)} className={n <= rating ? styles.starActive : styles.starInactive}>★</button>
                      ))}
                    </div>
                    <span className={styles.ratingLabel}>{["", "Poor", "Fair", "Good", "Very good", "Excellent"][rating]}</span>
                  </div>
                </fieldset>
                <label className={styles.fieldLabel} htmlFor="listing-review-heading">Review title <span>(optional)</span></label>
                <input id="listing-review-heading" className={styles.fieldInput} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} placeholder="Summarize your experience" />
                <label className={styles.fieldLabel} htmlFor="listing-review-description">Your experience <span>*</span></label>
                <textarea id="listing-review-description" className={styles.fieldInput} value={description}
                  onChange={(e) => setDescription(e.target.value)} required minLength={10} maxLength={2000} rows={5}
                  placeholder="What did you like? How was your experience?" />
                <div className={styles.characterCount}>{description.length}/2000 characters</div>
                {error && <p className={styles.formError} role="alert">{error}</p>}
                <div className={styles.modalActions}>
                  <button type="button" className={styles.cancelButton} disabled={saving} onClick={() => setOpen(false)}>Cancel</button>
                  <button type="submit" className={styles.submitButton} disabled={saving}>{saving ? "Submitting…" : "Submit Review →"}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
