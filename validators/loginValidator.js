const Joi = require("joi");
const passwordRule = require("./passwordRule");
const { emailRule } = require("./emailValidator");

const loginValidationSchema = Joi.object({
  email: emailRule,
  password: passwordRule.required(),
});

module.exports = { loginValidationSchema };
