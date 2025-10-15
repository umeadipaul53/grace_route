const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    location: { type: String, required: true },
  },
  { timestamps: true }
);

const locationModel = mongoose.model("locations", locationSchema);

module.exports = locationModel;
