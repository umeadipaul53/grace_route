const Joi = require("joi");

const emailValidationSchema = Joi.object({
  email: Joi.string().email().required(),
});

module.exports = { emailValidationSchema };
