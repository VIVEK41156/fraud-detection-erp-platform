const Transaction =
  require("../models/Transaction");

// ----------------------
// UPDATE ACTION
// ----------------------
const updateTransactionAction =
  async (
    req,
    res
  ) => {
    try {
      const {
        action,
        note,
      } = req.body;

      const transaction =
        await Transaction.findById(
          req.params.id
        );

      if (
        !transaction
      ) {
        return res
          .status(404)
          .json({
            success:
              false,

            message:
              "Transaction not found",
          });
      }

      // ------------------
      // ACTIONS
      // ------------------
      if (
        action ===
        "freeze"
      ) {
        transaction.transactionStatus =
          "Frozen";

        transaction.adminAction =
          "Frozen";
      }

      if (
        action ===
        "fraud"
      ) {
        transaction.isFraud =
          true;

        transaction.adminAction =
          "Marked Fraud";
      }

      if (
        action ===
        "safe"
      ) {
        transaction.isFraud =
          false;

        transaction.adminAction =
          "Marked Safe";
      }

      transaction.adminNote =
        note ||
        "";

      await transaction.save();

      res.status(200).json(
        {
          success:
            true,

          message:
            "Admin Action Applied",

          transaction,
        }
      );
    } catch (
      error
    ) {
      res.status(500).json(
        {
          success:
            false,

          message:
            error.message,
        }
      );
    }
  };

module.exports = {
  updateTransactionAction,
};