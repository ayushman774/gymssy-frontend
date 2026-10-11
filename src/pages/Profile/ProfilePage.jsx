import { Link, Navigate, useNavigate } from "react-router-dom";
import { useCustomerAuth } from "../../context/CustomerAuthContext.jsx";
import styles from "./ProfilePage.module.css";

const sections = [
  { title: "Favorites", description: "Your saved gyms, trainers and experiences", href: "/favorites", icon: "♡" },
  { title: "Enquiries", description: "Follow up on conversations with providers", href: "/enquiries", icon: "✉" },
  { title: "My Bookings", description: "View and manage your fitness bookings", href: "/bookings", icon: "▦" },
];

export default function ProfilePage() {
  const { user, loading, isAuthenticated, logout } = useCustomerAuth();
  const navigate = useNavigate();
  if (loading) return <main className={styles.page}><p>Loading profile…</p></main>;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: "/profile" }} />;
  const name = user?.name || "Gymssy Member";
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <p className={styles.eyebrow}>MY GYMSSY</p>
        <h1 className={styles.heading}>My Profile</h1>
        <section className={styles.identity} aria-label="Account details">
          <div className={styles.avatar}>{user?.avatar?.url ? <img src={user.avatar.url} alt="" /> : name.trim().charAt(0).toUpperCase()}</div>
          <div><h2>Hi, {name}</h2><p>{user?.email}</p></div>
        </section>
        <h2 className={styles.sectionTitle}>Your account</h2>
        <div className={styles.links}>
          {sections.map((item) => <Link className={styles.item} to={item.href} key={item.href}>
            <span className={styles.icon} aria-hidden="true">{item.icon}</span>
            <span className={styles.itemCopy}><strong>{item.title}</strong><small>{item.description}</small></span>
            <span className={styles.arrow} aria-hidden="true">→</span>
          </Link>)}
          <button type="button" className={styles.item} onClick={() => { logout(); navigate("/", { replace: true }); }}>
            <span className={styles.icon} aria-hidden="true">↪</span>
            <span className={styles.itemCopy}><strong>Log Out</strong><small>Sign out of your Gymssy account</small></span>
            <span className={styles.arrow} aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </main>
  );
}
