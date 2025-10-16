const Joi = require("joi");
const { emailRule } = require("./emailValidator");

const emailMessageSchema = Joi.object({
  email: emailRule,

  subject: Joi.string().min(3).max(150).required().messages({
    "string.empty": "Subject is required",
    "string.min": "Subject must be at least 3 characters long",
    "string.max": "Subject cannot exceed 150 characters",
  }),

  message: Joi.string().min(5).required().messages({
    "string.empty": "Message body is required",
    "string.min": "Message must be at least 5 characters long",
  }),
});

const contactEmailSchema = Joi.object({
  email: emailRule,

  subject: Joi.string().min(3).max(150).required().messages({
    "string.empty": "Subject is required",
    "string.min": "Subject must be at least 3 characters long",
    "string.max": "Subject cannot exceed 150 characters",
  }),

  message: Joi.string().min(5).required().messages({
    "string.empty": "Message body is required",
    "string.min": "Message must be at least 5 characters long",
  }),
  name: Joi.string()
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
  phone: Joi.string()
    .pattern(/^\+?[0-9]{7,15}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Phone number must be a valid international number.",
      "string.empty": "Phone number is required.",
    }),
});

module.exports = { emailMessageSchema, contactEmailSchema };
