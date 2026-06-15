import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";

function Settings() {
  const { user } =
    useAuth();

  const [formData,
    setFormData] =
    useState({
      name:
        user?.name ||
        "",
      email:
        user?.email ||
        "",
      currentPassword:
        "",
      newPassword:
        "",
    });

  const handleChange =
    (e) => {
      setFormData({
        ...formData,
        [
          e.target.name
        ]:
          e.target
            .value,
      });
    };

  const handleSave =
    () => {
      alert(
        "Settings Saved Successfully ✅"
      );
    };

  return (
    <DashboardLayout>

      <h1 className="text-5xl text-white font-bold mb-10">
        Settings
      </h1>

      <div className="grid grid-cols-2 gap-8">

        {/* Profile Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-[35px] p-8">

          <h2 className="text-2xl text-white font-bold mb-6">
            Profile Settings
          </h2>

          <div className="space-y-5">

            <div>
              <label className="text-slate-400">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={
                  formData.name
                }
                onChange={
                  handleChange
                }
                className="w-full mt-2 bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
                className="w-full mt-2 bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white outline-none"
              />
            </div>

          </div>
        </div>

        {/* Password */}
        <div className="bg-slate-900 border border-slate-800 rounded-[35px] p-8">

          <h2 className="text-2xl text-white font-bold mb-6">
            Change Password
          </h2>

          <div className="space-y-5">

            <div>
              <label className="text-slate-400">
                Current Password
              </label>

              <input
                type="password"
                name="currentPassword"
                value={
                  formData.currentPassword
                }
                onChange={
                  handleChange
                }
                className="w-full mt-2 bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400">
                New Password
              </label>

              <input
                type="password"
                name="newPassword"
                value={
                  formData.newPassword
                }
                onChange={
                  handleChange
                }
                className="w-full mt-2 bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white outline-none"
              />
            </div>

          </div>
        </div>

      </div>

      {/* Preferences */}
      <div className="bg-slate-900 border border-slate-800 rounded-[35px] p-8 mt-8">

        <h2 className="text-2xl text-white font-bold mb-6">
          Preferences
        </h2>

        <div className="space-y-5">

          <div className="flex justify-between items-center bg-slate-800 p-5 rounded-2xl">
            <p className="text-white">
              Email Notifications
            </p>

            <input
              type="checkbox"
              defaultChecked
            />
          </div>

          <div className="flex justify-between items-center bg-slate-800 p-5 rounded-2xl">
            <p className="text-white">
              Dark Mode
            </p>

            <input
              type="checkbox"
              defaultChecked
            />
          </div>

        </div>

      </div>

      {/* Save */}
      <div className="mt-8">

        <button
          onClick={
            handleSave
          }
          className="bg-indigo-600 hover:bg-indigo-700 transition-all text-white px-10 py-4 rounded-2xl font-semibold"
        >
          Save Changes
        </button>

      </div>

    </DashboardLayout>
  );
}

export default Settings;