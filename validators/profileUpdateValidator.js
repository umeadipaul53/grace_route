const Joi = require("joi");

const profileUpdateSchema = Joi.object({
  firstname: Joi.string().optional(),
  lastname: Joi.string().optional(),
  phone_number: Joi.string().optional(),

  // ✅ nested optional object for address
  address: Joi.object({
    house_number: Joi.string().optional(),
    street: Joi.string().optional(),
    city: Joi.string().optional(),
    lga: Joi.string().optional(),
    state: Joi.string().optional(),
    country: Joi.string().optional(),
    postalCode: Joi.string().optional(),
  }).optional(),
});

module.exports = profileUpdateSchema;
