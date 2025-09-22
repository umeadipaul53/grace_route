const express = require("express");
const auth = express.Router();
const { userValidationSchema } = require("../validators/userValidator");
const { emailValidationSchema } = require("../validators/emailValidator");
const { validateTokenSchema } = require("../validators/tokenValidator");
const changePasswordSchema = require("../validators/changePasswordSchema");
const { loginValidationSchema } = require("../validators/loginValidator");
const validate = require("../middleware/validate");
const userReg = require("../controller/userController/createUserAccount_controller");
const userAccountVerification = require("../controller/userController/verifyUserAccount_controller");
const resendUserRegistrationToken = require("../controller/userController/resendUserAccountVerification_controller");
const userLogin = require("../controller/userController/userLogin_controller");

const { authRateLimiter } = require("../middleware/security");
const forgotPassword = require("../controller/userController/forgotPassword_controller");
const {
  verifyChangePasswordToken,
  handleChangePassword,
} = require("../controller/userController/changePassword_controller");

auth
  .route("/register")
  .post(authRateLimiter, validate(userValidationSchema), userReg);
auth
  .route("/verify-user-account")
  .get(
    authRateLimiter,
    validate(validateTokenSchema, "query"),
    userAccountVerification
  );
auth
  .route("/resend-account-verification-link")
  .post(
    authRateLimiter,
    validate(emailValidationSchema),
    resendUserRegistrationToken
  );
auth
  .route("/forgot-password")
  .post(authRateLimiter, validate(emailValidationSchema), forgotPassword);
auth
  .route("/change-password")
  .get(
    authRateLimiter,
    validate(validateTokenSchema, "query"),
    verifyChangePasswordToken
  );
auth
  .route("/change-password")
  .put(authRateLimiter, validate(changePasswordSchema), handleChangePassword);
auth
  .route("/login")
  .post(authRateLimiter, validate(loginValidationSchema), userLogin);

module.exports = auth;
