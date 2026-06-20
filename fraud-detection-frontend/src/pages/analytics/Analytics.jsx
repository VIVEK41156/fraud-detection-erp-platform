import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../services/api";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, Legend,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        {label && <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>}
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></p>
        ))}
      </div>
    );
  }
  return null;
};

function KpiCard({ title, value, accent }) {
  const colors = {
    indigo: { border: "#6366f1", bg: "rgba(99,102,241,0.08)", color: "#818cf8" },
    red:    { border: "#ef4444", bg: "rgba(239,68,68,0.08)",  color: "#f87171" },
    green:  { border: "#10b981", bg: "rgba(16,185,129,0.08)", color: "#34d399" },
    amber:  { border: "#f59e0b", bg: "rgba(245,158,11,0.08)", color: "#fbbf24" },
  };
  const c = colors[accent] || colors.indigo;
  return (
    <div className="glass-card" style={{ padding: "22px 24px", borderTop: `2px solid ${c.border}` }}>
      <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: 10 }}>
        {title}
      </p>
      <h2 style={{ fontSize: 36, fontWeight: 800, color: c.color, letterSpacing: "-0.03em" }}>
        {value}
      </h2>
    </div>
  );
}

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await API.get("/analytics");
      setAnalytics(res.data.analytics);
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !analytics) {
    return (
      <DashboardLayout>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400, gap: 16 }}>
          <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3, borderTopColor: "#6366f1" }} />
          <span style={{ color: "var(--text-secondary)", fontSize: 16 }}>Loading analytics...</span>
        </div>
      </DashboardLayout>
    );
  }

  const pieData = [
    { name: "Fraud",  value: analytics.fraudTransactions },
    { name: "Safe",   value: analytics.safeTransactions  },
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Deep insights into fraud patterns and transaction trends</p>
        </div>
        <button className="btn-ghost" onClick={fetchAnalytics} style={{ fontSize: 13 }}>
          ↻ Refresh
        </button>
      </div>

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        <KpiCard title="Total Transactions" value={analytics.totalTransactions}  accent="indigo" />
        <KpiCard title="Fraud Detected"     value={analytics.fraudTransactions}  accent="red"    />
        <KpiCard title="Safe Transactions"  value={analytics.safeTransactions}   accent="green"  />
        <KpiCard title="Avg Risk Score"     value={`${analytics.avgRiskScore}%`} accent="amber"  />
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Donut Pie */}
        <div className="glass-card" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>Fraud vs Safe</h2>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 20 }}>Transaction breakdown by fraud status</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={100} innerRadius={55} paddingAngle={4} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                <Cell fill="#ef4444" />
                <Cell fill="#10b981" />
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={(v) => <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Area Chart */}
        <div className="glass-card" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>Monthly Fraud Trend</h2>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 20 }}>Fraud cases detected per month</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={analytics.monthlyFrauds}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="frauds" name="Frauds" stroke="#ef4444" strokeWidth={2} fill="url(#areaGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Locations Bar */}
        <div className="glass-card" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>Top Fraud Locations</h2>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 20 }}>Cities with highest fraud activity</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={analytics.topLocations} barSize={30}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="location" tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Count" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Merchants Bar */}
        <div className="glass-card" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>Top Fraud Merchants</h2>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 20 }}>Merchants with most fraud reports</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={analytics.topMerchants} barSize={30}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="merchant" tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Analytics;