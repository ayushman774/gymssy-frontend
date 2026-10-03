import { FiHeart } from "react-icons/fi";
import { useFavorites } from "../../context/FavoritesContext.jsx";
import styles from "./FavoriteButton.module.css";

export default function FavoriteButton({ targetType, targetId, name, className = "" }) {
  const { isFavorite, isPending, toggleFavorite } = useFavorites();
  const saved = isFavorite(targetType, targetId);
  const pending = isPending(targetType, targetId);
  return <button type="button" className={`${styles.button} ${saved ? styles.saved : ""} ${className}`} disabled={pending} aria-pressed={saved} aria-label={saved ? `Remove ${name} from favorites` : `Save ${name}`} onClick={(event) => { event.preventDefault(); event.stopPropagation(); toggleFavorite(targetType, targetId); }}><FiHeart aria-hidden="true" /></button>;
}
