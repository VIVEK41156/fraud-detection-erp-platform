import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  MdDashboard,
  MdSwapHoriz,
  MdBarChart,
  MdPeople,
  MdWarning,
  MdAssignment,
  MdLogout,
  MdShield,
} from "react-icons/md";

function Sidebar() {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "admin";

  const navItemClass = ({ isActive }) =>
    `nav-item ${isActive ? "active" : ""}`;

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <MdShield style={{ color: "white", fontSize: "20px" }} />
        </div>
        <div>
          <div className="sidebar-logo-text">FraudShield</div>
          <div className="sidebar-logo-sub">ERP Platform</div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div className="nav-section-label">Main Menu</div>

        <NavLink to="/dashboard" end className={navItemClass}>
          <span className="nav-item-icon"><MdDashboard /></span>
          Dashboard
        </NavLink>

        <NavLink to="/dashboard/transactions" className={navItemClass}>
          <span className="nav-item-icon"><MdSwapHoriz /></span>
          Transactions
        </NavLink>

        {isAdmin && (
          <>
            <div className="nav-section-label">Admin</div>

            <NavLink to="/dashboard/analytics" className={navItemClass}>
              <span className="nav-item-icon"><MdBarChart /></span>
              Analytics
            </NavLink>

            <NavLink to="/dashboard/users" className={navItemClass}>
              <span className="nav-item-icon"><MdPeople /></span>
              Users
            </NavLink>

            <NavLink to="/dashboard/frauds" className={navItemClass}>
              <span className="nav-item-icon"><MdWarning /></span>
              Fraud Monitor
            </NavLink>

            <NavLink to="/dashboard/logs" className={navItemClass}>
              <span className="nav-item-icon"><MdAssignment /></span>
              Audit Logs
            </NavLink>
          </>
        )}
      </div>

      {/* Bottom: User + Logout */}
      <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "16px" }}>
        {/* User chip */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 12px",
          borderRadius: "var(--radius-md)",
          marginBottom: "8px",
        }}>
          <div className="avatar" style={{ width: 34, height: 34, fontSize: 13 }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.name}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
              {user?.role}
            </div>
          </div>
        </div>

        <button className="nav-logout" onClick={logout}>
          <span className="nav-item-icon"><MdLogout /></span>
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;