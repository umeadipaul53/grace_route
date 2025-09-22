const Joi = require("joi");

const userValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
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
  firstname: Joi.string()
    .pattern(/^[a-zA-Z ]+$/)
    .required()
    .min(3)
    .max(50)
    .messages({
      "string.pattern.base": "Full name must only contain letters and spaces.",
      "string.empty": "Full name is required.",
      "string.min": "Full name must be at least 3 characters long.",
      "string.max": "Full name must be less than or equal to 50 characters.",
    }),
  lastname: Joi.string()
    .pattern(/^[a-zA-Z ]+$/)
    .required()
    .min(3)
    .max(50)
    .messages({
      "string.pattern.base": "Full name must only contain letters and spaces.",
      "string.empty": "Full name is required.",
      "string.min": "Full name must be at least 3 characters long.",
      "string.max": "Full name must be less than or equal to 50 characters.",
    }),
  phone_number: Joi.string()
    .pattern(/^\+?[0-9]{7,15}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Phone number must be a valid international number.",
      "string.empty": "Phone number is required.",
    }),
  role: Joi.string().valid("user").default("user"),
});

module.exports = { userValidationSchema };
