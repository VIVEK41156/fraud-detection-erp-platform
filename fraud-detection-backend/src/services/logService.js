const Log = require(
  "../models/Log"
);

const createLog =
  async ({
    userId,
    email,
    action,
    details = {},
  }) => {
    try {
      await Log.create({
        user: userId,
        email,
        action,
        details,
      });
    } catch (error) {
      console.log(
        "Log Error:",
        error.message
      );
    }
  };

module.exports = {
  createLog,
};