const createPropertyModel = require("../../model/propertyModel/createProperty_model");
const AppError = require("../../utils/AppError");

const viewAllPropertyListing = async (req, res, next) => {
  try {
    const { status = "available" } = req.query;
    const properties = await createPropertyModel.find({ status });

    if (!properties || properties.length === 0)
      return next(
        new AppError(
          `There are no properties with status "${status}" at the moment`,
          404
        )
      );

    res.status(200).json({
      status: "success",
      message: `All properties with status "${status}"`,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = viewAllPropertyListing;
