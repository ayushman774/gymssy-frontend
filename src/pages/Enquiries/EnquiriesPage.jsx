import { useCallback, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useCustomerAuth } from "../../context/CustomerAuthContext.jsx";
import { fetchMyEnquiries } from "../../services/enquiryService.js";
import styles from "./EnquiriesPage.module.css";

const STATUS = { submitted: "Submitted", viewed: "Viewed", contacted: "Contacted", closed: "Closed" };
const INTENT = { general: "General enquiry", membership: "Membership interest", class: "Class interest", trial: "Trial request", training: "Training enquiry", consultation: "Consultation enquiry" };

export default function EnquiriesPage() {
  const { token, loading: authLoading, isAuthenticated } = useCustomerAuth();
  const [page, setPage] = useState(1); const [payload, setPayload] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const load = useCallback(async () => { if (!token) return; setLoading(true); setError(""); try { setPayload(await fetchMyEnquiries(token, { page, limit: 12 })); } catch (requestError) { setError(requestError?.message || "Unable to load your enquiries."); } finally { setLoading(false); } }, [token, page]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);
  if (authLoading) return <main className={styles.page}><div className={styles.state}>Restoring your account…</div></main>;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: "/enquiries" }} />;
  const enquiries = payload?.data || []; const pagination = payload?.pagination;
  return <main className={styles.page}>
    <header><p>YOUR REQUESTS</p><h1>My Enquiries</h1><span>Track the requests you have sent to Gymssy providers.</span></header>
    {loading ? <div className={styles.state}>Loading enquiries…</div> : error ? <div className={styles.state} role="alert"><p>{error}</p><button onClick={load}>Try again</button></div> : enquiries.length === 0 ? <div className={styles.state}><h2>No enquiries yet</h2><p>Explore the marketplace and contact a venue or professional when you are ready.</p><Link to="/discover">Explore listings</Link></div> : <>
      <div className={styles.list}>{enquiries.map((item) => <article className={styles.card} key={item.id}>
        {item.listing.image?.url && <img src={item.listing.image.url} alt={item.listing.image.alt || ""} />}
        <div><div className={styles.meta}><span>{item.listing.entityType?.replaceAll("_", " ")}</span><strong data-status={item.status}>{STATUS[item.status] || item.status}</strong></div>
          <h2>{item.listing.name}</h2><p className={styles.intent}>{INTENT[item.intent] || item.intent}</p>
          {(item.context?.membershipName || item.context?.className) && <p>{item.context.membershipName || item.context.className}</p>}
          <p className={styles.message}>{item.message}</p><time dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</time>
          {item.listing.available && item.listing.href ? <Link to={item.listing.href}>View listing</Link> : <span className={styles.unavailable}>Listing is no longer available</span>}
        </div>
      </article>)}</div>
      {pagination?.totalPages > 1 && <nav className={styles.pagination} aria-label="Enquiry pages"><button disabled={page === 1} onClick={() => setPage((value) => value - 1)}>Previous</button><span>Page {page} of {pagination.totalPages}</span><button disabled={page === pagination.totalPages} onClick={() => setPage((value) => value + 1)}>Next</button></nav>}
    </>}
  </main>;
}
