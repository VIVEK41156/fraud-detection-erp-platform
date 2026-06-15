const axios = require("axios");
const Transaction = require(
  "../models/Transaction"
);

const calculateFraudRisk =
  async (
    transactionData,
    userId
  ) => {
    try {
      const {
        amount,
        location,
        deviceType,
        merchantCategory,
      } = transactionData;

      // -----------------------------
      // Convert to ML Features
      // -----------------------------
      const locationRisk =
        [
          "Nigeria",
          "Russia",
          "Pakistan",
          "Unknown",
        ].includes(location)
          ? 1
          : 0;

      const deviceRisk =
        deviceType ===
        "Desktop"
          ? 1
          : 0;

      const merchantRisk =
        [
          "Crypto",
          "Gaming",
          "Luxury",
          "Gift Cards",
        ].includes(
          merchantCategory
        )
          ? 1
          : 0;

      // -----------------------------
      // Velocity Risk
      // -----------------------------
      const twoMinutesAgo =
        new Date(
          Date.now() -
            2 *
              60 *
              1000
        );

      const recentTransactions =
        await Transaction.countDocuments(
          {
            user: userId,
            createdAt: {
              $gte:
                twoMinutesAgo,
            },
          }
        );

      const velocityRisk =
        recentTransactions >=
        3
          ? 1
          : 0;

      // -----------------------------
      // Spending Spike
      // -----------------------------
      let spendingSpike =
        0;

      const previousTransactions =
        await Transaction.find(
          {
            user: userId,
          }
        );

      if (
        previousTransactions.length >
        0
      ) {
        const totalSpent =
          previousTransactions.reduce(
            (
              total,
              transaction
            ) =>
              total +
              transaction.amount,
            0
          );

        const averageSpent =
          totalSpent /
          previousTransactions.length;

        if (
          amount >
          averageSpent * 5
        ) {
          spendingSpike =
            1;
        }
      }

      // -----------------------------
      // Call ML API
      // -----------------------------
      const mlResponse =
        await axios.post(
          "http://localhost:8000/predict",
          {
            amount,
            locationRisk,
            deviceRisk,
            merchantRisk,
            velocityRisk,
            spendingSpike,
          }
        );

      return {
        riskScore:
          mlResponse.data
            .riskScore,
        isFraud:
          mlResponse.data
            .isFraud,
      };
    } catch (error) {
      console.log(
        "ML Error:",
        error.message
      );

      return {
        riskScore: 0,
        isFraud: false,
      };
    }
  };

module.exports = {
  calculateFraudRisk,
};