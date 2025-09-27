const Joi = require("joi");

const mongoose = require("mongoose");

const objectId = () =>
  Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.error("any.invalid");
    }
    return value;
  }, "ObjectId validation");

// For updating a favourite
const paramQueryValidation = {
  params: Joi.object({
    id: objectId().required(), // must be a valid ObjectId
  }),
  body: Joi.object({
    status: Joi.string()
      .valid("available", "sold", "pending", "rejected")
      .required(),
  }),
};

module.exports = paramQueryValidation;
