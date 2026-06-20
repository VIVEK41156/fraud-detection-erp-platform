import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Dashboard
import Dashboard from "./pages/dashboard/Dashboard";

// Pages
import Transactions from "./pages/transactions/Transactions";
import Analytics from "./pages/analytics/Analytics";

// Admin
import Users from "./pages/admin/Users";
import Frauds from "./pages/admin/Frauds";
import Logs from "./pages/admin/Logs";

// Profile & Settings
import Profile from "./profile/Profile";
import Settings from "./settings/Settings";


function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Animated background */}
      <div className="auth-bg" />
      <div className="auth-orb" style={{
        width: 500, height: 500,
        background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)",
        top: "-100px", left: "-100px",
        animationDelay: "0s",
      }} />
      <div className="auth-orb" style={{
        width: 400, height: 400,
        background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
        bottom: "-50px", right: "10%",
        animationDelay: "3s",
      }} />
      <div className="auth-orb" style={{
        width: 300, height: 300,
        background: "radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)",
        top: "50%", right: "-50px",
        animationDelay: "1.5s",
      }} />

      {/* Card */}
      <div style={{
        position: "relative", zIndex: 1,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}>
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-xl)",
          padding: "40px",
          width: "100%",
          maxWidth: "440px",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow: "var(--shadow-lg)",
        }}>
          {isLogin
            ? <Login setIsLogin={setIsLogin} />
            : <Register setIsLogin={setIsLogin} />
          }
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/transactions" element={<Transactions />} />
        <Route path="/dashboard/analytics" element={<Analytics />} />
        <Route path="/dashboard/users" element={<Users />} />
        <Route path="/dashboard/frauds" element={<Frauds />} />
        <Route path="/dashboard/logs" element={<Logs />} />
        <Route path="/dashboard/profile" element={<Profile />} />
        <Route path="/dashboard/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;