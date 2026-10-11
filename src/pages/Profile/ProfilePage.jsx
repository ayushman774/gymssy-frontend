import { useEffect, useState } from "react";
import { NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useCustomerAuth } from "../../context/CustomerAuthContext.jsx";
import styles from "./ProfilePage.module.css";

const tabs = [
  { label: "Profile", href: "/profile", icon: "◉", end: true },
  { label: "Favorites", href: "/profile/favorites", icon: "♡" },
  { label: "Enquiries", href: "/profile/enquiries", icon: "✉" },
  { label: "My Bookings", href: "/profile/bookings", icon: "▦" },
];

const presetSeeds = ["Aarav", "Vihaan", "Kabir", "Arjun", "Reyansh", "Ishaan", "Anaya", "Diya", "Meera", "Sara", "Kiara", "Tara"];
export const presetAvatarUrl = (id) => {
  const index = Number(id?.replace("avatar-", "")) - 1;
  return Number.isInteger(index) && index >= 0 && index < presetSeeds.length
    ? `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(presetSeeds[index])}`
    : "";
};
export const customerAvatarUrl = (user) => user?.avatar?.url || presetAvatarUrl(user?.avatarPreset);

export function ProfileOverview() {
  const { user, updateProfile } = useCustomerAuth();
  const [form, setForm] = useState({ name: "", gender: "", address: { line1: "", area: "", city: "", state: "", pincode: "" }, avatarPreset: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    setForm({ name: user?.name || "", gender: user?.gender || "", address: {
      line1: user?.address?.line1 || "", area: user?.address?.area || "", city: user?.address?.city || "",
      state: user?.address?.state || "", pincode: user?.address?.pincode || ""
    }, avatarPreset: user?.avatarPreset || "" });
  }, [user]);
  const setAddress = (key, value) => setForm((prev) => ({ ...prev, address: { ...prev.address, [key]: value } }));
  const save = async (event) => {
    event.preventDefault();
    setSaving(true); setMessage("");
    try { await updateProfile({ name: form.name, gender: form.gender, address: form.address, avatarPreset: form.avatarPreset }); setMessage("Profile saved successfully."); }
    catch (error) { setMessage(error.message || "Unable to save profile."); }
    finally { setSaving(false); }
  };
  return <section className={styles.overview}>
    <p className={styles.eyebrow}>ACCOUNT SETTINGS</p><h1>My Profile</h1>
    <p className={styles.subtitle}>Personalize your Gymssy account.</p>
    <form className={styles.editForm} onSubmit={save}>
      <h2>Choose your avatar</h2>
      <div className={styles.avatarChoices}>
        <button type="button" className={`${styles.avatarChoice} ${!form.avatarPreset ? styles.selectedAvatar : ""}`} onClick={() => setForm((f) => ({ ...f, avatarPreset: "" }))}>Default</button>
        {presetSeeds.map((seed, index) => {
          const id = `avatar-${index + 1}`;
          return <button type="button" key={id} aria-label={`Choose cartoon avatar ${index + 1}`} aria-pressed={form.avatarPreset === id}
            className={`${styles.avatarChoice} ${form.avatarPreset === id ? styles.selectedAvatar : ""}`}
            onClick={() => setForm((f) => ({ ...f, avatarPreset: id }))}>
            <img src={presetAvatarUrl(id)} alt={`Cartoon avatar ${index + 1}`} loading="lazy" />
          </button>;
        })}
      </div>
      <p className={styles.hint}>Choose from 12 cartoon avatars. Personal photo uploads will be available once secure media storage is connected.</p>
      <div className={styles.formGrid}>
        <label>Full name<input required maxLength={100} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></label>
        <label>Gender<select value={form.gender} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}>
          <option value="">Select gender</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option><option value="prefer_not_to_say">Prefer not to say</option>
        </select></label>
        <label>Email address<input readOnly value={user?.email || ""} /></label>
        <label>Mobile number<input readOnly value={user?.phone || ""} /></label>
      </div>
      <h2>Address</h2>
      <div className={styles.formGrid}>
        {Object.entries({ line1: "Address line", area: "Area / locality", city: "City", state: "State", pincode: "PIN code" }).map(([key, label]) =>
          <label key={key}>{label}<input maxLength={180} value={form.address[key]} onChange={(e) => setAddress(key, e.target.value)} /></label>)}
      </div>
      {message && <p role="status" className={styles.hint}>{message}</p>}
      <button className={styles.saveButton} type="submit" disabled={saving}>{saving ? "Saving…" : "Save Changes"}</button>
    </form>
  </section>;
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
              {customerAvatarUrl(user) ? <img src={customerAvatarUrl(user)} alt="" /> : name.trim().charAt(0).toUpperCase()}
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
