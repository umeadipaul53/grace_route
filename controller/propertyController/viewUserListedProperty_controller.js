const createPropertyModel = require("../../model/propertyModel/createProperty_model");
const AppError = require("../../utils/AppError");

const viewAllUserListing = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const properties = await createPropertyModel.find({ userId });

    if (!properties || properties.length === 0)
      return next(
        new AppError(`There are no properties by this user at the moment`, 404)
      );

    res.status(200).json({
      status: "success",
      message: `All properties for this user`,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = viewAllUserListing;
