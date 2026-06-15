import {
  useEffect,
  useState,
} from "react";

import API from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";

function Logs() {
  const [logs,
    setLogs] =
    useState([]);

  const fetchLogs =
    async () => {
      try {
        const res =
          await API.get(
            "/admin/logs"
          );

        console.log(
          "LOGS API:",
          res.data
        );

        const logList =
          res.data.logs ||
          res.data.data ||
          [];

        setLogs(
          logList
        );
      } catch (error) {
        console.log(
          "LOG ERROR:",
          error.response
            ?.data
        );
      }
    };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <DashboardLayout>

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold text-white">
          Audit Logs
        </h1>

        <div className="bg-indigo-500/20 text-indigo-400 px-6 py-3 rounded-2xl font-semibold">
          Total Logs:
          {" "}
          {
            logs.length
          }
        </div>

      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[30px] p-8 overflow-x-auto">

        {logs.length ===
        0 ? (
          <p className="text-slate-400">
            No logs found
          </p>
        ) : (
          <table className="w-full text-white">

            <thead>
              <tr className="border-b border-slate-700 text-slate-400">

                <th className="text-left py-4">
                  Action
                </th>

                <th className="text-left">
                  User
                </th>

                <th className="text-left">
                  Method
                </th>

                <th className="text-left">
                  Route
                </th>

                <th className="text-left">
                  Timestamp
                </th>

              </tr>
            </thead>

            <tbody>
              {logs.map(
                (log) => (
                  <tr
                    key={
                      log._id
                    }
                    className="border-b border-slate-800"
                  >
                    <td className="py-5 text-indigo-400 font-semibold">
                      {
                        log.action
                      }
                    </td>

                    <td>
                      {log.user
                        ?.name ||
                        "Unknown"}
                    </td>

                    <td>
                      <span className="bg-slate-800 px-4 py-2 rounded-xl">
                        {
                          log.method
                        }
                      </span>
                    </td>

                    <td>
                      {
                        log.route
                      }
                    </td>

                    <td>
                      {new Date(
                        log.createdAt
                      ).toLocaleString()}
                    </td>
                  </tr>
                )
              )}
            </tbody>

          </table>
        )}

      </div>

    </DashboardLayout>
  );
}

export default Logs;