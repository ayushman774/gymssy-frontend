import { motion } from "framer-motion";
import { FiBarChart2, FiCheck, FiMapPin, FiStar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { isProfessionalType } from "../../../utils/discoveryState";
import { FALLBACK_IMAGE, TYPE_LABELS, listingLocation, listingTags, toCompareItem } from "./discoveryCardUtils";
import styles from "../../../pages/Discover/DiscoverPage.module.css";
import FavoriteButton from "../../Favorites/FavoriteButton.jsx";
import { favoriteTargetType } from "../../../utils/favoriteIdentity.js";

export default function DiscoveryCard({ item, selected = false, compareDisabled = false, onCompare, onView }) {
  const navigate = useNavigate();
  const location = listingLocation(item);
  const tags = listingTags(item);
  const professional = isProfessionalType(item.entityType);
  const targetType = favoriteTargetType(item.entityType);
  const viewListing = () => onView ? onView(item.href) : navigate(item.href);
  const imageFallback = (event) => {
    if (event.currentTarget.src.endsWith(FALLBACK_IMAGE)) return;
    event.currentTarget.src = FALLBACK_IMAGE;
    event.currentTarget.classList.add(styles.discoveryFallbackImg);
  };

  return (
    <motion.article className={`${styles.discoverCard} ${selected ? styles.discoverCardSelected : ""}`} whileHover={{ y: -8, transition: { duration: 0.3 } }}>
      <div className={styles.discoverImgWrap}>
        <img src={item.image?.url || FALLBACK_IMAGE} alt={item.image?.alt || item.name} onError={imageFallback} className={styles.discoverImg} loading="lazy" />
        <div className={styles.discoverImgOverlay} aria-hidden="true" />
        {item.verified && <div className={styles.verifiedBadge}><FiCheck aria-hidden="true" /> Verified</div>}
        <div className={styles.discoverCategory}>{TYPE_LABELS[item.entityType] || item.entityType}</div>
        {targetType && <div style={{ position: "absolute", top: onCompare ? 58 : 12, right: 12, zIndex: 4 }}><FavoriteButton targetType={targetType} targetId={item.id} name={item.name} /></div>}
        {onCompare && <button className={`${styles.compareToggle} ${selected ? styles.compareToggleActive : ""}`} onClick={() => onCompare(toCompareItem(item))} disabled={compareDisabled} aria-pressed={selected} aria-label={`${selected ? "Remove" : "Add"} ${item.name} ${selected ? "from" : "to"} comparison`}><FiBarChart2 aria-hidden="true" /><span>{selected ? "Added" : "Compare"}</span></button>}
      </div>
      <div className={styles.discoverBody}>
        <div className={styles.discoverMeta}>
          <span className={styles.discoverRating}><FiStar aria-hidden="true" /> {Number(item.rating || 0).toFixed(1)}</span>
          <span className={styles.discoverReviews}>({item.reviewCount || 0})</span>
          {location && <><span className={styles.discoverDot} aria-hidden="true" /><span className={styles.discoverDistance}><FiMapPin aria-hidden="true" /> {location}</span></>}
        </div>
        <h3 className={styles.discoverName}>{item.name}</h3>
        <div className={styles.discoverTags}>{tags.slice(0, 3).map((tag) => <span key={tag} className={styles.discoverTag}>{tag.replaceAll("-", " ")}</span>)}</div>
        <div className={styles.discoverFooter}>
          {item.price ? <span className={styles.discoverPrice}>From <strong>{item.price.currency}{item.price.from}</strong></span> : <span className={styles.discoveryCardKind}>{professional ? "Professional profile" : "View details"}</span>}
          <div className={styles.discoverActions}><button className={styles.discoverBtnOutline} onClick={viewListing}>View</button></div>
        </div>
      </div>
    </motion.article>
  );
}
