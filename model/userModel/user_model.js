const mongoose = require("../../config/db");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  password: { type: String, required: true },
  phone_number: { type: String, required: true },
  role: {
    type: String,
    enum: ["user"],
    default: "user",
  },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
