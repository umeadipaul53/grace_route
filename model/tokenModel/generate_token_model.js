const mongoose = require("mongoose");
const Joi = require("joi");

const generateTokenSchema = new mongoose.Schema({
  tokenId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  hash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "7d" },
});

const generateTokenModel = mongoose.model("token", generateTokenSchema);

module.exports = generateTokenModel;
