const express =
  require("express");

const router =
  express.Router();

// Controller
const {
  getAnalytics,
} = require(
  "../controllers/analyticsController"
);

// Middleware
const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

// Route
router.get(
  "/",
  protect,
  getAnalytics
);

module.exports =
  router;