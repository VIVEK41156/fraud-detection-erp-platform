const Transaction =
  require("../models/Transaction");

const axios =
  require("axios");

const nodemailer =
  require("nodemailer");

const fraudEmailTemplate =
  require(
    "../utils/fraudEmailTemplate"
  );

const otpEmailTemplate =
  require(
    "../utils/otpEmailTemplate"
  );

const {
  createLog,
} = require(
  "./logController"
);

// ----------------------
// CREATE TRANSACTION
// ----------------------
const createTransaction =
  async (req, res) => {
    try {
      const {
        amount,
        currency,
        paymentMethod,
        merchantName,
        merchantCategory,
        location,
        deviceType,
      } = req.body;

      // ----------------------
      // DEFAULT VALUES
      // ----------------------
      let riskScore =
        20;

      let isFraud =
        false;

      // ----------------------
      // COMPUTE RISK FEATURES
      // ----------------------
      const HIGH_RISK_LOCATIONS = ["south asia", "nigeria", "russia", "eastern europe", "anonymous", "unknown"];
      const HIGH_RISK_CATEGORIES = ["crypto", "gambling", "forex", "adult", "darkweb", "cryptox"];
      const HIGH_RISK_MERCHANTS  = ["cryptox", "betking", "fxpro", "coinbase", "binance"];

      const locationRisk  = HIGH_RISK_LOCATIONS.some(l => location?.toLowerCase().includes(l)) ? 1 : 0;
      const merchantRisk  = HIGH_RISK_CATEGORIES.some(c => merchantCategory?.toLowerCase().includes(c)) ||
                            HIGH_RISK_MERCHANTS.some(m => merchantName?.toLowerCase().includes(m)) ? 1 : 0;
      const deviceRisk    = deviceType?.toLowerCase() === "mobile" ? 1 : 0;
      const velocityRisk  = Number(amount) > 200000 ? 1 : 0;
      const spendingSpike = Number(amount) > 500000 ? 1 : 0;

      try {
        const mlResponse =
          await axios.post(
            process.env.ML_SERVICE_URL || "http://127.0.0.1:5001/predict",
            {
              amount:        Number(amount),
              locationRisk,
              deviceRisk,
              merchantRisk,
              velocityRisk,
              spendingSpike,
            },
            { timeout: 5000 }
          );

        riskScore =
          mlResponse.data
            .riskScore ??
          20;

        isFraud =
          mlResponse.data
            .isFraud ??
          false;
      } catch (
        error
      ) {
        console.log(
          "ML Service Error:",
          error.message
        );

        // ----------------------
        // SMART FALLBACK SCORING
        // Uses pre-computed risk features
        // ----------------------
        const riskFactors = locationRisk + merchantRisk + deviceRisk + velocityRisk + spendingSpike;
        const baseScore   = Math.min(Number(amount) / 10000, 30); // up to 30 pts from amount
        const featureScore = riskFactors * 15;                    // up to 75 pts from risk features
        riskScore = Math.min(Math.round(baseScore + featureScore), 99);
        isFraud   = riskScore >= 70;
      }

      // ----------------------
      // REAL IP DETECTION
      // ----------------------
      let detectedIp =
        req.headers[
          "x-forwarded-for"
        ] ||
        req.socket
          .remoteAddress ||
        req.ip;

      if (
        detectedIp ===
          "::1" ||
        detectedIp ===
          "127.0.0.1"
      ) {
        try {
          const ipRes =
            await axios.get(
              "https://api.ipify.org?format=json",
              { timeout: 3000 }
            );

          detectedIp =
            ipRes.data.ip;
        } catch (
          error
        ) {
          console.log(
            "IP Fetch Error"
          );
        }
      }

      // ----------------------
      // OTP LOGIC
      // ----------------------
      let otpCode =
        null;

      let otpExpiresAt =
        null;

      let otpVerified =
        false;

      let transactionStatus =
        "Completed";

      // ----------------------
      // HIGH RISK OTP
      // ----------------------
      if (
        riskScore >
        70
      ) {
        transactionStatus =
          "Pending OTP";

        otpCode =
          Math.floor(
            100000 +
              Math.random() *
                900000
          ).toString();

        otpExpiresAt =
          new Date(
            Date.now() +
              5 *
                60 *
                1000
          );

        // SEND OTP EMAIL
        try {
          const transporter =
            nodemailer.createTransport(
              {
                service:
                  "gmail",

                auth: {
                  user:
                    process.env.EMAIL_USER,

                  pass:
                    process.env.EMAIL_PASS,
                },
              }
            );

          await transporter.sendMail(
            {
              from:
                process.env.EMAIL_USER,

              to:
                process.env.EMAIL_USER,

              subject:
                "🔐 OTP Verification Required",

              html:
                otpEmailTemplate(
                  otpCode
                ),
            }
          );

          console.log(
            "OTP email sent ✅"
          );
        } catch (
          error
        ) {
          console.log(
            "OTP Email Error:",
            error.message
          );
        }

        // SEND FRAUD ALERT EMAIL
        try {
          const transporter =
            nodemailer.createTransport(
              {
                service:
                  "gmail",

                auth: {
                  user:
                    process.env.EMAIL_USER,

                  pass:
                    process.env.EMAIL_PASS,
                },
              }
            );

          await transporter.sendMail(
            {
              from:
                process.env.EMAIL_USER,

              to:
                process.env.EMAIL_USER,

              subject:
                "🚨 Fraud Alert Detected",

              html:
                fraudEmailTemplate(
                  {
                    merchantName,
                    amount,
                    location,
                    riskScore,
                    ipAddress:
                      detectedIp,
                  }
                ),
            }
          );

          console.log(
            "Fraud email sent ✅"
          );
        } catch (
          error
        ) {
          console.log(
            "Fraud Email Error:",
            error.message
          );
        }
      }

      // ----------------------
      // CREATE TRANSACTION
      // ----------------------
      const transaction =
        await Transaction.create(
          {
            user:
              req.user.id,

            amount,
            currency,

            paymentMethod,

            merchantName,

            merchantCategory,

            location,

            deviceType,

            ipAddress:
              detectedIp,

            riskScore,

            isFraud,

            transactionStatus,

            otpCode,

            otpExpiresAt,

            otpVerified,
          }
        );

      // ----------------------
      // AUDIT LOG
      // ----------------------
      await createLog({
        action:
          "TRANSACTION_CREATED",

        user:
          req.user.id,

        method:
          req.method,

        route:
          req.originalUrl,
      });

      return res
        .status(201)
        .json({
          success:
            true,

          message:
            transactionStatus ===
            "Pending OTP"
              ? "OTP Sent"
              : "Transaction Created",

          fraudAnalysis:
            {
              riskScore,
              isFraud,
            },

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

// ----------------------
// GET ALL
// ----------------------
const getTransactions =
  async (req, res) => {
    try {
      const transactions =
        await Transaction.find()
          .sort({
            createdAt:
              -1,
          });

      return res
        .status(200)
        .json({
          success:
            true,
          transactions,
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

// ----------------------
// GET BY ID
// ----------------------
const getTransactionById =
  async (req, res) => {
    try {
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

      return res
        .status(200)
        .json({
          success:
            true,
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

// ----------------------
// DELETE
// ----------------------
const deleteTransaction =
  async (req, res) => {
    try {
      await Transaction.findByIdAndDelete(
        req.params.id
      );

      return res
        .status(200)
        .json({
          success:
            true,
          message:
            "Transaction Deleted",
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
  createTransaction,
  getTransactions,
  getTransactionById,
  deleteTransaction,
};