const Joi = require("joi");
const mongoose = require("mongoose");

// Custom validator for ObjectId
const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message(`"${value}" is not a valid ObjectId`);
  }
  return value;
};

const buyPropertyValidationSchema = Joi.object({}).unknown(false).messages({
  "object.unknown": "Unexpected field(s) in request body",
});

module.exports = buyPropertyValidationSchema;
