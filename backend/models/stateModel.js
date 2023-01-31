const mongoose = require("mongoose");

const stateModelSchema = mongoose.Schema(
  {
    index: { type: Number, required: true, index: { unique: true } },
    state: {
      type: String,
      enum: ["KWS_KERIDOS", "KWS_KERIDOS_YG", "UNKNOWN", "ERROR"],
      default: "ERROR",
      required: true,
    },
    isUpdated: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StateModel", stateModelSchema);
