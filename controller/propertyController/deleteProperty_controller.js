const createPropertyModel = require("../../model/propertyModel/createProperty_model");
const AppError = require("../../utils/AppError");
const deleteCloudinaryImages = require("../../utils/deletePropertyImages");

const deletePropertyListing = async (req, res, next) => {
  try {
    const { id } = req.query;

    // ✅ Find property
    const property = await createPropertyModel.findById(id);
    if (!property) {
      return next(new AppError("This property does not exist", 404));
    }

    // ✅ Delete property images from Cloudinary
    await deleteCloudinaryImages(property.images);

    // ✅ Delete property document
    const deleted = await createPropertyModel.deleteOne({ _id: id });
    if (deleted.deletedCount === 0) {
      return next(new AppError("Could not delete this property", 400));
    }

    res.status(200).json({
      status: "success",
      message: "Property deleted successfully",
      data: property, // returning deleted property for confirmation
    });
  } catch (error) {
    next(error);
  }
};

module.exports = deletePropertyListing;
