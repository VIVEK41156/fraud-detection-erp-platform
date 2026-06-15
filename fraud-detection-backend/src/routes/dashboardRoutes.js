const express = require(
  "express"
);

const {
  getDashboardStats,
  getRecentFrauds,
  getRiskDistribution,
  getTopRiskMerchants,
} = require(
  "../controllers/dashboardController"
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
// Dashboard Stats
// -----------------------------
router.get(
  "/stats",
  protect,
  adminOnly,
  getDashboardStats
);

// -----------------------------
// Recent Frauds
// -----------------------------
router.get(
  "/recent-frauds",
  protect,
  adminOnly,
  getRecentFrauds
);

// -----------------------------
// Risk Distribution
// -----------------------------
router.get(
  "/risk-distribution",
  protect,
  adminOnly,
  getRiskDistribution
);

// -----------------------------
// Top Risk Merchants
// -----------------------------
router.get(
  "/top-risk-merchants",
  protect,
  adminOnly,
  getTopRiskMerchants
);

module.exports = router;