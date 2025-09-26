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
const updateBuyOrderStatus = require("../controller/propertyController/settleBuyOrder_controller");
const viewBuyOrder = require("../controller/propertyController/viewBuyOrder_controller");
const settleTourRequest = require("../controller/tourController/settleTour_controller");
const viewAllTourRequest = require("../controller/tourController/viewTourRequest_controller");

//Admin Account activities
admin_routes
  .route("/send-email")
  .post(
    authenticateToken,
    authorizeRoles("admin"),
    validate(emailMessageSchema),
    sendSingleEmail
  );
admin_routes
  .route("/settle-buy-order/:orderId")
  .post(authenticateToken, authorizeRoles("admin"), updateBuyOrderStatus);
admin_routes
  .route("/view-buy-order")
  .get(authenticateToken, authorizeRoles("admin"), viewBuyOrder); // buy orders that are pending or settled can be fetched
admin_routes
  .route("/settle-tour-request/:id")
  .patch(authenticateToken, authorizeRoles("admin"), settleTourRequest);
admin_routes
  .route("/view-all-tour-request")
  .get(authenticateToken, authorizeRoles("admin"), viewAllTourRequest);
admin_routes.route("/logout").post(logout);

module.exports = admin_routes;
