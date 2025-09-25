const AppError = require("../utils/AppError");

// middleware/parseJsonFields.js
const parseJsonFields = (req, res, next) => {
  const fieldAccumulator = {};

  for (const key in req.body) {
    let value = req.body[key];
    console.log(`➡️ Incoming [${key}] =`, value);

    // Case 1: multiple same keys → already array
    if (Array.isArray(value)) {
      fieldAccumulator[key] = value;
      continue;
    }

    // Case 2: JSON string
    if (typeof value === "string") {
      const trimmed = value.trim();

      if (
        (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
        (trimmed.startsWith("[") && trimmed.endsWith("]"))
      ) {
        try {
          value = JSON.parse(trimmed);
          console.log(`✅ Parsed [${key}] =`, value);
        } catch (err) {
          return next(new AppError(`Invalid JSON in field "${key}"`, 400));
        }
      }
    }

    fieldAccumulator[key] = value;
  }

  req.body = fieldAccumulator;
  next();
};

module.exports = parseJsonFields;
