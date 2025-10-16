const Joi = require("joi");
const mongoose = require("mongoose");

// Custom validator for ObjectId
const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

// Guest schema (not logged in)
const guestTourRequestSchema = Joi.object({
  property: Joi.string().custom(objectId).required(),
  date: Joi.date().required(),
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(7).max(20).required(),
  time: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/) // ✅ Validates HH:mm format (24-hour)
    .required()
    .messages({
      "string.pattern.base": "Time must be in HH:mm format (e.g., 14:30).",
    }),
});

// Logged-in schema (user info is fetched from DB)
const userTourRequestSchema = Joi.object({
  property: Joi.string().custom(objectId).required(),
  date: Joi.date().required(),
  time: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/) // ✅ Validates HH:mm format (24-hour)
    .required()
    .messages({
      "string.pattern.base": "Time must be in HH:mm format (e.g., 14:30).",
    }),
});

module.exports = {
  guestTourRequestSchema,
  userTourRequestSchema,
};
