const mongoose = require("mongoose");

const createEstateSchema = new mongoose.Schema({
  images: [
    {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
      fileType: {
        type: String,
        enum: ["image/jpeg", "image/png", "image/jpg"],
        required: true,
      },
      fileSize: {
        type: Number,
        required: true,
        validate: {
          validator: function (v) {
            return v <= 1 * 1024 * 1024; // 1MB max
          },
          message: "File size must not exceed 1MB",
        },
      },
    },
  ],
  name: {
    type: String,
    required: [true, "Estate name is required"],
    trim: true,
  },

  plotSize: {
    type: String,
    required: [true, "Plot Size is required"],
    trim: true,
  },

  pricePerPlot: {
    type: Number,
    required: [true, "Price per plot is required"],
    min: [0, "Price cannot be negative"],
  },

  location: {
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },
  },
  features: {
    type: [String],
    default: [],
    trim: true,
  },

  documents: {
    type: [String],
    default: [],
    trim: true,
  },

  description: {
    type: String,
    trim: true,
  },
  // 🔥 Track which user uploaded
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

const estateModel = mongoose.model("estate", createEstateSchema);

module.exports = estateModel;
