import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  MdNotifications,
  MdSettings,
  MdPerson,
  MdLogout,
  MdLightMode,
  MdDarkMode,
  MdWarning,
} from "react-icons/md";

import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const menuRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get("/admin/frauds");
        const frauds = res.data.transactions || res.data.frauds || [];
        setNotifications(frauds.slice(0, 5));
      } catch (e) {}
    };
    fetchNotifications();
  }, []);

  return (
    <div className="topbar">
      {/* Left */}
      <div className="topbar-left">
        <h1>
          Welcome back,{" "}
          <span>{user?.name?.split(" ")[0]}</span>
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>
          {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>

        {/* Theme Toggle */}
        <button className="btn-icon" onClick={toggleTheme} title="Toggle theme">
          {theme === "dark" ? <MdLightMode /> : <MdDarkMode />}
        </button>

        {/* Notifications */}
        <div ref={notifRef} style={{ position: "relative" }}>
          <button
            className="btn-icon"
            onClick={() => { setShowNotifications(!showNotifications); setShowMenu(false); }}
            style={{ position: "relative" }}
          >
            <MdNotifications />
            {notifications.length > 0 && (
              <span style={{
                position: "absolute",
                top: 6,
                right: 6,
                width: 8,
                height: 8,
                background: "var(--danger)",
                borderRadius: "50%",
                border: "2px solid var(--bg-primary)",
              }} />
            )}
          </button>

          {showNotifications && (
            <div className="notif-panel">
              <div className="notif-header">
                <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>
                  Fraud Alerts
                </span>
                {notifications.length > 0 && (
                  <span className="badge badge-danger">{notifications.length}</span>
                )}
              </div>

              {notifications.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
                  No active alerts
                </div>
              ) : (
                notifications.map((item) => (
                  <div key={item._id} className="notif-item">
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: "var(--danger-bg)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, fontSize: 14
                      }}>
                        <MdWarning style={{ color: "var(--danger)" }} />
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)" }}>
                          {item.merchantName}
                        </p>
                        <p style={{ fontSize: 12, color: "var(--danger)", fontWeight: 600 }}>
                          ₹{item.amount?.toLocaleString()}
                        </p>
                        <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                          {item.location}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Settings */}
        <Link to="/dashboard/settings" className="btn-icon">
          <MdSettings />
        </Link>

        {/* Avatar */}
        <div ref={menuRef} style={{ position: "relative" }}>
          <div
            className="avatar"
            style={{ width: 42, height: 42, fontSize: 15, cursor: "pointer", boxShadow: "var(--shadow-glow)" }}
            onClick={() => { setShowMenu(!showMenu); setShowNotifications(false); }}
          >
            {user?.name?.[0]?.toUpperCase()}
          </div>

          {showMenu && (
            <div className="dropdown">
              <div className="dropdown-header">
                <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>
                  {user?.name}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                  {user?.email}
                </div>
                <span
                  className={`badge ${user?.role === "admin" ? "badge-danger" : "badge-success"}`}
                  style={{ marginTop: 8 }}
                >
                  {user?.role}
                </span>
              </div>

              <Link to="/dashboard/profile" className="dropdown-item" onClick={() => setShowMenu(false)}>
                <MdPerson /> Profile
              </Link>
              <Link to="/dashboard/settings" className="dropdown-item" onClick={() => setShowMenu(false)}>
                <MdSettings /> Settings
              </Link>
              <button className="dropdown-item" onClick={logout} style={{ color: "var(--danger)", width: "100%" }}>
                <MdLogout /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;