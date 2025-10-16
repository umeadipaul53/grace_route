const express = require("express");
const admin_routes = express.Router();

const { upload, validateImageFile } = require("../config/multer");
const validate = require("../middleware/validate");
const parseJsonFields = require("../middleware/parseJsonFields");
const {
  propertyValidationSchema,
  propertyUpdateValidationSchema,
} = require("../validators/propertyValidator");
const { emailMessageSchema } = require("../validators/emailMessageValidator");
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
const updatePropertyListingStatus = require("../controller/propertyController/updatePropertyListingStatus_controller");
const viewAllUsers = require("../controller/userAccountController/viewAllUsers_controller");
const viewOneUser = require("../controller/userAccountController/viewOneUser_controller");
const deleteUser = require("../controller/userAccountController/deleteUserAccount_controller");
const deletePropertyListing = require("../controller/propertyController/deleteProperty_controller");
const viewAllPropertyListing = require("../controller/propertyController/viewAllPropertyListing_controller");
const viewOnePropertyListing = require("../controller/propertyController/viewOneProperty_controller");

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
  .route("/view-user/:id")
  .get(authenticateToken, authorizeRoles("admin"), viewOneUser);
admin_routes
  .route("/delete-user-account/:id")
  .delete(authenticateToken, authorizeRoles("admin"), deleteUser);
admin_routes
  .route("/view-all-users")
  .get(authenticateToken, authorizeRoles("admin"), viewAllUsers);
admin_routes
  .route("/view-buy-order")
  .get(authenticateToken, authorizeRoles("admin"), viewBuyOrder); // buy orders that are pending or settled can be fetched
admin_routes
  .route("/settle-tour-request/:id")
  .patch(authenticateToken, authorizeRoles("admin"), settleTourRequest);
admin_routes
  .route("/view-all-tour-request")
  .get(authenticateToken, authorizeRoles("admin"), viewAllTourRequest);
admin_routes
  .route("/upload-property")
  .post(
    authenticateToken,
    authorizeRoles("admin"),
    upload.array("propertyImages"),
    validateImageFile,
    parseJsonFields,
    validate(propertyValidationSchema),
    createProperty
  );
admin_routes
  .route("/edit-properties/:id")
  .put(
    authenticateToken,
    authorizeRoles("admin"),
    upload.array("propertyImages"),
    validateImageFile,
    parseJsonFields,
    validate(propertyValidationSchema),
    updateProperty
  );
admin_routes
  .route("/edit-properties/:id")
  .patch(
    authenticateToken,
    authorizeRoles("admin"),
    validate(propertyUpdateValidationSchema),
    updateProperty
  );
admin_routes
  .route("/edit-properties-with-images/:id")
  .patch(
    authenticateToken,
    authorizeRoles("admin"),
    upload.array("propertyImages"),
    validateImageFile,
    parseJsonFields,
    validate(propertyUpdateValidationSchema),
    updateProperty
  );
admin_routes
  .route("/update-property-listing/:id")
  .patch(
    authenticateToken,
    authorizeRoles("admin"),
    updatePropertyListingStatus
  );
admin_routes
  .route("/delete-property-listing/:id")
  .delete(authenticateToken, authorizeRoles("admin"), deletePropertyListing);
admin_routes
  .route("/view-property-listing/:id")
  .get(authenticateToken, authorizeRoles("admin"), viewOnePropertyListing);
admin_routes
  .route("/view-all-property-listing")
  .get(authenticateToken, authorizeRoles("admin"), viewAllPropertyListing);

admin_routes.route("/logout").post(logout);

module.exports = admin_routes;
