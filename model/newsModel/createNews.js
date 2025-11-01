const mongoose = require("mongoose");

const createNewsModel = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "News title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    source: {
      type: String,
      required: [true, "News  source is required"],
      trim: true,
      maxlength: [200, "Source cannot exceed 100 characters"],
    },
    content: {
      type: String,
      required: [true, "News content is required"],
    },
    // 🔥 Track which user uploaded
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
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
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

const newsModel = mongoose.model("news", createNewsModel);

module.exports = newsModel;
