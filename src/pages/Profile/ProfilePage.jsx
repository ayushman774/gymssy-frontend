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

const presetSeeds = Array.from({ length: 12 }, (_, index) => index + 1);
export const presetAvatarUrl = (id) => {
  const index = Number(id?.replace("avatar-", ""));
  return Number.isInteger(index) && index >= 1 && index <= 12 ? `/avatars/avatar-${index}.jpg` : "";
};
export const customerAvatarUrl = (user) =>
  user?.avatar?.url || presetAvatarUrl(user?.avatarPreset);

export function ProfileOverview() {
  const { user, updateProfile } = useCustomerAuth();
  const [form, setForm] = useState({
    name: "",
    gender: "",
    address: { line1: "", area: "", city: "", state: "", pincode: "" },
    avatarPreset: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    setForm({
      name: user?.name || "",
      gender: user?.gender || "",
      address: {
        line1: user?.address?.line1 || "",
        area: user?.address?.area || "",
        city: user?.address?.city || "",
        state: user?.address?.state || "",
        pincode: user?.address?.pincode || "",
      },
      avatarPreset: user?.avatarPreset || "",
    });
  }, [user]);
  const setAddress = (key, value) =>
    setForm((prev) => ({
      ...prev,
      address: { ...prev.address, [key]: value },
    }));
  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await updateProfile({
        name: form.name,
        gender: form.gender,
        address: form.address,
        avatarPreset: form.avatarPreset,
      });
      setMessage("Profile saved successfully.");
    } catch (error) {
      setMessage(error.message || "Unable to save profile.");
    } finally {
      setSaving(false);
    }
  };
  return <section className={styles.overview}>
    <h1>My Profile</h1>
    <p className={styles.subtitle}>Manage your profile information and personal preferences.</p>
    <form className={styles.editForm} onSubmit={save}>
      <div className={styles.pictureSection}>
        <div className={styles.picturePreview}>
          <h2>Profile Picture</h2>
          <p>Choose an avatar that represents you.</p>
          <div className={styles.largeAvatar}>
            {customerAvatarUrl({ ...user, avatarPreset: form.avatarPreset, avatar: form.avatarPreset ? { url: "" } : user?.avatar }) ?
              <img src={customerAvatarUrl({ ...user, avatarPreset: form.avatarPreset, avatar: form.avatarPreset ? { url: "" } : user?.avatar })} alt="Selected profile avatar" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = `/avatars/${form.avatarPreset || user?.avatarPreset}.svg`; }} /> :
              (form.name.trim().charAt(0) || "G").toUpperCase()}
          </div>
        </div>
        <div className={styles.picturePicker}>
          <div className={styles.avatarActions}>
            <span className={styles.actionDisabled} title="Photo upload requires secure image storage">Upload Photo — Coming Soon</span>
            <span className={styles.actionActive}>Choose Avatar</span>
          </div>
          <div className={styles.avatarChoices}>
        <button type="button" className={`${styles.avatarChoice} ${!form.avatarPreset ? styles.selectedAvatar : ""}`} onClick={() => setForm((f) => ({ ...f, avatarPreset: "" }))}>Default</button>
        {presetSeeds.map((seed, index) => {
          const id = `avatar-${index + 1}`;
          return <button type="button" key={id} aria-label={`Choose cartoon avatar ${index + 1}`} aria-pressed={form.avatarPreset === id}
            className={`${styles.avatarChoice} ${form.avatarPreset === id ? styles.selectedAvatar : ""}`}
            onClick={() => setForm((f) => ({ ...f, avatarPreset: id }))}>
            <img src={presetAvatarUrl(id)} alt={`Cartoon avatar ${index + 1}`} loading="lazy" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = `/avatars/${id}.svg`; }} />
          </button>;
        })}
      </div>
      </div></div>
      <p className={styles.hint}>Choose your favorite illustrated avatar or keep the default. Photo uploads are coming soon.</p>
      <div className={styles.sectionHeading}><h2>Personal Information</h2><p>Update your details. Email and mobile number cannot be changed.</p></div>
      <div className={styles.formGrid}>
        <label>Full name<input required maxLength={100} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></label>
        <label>Gender<select value={form.gender} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}>
          <option value="">Select gender</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option><option value="prefer_not_to_say">Prefer not to say</option>
        </select></label>
        <label>Email address<input readOnly value={user?.email || ""} /></label>
        <label>Mobile number<input readOnly value={user?.phone || ""} /></label>
      </div>
      <div className={styles.sectionHeading}><h2>Address Information</h2><p>Help us show relevant fitness experiences near you.</p></div>
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
  if (loading)
    return (
      <main className={styles.page}>
        <p>Loading your account…</p>
      </main>
    );
  if (!isAuthenticated)
    return <Navigate to="/login" replace state={{ from: "/profile" }} />;
  const name = user?.name || "Gymssy Member";
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <aside className={styles.sidebar} aria-label="My account navigation">
          <div className={styles.account}>
            <div className={styles.avatar} aria-hidden="true">
              {customerAvatarUrl(user) ? <img src={customerAvatarUrl(user)} alt="" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = `/avatars/${user.avatarPreset}.svg`; }} /> : name.trim().charAt(0).toUpperCase()}
            </div>
            <div className={styles.accountCopy}>
              <strong>{name}</strong>
              <small>{user?.email || ""}</small>
            </div>
          </div>
          <p className={styles.menuLabel}>MY ACCOUNT</p>
          <nav className={styles.tabs}>
            {tabs.map((tab) => (
              <NavLink
                key={tab.href}
                to={tab.href}
                end={tab.end}
                className={({ isActive }) =>
                  `${styles.tab} ${isActive ? styles.active : ""}`
                }
              >
                <span className={styles.tabIcon} aria-hidden="true">
                  {tab.icon}
                </span>
                {tab.label}
              </NavLink>
            ))}
          </nav>
          <button
            className={styles.logout}
            type="button"
            onClick={() => {
              logout();
              navigate("/", { replace: true });
            }}
          >
            <span className={styles.tabIcon} aria-hidden="true">
              ↪
            </span>
            Log Out
          </button>
        </aside>
        <div className={styles.panel}>
          <Outlet />
        </div>
      </div>
    </main>
  );
}
