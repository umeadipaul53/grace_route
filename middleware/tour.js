const {
  guestTourRequestSchema,
  userTourRequestSchema,
} = require("../validators/tourValidator");

const tourValidationMiddleware = (req, res, next) => {
  req.validationSchema = req.user
    ? userTourRequestSchema
    : guestTourRequestSchema;
  next();
};

module.exports = tourValidationMiddleware;
