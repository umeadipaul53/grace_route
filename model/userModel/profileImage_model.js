const mongoose = require("mongoose");

// Profile Image Schema
const profileImageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          // ensure it's an image file
          return /\.(jpg|jpeg|png)$/i.test(v);
        },
        message: "Invalid image file format. Only JPG, PNG allowed.",
      },
    },
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
          return v <= 1 * 1024 * 1024; // 2MB max
        },
        message: "File size must not exceed 1MB",
      },
    },
  },
  { timestamps: true }
);

const profileImage = mongoose.model("ProfileImage", profileImageSchema);

module.exports = profileImage;
