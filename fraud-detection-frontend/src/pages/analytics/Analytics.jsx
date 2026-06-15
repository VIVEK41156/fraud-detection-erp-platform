import {
  useEffect,
  useState,
} from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import API from "../../services/api";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

function Analytics() {
  const [analytics,
    setAnalytics] =
    useState(null);

  const fetchAnalytics =
    async () => {
      try {
        const res =
          await API.get(
            "/analytics"
          );

        setAnalytics(
          res.data
            .analytics
        );
      } catch (
        error
      ) {
        console.log(
          error
        );
      }
    };

  useEffect(() => {
    fetchAnalytics();

    const interval =
      setInterval(
        fetchAnalytics,
        5000
      );

    return () =>
      clearInterval(
        interval
      );
  }, []);

  if (!analytics) {
    return (
      <DashboardLayout>
        <div className="text-white text-3xl">
          Loading...
        </div>
      </DashboardLayout>
    );
  }

  const pieData =
    [
      {
        name:
          "Fraud",
        value:
          analytics.fraudTransactions,
      },
      {
        name:
          "Safe",
        value:
          analytics.safeTransactions,
      },
    ];

  return (
    <DashboardLayout>

      <h1 className="text-5xl text-white font-bold mb-10">
        Analytics
      </h1>

      {/* KPI */}
      <div className="grid grid-cols-4 gap-6 mb-10">

        <Card
          title="Transactions"
          value={
            analytics.totalTransactions
          }
        />

        <Card
          title="Frauds"
          value={
            analytics.fraudTransactions
          }
        />

        <Card
          title="Safe"
          value={
            analytics.safeTransactions
          }
        />

        <Card
          title="Avg Risk"
          value={`${analytics.avgRiskScore}%`}
        />

      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-8 mb-10">

        {/* Pie */}
        <div className="bg-slate-900 p-8 rounded-[35px] border border-slate-800">

          <h2 className="text-2xl text-white font-bold mb-8">
            Fraud vs Safe
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <PieChart>

              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={110}
              >
                <Cell fill="#ef4444" />
                <Cell fill="#22c55e" />
              </Pie>

              <Tooltip />

            </PieChart>
          </ResponsiveContainer>

        </div>

        {/* Trend */}
        <div className="bg-slate-900 p-8 rounded-[35px] border border-slate-800">

          <h2 className="text-2xl text-white font-bold mb-8">
            Monthly Fraud Trend
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <AreaChart
              data={
                analytics.monthlyFrauds
              }
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="frauds"
                stroke="#ef4444"
                fill="#ef4444"
              />

            </AreaChart>
          </ResponsiveContainer>

        </div>

      </div>

      {/* Bottom */}
      <div className="grid grid-cols-2 gap-8">

        {/* Locations */}
        <div className="bg-slate-900 p-8 rounded-[35px] border border-slate-800">

          <h2 className="text-2xl text-white font-bold mb-8">
            Top Locations
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <BarChart
              data={
                analytics.topLocations
              }
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="location" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>

        </div>

        {/* Merchants */}
        <div className="bg-slate-900 p-8 rounded-[35px] border border-slate-800">

          <h2 className="text-2xl text-white font-bold mb-8">
            Top Merchants
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <BarChart
              data={
                analytics.topMerchants
              }
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="merchant" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>

    </DashboardLayout>
  );
}

function Card({
  title,
  value,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-[35px] p-8">

      <p className="text-slate-400">
        {title}
      </p>

      <h1 className="text-5xl text-white font-bold mt-4">
        {value}
      </h1>

    </div>
  );
}

export default Analytics;