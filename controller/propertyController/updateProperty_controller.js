const createPropertyModel = require("../../model/propertyModel/createProperty_model");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const AppError = require("../../utils/AppError");
const deleteCloudinaryImages = require("../../utils/deletePropertyImages");

const updateProperty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userRole = req.user?.role;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid property ID format", 400));
    }

    // ✅ Ensure we have request body
    const updateData = { ...req.body };
    console.log("📝 Parsed Body =>", updateData);

    // ✅ Convert numerical fields
    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.unitsNumber)
      updateData.unitsNumber = Number(updateData.unitsNumber);

    // ✅ Parse location JSON if still a string
    if (updateData.location && typeof updateData.location === "string") {
      try {
        updateData.location = JSON.parse(updateData.location);
      } catch (err) {
        return next(new AppError("Invalid JSON in location field", 400));
      }
    }

    // ✅ Find the property
    const property = await createPropertyModel.findById(id);
    if (!property) {
      return next(new AppError("Property not found", 404));
    }

    // 🔐 Restrict editing if status is "available" and user is not admin
    if (property.status === "available" && userRole === "user") {
      return next(
        new AppError(
          "You no longer have permission to edit this property. Contact admin.",
          403
        )
      );
    }

    // ✅ Start with existing images
    let newImages = [...property.images];
    let imagesToDelete = updateData.imagesToDelete;
    console.log(imagesToDelete);

    // 🔹 Parse if string
    if (typeof imagesToDelete === "string") {
      try {
        imagesToDelete = JSON.parse(imagesToDelete);
      } catch (err) {
        return next(new AppError("Invalid JSON in imagesToDelete", 400));
      }
    }

    // 🔹 Ensure it's always an array
    if (!Array.isArray(imagesToDelete)) {
      imagesToDelete = [];
    }

    if (imagesToDelete.length > 0) {
      console.log("🗑️ Deleting images:", imagesToDelete);

      // Build list of images from property that match public_ids in imagesToDelete
      const imagesForDeletion = property.images.filter((img) =>
        imagesToDelete.includes(img.public_id)
      );

      //delete from cloudinary
      await deleteCloudinaryImages(imagesForDeletion);

      //remove from DB array
      newImages = newImages.filter(
        (img) => !imagesToDelete.includes(img.public_id)
      );
    }

    // ✅ Handle new image uploads
    if (req.files?.length > 0) {
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "properties_images" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });

        newImages.push({
          public_id: result.public_id,
          url: result.secure_url,
          fileType: file.mimetype,
          fileSize: file.size,
        });
      }
    }

    // ❌ Ensure at least one image remains
    if (newImages.length === 0) {
      return next(
        new AppError("You must have at least one image for this property.", 400)
      );
    }

    // ✅ Update fields dynamically
    for (const key of Object.keys(updateData)) {
      if (key === "imagesToDelete") continue; // Skip deletion helper field
      property[key] = updateData[key];

      // 🔑 Ensure nested objects are marked as modified
      if (
        typeof updateData[key] === "object" &&
        updateData[key] !== null &&
        !Array.isArray(updateData[key])
      ) {
        property.markModified(key);
      }
    }

    // ✅ Save updated images
    property.images = newImages;

    // ✅ Save to DB
    const updatedProperty = await property.save();

    res.status(200).json({
      status: "success",
      message: "Property updated successfully",
      data: updatedProperty,
    });
  } catch (err) {
    console.error("Update Error =>", err);
    next(err);
  }
};

module.exports = updateProperty;
