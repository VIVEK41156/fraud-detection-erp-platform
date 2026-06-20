import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import {
  MdPerson, MdLock, MdNotifications, MdDarkMode,
  MdLightMode, MdSave, MdShield,
} from "react-icons/md";

function Settings() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name:            user?.name  || "",
    email:           user?.email || "",
    currentPassword: "",
    newPassword:     "",
  });
  const [saving, setSaving] = useState(false);
  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    fraudAlerts:        true,
    weeklyReports:      false,
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800)); // simulate save
    setSaving(false);
    toast.success("Settings saved successfully!");
  };

  const togglePref = (key) =>
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account preferences and security</p>
        </div>
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? <><div className="spinner" /> Saving...</> : <><MdSave /> Save Changes</>}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Profile Settings */}
        <div className="glass-card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(99,102,241,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MdPerson style={{ color: "#818cf8", fontSize: 18 }} />
            </div>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Profile Settings</h2>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Update your name and email</p>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="form-label">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" />
          </div>
          <div>
            <label className="form-label">Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" />
          </div>
        </div>

        {/* Password */}
        <div className="glass-card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MdLock style={{ color: "#f87171", fontSize: 18 }} />
            </div>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Change Password</h2>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Update your security credentials</p>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="form-label">Current Password</label>
            <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} placeholder="••••••••" className="form-input" />
          </div>
          <div>
            <label className="form-label">New Password</label>
            <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="••••••••" className="form-input" />
          </div>
        </div>
      </div>

      {/* Notifications & Preferences */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Notifications */}
        <div className="glass-card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(59,130,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MdNotifications style={{ color: "#60a5fa", fontSize: 18 }} />
            </div>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Notifications</h2>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Control your alert preferences</p>
            </div>
          </div>

          {[
            { key: "emailNotifications", label: "Email Notifications", desc: "Receive alerts via email" },
            { key: "fraudAlerts",        label: "Fraud Alerts",        desc: "Instant fraud detection alerts" },
            { key: "weeklyReports",      label: "Weekly Reports",      desc: "Summary report every Monday" },
          ].map(({ key, label, desc }) => (
            <div key={key} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 16px",
              background: "var(--bg-input)",
              borderRadius: "var(--radius-md)",
              marginBottom: 10,
            }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{label}</p>
                <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{desc}</p>
              </div>
              <label className="toggle-wrapper">
                <input type="checkbox" checked={prefs[key]} onChange={() => togglePref(key)} />
                <span className="toggle-slider" />
              </label>
            </div>
          ))}
        </div>

        {/* Appearance */}
        <div className="glass-card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(245,158,11,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {theme === "dark"
                ? <MdDarkMode style={{ color: "#fbbf24", fontSize: 18 }} />
                : <MdLightMode style={{ color: "#fbbf24", fontSize: 18 }} />
              }
            </div>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Appearance</h2>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Customize your display</p>
            </div>
          </div>

          {/* Theme Toggle */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 16px",
            background: "var(--bg-input)",
            borderRadius: "var(--radius-md)",
            marginBottom: 10,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {theme === "dark"
                ? <MdDarkMode style={{ color: "var(--text-secondary)" }} />
                : <MdLightMode style={{ color: "var(--text-secondary)" }} />
              }
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                  {theme === "dark" ? "Dark Mode" : "Light Mode"}
                </p>
                <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                  Currently using {theme} theme
                </p>
              </div>
            </div>
            <label className="toggle-wrapper">
              <input type="checkbox" checked={theme === "dark"} onChange={toggleTheme} />
              <span className="toggle-slider" />
            </label>
          </div>

          {/* Security Banner */}
          <div style={{
            marginTop: 20,
            background: "rgba(99,102,241,0.08)",
            border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: "var(--radius-md)",
            padding: "16px",
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
          }}>
            <MdShield style={{ color: "#818cf8", fontSize: 20, flexShrink: 0, marginTop: 1 }} />
            <div>
              <p style={{ fontWeight: 600, color: "#818cf8", fontSize: 13 }}>Security Tips</p>
              <ul style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 4, paddingLeft: 16 }}>
                <li>Use a strong, unique password</li>
                <li>Keep your email address up to date</li>
                <li>Review your activity logs regularly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Settings;