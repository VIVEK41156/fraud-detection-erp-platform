import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { MdShield, MdEmail, MdLock, MdArrowForward } from "react-icons/md";

function Login({ setIsLogin }) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      navigate("/dashboard");
    } else {
      setError(res.message);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: "var(--accent-gradient)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px",
          boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
          fontSize: 26,
        }}>
          <MdShield style={{ color: "white" }} />
        </div>
        <h1 style={{
          fontSize: 26, fontWeight: 800, color: "var(--text-primary)",
          letterSpacing: "-0.02em", marginBottom: 6,
        }}>
          Welcome back
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
          Sign in to FraudShield ERP
        </p>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: "var(--danger-bg)",
          border: "1px solid rgba(239,68,68,0.25)",
          borderRadius: "var(--radius-md)",
          padding: "12px 16px",
          marginBottom: 20,
          color: "var(--danger)",
          fontSize: 13,
          fontWeight: 500,
        }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div style={{ marginBottom: 16 }}>
          <label className="form-label">Email Address</label>
          <div style={{ position: "relative" }}>
            <MdEmail style={{
              position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
              color: "var(--text-muted)", fontSize: 18, pointerEvents: "none",
            }} />
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              style={{ paddingLeft: 42 }}
            />
          </div>
        </div>

        {/* Password */}
        <div style={{ marginBottom: 24 }}>
          <label className="form-label">Password</label>
          <div style={{ position: "relative" }}>
            <MdLock style={{
              position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
              color: "var(--text-muted)", fontSize: 18, pointerEvents: "none",
            }} />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              style={{ paddingLeft: 42 }}
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
          style={{ width: "100%", justifyContent: "center", padding: "14px" }}
        >
          {loading ? (
            <><div className="spinner" /> Signing in...</>
          ) : (
            <>Sign in <MdArrowForward /></>
          )}
        </button>
      </form>

      <p style={{ textAlign: "center", fontSize: 14, color: "var(--text-secondary)", marginTop: 24 }}>
        Don't have an account?{" "}
        <button
          onClick={() => setIsLogin(false)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#818cf8", fontWeight: 600, fontSize: 14,
          }}
        >
          Create account
        </button>
      </p>
    </div>
  );
}

export default Login;