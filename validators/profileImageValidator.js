const Joi = require("joi");

const profileImageValidation = Joi.object({
  userId: Joi.string().required(),
  imageUrl: Joi.string().uri().required(), // must be a valid URL if using cloud storage (e.g., S3, Cloudinary)
  fileType: Joi.string()
    .valid("image/jpeg", "image/png", "image/jpg")
    .required(),
  fileSize: Joi.number()
    .max(1 * 1024 * 1024)
    .required(), // max 2MB
});

module.exports = profileImageValidation;
