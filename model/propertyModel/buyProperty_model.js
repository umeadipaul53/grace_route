const mongoose = require("mongoose");

const buyPropertySchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "property_listing",
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // registered buyer
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "settled", "rejected"],
      default: "pending", // fallback
    },
  },
  { timestamps: true }
);

const buyPropertyModel = mongoose.model("buyProperty", buyPropertySchema);

module.exports = buyPropertyModel;
