const multer = require("multer");
const { fileTypeFromBuffer } = require("file-type");
const sharp = require("sharp");
const AppError = require("../utils/AppError");

// First-level check: filter obvious non-images
const fileFilter = (req, file, cb) => {
  const allowed = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/x-png",
    "image/webp",
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError("Only JPEG, PNG, and WebP files are allowed!", 400), false);
  }
};

// Use memory storage for direct Cloudinary upload
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1 * 1024 * 1024, files: 10 }, // Max: 2MB
});

// Deep validation: check buffer contents
const validateImageFile = async (req, res, next) => {
  try {
    let files = [];

    // Case 1: Single file upload (upload.single)
    if (req.file) {
      files = [req.file];
    }

    // Case 2: Multiple files (upload.array or upload.fields)
    else if (Array.isArray(req.files)) {
      files = req.files;
    }

    // Case 3: upload.fields — req.files is an object with arrays of files
    else if (typeof req.files === "object" && req.files !== null) {
      Object.values(req.files).forEach((fileArray) => {
        files = files.concat(fileArray); // flatten into one array
      });
    }

    if (!files.length) {
      return next(new AppError("No image file(s) uploaded", 400));
    }

    // Optional: Enforce max or min count
    if (files.length > 10) {
      return next(new AppError("You can upload up to 8 images only.", 400));
    }

    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/x-png",
      "image/webp",
    ];

    for (const file of files) {
      const type = await fileTypeFromBuffer(file.buffer);

      if (!type || !allowedMimeTypes.includes(type.mime)) {
        return next(
          new AppError(
            `Invalid or unsupported image type: ${type ? type.mime : "unknown"}`,
            400
          )
        );
      }

      // Ensure image is readable (not corrupted)
      await sharp(file.buffer)
        .metadata()
        .catch(() => {
          throw new AppError("Corrupted or unreadable image file", 400);
        });
    }

    // Everything passed
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { upload, validateImageFile };
