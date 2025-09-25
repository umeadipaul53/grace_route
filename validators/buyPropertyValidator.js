const Joi = require("joi");
const mongoose = require("mongoose");

// Custom Joi validator to check if a value is a valid MongoDB ObjectId
const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message(`"${value}" is not a valid ObjectId`);
  }
  return value;
};

const buyPropertyValidationSchema = Joi.object({
  property: Joi.string().custom(objectId).required().messages({
    "any.required": "Property ID is required",
    "string.empty": "Property ID cannot be empty",
  }),
  buyer: Joi.string().custom(objectId).required().messages({
    "any.required": "Buyer ID is required",
    "string.empty": "Buyer ID cannot be empty",
  }),
  status: Joi.string().valid("pending", "settled").default("pending").messages({
    "any.only": "Status must be either 'pending' or 'settled'",
  }),
});

module.exports = buyPropertyValidationSchema;
