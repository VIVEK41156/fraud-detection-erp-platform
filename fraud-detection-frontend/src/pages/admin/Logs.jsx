import { useEffect, useState } from "react";
import API from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { MdAssignment, MdSearch } from "react-icons/md";

const METHOD_STYLE = {
  GET:    { color: "#60a5fa", bg: "rgba(59,130,246,0.12)" },
  POST:   { color: "#34d399", bg: "rgba(16,185,129,0.12)" },
  PUT:    { color: "#fbbf24", bg: "rgba(245,158,11,0.12)" },
  DELETE: { color: "#f87171", bg: "rgba(239,68,68,0.12)" },
  PATCH:  { color: "#a78bfa", bg: "rgba(139,92,246,0.12)" },
};

function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/logs");
      setLogs(res.data.logs || res.data.data || []);
    } catch (e) {
      console.log("LOG ERROR:", e.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  const filtered = logs.filter((l) =>
    l.action?.toLowerCase().includes(search.toLowerCase()) ||
    l.route?.toLowerCase().includes(search.toLowerCase()) ||
    l.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Audit Logs</h1>
          <p className="page-subtitle">Complete activity trail across all users and actions</p>
        </div>
        <span className="badge badge-accent" style={{ fontSize: 13, padding: "6px 14px" }}>
          {logs.length} entries
        </span>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20, position: "relative" }}>
        <MdSearch style={{
          position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
          color: "var(--text-muted)", fontSize: 18, pointerEvents: "none",
        }} />
        <input
          className="form-input"
          placeholder="Search action, route, or user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: 42, maxWidth: 400 }}
        />
      </div>

      <div className="glass-card" style={{ overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "60px", textAlign: "center", color: "var(--text-muted)" }}>
            <div className="spinner" style={{ margin: "0 auto 12px", borderTopColor: "#6366f1" }} />
            Loading audit logs...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center" }}>
            <MdAssignment style={{ fontSize: 40, color: "var(--text-muted)", display: "block", margin: "0 auto 12px" }} />
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No logs found</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>User</th>
                  <th>Method</th>
                  <th>Route</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log) => {
                  const mStyle = METHOD_STYLE[log.method?.toUpperCase()] || METHOD_STYLE["GET"];
                  return (
                    <tr key={log._id}>
                      <td>
                        <span style={{ fontWeight: 600, color: "#818cf8" }}>{log.action}</span>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                            {(log.user?.name || "?")[0].toUpperCase()}
                          </div>
                          <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                            {log.user?.name || "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span style={{
                          fontSize: 11, fontWeight: 700,
                          color: mStyle.color, background: mStyle.bg,
                          padding: "3px 10px", borderRadius: "99px",
                          letterSpacing: "0.05em",
                        }}>
                          {log.method?.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <code style={{ fontSize: 12, color: "var(--text-secondary)", background: "var(--bg-input)", padding: "2px 8px", borderRadius: 6 }}>
                          {log.route}
                        </code>
                      </td>
                      <td style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        {new Date(log.createdAt).toLocaleString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
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

export default Logs;