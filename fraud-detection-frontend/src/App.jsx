import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { useState } from "react";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Dashboard
import Dashboard from "./pages/dashboard/Dashboard";

// Pages
import Transactions from "./pages/transactions/Transactions";
import Analytics from "./pages/analytics/Analytics";

// Admin
import Users from "./pages/admin/Users";
import Frauds from "./pages/admin/Frauds";
import Logs from "./pages/admin/Logs";

// Profile
import Profile from "./profile/Profile";

// Settings
import Settings from "./settings/Settings";

function AuthPage() {
  const [isLogin,
    setIsLogin] =
    useState(true);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

      <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-10 w-full max-w-md shadow-2xl">

        {isLogin ? (
          <Login
            setIsLogin={
              setIsLogin
            }
          />
        ) : (
          <Register
            setIsLogin={
              setIsLogin
            }
          />
        )}

      </div>

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Auth */}
        <Route
          path="/"
          element={
            <AuthPage />
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <Dashboard />
          }
        />

        {/* Transactions */}
        <Route
          path="/dashboard/transactions"
          element={
            <Transactions />
          }
        />

        {/* Analytics */}
        <Route
          path="/dashboard/analytics"
          element={
            <Analytics />
          }
        />

        {/* Users */}
        <Route
          path="/dashboard/users"
          element={
            <Users />
          }
        />

        {/* Frauds */}
        <Route
          path="/dashboard/frauds"
          element={
            <Frauds />
          }
        />

        {/* Logs */}
        <Route
          path="/dashboard/logs"
          element={
            <Logs />
          }
        />

        {/* Profile */}
        <Route
          path="/dashboard/profile"
          element={
            <Profile />
          }
        />

        {/* Settings */}
        <Route
          path="/dashboard/settings"
          element={
            <Settings />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;