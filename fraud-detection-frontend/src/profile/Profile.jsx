import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";

function Profile() {
  const { user } =
    useAuth();

  return (
    <DashboardLayout>

      <div className="grid grid-cols-3 gap-8">

        {/* Left Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-[35px] p-8">

          <div className="flex flex-col items-center">

            <div className="w-36 h-36 rounded-full bg-indigo-600 flex items-center justify-center text-white text-6xl font-bold">

              {user?.name?.[0]?.toUpperCase()}
            </div>

            <h1 className="text-3xl text-white font-bold mt-6">
              {user?.name}
            </h1>

            <p className="text-slate-400 mt-2">
              {user?.email}
            </p>

            <span
              className={`mt-5 px-5 py-2 rounded-full text-sm font-semibold ${
                user?.role === "admin"
                  ? "bg-red-500/20 text-red-400"
                  : "bg-green-500/20 text-green-400"
              }`}
            >
              {user?.role}
            </span>

          </div>
        </div>

        {/* Right Side */}
        <div className="col-span-2 space-y-8">

          <div className="bg-slate-900 border border-slate-800 rounded-[35px] p-8">

            <h2 className="text-2xl text-white font-bold mb-6">
              Account Information
            </h2>

            <div className="grid grid-cols-2 gap-6">

              <div>
                <label className="text-slate-400">
                  Full Name
                </label>

                <div className="bg-slate-800 p-4 mt-2 rounded-2xl text-white">
                  {user?.name}
                </div>
              </div>

              <div>
                <label className="text-slate-400">
                  Email
                </label>

                <div className="bg-slate-800 p-4 mt-2 rounded-2xl text-white">
                  {user?.email}
                </div>
              </div>

              <div>
                <label className="text-slate-400">
                  Role
                </label>

                <div className="bg-slate-800 p-4 mt-2 rounded-2xl text-white capitalize">
                  {user?.role}
                </div>
              </div>

              <div>
                <label className="text-slate-400">
                  Status
                </label>

                <div className="bg-slate-800 p-4 mt-2 rounded-2xl text-green-400">
                  Active
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default Profile;