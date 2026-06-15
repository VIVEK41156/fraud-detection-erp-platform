const mongoose =
  require("mongoose");

const logSchema =
  new mongoose.Schema(
    {
      action: {
        type: String,
        required: true,
      },

      user: {
        type:
          mongoose.Schema
            .Types
            .ObjectId,
        ref: "User",
      },

      method: {
        type: String,
        default: "",
      },

      route: {
        type: String,
        default: "",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Log",
    logSchema
  );