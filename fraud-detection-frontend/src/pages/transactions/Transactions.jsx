import {
  useState,
  useEffect,
} from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../services/api";

function Transactions() {
  const [formData,
    setFormData] =
    useState({
      amount: "",
      currency: "INR",
      paymentMethod:
        "Credit Card",
      merchantName: "",
      merchantCategory:
        "",
      location: "",
      deviceType:
        "Desktop",
    });

  const [transactions,
    setTransactions] =
    useState([]);

  const [search,
    setSearch] =
    useState("");

  const [fraudFilter,
    setFraudFilter] =
    useState("all");

  const [
    selectedTransaction,
    setSelectedTransaction,
  ] = useState(null);

  const [adminNote,
    setAdminNote] =
    useState("");

  const [otp,
    setOtp] =
    useState("");

  // ----------------
  // Fetch Transactions
  // ----------------
  const fetchTransactions =
    async () => {
      try {
        const res =
          await API.get(
            "/transactions"
          );

        setTransactions(
          res.data
            .transactions ||
            []
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
    fetchTransactions();
  }, []);

  // ----------------
  // Form Change
  // ----------------
  const handleChange =
    (e) => {
      setFormData({
        ...formData,
        [
          e.target.name
        ]:
          e.target.value,
      });
    };

  // ----------------
  // Create Transaction
  // ----------------
  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        const res =
          await API.post(
            "/transactions",
            formData
          );

        alert(
          res.data
            .message
        );

        fetchTransactions();

        setFormData({
          amount: "",
          currency:
            "INR",
          paymentMethod:
            "Credit Card",
          merchantName:
            "",
          merchantCategory:
            "",
          location:
            "",
          deviceType:
            "Desktop",
        });
      } catch (
        error
      ) {
        console.log(
          error
        );
      }
    };

  // ----------------
  // Delete
  // ----------------
  const deleteTransaction =
    async (id) => {
      try {
        await API.delete(
          `/transactions/${id}`
        );

        fetchTransactions();
      } catch (
        error
      ) {
        console.log(
          error
        );
      }
    };

  // ----------------
  // Verify OTP
  // ----------------
  const verifyOtp =
    async (
      transactionId
    ) => {
      try {
        const res =
          await API.post(
            "/otp/verify",
            {
              transactionId,
              otp,
            }
          );

        alert(
          res.data
            .message
        );

        fetchTransactions();

        setOtp("");

        setSelectedTransaction(
          null
        );
      } catch (
        error
      ) {
        alert(
          error.response
            ?.data
            ?.message ||
            "OTP Failed"
        );
      }
    };

  // ----------------
  // Admin Action
  // ----------------
  const handleAdminAction =
    async (
      id,
      action
    ) => {
      try {
        await API.put(
          `/admin-actions/${id}`,
          {
            action,
            note:
              adminNote,
          }
        );

        alert(
          `Action Applied: ${action}`
        );

        fetchTransactions();

        setSelectedTransaction(
          null
        );

        setAdminNote(
          ""
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
  // Filters
  // ----------------
  const filteredTransactions =
    transactions.filter(
      (item) => {
        const searchMatch =
          item.merchantName
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const fraudMatch =
          fraudFilter ===
          "all"
            ? true
            : fraudFilter ===
              "fraud"
            ? item.isFraud
            : !item.isFraud;

        return (
          searchMatch &&
          fraudMatch
        );
      }
    );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl text-white font-bold mb-10">
          Transactions
        </h1>

        {/* FORM */}
        <form
          onSubmit={
            handleSubmit
          }
          className="bg-slate-900 border border-slate-800 rounded-[35px] p-8 mb-10 grid grid-cols-2 gap-6"
        >

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={
              formData.amount
            }
            onChange={
              handleChange
            }
            required
            className="bg-slate-800 p-4 rounded-2xl text-white outline-none"
          />

          <input
            type="text"
            name="merchantName"
            placeholder="Merchant Name"
            value={
              formData.merchantName
            }
            onChange={
              handleChange
            }
            required
            className="bg-slate-800 p-4 rounded-2xl text-white outline-none"
          />

          <input
            type="text"
            name="merchantCategory"
            placeholder="Merchant Category"
            value={
              formData.merchantCategory
            }
            onChange={
              handleChange
            }
            required
            className="bg-slate-800 p-4 rounded-2xl text-white outline-none"
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={
              formData.location
            }
            onChange={
              handleChange
            }
            required
            className="bg-slate-800 p-4 rounded-2xl text-white outline-none"
          />

          <select
            name="deviceType"
            value={
              formData.deviceType
            }
            onChange={
              handleChange
            }
            className="bg-slate-800 p-4 rounded-2xl text-white outline-none"
          >
            <option>
              Desktop
            </option>

            <option>
              Mobile
            </option>
          </select>

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-semibold"
          >
            Create Transaction
          </button>

        </form>

        {/* TABLE */}
        <div className="bg-slate-900 border border-slate-800 rounded-[35px] p-8 overflow-x-auto">

          <table className="w-full text-white">

            <thead>
              <tr className="border-b border-slate-700 text-slate-400">
                <th>
                  Merchant
                </th>
                <th>
                  Amount
                </th>
                <th>
                  Risk
                </th>
                <th>
                  Status
                </th>
                <th>
                  Action
                </th>
              </tr>
            </thead>

            <tbody>

              {filteredTransactions.map(
                (
                  item
                ) => (
                  <tr
                    key={
                      item._id
                    }
                    className="border-b border-slate-800"
                  >
                    <td className="py-4">
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

                    <td>
                      {
                        item.riskScore
                      }
                    </td>

                    <td>
                      {
                        item.transactionStatus
                      }
                    </td>

                    <td>

                      <button
                        onClick={() =>
                          setSelectedTransaction(
                            item
                          )
                        }
                        className="bg-blue-600 px-4 py-2 rounded-xl"
                      >
                        View
                      </button>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

        {/* MODAL */}
        {selectedTransaction && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">

            <div className="bg-slate-900 w-[800px] rounded-[35px] p-10">

              <h2 className="text-3xl text-white font-bold mb-6">
                Transaction Details
              </h2>

              <textarea
                placeholder="Admin Note"
                value={
                  adminNote
                }
                onChange={(
                  e
                ) =>
                  setAdminNote(
                    e.target
                      .value
                  )
                }
                className="w-full bg-slate-800 text-white rounded-2xl p-4 mb-5"
              />

              {/* OTP */}
              {selectedTransaction.transactionStatus ===
                "Pending OTP" && (
                <>

                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(
                      e
                    ) =>
                      setOtp(
                        e.target
                          .value
                      )
                    }
                    className="w-full bg-slate-800 text-white rounded-2xl p-4 mb-5"
                  />

                  <button
                    onClick={() =>
                      verifyOtp(
                        selectedTransaction._id
                      )
                    }
                    className="bg-indigo-600 px-6 py-3 rounded-2xl text-white"
                  >
                    Verify OTP
                  </button>

                </>
              )}

            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

export default Transactions;