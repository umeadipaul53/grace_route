const Joi = require("joi");

const createEstateValidation = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Estate name is required",
  }),
  plotSize: Joi.string().trim().required().messages({
    "string.empty": "Plot size is required",
  }),

  pricePerPlot: Joi.number().min(0).required().messages({
    "number.base": "Price per plot must be a number",
    "number.min": "Price cannot be negative",
    "any.required": "Price per plot is required",
  }),

  location: Joi.object({
    city: Joi.string().trim().required().messages({
      "string.empty": "City is required",
    }),
    state: Joi.string().trim().required().messages({
      "string.empty": "State is required",
    }),
  })
    .required()
    .messages({
      "any.required": "Location is required",
    }),

  features: Joi.array().items(Joi.string().trim()).min(1).messages({
    "array.min": "Please select at least one feature",
  }),

  documents: Joi.array().items(Joi.string().trim()).min(1).messages({
    "array.min": "Please select at least one document",
  }),

  description: Joi.string().trim().allow("", null),
});

module.exports = createEstateValidation;
