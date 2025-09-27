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
const tourValidationMiddleware = require("../middleware/tour");
const createTourRequest = require("../controller/tourController/createTour_controller");
const viewAllPropertyListing = require("../controller/propertyController/viewAllPropertyListing_controller");
const viewOnePropertyListing = require("../controller/propertyController/viewOneProperty_controller");

auth
  .route("/register")
  .post(authRateLimiter, validate(userValidationSchema), userReg);
auth
  .route("/request-tour")
  .post(tourValidationMiddleware, validate(), createTourRequest);
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
auth.route("/view-property-listing/:id").get(viewOnePropertyListing);
auth.route("/view-all-property-listing").get(viewAllPropertyListing);

module.exports = auth;
