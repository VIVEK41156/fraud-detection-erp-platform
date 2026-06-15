import {
  useEffect,
  useState,
} from "react";

import API from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";

function Frauds() {
  const [frauds,
    setFrauds] =
    useState([]);

  const fetchFrauds =
    async () => {
      try {
        const res =
          await API.get(
            "/admin/frauds"
          );

        console.log(
          "FRAUD API:",
          res.data
        );

        // Support multiple response shapes
        const fraudList =
          res.data.frauds ||
          res.data.transactions ||
          res.data.data ||
          [];

        setFrauds(
          fraudList
        );
      } catch (error) {
        console.log(
          "FRAUD ERROR:",
          error.response
            ?.data
        );
      }
    };

  useEffect(() => {
    fetchFrauds();
  }, []);

  return (
    <DashboardLayout>

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold text-white">
          Fraud Monitoring
        </h1>

        <div className="bg-red-500/20 text-red-400 px-6 py-3 rounded-2xl font-semibold">
          Total Frauds:
          {" "}
          {
            frauds.length
          }
        </div>

      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[30px] p-8 overflow-x-auto">

        {frauds.length ===
        0 ? (
          <p className="text-slate-400">
            No fraud transactions found
          </p>
        ) : (
          <table className="w-full text-white">

            <thead>
              <tr className="border-b border-slate-700 text-slate-400">

                <th className="text-left py-4">
                  Merchant
                </th>

                <th className="text-left">
                  Amount
                </th>

                <th className="text-left">
                  Risk
                </th>

                <th className="text-left">
                  Location
                </th>

                <th className="text-left">
                  Payment
                </th>

                <th className="text-left">
                  Device
                </th>

                <th className="text-left">
                  Status
                </th>

              </tr>
            </thead>

            <tbody>
              {frauds.map(
                (item) => (
                  <tr
                    key={
                      item._id
                    }
                    className="border-b border-slate-800"
                  >
                    <td className="py-5">
                      {
                        item.merchantName
                      }
                    </td>

                    <td>
                      ₹
                      {
                        item.amount
                      }
                    </td>

                    <td className="text-red-400 font-bold">
                      {
                        item.riskScore
                      }
                    </td>

                    <td>
                      {
                        item.location
                      }
                    </td>

                    <td>
                      {
                        item.paymentMethod
                      }
                    </td>

                    <td>
                      {
                        item.deviceType
                      }
                    </td>

                    <td>
                      <span className="bg-red-500/20 text-red-400 px-4 py-2 rounded-full">
                        FRAUD 🚨
                      </span>
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

export default Frauds;