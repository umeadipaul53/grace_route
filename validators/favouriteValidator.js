const Joi = require("joi");
const mongoose = require("mongoose");

// custom ObjectId validator
const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message('"{{#label}}" must be a valid ObjectId');
  }
  return value;
};

// Add favourite
const favouriteValidation = Joi.object({
  propertyId: Joi.string().custom(objectId).required(),
  userId: Joi.string().custom(objectId).required(),
});

module.exports = favouriteValidation;
