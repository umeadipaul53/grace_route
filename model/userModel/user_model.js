const mongoose = require("../../config/db");

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, default: "" },
    house_number: { type: String, default: "" },
    street: { type: String, default: "" },
    city: { type: String, default: "" },
    lga: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "" },
    postalCode: { type: String, default: "" },
  },
  {
    _id: false, //prevents creating a separate _id for address
  }
);

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    password: { type: String, required: true },
    phone_number: { type: String, required: true },
    address: addressSchema,
    role: {
      type: String,
      enum: ["user"],
      default: "user",
    },
    verified: { type: Boolean, default: false },
  },
  {
    timestamps: true, // <-- this automatically adds createdAt & updatedAt
  }
);

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
