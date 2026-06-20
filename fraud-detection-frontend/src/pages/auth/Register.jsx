import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { MdPerson, MdEmail, MdLock, MdShield, MdArrowForward } from "react-icons/md";

function Register({ setIsLogin }) {
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await register(formData.name, formData.email, formData.password, formData.role);
    setLoading(false);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => setIsLogin(true), 1500);
    } else {
      setError(res.message);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
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
          Create account
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
          Join FraudShield ERP
        </p>
      </div>

      {error && (
        <div style={{
          background: "var(--danger-bg)", border: "1px solid rgba(239,68,68,0.25)",
          borderRadius: "var(--radius-md)", padding: "12px 16px", marginBottom: 16,
          color: "var(--danger)", fontSize: 13, fontWeight: 500,
        }}>
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div style={{
          background: "var(--success-bg)", border: "1px solid rgba(16,185,129,0.25)",
          borderRadius: "var(--radius-md)", padding: "12px 16px", marginBottom: 16,
          color: "var(--success)", fontSize: 13, fontWeight: 500,
        }}>
          ✅ Registration successful! Redirecting to login...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 14 }}>
          <label className="form-label">Full Name</label>
          <div style={{ position: "relative" }}>
            <MdPerson style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 18, pointerEvents: "none" }} />
            <input type="text" name="name" placeholder="John Doe" onChange={handleChange} required className="form-input" style={{ paddingLeft: 42 }} />
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label className="form-label">Email Address</label>
          <div style={{ position: "relative" }}>
            <MdEmail style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 18, pointerEvents: "none" }} />
            <input type="email" name="email" placeholder="you@company.com" onChange={handleChange} required className="form-input" style={{ paddingLeft: 42 }} />
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label className="form-label">Password</label>
          <div style={{ position: "relative" }}>
            <MdLock style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 18, pointerEvents: "none" }} />
            <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required className="form-input" style={{ paddingLeft: 42 }} />
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label className="form-label">Role</label>
          <select name="role" onChange={handleChange} className="form-input" style={{ cursor: "pointer" }}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button type="submit" className="btn-primary" disabled={loading || success} style={{ width: "100%", justifyContent: "center", padding: "14px" }}>
          {loading ? <><div className="spinner" /> Creating...</> : <>Create Account <MdArrowForward /></>}
        </button>
      </form>

      <p style={{ textAlign: "center", fontSize: 14, color: "var(--text-secondary)", marginTop: 24 }}>
        Already have an account?{" "}
        <button
          onClick={() => setIsLogin(true)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#818cf8", fontWeight: 600, fontSize: 14 }}
        >
          Sign in
        </button>
      </p>
    </div>
  );
}

export default Register;