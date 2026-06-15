require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

// Connect MongoDB
connectDB();

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server Running on Port ${PORT}`);
});