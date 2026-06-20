const Transaction = require("../models/Transaction");
const nodemailer  = require("nodemailer");
const fraudEmailTemplate = require("../utils/fraudEmailTemplate");
const otpEmailTemplate   = require("../utils/otpEmailTemplate");
const { createLog }      = require("./logController");

// ─── reusable mailer (created once) ─────────────────────────────
const createMailer = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 8000,
    greetingTimeout:   8000,
    socketTimeout:     10000,
  });

// ─── fire-and-forget email helper ───────────────────────────────
const sendEmailBg = (opts) => {
  const mailer = createMailer();
  mailer
    .sendMail(opts)
    .then(() => console.log(`✅ Email sent: ${opts.subject}`))
    .catch((e) => console.log(`❌ Email failed: ${e.message}`));
};

// ─── inline AI/ML risk scoring ───────────────────────────────────
// Uses the same features the Random Forest model was trained on.
// This runs in < 1ms with no network calls needed.
const scoreTransaction = ({ amount, location, merchantCategory, merchantName, deviceType }) => {
  const HIGH_RISK_LOCATIONS  = ["south asia", "nigeria", "russia", "eastern europe", "anonymous", "unknown", "offshore"];
  const HIGH_RISK_CATEGORIES = ["crypto", "gambling", "forex", "adult", "darkweb"];
  const HIGH_RISK_MERCHANTS  = ["cryptox", "betking", "fxpro", "coinbase", "binance", "bitmex"];

  const amt           = Number(amount);
  const locationRisk  = HIGH_RISK_LOCATIONS.some(l  => location?.toLowerCase().includes(l))         ? 1 : 0;
  const merchantRisk  = HIGH_RISK_CATEGORIES.some(c => merchantCategory?.toLowerCase().includes(c)) ||
                        HIGH_RISK_MERCHANTS.some(m  => merchantName?.toLowerCase().includes(m))     ? 1 : 0;
  const deviceRisk    = deviceType?.toLowerCase() === "mobile" ? 1 : 0;
  const velocityRisk  = amt > 200000 ? 1 : 0;
  const spendingSpike = amt > 500000 ? 1 : 0;

  const riskFactors  = locationRisk + merchantRisk + deviceRisk + velocityRisk + spendingSpike;
  const amountScore  = Math.min(amt / 10000, 30);   // up to 30 pts
  const featureScore = riskFactors * 14;             // up to 70 pts

  const riskScore = Math.min(Math.round(amountScore + featureScore), 99);
  const isFraud   = riskScore >= 70;

  return { riskScore, isFraud };
};

// ─── also try the real ML service (non-blocking best-effort) ─────
const tryMlService = async ({ amount, location, merchantCategory, merchantName, deviceType }) => {
  const mlUrl = process.env.ML_SERVICE_URL;
  if (!mlUrl) return null;

  try {
    const axios = require("axios");

    const HIGH_RISK_LOCATIONS  = ["south asia", "nigeria", "russia", "eastern europe", "anonymous", "unknown"];
    const HIGH_RISK_CATEGORIES = ["crypto", "gambling", "forex", "adult", "darkweb"];
    const HIGH_RISK_MERCHANTS  = ["cryptox", "betking", "fxpro", "coinbase", "binance"];

    const amt          = Number(amount);
    const locationRisk = HIGH_RISK_LOCATIONS.some(l  => location?.toLowerCase().includes(l))         ? 1 : 0;
    const merchantRisk = HIGH_RISK_CATEGORIES.some(c => merchantCategory?.toLowerCase().includes(c)) ||
                         HIGH_RISK_MERCHANTS.some(m  => merchantName?.toLowerCase().includes(m))     ? 1 : 0;
    const deviceRisk   = deviceType?.toLowerCase() === "mobile" ? 1 : 0;
    const velocityRisk  = amt > 200000 ? 1 : 0;
    const spendingSpike = amt > 500000 ? 1 : 0;

    const res = await axios.post(
      mlUrl,
      { amount: amt, locationRisk, deviceRisk, merchantRisk, velocityRisk, spendingSpike },
      { timeout: 4000 }
    );

    if (res.data?.riskScore !== undefined) {
      return {
        riskScore: Math.round(res.data.riskScore),
        isFraud:   Boolean(res.data.isFraud),
      };
    }
  } catch (e) {
    console.log("ML service unavailable:", e.message);
  }
  return null;
};

// ════════════════════════════════════════════════════════════════
// CREATE TRANSACTION
// ════════════════════════════════════════════════════════════════
const createTransaction = async (req, res) => {
  try {
    const {
      amount, currency = "INR", paymentMethod,
      merchantName, merchantCategory, location, deviceType,
    } = req.body;

    // ── 1. Inline scoring (instant, no network) ──────────────
    let { riskScore, isFraud } = scoreTransaction({
      amount, location, merchantCategory, merchantName, deviceType,
    });

    // ── 2. Try real ML model (best-effort, 4s timeout) ───────
    const mlResult = await tryMlService({
      amount, location, merchantCategory, merchantName, deviceType,
    });
    if (mlResult) {
      riskScore = mlResult.riskScore;
      isFraud   = mlResult.isFraud;
      console.log(`🤖 ML model used: risk=${riskScore}% fraud=${isFraud}`);
    } else {
      console.log(`📊 Fallback scoring used: risk=${riskScore}% fraud=${isFraud}`);
    }

    // ── 3. IP (from headers, no HTTP call) ───────────────────
    const detectedIp =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "unknown";

    // ── 4. OTP if high risk ───────────────────────────────────
    let otpCode          = null;
    let otpExpiresAt     = null;
    let otpVerified      = false;
    let transactionStatus = "Completed";

    if (riskScore > 70) {
      transactionStatus = "Pending OTP";
      otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

      // ── 5. Emails — fire & forget (NEVER block the response) ─
      const userEmail    = req.user?.email || process.env.EMAIL_USER;
      const adminEmail   = process.env.EMAIL_USER;

      // OTP → send to the user who made the transaction
      sendEmailBg({
        from:    adminEmail,
        to:      userEmail,
        subject: "🔐 OTP Verification — FraudShield ERP",
        html:    otpEmailTemplate(otpCode),
      });

      // Fraud alert → send to admin
      sendEmailBg({
        from:    adminEmail,
        to:      adminEmail,
        subject: `🚨 Fraud Alert: ${merchantName} — ₹${Number(amount).toLocaleString("en-IN")}`,
        html:    fraudEmailTemplate({
          merchantName, amount, location, riskScore, ipAddress: detectedIp,
        }),
      });
    }

    // ── 6. Save to DB ─────────────────────────────────────────
    const transaction = await Transaction.create({
      user:              req.user.id,
      amount,
      currency,
      paymentMethod,
      merchantName,
      merchantCategory,
      location,
      deviceType,
      ipAddress:         detectedIp,
      riskScore,
      isFraud,
      transactionStatus,
      otpCode,
      otpExpiresAt,
      otpVerified,
    });

    // ── 7. Audit log (fire & forget) ──────────────────────────
    createLog({
      action: "TRANSACTION_CREATED",
      user:   req.user.id,
      method: req.method,
      route:  req.originalUrl,
    }).catch(() => {});

    // ── 8. Respond immediately ────────────────────────────────
    return res.status(201).json({
      success: true,
      message: transactionStatus === "Pending OTP"
        ? `⚠️ High risk detected (${riskScore}%). OTP sent to ${req.user?.email || "admin email"}.`
        : `✅ Transaction completed. Risk score: ${riskScore}%.`,
      mlUsed: Boolean(mlResult),
      fraudAnalysis: { riskScore, isFraud, source: mlResult ? "ml-model" : "rule-engine" },
      transaction,
      ...(transactionStatus === "Pending OTP" && { otpNote: "Check your email for the OTP code." }),
    });

  } catch (error) {
    console.error("createTransaction error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ════════════════════════════════════════════════════════════════
// GET ALL TRANSACTIONS
// ════════════════════════════════════════════════════════════════
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, transactions });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ════════════════════════════════════════════════════════════════
// GET BY ID
// ════════════════════════════════════════════════════════════════
const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction)
      return res.status(404).json({ success: false, message: "Transaction not found" });
    return res.status(200).json({ success: true, transaction });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ════════════════════════════════════════════════════════════════
// DELETE
// ════════════════════════════════════════════════════════════════
const deleteTransaction = async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: "Transaction deleted." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createTransaction, getTransactions, getTransactionById, deleteTransaction };