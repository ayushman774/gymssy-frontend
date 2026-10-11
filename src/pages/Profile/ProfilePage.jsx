import { NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useCustomerAuth } from "../../context/CustomerAuthContext.jsx";
import styles from "./ProfilePage.module.css";

const tabs = [
  { label: "Profile", href: "/profile", icon: "◉", end: true },
  { label: "Favorites", href: "/profile/favorites", icon: "♡" },
  { label: "Enquiries", href: "/profile/enquiries", icon: "✉" },
  { label: "My Bookings", href: "/profile/bookings", icon: "▦" },
];

export function ProfileOverview() {
  const { user } = useCustomerAuth();
  const name = user?.name || "Gymssy Member";
  return (
    <section className={styles.overview}>
      <p className={styles.eyebrow}>ACCOUNT OVERVIEW</p>
      <h1>My Profile</h1>
      <p className={styles.subtitle}>Your Gymssy account details in one place.</p>
      <div className={styles.details}>
        <h2>Personal information</h2>
        <div className={styles.detail}><span>Full name</span><strong>{name}</strong></div>
        <div className={styles.detail}><span>Email address</span><strong>{user?.email || "—"}</strong></div>
        <div className={styles.detail}><span>Phone number</span><strong>{user?.phone || "Not provided"}</strong></div>
      </div>
    </section>
  );
}

export default function ProfilePage() {
  const { user, loading, isAuthenticated, logout } = useCustomerAuth();
  const navigate = useNavigate();
  if (loading) return <main className={styles.page}><p>Loading your account…</p></main>;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: "/profile" }} />;
  const name = user?.name || "Gymssy Member";
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <aside className={styles.sidebar} aria-label="My account navigation">
          <div className={styles.account}>
            <div className={styles.avatar} aria-hidden="true">
              {user?.avatar?.url ? <img src={user.avatar.url} alt="" /> : name.trim().charAt(0).toUpperCase()}
            </div>
            <div className={styles.accountCopy}><strong>{name}</strong><small>{user?.email}</small></div>
          </div>
          <p className={styles.menuLabel}>MY ACCOUNT</p>
          <nav className={styles.tabs}>
            {tabs.map((tab) => (
              <NavLink key={tab.href} to={tab.href} end={tab.end} className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ""}`}>
                <span className={styles.tabIcon} aria-hidden="true">{tab.icon}</span>{tab.label}
              </NavLink>
            ))}
          </nav>
          <button className={styles.logout} type="button" onClick={() => { logout(); navigate("/", { replace: true }); }}>
            <span className={styles.tabIcon} aria-hidden="true">↪</span>Log Out
          </button>
        </aside>
        <div className={styles.panel}><Outlet /></div>
      </div>
    </main>
  );
}
