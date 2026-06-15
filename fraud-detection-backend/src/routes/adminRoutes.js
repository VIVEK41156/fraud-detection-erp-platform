const express = require(
  "express"
);

const {
  getAllUsers,
  getAllTransactions,
  getFraudTransactions,
} = require(
  "../controllers/adminController"
);

const {
  getLogs,
} = require(
  "../controllers/logController"
);

const {
  protect,
  adminOnly,
} = require(
  "../middleware/authMiddleware"
);

const router =
  express.Router();

// -----------------------------
// Admin Users
// -----------------------------
router.get(
  "/users",
  protect,
  adminOnly,
  getAllUsers
);

// -----------------------------
// All Transactions
// -----------------------------
router.get(
  "/transactions",
  protect,
  adminOnly,
  getAllTransactions
);

// -----------------------------
// Fraud Transactions
// -----------------------------
router.get(
  "/frauds",
  protect,
  adminOnly,
  getFraudTransactions
);

// -----------------------------
// Audit Logs
// -----------------------------
router.get(
  "/logs",
  protect,
  adminOnly,
  getLogs
);

module.exports = router;