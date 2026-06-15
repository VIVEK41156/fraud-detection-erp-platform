import {
  FaBell,
  FaCog,
  FaMoon,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";

import {
  useState,
  useEffect,
} from "react";

import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user, logout } =
    useAuth();

  const [showMenu,
    setShowMenu] =
    useState(false);

  const [showNotifications,
    setShowNotifications] =
    useState(false);

  const [notifications,
    setNotifications] =
    useState([]);

  const fetchNotifications =
    async () => {
      try {
        const res =
          await API.get(
            "/admin/frauds"
          );

        const frauds =
          res.data
            .transactions ||
          [];

        setNotifications(
          frauds.slice(
            0,
            5
          )
        );
      } catch (error) {
        console.log(
          error
        );
      }
    };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-[35px] p-6 flex justify-between items-center mb-10">

      {/* Left */}
      <div>
        <h1 className="text-4xl font-bold text-white">
          Welcome,
          {" "}
          {
            user?.name
          }
        </h1>

        <div className="flex items-center gap-3 mt-2">

          <p className="text-slate-400">
            Role:
          </p>

          <span
            className={`px-4 py-1 rounded-full text-sm font-semibold ${
              user?.role ===
              "admin"
                ? "bg-red-500/20 text-red-400"
                : "bg-green-500/20 text-green-400"
            }`}
          >
            {
              user?.role
            }
          </span>

        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5 relative">

        {/* Bell */}
        <button
          onClick={() =>
            setShowNotifications(
              !showNotifications
            )
          }
          className="relative bg-slate-800 hover:bg-slate-700 p-4 rounded-2xl text-white"
        >
          <FaBell />

          {notifications.length >
            0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {
                notifications.length
              }
            </span>
          )}
        </button>

        {/* Notification Dropdown */}
        {showNotifications && (
          <div className="absolute top-20 right-24 w-96 bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl z-50">

            <h2 className="text-white text-xl font-bold mb-5">
              Notifications
            </h2>

            {notifications.map(
              (
                item
              ) => (
                <div
                  key={
                    item._id
                  }
                  className="bg-slate-800 rounded-2xl p-4 mb-4"
                >
                  <p className="text-red-400 font-semibold">
                    🚨 Fraud Alert
                  </p>

                  <p className="text-white mt-1">
                    {
                      item.merchantName
                    }
                    {" - "}
                    ₹
                    {
                      item.amount
                    }
                  </p>

                  <p className="text-slate-400 text-sm">
                    {
                      item.location
                    }
                  </p>
                </div>
              )
            )}
          </div>
        )}

        {/* Dark */}
        <button className="bg-slate-800 p-4 rounded-2xl text-white">
          <FaMoon />
        </button>

        {/* Settings */}
        <a
          href="/dashboard/settings"
          className="bg-slate-800 p-4 rounded-2xl text-white hover:bg-slate-700 transition-all"
        >
          <FaCog />
        </a>

        {/* Avatar */}
        <div
          className="relative"
          onClick={() =>
            setShowMenu(
              !showMenu
            )
          }
        >
          <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-2xl cursor-pointer">

            {user?.name?.[0]?.toUpperCase()}
          </div>

          {showMenu && (
            <div className="absolute right-0 mt-4 w-64 bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl z-50">

              <h2 className="text-white font-bold">
                {
                  user?.name
                }
              </h2>

              <p className="text-slate-400 text-sm mb-4">
                {
                  user?.email
                }
              </p>

              <a
                href="/dashboard/profile"
                className="flex items-center gap-3 text-white hover:bg-slate-800 rounded-2xl p-4"
              >
                <FaUser />
                Profile
              </a>

              <a
                href="/dashboard/settings"
                className="flex items-center gap-3 text-white hover:bg-slate-800 rounded-2xl p-4"
              >
                <FaCog />
                Settings
              </a>

              <button
                onClick={
                  logout
                }
                className="w-full flex items-center gap-3 text-red-400 hover:bg-red-500/10 rounded-2xl p-4 mt-2"
              >
                <FaSignOutAlt />
                Logout
              </button>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Navbar;