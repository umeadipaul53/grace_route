const Joi = require("joi");
const passwordRule = require("./passwordRule");

const passwordValidationSchema = Joi.object({
  newPassword: passwordRule.required(),

  confirmPass: Joi.string().valid(Joi.ref("newPassword")).required().messages({
    "any.only": "Confirm password must match new password",
    "string.empty": "Confirm password is required",
  }),
});

const changeAdminPasswordSchema = Joi.object({
  newPassword: passwordRule.required(),
  oldPassword: passwordRule.required(),
});

module.exports = { passwordValidationSchema, changeAdminPasswordSchema };
