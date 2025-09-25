const Joi = require("joi");

const profileImageValidation = Joi.object({
  userId: Joi.string().required(),
  imageUrl: Joi.string().uri().required(), // must be a valid URL if using cloud storage (e.g., S3, Cloudinary)
  profileImageID: Joi.string()
    .pattern(/^[a-zA-Z0-9_\-\/]+$/) // only allow letters, numbers, underscore, hyphen, slash
    .max(255) // Cloudinary public_id length limit
    .required()
    .messages({
      "string.base": "Profile Image ID must be a string",
      "string.empty": "Profile Image ID is required",
      "string.pattern.base": "Invalid Profile Image ID format",
      "string.max": "Profile Image ID must not exceed 255 characters",
      "any.required": "Profile Image ID is required",
    }),
  fileType: Joi.string()
    .valid("image/jpeg", "image/png", "image/jpg", "image/webp")
    .required(),
  fileSize: Joi.number()
    .max(1 * 1024 * 1024)
    .required(), // max 1MB
});

module.exports = profileImageValidation;
