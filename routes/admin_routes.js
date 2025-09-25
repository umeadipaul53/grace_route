const express = require("express");
const admin_routes = express.Router();

const { upload, validateImageFile } = require("../config/multer");
const validate = require("../middleware/validate");
const parseJsonFields = require("../middleware/parseJsonFields");
const {
  propertyValidationSchema,
  propertyUpdateValidationSchema,
} = require("../validators/propertyValidator");
const emailMessageSchema = require("../validators/emailMessageValidator");
const authorizeRoles = require("../middleware/role");
const authenticateToken = require("../middleware/auth");
const logout = require("../controller/userAccountController/logout");
const createProperty = require("../controller/propertyController/createProperty_conroller");
const updateProperty = require("../controller/propertyController/updateProperty_controller");
const sendSingleEmail = require("../controller/emailController/sendSingleEmail_controller");

//Admin Account activities
admin_routes
  .route("/send-email")
  .post(
    authenticateToken,
    authorizeRoles("admin"),
    validate(emailMessageSchema),
    sendSingleEmail
  );

admin_routes.route("/logout").post(logout);

module.exports = admin_routes;
