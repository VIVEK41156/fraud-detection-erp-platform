const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// ----------------------
// CORS Configuration
// ----------------------
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// ----------------------
// Middleware
// ----------------------
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(morgan("dev"));

// ----------------------
// Route Imports
// ----------------------
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminRoutes = require("./routes/adminRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const adminActionRoutes = require("./routes/adminActionRoutes");
const otpRoutes = require("./routes/otpRoutes");
const monitoringRoutes = require("./routes/monitoringRoutes");

// ----------------------
// API Routes
// ----------------------
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin-actions", adminActionRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/monitoring", monitoringRoutes);

// ----------------------
// Health Check
// ----------------------
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Fraud Detection API Running 🚀",
  });
});

// ----------------------
// 404 Route
// ----------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

module.exports = app;