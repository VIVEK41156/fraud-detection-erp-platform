import { useEffect, useState } from "react";
import API from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { MdWarning, MdLocationOn, MdPhoneAndroid, MdCreditCard } from "react-icons/md";

function getRiskColor(score) {
  if (score >= 80) return { color: "#ef4444", bg: "rgba(239,68,68,0.1)" };
  if (score >= 50) return { color: "#f59e0b", bg: "rgba(245,158,11,0.1)" };
  return { color: "#10b981", bg: "rgba(16,185,129,0.1)" };
}

function Frauds() {
  const [frauds, setFrauds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchFrauds = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/frauds");
      const fraudList = res.data.frauds || res.data.transactions || res.data.data || [];
      setFrauds(fraudList);
    } catch (e) {
      console.log("FRAUD ERROR:", e.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFrauds(); }, []);

  const filtered = frauds.filter((f) =>
    f.merchantName?.toLowerCase().includes(search.toLowerCase()) ||
    f.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Fraud Monitor</h1>
          <p className="page-subtitle">All flagged and suspicious transactions</p>
        </div>
        <span className="badge badge-danger" style={{ fontSize: 13, padding: "8px 16px" }}>
          <MdWarning /> {frauds.length} Frauds Detected
        </span>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <input
          className="form-input"
          placeholder="Search by merchant or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 360 }}
        />
      </div>

      <div className="glass-card" style={{ overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "60px", textAlign: "center", color: "var(--text-muted)" }}>
            <div className="spinner" style={{ margin: "0 auto 12px", borderTopColor: "#ef4444" }} />
            Loading fraud data...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center" }}>
            <MdWarning style={{ fontSize: 40, color: "var(--text-muted)", display: "block", margin: "0 auto 12px" }} />
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No fraud transactions found</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Merchant</th>
                  <th>Amount</th>
                  <th>Risk Score</th>
                  <th>Location</th>
                  <th>Payment</th>
                  <th>Device</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const risk = getRiskColor(item.riskScore);
                  return (
                    <tr key={item._id}>
                      <td>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                          {item.merchantName}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                          {item.merchantCategory}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                          ₹{Number(item.amount).toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div className="risk-bar">
                            <div className="risk-bar-fill" style={{
                              width: `${Math.min(item.riskScore || 0, 100)}%`,
                              background: risk.color,
                            }} />
                          </div>
                          <span style={{
                            fontSize: 12, fontWeight: 700, color: risk.color,
                            background: risk.bg, padding: "2px 8px", borderRadius: "99px",
                          }}>
                            {item.riskScore}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--text-secondary)", fontSize: 13 }}>
                          <MdLocationOn style={{ color: "var(--text-muted)" }} />
                          {item.location}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--text-secondary)", fontSize: 13 }}>
                          <MdCreditCard style={{ fontSize: 14 }} />
                          {item.paymentMethod}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--text-secondary)", fontSize: 13 }}>
                          <MdPhoneAndroid style={{ fontSize: 14 }} />
                          {item.deviceType}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-danger animate-pulse-glow">
                          🚨 FRAUD
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Frauds;