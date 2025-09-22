const express = require("express");
const user_route = express.Router();
const { userValidationSchema } = require("../validators/userValidator");
const { emailValidationSchema } = require("../validators/emailValidator");
const { validateTokenSchema } = require("../validators/tokenValidator");
const changePasswordSchema = require("../validators/changePasswordSchema");
const validate = require("../middleware/validate");
const userReg = require("../controller/userController/createUserAccount_controller");
const userAccountVerification = require("../controller/userController/verifyUserAccount_controller");
const resendUserRegistrationToken = require("../controller/userController/resendUserAccountVerification_controller");
const userLogin = require("../controller/userController/userLogin_controller");
const { authRateLimiter, csrfMiddleware } = require("../middleware/security");
const forgotPassword = require("../controller/userController/forgotPassword_controller");
const {
  verifyChangePasswordToken,
  handleChangePassword,
} = require("../controller/userController/changePassword_controller");

user_route
  .route("/register")
  .post(authRateLimiter, validate(userValidationSchema), userReg);
user_route
  .route("/verify-user-account")
  .get(validate(validateTokenSchema, "query"), userAccountVerification);
user_route
  .route("/resend-account-verification-link")
  .post(validate(emailValidationSchema), resendUserRegistrationToken);
user_route
  .route("/forgot-password")
  .post(validate(emailValidationSchema), forgotPassword);
user_route
  .route("/change-password")
  .get(validate(validateTokenSchema, "query"), verifyChangePasswordToken);
user_route
  .route("/change-password")
  .put(validate(changePasswordSchema), handleChangePassword);
user_route.route("/login").post(authRateLimiter, csrfMiddleware, userLogin);

module.exports = user_route;
