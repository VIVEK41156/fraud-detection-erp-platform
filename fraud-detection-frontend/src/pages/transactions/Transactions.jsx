import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../services/api";
import { useToast } from "../../context/ToastContext";
import {
  MdAdd, MdSearch, MdClose, MdVerifiedUser, MdBlock,
  MdDelete, MdSwapHoriz, MdLock,
} from "react-icons/md";

function getRiskColor(score) {
  if (score >= 80) return { color: "#ef4444", bg: "rgba(239,68,68,0.1)" };
  if (score >= 50) return { color: "#f59e0b", bg: "rgba(245,158,11,0.1)" };
  return { color: "#10b981", bg: "rgba(16,185,129,0.1)" };
}

function getStatusBadge(status) {
  if (!status) return <span className="badge badge-info">—</span>;
  if (status === "Completed") return <span className="badge badge-success">{status}</span>;
  if (status === "Fraud") return <span className="badge badge-danger">{status}</span>;
  if (status === "Pending OTP") return <span className="badge badge-warning">{status}</span>;
  return <span className="badge badge-info">{status}</span>;
}

function Transactions() {
  const toast = useToast();

  const [formData, setFormData] = useState({
    amount: "", currency: "INR", paymentMethod: "Credit Card",
    merchantName: "", merchantCategory: "", location: "", deviceType: "Desktop",
  });
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [fraudFilter, setFraudFilter] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [adminNote, setAdminNote] = useState("");
  const [otp, setOtp] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchTransactions = async () => {
    try {
      const res = await API.get("/transactions");
      setTransactions(res.data.transactions || []);
    } catch (e) { console.log(e); }
  };

  useEffect(() => { fetchTransactions(); }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await API.post("/transactions", formData);
      toast.success(res.data.message || "Transaction created!");
      fetchTransactions();
      setFormData({ amount: "", currency: "INR", paymentMethod: "Credit Card", merchantName: "", merchantCategory: "", location: "", deviceType: "Desktop" });
      setShowForm(false);
    } catch (e) {
      toast.error("Failed to create transaction.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteTransaction = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    try {
      await API.delete(`/transactions/${id}`);
      toast.success("Transaction deleted.");
      fetchTransactions();
    } catch (e) {
      toast.error("Failed to delete transaction.");
    }
  };

  const verifyOtp = async (transactionId) => {
    try {
      const res = await API.post("/otp/verify", { transactionId, otp });
      toast.success(res.data.message || "OTP verified!");
      fetchTransactions();
      setOtp("");
      setSelectedTransaction(null);
    } catch (e) {
      toast.error(e.response?.data?.message || "OTP verification failed.");
    }
  };

  const handleAdminAction = async (id, action) => {
    try {
      await API.put(`/admin-actions/${id}`, { action, note: adminNote });
      toast.success(`Action applied: ${action}`);
      fetchTransactions();
      setSelectedTransaction(null);
      setAdminNote("");
    } catch (e) {
      toast.error("Failed to apply action.");
    }
  };

  const filtered = transactions.filter((item) => {
    const searchMatch = item.merchantName?.toLowerCase().includes(search.toLowerCase());
    const fraudMatch = fraudFilter === "all" ? true
      : fraudFilter === "fraud" ? item.isFraud : !item.isFraud;
    return searchMatch && fraudMatch;
  });

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">Create and manage all financial transactions</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <MdAdd /> New Transaction
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="glass-card" style={{ padding: "24px", marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 20 }}>
            Create Transaction
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label className="form-label">Amount (₹)</label>
                <input type="number" name="amount" placeholder="0.00" value={formData.amount} onChange={handleChange} required className="form-input" />
              </div>
              <div>
                <label className="form-label">Merchant Name</label>
                <input type="text" name="merchantName" placeholder="e.g. Amazon India" value={formData.merchantName} onChange={handleChange} required className="form-input" />
              </div>
              <div>
                <label className="form-label">Merchant Category</label>
                <input type="text" name="merchantCategory" placeholder="e.g. E-commerce" value={formData.merchantCategory} onChange={handleChange} required className="form-input" />
              </div>
              <div>
                <label className="form-label">Location</label>
                <input type="text" name="location" placeholder="e.g. Mumbai" value={formData.location} onChange={handleChange} required className="form-input" />
              </div>
              <div>
                <label className="form-label">Payment Method</label>
                <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="form-input">
                  <option>Credit Card</option>
                  <option>Debit Card</option>
                  <option>UPI</option>
                  <option>Net Banking</option>
                </select>
              </div>
              <div>
                <label className="form-label">Device Type</label>
                <select name="deviceType" value={formData.deviceType} onChange={handleChange} className="form-input">
                  <option>Desktop</option>
                  <option>Mobile</option>
                  <option>Tablet</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? <><div className="spinner" /> Creating...</> : <><MdAdd /> Create Transaction</>}
              </button>
              <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ position: "relative" }}>
          <MdSearch style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 18 }} />
          <input
            className="form-input"
            placeholder="Search merchant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 38, width: 280 }}
          />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["all", "fraud", "safe"].map((f) => (
            <button
              key={f}
              onClick={() => setFraudFilter(f)}
              className={fraudFilter === f ? "btn-primary" : "btn-ghost"}
              style={{ padding: "10px 16px", fontSize: 13, textTransform: "capitalize" }}
            >
              {f === "all" ? "All" : f === "fraud" ? "🚨 Fraud" : "✅ Safe"}
            </button>
          ))}
        </div>
        <span className="badge badge-accent" style={{ padding: "8px 14px", fontSize: 13, alignSelf: "center" }}>
          {filtered.length} results
        </span>
      </div>

      {/* Table */}
      <div className="glass-card" style={{ overflow: "hidden" }}>
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
              {filtered.map((item) => {
                const risk = getRiskColor(item.riskScore);
                return (
                  <tr key={item._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.merchantName}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{item.merchantCategory}</div>
                    </td>
                    <td style={{ fontWeight: 700 }}>₹{Number(item.amount).toLocaleString("en-IN")}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="risk-bar">
                          <div className="risk-bar-fill" style={{ width: `${Math.min(item.riskScore || 0, 100)}%`, background: risk.color }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: risk.color, background: risk.bg, padding: "2px 8px", borderRadius: "99px" }}>
                          {item.riskScore}%
                        </span>
                      </div>
                    </td>
                    <td>{getStatusBadge(item.transactionStatus)}</td>
                    <td>
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <button
                          className="btn-ghost"
                          onClick={() => setSelectedTransaction(item)}
                          style={{ padding: "6px 14px", fontSize: 12 }}
                        >
                          <MdSwapHoriz /> View
                        </button>
                        <button
                          onClick={() => deleteTransaction(item._id)}
                          style={{ background: "var(--danger-bg)", border: "none", color: "var(--danger)", borderRadius: "var(--radius-md)", padding: "6px 12px", cursor: "pointer", fontSize: 16 }}
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedTransaction && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setSelectedTransaction(null); }}>
          <div className="modal">
            <div className="modal-header">
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)" }}>
                  Transaction Details
                </h2>
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
                  {selectedTransaction.merchantName}
                </p>
              </div>
              <button className="btn-icon" onClick={() => setSelectedTransaction(null)}>
                <MdClose />
              </button>
            </div>

            <div className="modal-body">
              {/* Details Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
                {[
                  ["Amount", `₹${Number(selectedTransaction.amount).toLocaleString("en-IN")}`],
                  ["Risk Score", `${selectedTransaction.riskScore}%`],
                  ["Status", selectedTransaction.transactionStatus],
                  ["Payment", selectedTransaction.paymentMethod],
                  ["Location", selectedTransaction.location],
                  ["Device", selectedTransaction.deviceType],
                ].map(([label, value]) => (
                  <div key={label} style={{ background: "var(--bg-input)", borderRadius: "var(--radius-md)", padding: "14px 16px" }}>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: 4 }}>
                      {label}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Admin Note */}
              <div style={{ marginBottom: 16 }}>
                <label className="form-label">Admin Note</label>
                <textarea
                  placeholder="Add an administrative note..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="form-input"
                  style={{ minHeight: 80, resize: "vertical" }}
                />
              </div>

              {/* OTP Section */}
              {selectedTransaction.transactionStatus === "Pending OTP" && (
                <div style={{
                  background: "var(--warning-bg)",
                  border: "1px solid rgba(245,158,11,0.2)",
                  borderRadius: "var(--radius-md)",
                  padding: "16px",
                  marginBottom: 16,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <MdLock style={{ color: "var(--warning)" }} />
                    <span style={{ fontWeight: 600, color: "var(--warning)", fontSize: 14 }}>OTP Verification Required</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="form-input"
                    style={{ marginBottom: 12, letterSpacing: "0.2em", textAlign: "center", fontSize: 18 }}
                    maxLength={6}
                  />
                  <button className="btn-primary" onClick={() => verifyOtp(selectedTransaction._id)} style={{ width: "100%", justifyContent: "center" }}>
                    <MdVerifiedUser /> Verify OTP
                  </button>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="modal-footer">
              <button className="btn-ghost" onClick={() => setSelectedTransaction(null)}>
                Close
              </button>
              <button
                onClick={() => handleAdminAction(selectedTransaction._id, "approve")}
                style={{ background: "var(--success-bg)", color: "var(--success)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "var(--radius-md)", padding: "10px 20px", fontWeight: 600, cursor: "pointer" }}
              >
                <MdVerifiedUser /> Approve
              </button>
              <button
                onClick={() => handleAdminAction(selectedTransaction._id, "block")}
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