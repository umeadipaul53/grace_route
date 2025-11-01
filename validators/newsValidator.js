const Joi = require("joi");

const newsValidationSchema = Joi.object({
  title: Joi.string().trim().max(200).required(),
  source: Joi.string().trim().max(200).required(),
  content: Joi.string().min(20).required(),
});

module.exports = newsValidationSchema;
