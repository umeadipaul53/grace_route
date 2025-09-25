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

module.exports = emailMessageSchema;
