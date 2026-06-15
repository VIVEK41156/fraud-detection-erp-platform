const express =
  require("express");

const router =
  express.Router();

const {
  createTransaction,
  getTransactions,
  getTransactionById,
  deleteTransaction,
} = require(
  "../controllers/transactionController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

// Create + Get All
router
  .route("/")
  .post(
    protect,
    createTransaction
  )
  .get(
    protect,
    getTransactions
  );

// Get By ID + Delete
router
  .route("/:id")
  .get(
    protect,
    getTransactionById
  )
  .delete(
    protect,
    deleteTransaction
  );

module.exports =
  router;