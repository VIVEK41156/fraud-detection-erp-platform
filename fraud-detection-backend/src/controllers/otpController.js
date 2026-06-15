const Transaction =
  require("../models/Transaction");

const verifyOtp =
  async (req, res) => {
    try {
      const {
        transactionId,
        otp,
      } = req.body;

      const transaction =
        await Transaction.findById(
          transactionId
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

      // OTP Expired
      if (
        new Date() >
        transaction.otpExpiresAt
      ) {
        return res
          .status(400)
          .json({
            success:
              false,

            message:
              "OTP Expired ❌",
          });
      }

      // Wrong OTP
      if (
        transaction.otpCode !==
        otp
      ) {
        return res
          .status(400)
          .json({
            success:
              false,

            message:
              "Invalid OTP ❌",
          });
      }

      // Success
      transaction.otpVerified =
        true;

      transaction.transactionStatus =
        "Completed";

      transaction.otpCode =
        null;

      transaction.otpExpiresAt =
        null;

      await transaction.save();

      return res
        .status(200)
        .json({
          success:
            true,

          message:
            "Transaction Verified ✅",

          transaction,
        });
    } catch (
      error
    ) {
      return res
        .status(500)
        .json({
          success:
            false,

          message:
            error.message,
        });
    }
  };

module.exports = {
  verifyOtp,
};