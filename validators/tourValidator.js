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
});

// Logged-in schema (user info is fetched from DB)
const userTourRequestSchema = Joi.object({
  property: Joi.string().custom(objectId).required(),
  date: Joi.date().required(),
});

module.exports = {
  guestTourRequestSchema,
  userTourRequestSchema,
};
