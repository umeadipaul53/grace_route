const Joi = require("joi");

const emailRule = Joi.string()
  .email({ tlds: { allow: false } }) // disable strict TLD checking
  .required()
  .messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
  });

const emailValidationSchema = Joi.object({
  email: emailRule,
});

module.exports = { emailValidationSchema, emailRule };
