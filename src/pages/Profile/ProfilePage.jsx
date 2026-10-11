import { useEffect, useRef, useState } from "react";
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
  const { user, updateProfile, uploadProfilePhoto } = useCustomerAuth();
  const [avatarMode, setAvatarMode] = useState("photo");
  const [pictureTab, setPictureTab] = useState("avatar");
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
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
    setAvatarMode(user?.avatarPreset ? "preset" : user?.avatar?.url ? "photo" : "default");
  }, [user]);
  const handlePhoto = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setMessage("Choose a JPEG, PNG, or WebP image."); return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image must be 5 MB or smaller."); return;
    }
    setUploading(true);
    setMessage("");
    try {
      await uploadProfilePhoto(file);
      setAvatarMode("photo");
      setPictureTab("upload");
      setMessage("Photo uploaded successfully.");
    } catch (error) {
      setMessage(error.message || "Unable to upload photo.");
    } finally {
      setUploading(false);
    }
  };
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
        ...(avatarMode !== "photo" ? { avatarPreset: avatarMode === "default" ? "" : form.avatarPreset } : {}),
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
          <p>Upload your photo or choose an avatar that represents you.</p>
          <div className={styles.largeAvatar}>
            {((avatarMode === "preset" && presetAvatarUrl(form.avatarPreset)) || (avatarMode === "photo" && user?.avatar?.url)) ?
              <img src={avatarMode === "preset" ? presetAvatarUrl(form.avatarPreset) : user.avatar.url} alt="Selected profile avatar" onError={(event) => { event.currentTarget.onerror = null; if (avatarMode === "preset") event.currentTarget.src = `/avatars/${form.avatarPreset}.svg`; }} /> :
              (form.name.trim().charAt(0) || "G").toUpperCase()}
          </div>
        </div>
        <div className={styles.picturePicker}>
          <div className={styles.avatarActions} role="tablist" aria-label="Profile picture options">
            <button type="button" role="tab" aria-selected={pictureTab === "upload"} className={`${styles.pictureTab} ${pictureTab === "upload" ? styles.pictureTabActive : ""}`} onClick={() => setPictureTab("upload")}>Upload Photo</button>
            <button type="button" role="tab" aria-selected={pictureTab === "avatar"} className={`${styles.pictureTab} ${pictureTab === "avatar" ? styles.pictureTabActive : ""}`} onClick={() => setPictureTab("avatar")}>Choose Avatar</button>
          </div>
          <input ref={fileInputRef} id="profile-photo-upload" className={styles.photoInput} type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading || saving} onChange={handlePhoto} />
          {pictureTab === "upload" ? (
            <div className={styles.uploadPanel} role="tabpanel">
              <div className={styles.uploadIcon} aria-hidden="true">↑</div>
              <strong>{uploading ? "Uploading your photo…" : "Add your own profile photo"}</strong>
              <p>JPEG, PNG or WebP · Maximum 5 MB</p>
              <button type="button" className={styles.uploadButton} disabled={uploading || saving} onClick={() => fileInputRef.current?.click()}>
                {uploading ? "Uploading…" : user?.avatar?.url ? "Change Photo" : "Select Photo"}
              </button>
              {user?.avatar?.url && <p className={styles.uploadSuccess}>Your uploaded photo is saved and available across Gymssy.</p>}
            </div>
          ) : (
            <div className={styles.avatarChoices} role="tabpanel">
              <button type="button" className={`${styles.avatarChoice} ${avatarMode === "default" ? styles.selectedAvatar : ""}`} aria-pressed={avatarMode === "default"} onClick={() => { setAvatarMode("default"); setForm((f) => ({ ...f, avatarPreset: "" })); }}>Default</button>
              {presetSeeds.map((seed, index) => {
                const id = `avatar-${seed}`;
                return <button type="button" key={id} aria-label={`Choose cartoon avatar ${index + 1}`} aria-pressed={avatarMode === "preset" && form.avatarPreset === id}
                  className={`${styles.avatarChoice} ${avatarMode === "preset" && form.avatarPreset === id ? styles.selectedAvatar : ""}`}
                  onClick={() => { setAvatarMode("preset"); setForm((f) => ({ ...f, avatarPreset: id })); }}>
                  <img src={presetAvatarUrl(id)} alt={`Cartoon avatar ${index + 1}`} loading="lazy" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = `/avatars/${id}.svg`; }} />
                </button>;
              })}
            </div>
          )}
      </div></div>
      <p className={styles.hint}>Upload a JPEG, PNG or WebP photo (max 5 MB), select an illustrated avatar, or keep the default. Photo uploads are saved immediately; other changes use Save Changes.</p>
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
      <button className={styles.saveButton} type="submit" disabled={saving || uploading}>{saving ? "Saving…" : "Save Changes"}</button>
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
