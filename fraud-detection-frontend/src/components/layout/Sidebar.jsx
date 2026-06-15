import {
  FaChartPie,
  FaMoneyBillWave,
  FaUsers,
  FaClipboardList,
  FaExclamationTriangle,
  FaSignOutAlt,
} from "react-icons/fa";

import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
  const { user, logout } =
    useAuth();

  const isAdmin =
    user?.role === "admin";

  return (
    <div className="w-[280px] h-screen bg-slate-900 border-r border-slate-800 p-6 fixed left-0 top-0">

      <h1 className="text-3xl font-bold text-white mb-10">
        Fraud ERP
      </h1>

      <div className="space-y-4">

        {/* Dashboard */}
        <Link
          to="/dashboard"
          className="flex items-center gap-4 bg-slate-800 hover:bg-slate-700 transition-all p-4 rounded-2xl text-white"
        >
          <FaChartPie />
          Dashboard
        </Link>

        {/* Transactions */}
        <Link
          to="/dashboard/transactions"
          className="flex items-center gap-4 bg-slate-800 hover:bg-slate-700 transition-all p-4 rounded-2xl text-white"
        >
          <FaMoneyBillWave />
          Transactions
        </Link>

        {/* Admin Only */}
        {isAdmin && (
          <>
            {/* Analytics */}
            <Link
              to="/dashboard/analytics"
              className="flex items-center gap-4 bg-slate-800 hover:bg-slate-700 transition-all p-4 rounded-2xl text-white"
            >
              <FaClipboardList />
              Analytics
            </Link>

            {/* Users */}
            <Link
              to="/dashboard/users"
              className="flex items-center gap-4 bg-slate-800 hover:bg-slate-700 transition-all p-4 rounded-2xl text-white"
            >
              <FaUsers />
              Users
            </Link>

            {/* Frauds */}
            <Link
              to="/dashboard/frauds"
              className="flex items-center gap-4 bg-slate-800 hover:bg-slate-700 transition-all p-4 rounded-2xl text-white"
            >
              <FaExclamationTriangle />
              Frauds
            </Link>

            {/* Audit Logs */}
            <Link
              to="/dashboard/logs"
              className="flex items-center gap-4 bg-slate-800 hover:bg-slate-700 transition-all p-4 rounded-2xl text-white"
            >
              <FaClipboardList />
              Audit Logs
            </Link>
          </>
        )}

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-4 bg-red-600 hover:bg-red-700 transition-all p-4 rounded-2xl text-white mt-8"
        >
          <FaSignOutAlt />
          Logout
        </button>

      </div>
    </div>
  );
}

export default Sidebar;