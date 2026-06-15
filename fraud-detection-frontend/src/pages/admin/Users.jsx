import {
  useEffect,
  useState,
} from "react";

import API from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";

function Users() {
  const [users,
    setUsers] =
    useState([]);

  const fetchUsers =
    async () => {
      try {
        const res =
          await API.get(
            "/admin/users"
          );

        setUsers(
          res.data.users
        );
      } catch (error) {
        console.log(
          error.response
            ?.data
        );
      }
    };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <DashboardLayout>

      <h1 className="text-4xl font-bold text-white mb-8">
        Users Management
      </h1>

      <div className="bg-slate-900 border border-slate-800 rounded-[30px] p-8 overflow-x-auto">

        <table className="w-full text-white">

          <thead>
            <tr className="border-b border-slate-700 text-slate-400">

              <th className="text-left py-4">
                Name
              </th>

              <th className="text-left">
                Email
              </th>

              <th className="text-left">
                Role
              </th>

              <th className="text-left">
                Joined
              </th>

            </tr>
          </thead>

          <tbody>
            {users.map(
              (user) => (
                <tr
                  key={
                    user._id
                  }
                  className="border-b border-slate-800"
                >
                  <td className="py-5">
                    {user.name}
                  </td>

                  <td>
                    {user.email}
                  </td>

                  <td>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        user.role ===
                        "admin"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td>
                    {new Date(
                      user.createdAt
                    ).toLocaleDateString()}
                  </td>
                </tr>
              )
            )}
          </tbody>

        </table>
      </div>

    </DashboardLayout>
  );
}

export default Users;