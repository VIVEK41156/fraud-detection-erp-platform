import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../services/api";
import { useToast } from "../../context/ToastContext";
import {
  MdAdd, MdSearch, MdClose, MdVerifiedUser, MdBlock,
  MdDelete, MdSwapHoriz, MdLock, MdRefresh,
  MdWarning, MdCheckCircle, MdLocationOn, MdCreditCard,
} from "react-icons/md";

// ─── helpers ────────────────────────────────────────────────────
function getRiskColor(score) {
  if (score >= 80) return { color: "#ef4444", bg: "rgba(239,68,68,0.1)" };
  if (score >= 50) return { color: "#f59e0b", bg: "rgba(245,158,11,0.1)" };
  return { color: "#10b981", bg: "rgba(16,185,129,0.1)" };
}

function StatusBadge({ status }) {
  if (!status) return <span className="badge badge-info">—</span>;
  const map = {
    "Completed":   "badge-success",
    "Fraud":       "badge-danger",
    "Pending OTP": "badge-warning",
    "Blocked":     "badge-danger",
    "Approved":    "badge-success",
  };
  return <span className={`badge ${map[status] || "badge-info"}`}>{status}</span>;
}

// ─── main component ─────────────────────────────────────────────
function Transactions() {
  const toast = useToast();

  const [formData, setFormData] = useState({
    amount: "", currency: "INR", paymentMethod: "Credit Card",
    merchantName: "", merchantCategory: "", location: "", deviceType: "Desktop",
  });
  const [transactions, setTransactions]       = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [search, setSearch]                   = useState("");
  const [fraudFilter, setFraudFilter]         = useState("all");
  const [selectedTx, setSelectedTx]           = useState(null);
  const [otp, setOtp]                         = useState("");
  const [adminNote, setAdminNote]             = useState("");
  const [showForm, setShowForm]               = useState(false);
  const [submitting, setSubmitting]           = useState(false);
  const [otpLoading, setOtpLoading]           = useState(false);

  // ─── fetch ───────────────────────────────────────────────────
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/transactions");
      setTransactions(res.data.transactions || []);
    } catch (e) {
      toast.error("Could not load transactions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  // ─── create transaction ───────────────────────────────────────
  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // 30-second client-side timeout — backend should respond in <5s now
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 30000);

      const res = await API.post("/transactions", formData, {
        signal: controller.signal,
      });
      clearTimeout(timer);

      const msg = res.data.message || "Transaction created!";
      if (res.data.transaction?.transactionStatus === "Pending OTP") {
        toast.info("⚠️ High risk — OTP sent to admin email. Check your inbox.");
      } else {
        toast.success("✅ " + msg);
      }
      await fetchTransactions();
      setFormData({
        amount: "", currency: "INR", paymentMethod: "Credit Card",
        merchantName: "", merchantCategory: "", location: "", deviceType: "Desktop",
      });
      setShowForm(false);
    } catch (e) {
      if (e.name === "AbortError" || e.code === "ERR_CANCELED") {
        toast.error("Request timed out. Please try again.");
      } else {
        toast.error(e.response?.data?.message || "Failed to create transaction.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ─── delete ───────────────────────────────────────────────────
  const deleteTransaction = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await API.delete(`/transactions/${id}`);
      toast.success("Transaction deleted.");
      fetchTransactions();
    } catch {
      toast.error("Failed to delete.");
    }
  };

  // ─── OTP verify ───────────────────────────────────────────────
  const verifyOtp = async () => {
    if (!otp || otp.length < 6) { toast.error("Enter the 6-digit OTP."); return; }
    setOtpLoading(true);
    try {
      const res = await API.post("/otp/verify", { transactionId: selectedTx._id, otp });
      toast.success(res.data.message || "OTP verified! ✅");
      setOtp("");
      setSelectedTx(null);
      fetchTransactions();
    } catch (e) {
      toast.error(e.response?.data?.message || "OTP verification failed.");
    } finally {
      setOtpLoading(false);
    }
  };

  // ─── admin action ─────────────────────────────────────────────
  const handleAdminAction = async (action) => {
    try {
      await API.put(`/admin-actions/${selectedTx._id}`, { action, note: adminNote });
      toast.success(`Transaction ${action}d.`);
      setSelectedTx(null);
      setAdminNote("");
      fetchTransactions();
    } catch {
      toast.error("Failed to apply action.");
    }
  };

  // ─── filter ───────────────────────────────────────────────────
  const filtered = transactions.filter((item) => {
    const s = search.toLowerCase();
    const matchSearch = !s || item.merchantName?.toLowerCase().includes(s) ||
                        item.location?.toLowerCase().includes(s);
    const matchFraud  = fraudFilter === "all"   ? true
                      : fraudFilter === "fraud" ? item.isFraud
                      : !item.isFraud;
    return matchSearch && matchFraud;
  });

  // ─── render ───────────────────────────────────────────────────
  return (
    <DashboardLayout>

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">Create and manage all financial transactions</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-ghost" onClick={fetchTransactions} title="Refresh">
            <MdRefresh />
          </button>
          <button className="btn-primary" onClick={() => setShowForm((v) => !v)}>
            <MdAdd /> New Transaction
          </button>
        </div>
      </div>

      {/* ── Create Form ───────────────────────────────────────── */}
      {showForm && (
        <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 20 }}>
            Create Transaction
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label className="form-label">Amount (₹) *</label>
                <input type="number" name="amount" placeholder="0.00"
                  value={formData.amount} onChange={handleChange}
                  required className="form-input" min="1" />
              </div>
              <div>
                <label className="form-label">Merchant Name *</label>
                <input type="text" name="merchantName" placeholder="e.g. Amazon India"
                  value={formData.merchantName} onChange={handleChange}
                  required className="form-input" />
              </div>
              <div>
                <label className="form-label">Merchant Category *</label>
                <input type="text" name="merchantCategory" placeholder="e.g. E-commerce"
                  value={formData.merchantCategory} onChange={handleChange}
                  required className="form-input" />
              </div>
              <div>
                <label className="form-label">Location *</label>
                <input type="text" name="location" placeholder="e.g. Mumbai"
                  value={formData.location} onChange={handleChange}
                  required className="form-input" />
              </div>
              <div>
                <label className="form-label">Payment Method</label>
                <select name="paymentMethod" value={formData.paymentMethod}
                  onChange={handleChange} className="form-input">
                  <option>Credit Card</option>
                  <option>Debit Card</option>
                  <option>UPI</option>
                  <option>Net Banking</option>
                </select>
              </div>
              <div>
                <label className="form-label">Device Type</label>
                <select name="deviceType" value={formData.deviceType}
                  onChange={handleChange} className="form-input">
                  <option>Desktop</option>
                  <option>Mobile</option>
                  <option>Tablet</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting
                  ? <><div className="spinner" /> Analysing with AI...</>
                  : <><MdAdd /> Create & Analyse</>}
              </button>
              <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Filters ───────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <MdSearch style={{
            position: "absolute", left: 12, top: "50%",
            transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 18
          }} />
          <input className="form-input" placeholder="Search merchant or location..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 38, width: 280 }} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["all", "fraud", "safe"].map((f) => (
            <button key={f} onClick={() => setFraudFilter(f)}
              className={fraudFilter === f ? "btn-primary" : "btn-ghost"}
              style={{ padding: "10px 16px", fontSize: 13, textTransform: "capitalize" }}>
              {f === "all" ? "All" : f === "fraud" ? "🚨 Fraud" : "✅ Safe"}
            </button>
          ))}
        </div>
        <span className="badge badge-accent" style={{ padding: "8px 14px", fontSize: 13 }}>
          {filtered.length} results
        </span>
      </div>

      {/* ── Table ─────────────────────────────────────────────── */}
      <div className="glass-card" style={{ overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "60px", textAlign: "center", color: "var(--text-muted)" }}>
            <div className="spinner" style={{ margin: "0 auto 12px", borderTopColor: "#6366f1" }} />
            Loading transactions...
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Merchant</th>
                  <th>Amount</th>
                  <th>Risk Score</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                      No transactions found
                    </td>
                  </tr>
                ) : filtered.map((item) => {
                  const risk = getRiskColor(item.riskScore);
                  return (
                    <tr key={item._id}>
                      <td>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                          {item.merchantName}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                          {item.merchantCategory}
                        </div>
                      </td>
                      <td style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                        ₹{Number(item.amount).toLocaleString("en-IN")}
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div className="risk-bar">
                            <div className="risk-bar-fill" style={{
                              width: `${Math.min(item.riskScore || 0, 100)}%`,
                              background: risk.color,
                            }} />
                          </div>
                          <span style={{
                            fontSize: 12, fontWeight: 700,
                            color: risk.color, background: risk.bg,
                            padding: "2px 8px", borderRadius: "99px",
                          }}>
                            {item.riskScore}%
                          </span>
                        </div>
                      </td>
                      <td><StatusBadge status={item.transactionStatus} /></td>
                      <td>
                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                          {/* VIEW button — opens modal */}
                          <button
                            id={`view-btn-${item._id}`}
                            className="btn-ghost"
                            onClick={() => { setSelectedTx(item); setOtp(""); setAdminNote(""); }}
                            style={{ padding: "6px 14px", fontSize: 12 }}
                          >
                            <MdSwapHoriz /> View
                          </button>
                          <button
                            onClick={(e) => deleteTransaction(item._id, e)}
                            style={{
                              background: "var(--danger-bg)", border: "none",
                              color: "var(--danger)", borderRadius: "var(--radius-md)",
                              padding: "6px 12px", cursor: "pointer", fontSize: 16,
                              display: "flex", alignItems: "center",
                            }}
                          >
                            <MdDelete />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Detail Modal ──────────────────────────────────────── */}
      {selectedTx && (
        <div
          className="modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedTx(null); }}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>

            {/* Modal Header */}
            <div className="modal-header">
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)" }}>
                  Transaction Details
                </h2>
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
                  {selectedTx.merchantName} — ₹{Number(selectedTx.amount).toLocaleString("en-IN")}
                </p>
              </div>
              <button className="btn-icon" onClick={() => setSelectedTx(null)}>
                <MdClose />
              </button>
            </div>

            <div className="modal-body">

              {/* AI Risk Banner */}
              {selectedTx.isFraud && (
                <div style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: "var(--radius-md)",
                  padding: "12px 16px",
                  marginBottom: 16,
                  display: "flex", alignItems: "center", gap: 10,
                }}>
                  <MdWarning style={{ color: "#ef4444", fontSize: 20, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontWeight: 700, color: "#ef4444", fontSize: 13 }}>
                      🤖 AI Fraud Detected — Risk Score: {selectedTx.riskScore}%
                    </p>
                    <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 2 }}>
                      This transaction was flagged by the ML model as high risk.
                    </p>
                  </div>
                </div>
              )}

              {/* Details Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[
                  ["Amount",   `₹${Number(selectedTx.amount).toLocaleString("en-IN")}`],
                  ["Risk Score", `${selectedTx.riskScore}%`],
                  ["Status",   selectedTx.transactionStatus],
                  ["Payment",  selectedTx.paymentMethod],
                  ["Location", selectedTx.location],
                  ["Device",   selectedTx.deviceType],
                  ["Category", selectedTx.merchantCategory],
                  ["IP",       selectedTx.ipAddress || "—"],
                ].map(([label, value]) => (
                  <div key={label} style={{
                    background: "var(--bg-input)",
                    borderRadius: "var(--radius-md)",
                    padding: "12px 14px",
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: 4 }}>
                      {label}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                      {label === "Status" ? <StatusBadge status={value} /> : value}
                    </div>
                  </div>
                ))}
              </div>

              {/* OTP Section — only if Pending OTP */}
              {selectedTx.transactionStatus === "Pending OTP" && (
                <div style={{
                  background: "rgba(245,158,11,0.08)",
                  border: "1px solid rgba(245,158,11,0.3)",
                  borderRadius: "var(--radius-md)",
                  padding: "20px",
                  marginBottom: 16,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <MdLock style={{ color: "#f59e0b", fontSize: 20 }} />
                    <span style={{ fontWeight: 700, color: "#f59e0b", fontSize: 15 }}>
                      OTP Verification Required
                    </span>
                  </div>
                  <p style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 16 }}>
                    An OTP has been sent to <strong>{import.meta.env.VITE_ADMIN_EMAIL || "the admin email"}</strong>.
                    Check your inbox (including spam folder) and enter it below.
                  </p>

                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="form-input"
                    style={{
                      textAlign: "center",
                      fontSize: 22,
                      fontWeight: 800,
                      letterSpacing: "0.35em",
                      marginBottom: 14,
                    }}
                    maxLength={6}
                    autoFocus
                  />

                  <button
                    className="btn-primary"
                    onClick={verifyOtp}
                    disabled={otpLoading || otp.length < 6}
                    style={{ width: "100%", justifyContent: "center", padding: "13px" }}
                  >
                    {otpLoading
                      ? <><div className="spinner" /> Verifying...</>
                      : <><MdVerifiedUser /> Verify OTP</>}
                  </button>
                </div>
              )}

              {/* Admin Note */}
              <div>
                <label className="form-label">Admin Note (optional)</label>
                <textarea
                  placeholder="Add a note about this transaction..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="form-input"
                  style={{ minHeight: 72, resize: "vertical" }}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button className="btn-ghost" onClick={() => setSelectedTx(null)}>
                Close
              </button>
              <button
                onClick={() => handleAdminAction("approve")}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "var(--success-bg)", color: "var(--success)",
                  border: "1px solid rgba(16,185,129,0.25)",
                  borderRadius: "var(--radius-md)", padding: "10px 20px",
                  fontWeight: 600, cursor: "pointer", fontSize: 14,
                }}
              >
                <MdVerifiedUser /> Approve
              </button>
              <button
                onClick={() => handleAdminAction("block")}
                className="btn-danger"
              >
                <MdBlock /> Block
              </button>
            </div>

          </div>
        </div>
      )}

    </DashboardLayout>
  );
}

export default Transactions;