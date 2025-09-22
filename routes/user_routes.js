const express = require("express");
const user = express.Router();

const UserDetail = require("../controller/userAccountController/user");
const validate = require("../middleware/validate");
const profileUpdateSchema = require("../validators/profileUpdateValidator");
const authorizeRoles = require("../middleware/role");
const authenticateToken = require("../middleware/auth");
const updateProfile = require("../controller/userAccountController/updateProfile_controller");
const refreshToken = require("../controller/userAccountController/refreshUserToken_controller");

//User Account activities
user
  .route("/profile-update")
  .put(
    authenticateToken,
    authorizeRoles("user"),
    validate(profileUpdateSchema),
    updateProfile
  );

user.route("/user").get(authenticateToken, authorizeRoles("user"), UserDetail);
user
  .route("/refresh-token")
  .post(authenticateToken, authorizeRoles("user"), refreshToken);

module.exports = user;
