const { validateTokenSchema } = require("./tokenValidator");
const { passwordValidationSchema } = require("./passwordValidator");

const changePasswordSchema = validateTokenSchema.concat(
  passwordValidationSchema
);

module.exports = changePasswordSchema;
