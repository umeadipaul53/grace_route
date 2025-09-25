const Joi = require("joi");

const basePropertySchema = Joi.object({
  property_name: Joi.string().trim().required(),
  property_type: Joi.string()
    .valid("Land", "Commercial", "Residential")
    .required(),
  price: Joi.number().min(0).required(),
  homeType: Joi.string().valid(
    "Duplex",
    "Bungalow",
    "Detached Duplex",
    "Semi-detached Duplex",
    "Terraced Duplex",
    "Block of Flats",
    "Mini Flat",
    "Self-contained"
  ),
  bedrooms: Joi.string()
    .pattern(/^[0-9]+\s*Bed(room)?s?$/i) // e.g. "2 Bedroom", "3 Bed room"
    .required(),
  description: Joi.string().min(20).required(),
  // We let multer/cloudinary handle actual file upload
  // So just check that it's at least provided (array of files)
  images: Joi.any().optional(),
  location: Joi.object({
    city: Joi.string().required(),
    state: Joi.string().required(),
    postalCode: Joi.string().required(),
  }).required(),
  plotArea: Joi.string().required(), // changed from string → number
  unitsNumber: Joi.number().min(0).required(),
  // status will be enforced in Mongoose pre-save hook
  // so frontend can’t override role-based behavior
  status: Joi.string().valid("available", "sold", "pending", "rejected"),
  otherInfo: Joi.string().allow("", null),
  // ❌ don’t require userId from frontend
  userId: Joi.any().optional(),
  imagesToDelete: Joi.array().items(Joi.string()).optional(),
});

// For PATCH → everything optional
const partialPropertySchema = basePropertySchema.fork(
  Object.keys(basePropertySchema.describe().keys),
  (field) => field.optional()
);

module.exports = {
  propertyValidationSchema: basePropertySchema,
  propertyUpdateValidationSchema: partialPropertySchema,
};
