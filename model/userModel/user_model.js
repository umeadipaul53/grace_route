const mongoose = require("../../config/db");
const Joi = require("joi");

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

const userValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(6)
    .pattern(
      /^(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one symbol, letters, and numbers",
      "string.empty": "New password is required",
      "string.min": "New password must be at least 6 characters long",
    }),
  firstname: Joi.string()
    .pattern(/^[a-zA-Z ]+$/)
    .required()
    .min(3)
    .max(50)
    .messages({
      "string.pattern.base": "Full name must only contain letters and spaces.",
      "string.empty": "Full name is required.",
      "string.min": "Full name must be at least 3 characters long.",
      "string.max": "Full name must be less than or equal to 50 characters.",
    }),
  lastname: Joi.string()
    .pattern(/^[a-zA-Z ]+$/)
    .required()
    .min(3)
    .max(50)
    .messages({
      "string.pattern.base": "Full name must only contain letters and spaces.",
      "string.empty": "Full name is required.",
      "string.min": "Full name must be at least 3 characters long.",
      "string.max": "Full name must be less than or equal to 50 characters.",
    }),
  phone_number: Joi.string()
    .pattern(/^\+?[0-9]{7,15}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Phone number must be a valid international number.",
      "string.empty": "Phone number is required.",
    }),
  role: Joi.string().valid("user").default("user"),
});

module.exports = {
  userModel,
  userValidationSchema,
};
