const mongoose = require("mongoose");
const userModel = require("../userModel/user_model");

const propertySchema = new mongoose.Schema(
  {
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
    bedrooms: {
      type: String,
      match: /^[0-9]+\s*Bed(room)?s?$/i,
      required: true,
    },
    description: {
      type: String,
      required: true,
      minlength: 20,
    },
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
    location: {
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    plotArea: { type: String, required: true },
    unitsNumber: { type: Number, required: true },

    // 🔥 Track which user uploaded
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    status: {
      type: String,
      enum: ["available", "sold", "pending", "rejected"],
      default: "pending", // fallback
    },

    otherInfo: { type: String },
  },
  { timestamps: true }
);

// Hook: set default status depending on role
propertySchema.pre("save", async function (next) {
  if (this.isNew && this.userId) {
    try {
      const User = mongoose.model("user"); // require dynamically
      const user = await User.findById(this.userId).select("role");

      if (user && user.role === "user") {
        this.status = "pending"; // users can't auto-publish
      } else if (user && user.role === "admin") {
        this.status = "available"; // admins auto-publish
      }
    } catch (err) {
      return next(err);
    }
  }
  next();
});

const createPropertyModel = mongoose.model("property_listing", propertySchema);
module.exports = createPropertyModel;
