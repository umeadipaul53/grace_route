const express = require("express");
const user_route = express.Router();
const userReg = require("../controller/userController/createUserAccount_controller");
const userAccountVerification = require("../controller/userController/verifyUserAccount_controller");
const resendUserRegistrationToken = require("../controller/userController/resendUserAccountVerification_controller");

user_route.route("/register").post(userReg);
user_route.route("/verify-user-account").get(userAccountVerification);
user_route
  .route("/resend-account-verification-link")
  .post(resendUserRegistrationToken);

module.exports = user_route;
