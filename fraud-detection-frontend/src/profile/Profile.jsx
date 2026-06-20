import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import { MdEmail, MdPerson, MdShield, MdVerified, MdEdit } from "react-icons/md";

function Profile() {
  const { user } = useAuth();

  const fields = [
    { label: "Full Name",  value: user?.name,  icon: MdPerson  },
    { label: "Email",      value: user?.email, icon: MdEmail   },
    { label: "Role",       value: user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1), icon: MdShield },
    { label: "Status",     value: "Active",    icon: MdVerified },
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Your account information and details</p>
        </div>
        <button className="btn-ghost" style={{ fontSize: 13 }}>
          <MdEdit /> Edit Profile
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20 }}>
        {/* Avatar Card */}
        <div className="glass-card" style={{ padding: "32px 24px", textAlign: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              className="avatar"
              style={{
                width: 96, height: 96, fontSize: 36,
                boxShadow: "0 8px 32px rgba(99,102,241,0.4)",
                marginBottom: 20,
              }}
            >
              {user?.name?.[0]?.toUpperCase()}
            </div>

            <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
              {user?.name}
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4, marginBottom: 16 }}>
              {user?.email}
            </p>

            <span className={`badge ${user?.role === "admin" ? "badge-danger" : "badge-success"}`}
              style={{ fontSize: 12, padding: "6px 16px" }}>
              {user?.role === "admin" ? "🛡️ Admin" : "👤 User"}
            </span>

            {/* Divider */}
            <div style={{ width: "100%", height: 1, background: "var(--border-color)", margin: "24px 0" }} />

            <div style={{ width: "100%", textAlign: "left" }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 12 }}>
                Account Status
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--success)", boxShadow: "0 0 8px var(--success)" }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--success)" }}>Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="glass-card" style={{ padding: "28px" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 24 }}>
            Account Information
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {fields.map(({ label, value, icon: Icon }) => (
              <div key={label} style={{
                background: "var(--bg-input)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                padding: "16px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <Icon style={{ color: "var(--text-muted)", fontSize: 16 }} />
                  <label className="form-label" style={{ margin: 0 }}>{label}</label>
                </div>
                <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Info Banner */}
          <div style={{
            marginTop: 24,
            background: "rgba(99,102,241,0.08)",
            border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: "var(--radius-md)",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}>
            <MdShield style={{ color: "#818cf8", fontSize: 20, flexShrink: 0 }} />
            <div>
              <p style={{ fontWeight: 600, color: "#818cf8", fontSize: 13 }}>Secure Account</p>
              <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 2 }}>
                Your account is protected. To update your details, go to Settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Profile;