const Transaction =
  require("../models/Transaction");

const getMonitoringStats =
  async (req, res) => {
    try {
      console.log(
        "Monitoring API Called"
      );

      const transactions =
        await Transaction.find();

      const totalTransactions =
        transactions.length;

      const fraudCount =
        transactions.filter(
          (t) =>
            t.isFraud ===
            true
        ).length;

      const pendingOtp =
        transactions.filter(
          (t) =>
            t.transactionStatus ===
            "Pending OTP"
        ).length;

      const completed =
        transactions.filter(
          (t) =>
            t.transactionStatus ===
            "Completed"
        ).length;

      const highRisk =
        transactions.filter(
          (t) =>
            t.riskScore >
            70
        ).length;

      console.log({
        totalTransactions,
        fraudCount,
        pendingOtp,
        completed,
        highRisk,
      });

      return res
        .status(200)
        .json({
          success:
            true,

          stats: {
            totalTransactions,
            fraudCount,
            pendingOtp,
            completed,
            highRisk,
          },
        });
    } catch (
      error
    ) {
      console.log(
        "Monitoring Error:",
        error
      );

      return res
        .status(500)
        .json({
          success:
            false,
          message:
            error.message,
        });
    }
  };

module.exports = {
  getMonitoringStats,
};