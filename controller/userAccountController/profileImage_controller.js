const profileImage = require("../../model/userModel/profileImage_model");
const AppError = require("../../utils/AppError");
const cloudinary = require("../../config/cloudinary");

// Upload to Cloudinary using buffer
const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "profile_images" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

const uploadProfileImage = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    if (!req.file) return next(new AppError("No image uploaded", 400));

    const cloudImage = await streamUpload(req.file.buffer);

    const newImage = await profileImage.create({
      userId: user_id,
      imageUrl: cloudImage.secure_url,
      profileImageID: cloudImage.public_id,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
    });

    res.status(200).json({
      message: "uploaded profile image successfully",
      data: newImage,
    });
  } catch (err) {
    next(err);
  }
};

const replaceProfileImage = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    if (!req.file) {
      return next(new AppError("No new image uploaded", 400));
    }

    // Step 1: Find existing profile image
    const existingImage = await profileImage.findOne({ userId: user_id });
    if (!existingImage) {
      return next(new AppError("No profile image found for this user", 404));
    }

    // Step 2: Delete old image from Cloudinary
    await cloudinary.uploader.destroy(existingImage.profileImageID);

    // Step 3: Upload new image
    const cloudImage = await streamUpload(req.file.buffer);

    // Step 4: Update DB record
    existingImage.imageUrl = cloudImage.secure_url;
    existingImage.profileImageID = cloudImage.public_id;
    existingImage.fileType = req.file.mimetype;
    existingImage.fileSize = req.file.size;
    await existingImage.save();

    res.status(200).json({
      message: "Profile image replaced successfully",
      data: existingImage,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadProfileImage, replaceProfileImage };
