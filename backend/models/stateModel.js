const mongoose = require("mongoose");

const stateModelSchema = mongoose.Schema(
  {
    id: { type: Number, required: true, unique:true}, //Index in the array
    state: { type: String, required: true }, //Enum
  },
  { timestamps: true }
);

module.exports = mongoose.model("StateModel", stateModelSchema);
