const express =
  require("express");

const router =
  express.Router();

const {
  verifyOtp,
} = require(
  "../controllers/otpController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

router.post(
  "/verify",
  protect,
  verifyOtp
);

module.exports =
  router;