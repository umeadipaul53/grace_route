const express = require("express");
const user = express.Router();

const { upload, validateImageFile } = require("../config/multer");
const UserDetail = require("../controller/userAccountController/user");
const validate = require("../middleware/validate");
const parseJsonFields = require("../middleware/parseJsonFields");
const profileImageValidation = require("../validators/profileImageValidator");
const profileUpdateSchema = require("../validators/profileUpdateValidator");
const {
  propertyValidationSchema,
  propertyUpdateValidationSchema,
} = require("../validators/propertyValidator");
const buyPropertyValidationSchema = require("../validators/buyPropertyValidator");
const favouriteValidation = require("../validators/favouriteValidator");
const authorizeRoles = require("../middleware/role");
const authenticateToken = require("../middleware/auth");
const updateProfile = require("../controller/userAccountController/updateProfile_controller");
const refreshToken = require("../controller/userAccountController/refreshUserToken_controller");
const {
  uploadProfileImage,
  replaceProfileImage,
} = require("../controller/userAccountController/profileImage_controller");
const userProfile = require("../controller/userAccountController/profile_controller");
const logout = require("../controller/userAccountController/logout");
const createProperty = require("../controller/propertyController/createProperty_conroller");
const updateProperty = require("../controller/propertyController/updateProperty_controller");
const buyProperty = require("../controller/propertyController/buyProperty_controller");
const updateGoals = require("../controller/userAccountController/updateGoals_controller");
const tourValidationMiddleware = require("../middleware/tour");
const createTourRequest = require("../controller/tourController/createTour_controller");
const {
  addFavourite,
  removeFavourite,
  getFavourites,
} = require("../controller/favouriteController/favouriteController");

//User Account activities
user
  .route("/request-tour")
  .post(
    authenticateToken,
    authorizeRoles("user"),
    validate(tourValidationMiddleware),
    createTourRequest
  );
user.route("/user").get(authenticateToken, authorizeRoles("user"), UserDetail);
user.route("/refresh-token").post(refreshToken);
user
  .route("/profile-update")
  .patch(
    authenticateToken,
    authorizeRoles("user"),
    validate(profileUpdateSchema),
    updateProfile
  );
user
  .route("/goals-update")
  .patch(
    authenticateToken,
    authorizeRoles("user"),
    validate(profileUpdateSchema),
    updateGoals
  );

user
  .route("/profile-image")
  .post(
    authenticateToken,
    authorizeRoles("user"),
    upload.single("profileImage"),
    validateImageFile,
    validate(profileImageValidation),
    uploadProfileImage
  );
user
  .route("/profile-image")
  .put(
    authenticateToken,
    authorizeRoles("user"),
    upload.single("profileImage"),
    validateImageFile,
    validate(profileImageValidation),
    replaceProfileImage
  );
user
  .route("/profile")
  .get(authenticateToken, authorizeRoles("user"), userProfile);
user
  .route("/upload-property")
  .post(
    authenticateToken,
    authorizeRoles("user", "admin"),
    upload.array("propertyImages"),
    validateImageFile,
    parseJsonFields,
    validate(propertyValidationSchema),
    createProperty
  );
user
  .route("/edit-properties/:id")
  .put(
    authenticateToken,
    authorizeRoles("user", "admin"),
    upload.array("propertyImages"),
    validateImageFile,
    parseJsonFields,
    validate(propertyValidationSchema),
    updateProperty
  );
user
  .route("/edit-properties/:id")
  .patch(
    authenticateToken,
    authorizeRoles("user", "admin"),
    validate(propertyUpdateValidationSchema),
    updateProperty
  );
user
  .route("/edit-properties-with-images/:id")
  .patch(
    authenticateToken,
    authorizeRoles("user", "admin"),
    upload.array("propertyImages"),
    validateImageFile,
    parseJsonFields,
    validate(propertyUpdateValidationSchema),
    updateProperty
  );
user
  .route("/buy-property/:id")
  .post(
    authenticateToken,
    authorizeRoles("user"),
    validate(buyPropertyValidationSchema),
    buyProperty
  );
user
  .route("/add-to-favourite/:id")
  .post(
    authenticateToken,
    authorizeRoles("user"),
    validate(favouriteValidation),
    addFavourite
  );
user
  .route("/remove-from-favourite/:id")
  .delete(
    authenticateToken,
    authorizeRoles("user"),
    validate(favouriteValidation),
    removeFavourite
  );
user
  .route("/get-favourites")
  .get(authenticateToken, authorizeRoles("user"), getFavourites);
user.route("/logout").post(logout);

module.exports = user;
