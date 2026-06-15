const Log =
  require("../models/Log");

// --------------------
// Create Log
// --------------------
const createLog =
  async (data) => {
    try {
      await Log.create(data);
    } catch (error) {
      console.log(
        "Log Error:",
        error.message
      );
    }
  };

// --------------------
// Get Logs
// --------------------
const getLogs =
  async (req, res) => {
    try {
      const logs =
        await Log.find()
          .populate(
            "user",
            "name email role"
          )
          .sort({
            createdAt:
              -1,
          });

      res.status(200).json({
        success: true,
        logs,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

module.exports = {
  createLog,
  getLogs,
};