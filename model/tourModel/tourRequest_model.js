const mongoose = require("mongoose");

const tourRequestSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "property_listing",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null, // guests won't have this
    },
    property_name: {
      type: String,
      required: true,
      trim: true,
    },
    property_type: {
      type: String,
      required: true,
      enum: ["Land", "Commercial", "Residential"],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    homeType: {
      type: String,
      enum: [
        "Duplex",
        "Bungalow",
        "Detached Duplex",
        "Semi-detached Duplex",
        "Terraced Duplex",
        "Block of Flats",
        "Mini Flat",
        "Self-contained",
      ],
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "attended"],
      default: "pending", // fallback
    },
  },
  { timestamps: true }
);

const tourRequestModel = mongoose.model("tourRequest", tourRequestSchema);

module.exports = tourRequestModel;
