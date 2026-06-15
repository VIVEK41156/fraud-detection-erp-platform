const mongoose =
  require("mongoose");

const transactionSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema
            .Types
            .ObjectId,
        ref: "User",
        required:
          true,
      },

      amount: {
        type:
          Number,
        required:
          true,
      },

      currency: {
        type:
          String,
        default:
          "INR",
      },

      paymentMethod:
        {
          type:
            String,
          required:
            true,
        },

      merchantName:
        {
          type:
            String,
          required:
            true,
        },

      merchantCategory:
        {
          type:
            String,
          required:
            true,
        },

      location: {
        type:
          String,
        required:
          true,
      },

      deviceType:
        {
          type:
            String,
          required:
            true,
        },

      ipAddress:
        {
          type:
            String,
        },

      riskScore:
        {
          type:
            Number,
          default:
            0,
        },

      isFraud: {
        type:
          Boolean,
        default:
          false,
      },

      transactionStatus:
        {
          type:
            String,

          enum: [
            "Completed",
            "Pending OTP",
            "Frozen",
            "Blocked",
          ],

          default:
            "Completed",
        },

      // OTP
      otpCode: {
        type:
          String,
        default:
          null,
      },

      otpExpiresAt:
        {
          type:
            Date,
          default:
            null,
        },

      otpVerified:
        {
          type:
            Boolean,
          default:
            false,
        },

      adminAction:
        {
          type:
            String,
          enum: [
            "Marked Fraud",
            "Marked Safe",
            "Frozen",
            "None",
          ],
          default:
            "None",
        },

      adminNote:
        {
          type:
            String,
          default:
            "",
        },
    },
    {
      timestamps:
        true,
    }
  );

module.exports =
  mongoose.model(
    "Transaction",
    transactionSchema
  );