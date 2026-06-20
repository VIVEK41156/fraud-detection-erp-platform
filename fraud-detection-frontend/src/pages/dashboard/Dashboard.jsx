import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../services/api";
import {
  MdSwapHoriz, MdWarning, MdLock, MdCheckCircle, MdTrendingUp,
} from "react-icons/md";

const COLORS = ["#6366f1", "#ef4444", "#f59e0b", "#10b981", "#3b82f6"];
const PIE_COLORS = ["#10b981", "#ef4444", "#f59e0b"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
        <p style={{ color: "#818cf8" }}>{payload[0].name}: <strong>{payload[0].value}</strong></p>
      </div>
    );
  }
  return null;
};

function StatCard({ title, value, icon: Icon, accent, subtitle }) {
  return (
    <div className={`glass-card stat-card-${accent}`} style={{ padding: "22px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: 10 }}>
            {title}
          </p>
          <h2 style={{ fontSize: 34, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1 }}>
            {value}
          </h2>
          {subtitle && (
            <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 6 }}>{subtitle}</p>
          )}
        </div>
        <div style={{
          width: 46, height: 46, borderRadius: 14,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
          background: accent === "indigo" ? "rgba(99,102,241,0.12)"
            : accent === "red" ? "rgba(239,68,68,0.12)"
            : accent === "amber" ? "rgba(245,158,11,0.12)"
            : accent === "green" ? "rgba(16,185,129,0.12)"
            : "rgba(59,130,246,0.12)",
          color: accent === "indigo" ? "#818cf8"
            : accent === "red" ? "#f87171"
            : accent === "amber" ? "#fbbf24"
            : accent === "green" ? "#34d399"
            : "#60a5fa",
        }}>
          <Icon />
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({
    totalTransactions: 0, fraudCount: 0, pendingOtp: 0, completed: 0, highRisk: 0,
  });

  useEffect(() => { fetchMonitoring(); }, []);

  const fetchMonitoring = async () => {
    try {
      const res = await API.get("/monitoring");
      setStats(res.data?.stats || {});
    } catch (e) { console.log(e); }
  };

  const barData = [
    { name: "Transactions", value: stats.totalTransactions },
    { name: "Frauds",       value: stats.fraudCount },
    { name: "Pending OTP",  value: stats.pendingOtp },
    { name: "Completed",    value: stats.completed },
    { name: "High Risk",    value: stats.highRisk },
  ];

  const pieData = [
    { name: "Safe",    value: stats.completed },
    { name: "Fraud",   value: stats.fraudCount },
    { name: "Pending", value: stats.pendingOtp },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Fraud Monitoring Dashboard</h1>
          <p className="page-subtitle">Real-time overview of transactions and fraud detection</p>
        </div>
        <button className="btn-ghost" onClick={fetchMonitoring} style={{ fontSize: 13 }}>
          ↻ Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 16,
        marginBottom: 28,
      }}>
        <StatCard title="Total Transactions" value={stats.totalTransactions} icon={MdSwapHoriz} accent="indigo" subtitle="All time" />
        <StatCard title="Fraud Detected"     value={stats.fraudCount}        icon={MdWarning}   accent="red"    subtitle="Flagged transactions" />
        <StatCard title="Pending OTP"        value={stats.pendingOtp}        icon={MdLock}      accent="amber"  subtitle="Awaiting verification" />
        <StatCard title="Completed"          value={stats.completed}         icon={MdCheckCircle} accent="green" subtitle="Successfully processed" />
        <StatCard title="High Risk"          value={stats.highRisk}          icon={MdTrendingUp}  accent="blue"  subtitle="Risk score > 70%" />
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Bar Chart */}
        <div className="glass-card" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 20 }}>
            Fraud Analytics Overview
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} barSize={36}>
              <XAxis
                dataKey="name"
                tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {barData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="glass-card" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 20 }}>
            Transaction Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={100}
                innerRadius={50}
                paddingAngle={3}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => (
                  <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;