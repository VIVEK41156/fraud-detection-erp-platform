const Transaction = require(
  "../models/Transaction"
);

// -----------------------------
// Dashboard Stats
// -----------------------------
const getDashboardStats =
  async (req, res) => {
    try {
      const totalTransactions =
        await Transaction.countDocuments();

      const fraudTransactions =
        await Transaction.countDocuments(
          {
            isFraud: true,
          }
        );

      const safeTransactions =
        totalTransactions -
        fraudTransactions;

      const fraudRate =
        totalTransactions > 0
          ? (
              (fraudTransactions /
                totalTransactions) *
              100
            ).toFixed(2)
          : 0;

      res.status(200).json({
        success: true,
        stats: {
          totalTransactions,
          fraudTransactions,
          safeTransactions,
          fraudRate,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// -----------------------------
// Recent Frauds
// -----------------------------
const getRecentFrauds =
  async (req, res) => {
    try {
      const frauds =
        await Transaction.find({
          isFraud: true,
        })
          .sort({
            createdAt: -1,
          })
          .limit(5);

      res.status(200).json({
        success: true,
        frauds,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// -----------------------------
// Risk Distribution
// -----------------------------
const getRiskDistribution =
  async (req, res) => {
    try {
      const lowRisk =
        await Transaction.countDocuments(
          {
            riskScore: {
              $lt: 40,
            },
          }
        );

      const mediumRisk =
        await Transaction.countDocuments(
          {
            riskScore: {
              $gte: 40,
              $lt: 70,
            },
          }
        );

      const highRisk =
        await Transaction.countDocuments(
          {
            riskScore: {
              $gte: 70,
            },
          }
        );

      res.status(200).json({
        success: true,
        riskDistribution:
          {
            lowRisk,
            mediumRisk,
            highRisk,
          },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// -----------------------------
// Top Risk Merchants
// -----------------------------
const getTopRiskMerchants =
  async (req, res) => {
    try {
      const merchants =
        await Transaction.aggregate(
          [
            {
              $match: {
                isFraud: true,
              },
            },
            {
              $group: {
                _id:
                  "$merchantName",
                fraudCount:
                  {
                    $sum: 1,
                  },
              },
            },
            {
              $sort: {
                fraudCount:
                  -1,
              },
            },
            {
              $limit: 5,
            },
          ]
        );

      res.status(200).json({
        success: true,
        merchants,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

module.exports = {
  getDashboardStats,
  getRecentFrauds,
  getRiskDistribution,
  getTopRiskMerchants,
};