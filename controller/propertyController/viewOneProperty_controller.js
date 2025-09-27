const mongoose = require("mongoose");
const createPropertyModel = require("../../model/propertyModel/createProperty_model");
const AppError = require("../../utils/AppError");

const viewOnePropertyListing = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid property ID format", 400));
    }

    const property = await createPropertyModel.findById(id);

    if (!property)
      return next(new AppError(`This property does not exist`, 404));

    res.status(200).json({
      status: "success",
      message: `Property Details`,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = viewOnePropertyListing;
