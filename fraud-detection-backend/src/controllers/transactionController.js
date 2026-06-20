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
      // IP — use forwarded header directly (Render sets x-forwarded-for)
      const detectedIp =
        req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
        req.socket.remoteAddress ||
        req.ip ||
        "unknown";

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

        // ─────────────────────────────────────────
        // SEND EMAILS — fire & forget (non-blocking)
        // Transaction response does NOT wait for email
        // ─────────────────────────────────────────
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
          connectionTimeout: 5000,
          greetingTimeout:   5000,
          socketTimeout:     10000,
        });

        // OTP email — fire & forget
        transporter.sendMail({
          from:    process.env.EMAIL_USER,
          to:      process.env.EMAIL_USER,
          subject: "🔐 OTP Verification Required - FraudShield",
          html:    otpEmailTemplate(otpCode),
        }).then(() => console.log("OTP email sent ✅"))
          .catch((e) => console.log("OTP Email Error:", e.message));

        // Fraud alert email — fire & forget
        transporter.sendMail({
          from:    process.env.EMAIL_USER,
          to:      process.env.EMAIL_USER,
          subject: "🚨 Fraud Alert Detected - FraudShield",
          html:    fraudEmailTemplate({ merchantName, amount, location, riskScore, ipAddress: detectedIp }),
        }).then(() => console.log("Fraud alert email sent ✅"))
          .catch((e) => console.log("Fraud Email Error:", e.message));
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