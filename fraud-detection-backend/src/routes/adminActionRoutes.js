const express =
  require("express");

const router =
  express.Router();

const {
  updateTransactionAction,
} = require(
  "../controllers/adminActionController"
);

const {
  protect,
  adminOnly,
} = require(
  "../middleware/authMiddleware"
);

router.put(
  "/:id",
  protect,
  adminOnly,
  updateTransactionAction
);

module.exports =
  router;