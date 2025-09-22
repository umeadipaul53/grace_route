const mongoose = require("mongoose");

const registerTokenSchema = new mongoose.Schema(
  {
    tokenId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    hash: { type: String, required: true },
  },
  {
    timestamps: true, // <-- this automatically adds createdAt & updatedAt
  }
);

const registerTokenModel = mongoose.model("token", registerTokenSchema);

const authTokenSchema = new mongoose.Schema({
  tokenId: { type: String, required: true, unique: true },
  token: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now, expires: "7d" }, // optional auto-expiry
});

const authTokenModel = mongoose.model("authToken", authTokenSchema);

module.exports = { registerTokenModel, authTokenModel };
