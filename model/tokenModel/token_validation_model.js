const mongoose = require("mongoose");
const joi = require("joi");

const validateRegistrationTokenSchema = joi.string().required();

module.exports = validateRegistrationTokenSchema;
