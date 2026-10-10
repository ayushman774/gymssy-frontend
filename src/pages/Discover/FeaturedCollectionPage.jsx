import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import DiscoveryCard from "../../components/Discover/DiscoveryCard/DiscoveryCard";
import useDiscovery from "../../hooks/useDiscovery";
import {
  FEATURED_COLLECTIONS,
  getFeaturedCollection,
} from "./featuredCollections";
import styles from "./FeaturedCollectionPage.module.css";

export default function FeaturedCollectionPage() {
  const { slug } = useParams();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const collection = getFeaturedCollection(slug);
  const requestedPage = Number.parseInt(params.get("page") || "1", 10);
  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? Math.min(requestedPage, 1000)
      : 1;
  const filters = useMemo(
    () => ({ collection: slug, page, limit: 6 }),
    [slug, page],
  );
  const { listings, pagination, loading, error, retry } = useDiscovery(
    filters,
    Boolean(collection),
  );
  const [selectedSlug, setSelectedSlug] = useState(slug);
  useEffect(() => {
    if (selectedSlug !== slug) {
      setSelectedSlug(slug);
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [selectedSlug, slug]);
  const changePage = (nextPage) => {
    setParams(nextPage > 1 ? { page: String(nextPage) } : {});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!collection)
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.empty}>
            <h1>Collection not found</h1>
            <p>This collection isn't available.</p>
            <Link to="/discover">Back to Discover</Link>
          </div>
        </div>
      </main>
    );

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <img src={collection.image} alt="" className={styles.heroImage} />
          <div className={styles.heroShade} />
          <div className={styles.heroText}>
            <span className={styles.eyebrow}>FEATURED COLLECTION</span>
            <h1>{collection.title}</h1>
            <p>{collection.subtitle}</p>
          </div>
        </header>
        <div className={styles.intro}>
          <p>{collection.description}</p>
          <Link to="/discover">
            Explore all listings <FiArrowRight aria-hidden="true" />
          </Link>
        </div>
        <section aria-label={collection.title + " listings"}>
          {loading ? (
            <div className={styles.state} role="status">
              Loading collection listings…
            </div>
          ) : error ? (
            <div className={styles.state} role="alert">
              <h2>Unable to load this collection</h2>
              <p>
                Please try again. Your other marketplace listings are
                unaffected.
              </p>
              <button onClick={retry}>Retry</button>
            </div>
          ) : listings.length === 0 ? (
            <div className={styles.state}>
              <h2>No listings in this collection yet</h2>
              <p>
                We haven't found published listings matching this collection's
                criteria. Browse all listings while we expand this selection.
              </p>
              <Link to="/discover">
                Browse all Gymssy listings <FiArrowRight aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <>
              <div className={styles.grid}>
                {listings.map((item) => (
                  <DiscoveryCard
                    key={item.entityType + "-" + item.id}
                    item={item}
                    onView={(href) => navigate(href)}
                  />
                ))}
              </div>
              {pagination.totalPages > 1 && (
                <nav
                  className={styles.pagination}
                  aria-label="Collection result pages"
                >
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => changePage(page - 1)}
                  >
                    <FiArrowLeft aria-hidden="true" /> Previous
                  </button>
                  <span>
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={page >= pagination.totalPages}
                    onClick={() => changePage(page + 1)}
                  >
                    Next <FiArrowRight aria-hidden="true" />
                  </button>
                </nav>
              )}
            </>
          )}
        </section>
        <section
          className={styles.otherCollections}
          aria-label="Other featured collections"
        >
          <h2>Explore more collections</h2>
          <div className={styles.otherGrid}>
            {FEATURED_COLLECTIONS.filter((item) => item.slug !== slug).map(
              (item) => (
                <Link
                  key={item.slug}
                  to={"/discover/collections/" + item.slug}
                  className={styles.otherCard}
                >
                  <img src={item.image} alt="" loading="lazy" />
                  <span>{item.title}</span>
                  <FiArrowRight aria-hidden="true" />
                </Link>
              ),
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
