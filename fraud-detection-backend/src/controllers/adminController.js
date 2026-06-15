const User = require(
  "../models/User"
);

const Transaction =
  require(
    "../models/Transaction"
  );

// Get All Users
const getAllUsers =
  async (req, res) => {
    try {
      const users =
        await User.find().select(
          "-password"
        );

      res.status(200).json({
        success: true,
        users,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// Get All Transactions
const getAllTransactions =
  async (req, res) => {
    try {
      const transactions =
        await Transaction.find();

      res.status(200).json({
        success: true,
        transactions,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// Fraud Transactions
const getFraudTransactions =
  async (req, res) => {
    try {
      const frauds =
        await Transaction.find(
          {
            isFraud: true,
          }
        );

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

module.exports = {
  getAllUsers,
  getAllTransactions,
  getFraudTransactions,
};