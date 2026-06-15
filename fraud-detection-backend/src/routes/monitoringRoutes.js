const express =
  require("express");

const router =
  express.Router();

const {
  getMonitoringStats,
} = require(
  "../controllers/monitoringController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

router.get(
  "/",
  protect,
  getMonitoringStats
);

module.exports =
  router;