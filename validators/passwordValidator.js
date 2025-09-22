const Joi = require("joi");

const passwordValidationSchema = Joi.object({
  newPassword: Joi.string()
    .min(6)
    .pattern(
      /^(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one symbol, letters, and numbers",
      "string.empty": "New password is required",
      "string.min": "New password must be at least 6 characters long",
    }),

  confirmPass: Joi.string().valid(Joi.ref("newPassword")).required().messages({
    "any.only": "Confirm password must match new password",
    "string.empty": "Confirm password is required",
  }),
});

module.exports = { passwordValidationSchema };
