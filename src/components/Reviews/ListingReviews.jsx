import ReviewSection from "../GymDetails/ReviewSection/ReviewSection.jsx";
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
      setError("");
    } catch (err) {
      setError(err.message || "Unable to load reviews.");
    } finally {
      setLoading(false);
    }
  }, [type, listingId]);
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
    <section
      aria-label="Customer reviews"
      style={{ margin: "40px 0", color: "inherit" }}
    >
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
        <div
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !saving) setOpen(false);
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.8)",
            zIndex: 10000,
            display: "grid",
            placeItems: "center",
            padding: 20,
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="listing-review-title"
            style={{
              background: "#181818",
              color: "#fff",
              border: "1px solid #444",
              borderRadius: 16,
              padding: 26,
              width: "min(100%, 500px)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2 id="listing-review-title">Write a Review</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={saving}
                aria-label="Close review form"
              >
                ✕
              </button>
            </div>
            {!user ? (
              <p>Please sign in with a customer account to submit a review.</p>
            ) : (
              <form onSubmit={submit} style={{ display: "grid", gap: 16 }}>
                <fieldset style={{ border: 0, padding: 0 }}>
                  <legend>Your rating</legend>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      type="button"
                      key={n}
                      aria-label={`${n} stars`}
                      aria-pressed={rating === n}
                      onClick={() => setRating(n)}
                      style={{
                        fontSize: 30,
                        color: n <= rating ? "#39ff14" : "#777",
                        background: "none",
                        border: 0,
                        cursor: "pointer",
                      }}
                    >
                      ★
                    </button>
                  ))}
                </fieldset>
                <label>
                  Title (optional)
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={120}
                    style={{ display: "block", width: "100%", padding: 10 }}
                  />
                </label>
                <label>
                  Your review
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    minLength={10}
                    maxLength={2000}
                    rows={5}
                    style={{ display: "block", width: "100%", padding: 10 }}
                  />
                </label>
                {error && <p role="alert">{error}</p>}
                <button
                  disabled={saving}
                  type="submit"
                  style={{
                    padding: 12,
                    background: "#39ff14",
                    color: "#111",
                    fontWeight: 700,
                  }}
                >
                  {saving ? "Submitting…" : "Submit Review"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
