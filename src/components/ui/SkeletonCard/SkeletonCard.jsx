import styles from "./SkeletonCard.module.css";

/* ══════════════════════════════════════════════════════
   SKELETON CARD
   Generic shimmer placeholder — reusable across pages.
   variant: "gym" | "trainer" | "experience" | "city"
══════════════════════════════════════════════════════ */
const SkeletonCard = ({ variant = "gym" }) => {
  return (
    <div
      className={`${styles.skeleton} ${styles[variant]}`}
      aria-hidden="true"
      role="presentation"
    >
      <div className={styles.imageArea} />
      <div className={styles.body}>
        <div className={`${styles.line} ${styles.lineShort}`} />
        <div className={`${styles.line} ${styles.lineMed}`} />
        <div className={`${styles.line} ${styles.lineShort}`} />
        {variant !== "city" && (
          <>
            <div className={`${styles.line} ${styles.lineLong}`} />
            <div className={`${styles.line} ${styles.lineMed}`} />
          </>
        )}
      </div>
    </div>
  );
};

export const SkeletonRow = ({ count = 4, variant = "gym" }) => (
  <div className={styles.row}>
    {Array.from({ length: count }, (_, i) => (
      <SkeletonCard key={i} variant={variant} />
    ))}
  </div>
);

export default SkeletonCard;
