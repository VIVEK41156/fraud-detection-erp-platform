import {
  useState,
  useEffect,
} from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../services/api";

function Dashboard() {
  const [stats,
    setStats] =
    useState({
      totalTransactions:
        0,
      fraudCount:
        0,
      pendingOtp:
        0,
      completed:
        0,
      highRisk:
        0,
    });

  useEffect(() => {
    fetchMonitoring();
  }, []);

  const fetchMonitoring =
    async () => {
      try {
        const res =
          await API.get(
            "/monitoring"
          );

        setStats(
          res.data
            ?.stats || {}
        );
      } catch (
        error
      ) {
        console.log(
          error
        );
      }
    };

  // ----------------
  // BAR CHART DATA
  // ----------------
  const barData = [
    {
      name:
        "Transactions",
      value:
        stats.totalTransactions,
    },
    {
      name:
        "Frauds",
      value:
        stats.fraudCount,
    },
    {
      name:
        "Pending OTP",
      value:
        stats.pendingOtp,
    },
    {
      name:
        "Completed",
      value:
        stats.completed,
    },
    {
      name:
        "High Risk",
      value:
        stats.highRisk,
    },
  ];

  // ----------------
  // PIE DATA
  // ----------------
  const pieData = [
    {
      name:
        "Safe",
      value:
        stats.completed,
    },
    {
      name:
        "Fraud",
      value:
        stats.fraudCount,
    },
    {
      name:
        "Pending",
      value:
        stats.pendingOtp,
    },
  ];

  return (
    <DashboardLayout>

      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold text-white mb-10">
          Fraud Monitoring Dashboard
        </h1>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-10">

          <Card
            title="Transactions"
            value={
              stats.totalTransactions
            }
            icon="💳"
          />

          <Card
            title="Frauds"
            value={
              stats.fraudCount
            }
            icon="🚨"
          />

          <Card
            title="Pending OTP"
            value={
              stats.pendingOtp
            }
            icon="🔐"
          />

          <Card
            title="Completed"
            value={
              stats.completed
            }
            icon="✅"
          />

          <Card
            title="High Risk"
            value={
              stats.highRisk
            }
            icon="⚠️"
          />

        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* BAR GRAPH */}
          <div className="bg-slate-900 border border-slate-800 rounded-[35px] p-8">

            <h2 className="text-2xl text-white font-bold mb-6">
              Fraud Analytics
            </h2>

            <ResponsiveContainer
              width="100%"
              height={350}
            >
              <BarChart
                data={barData}
              >
                <XAxis
                  dataKey="name"
                />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="value"
                  radius={[
                    10,
                    10,
                    0,
                    0,
                  ]}
                />
              </BarChart>
            </ResponsiveContainer>

          </div>

          {/* PIE CHART */}
          <div className="bg-slate-900 border border-slate-800 rounded-[35px] p-8">

            <h2 className="text-2xl text-white font-bold mb-6">
              Transaction Distribution
            </h2>

            <ResponsiveContainer
              width="100%"
              height={350}
            >
              <PieChart>

                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={
                    120
                  }
                  label
                >
                  <Cell />
                  <Cell />
                  <Cell />
                </Pie>

                <Tooltip />

              </PieChart>
            </ResponsiveContainer>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

// ----------------
// CARD
// ----------------
function Card({
  title,
  value,
  icon,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-[35px] p-8 hover:scale-105 duration-300">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-slate-400">
            {title}
          </p>

          <h1 className="text-5xl text-white font-bold mt-4">
            {value}
          </h1>

        </div>

        <div className="text-5xl">
          {icon}
        </div>

      </div>

    </div>
  );
}

export default Dashboard;