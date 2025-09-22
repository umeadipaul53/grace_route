const AppError = require("../utils/AppError");
const sanitize = require("mongo-sanitize");

const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const sanitizedInput = sanitize(req[property]);

    const { error, value } = schema.validate(sanitizedInput, {
      abortEarly: false, // return all errors, not just the first
      stripUnknown: true, // remove unknown fields
      convert: true, // coerce types (e.g., string → number)
    });

    if (error) {
      return next(new AppError("Validation failed", 400, error.details));
    }

    // ✅ replace raw input with validated/cleaned data
    req[property] = value;

    next();
  };
};

module.exports = validate;
