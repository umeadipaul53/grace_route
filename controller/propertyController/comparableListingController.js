const mongoose = require("mongoose");
const createPropertyModel = require("../../model/propertyModel/createProperty_model");
const AppError = require("../../utils/AppError");

const comparableListing = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid Property ID format", 400));
    }

    const mainProperty = await createPropertyModel.findById(id);
    if (!mainProperty) {
      return next(new AppError("Property not found", 404));
    }

    const { property_type, price, location, homeType, status } = mainProperty;

    const filter = { _id: { $ne: id } };
    const orConditions = [];

    if (location?.city) {
      const city = location.city.trim();
      orConditions.push({
        "location.city": { $regex: city, $options: "i" }, // case-insensitive partial match
      });
    }

    if (location?.state) {
      const state = location.state.trim();
      orConditions.push({
        "location.state": { $regex: state, $options: "i" }, // case-insensitive partial match
      });
    }

    if (property_type)
      orConditions.push({
        property_type: new RegExp(`^${property_type}$`, "i"),
      });

    if (homeType)
      orConditions.push({ homeType: new RegExp(`^${homeType}$`, "i") });

    if (status) orConditions.push({ status: new RegExp(`^${status}$`, "i") });

    if (orConditions.length > 0) {
      filter.$or = orConditions;
    }

    if (price) {
      const lower = price * 0.7;
      const upper = price * 1.3;
      filter.price = { $gte: lower, $lte: upper };
    }

    console.log("🔍 Comparable filter used:", filter);

    let comparableProperties = await createPropertyModel
      .find(filter)
      .sort("-createdAt")
      .limit(6);

    if (!comparableProperties || comparableProperties.length === 0) {
      console.log(
        "⚠️ No comparable found — returning recent properties instead."
      );
      comparableProperties = await createPropertyModel
        .find({ _id: { $ne: id } })
        .sort("-createdAt")
        .limit(6);
    }

    res.status(200).json({
      status: "success",
      message:
        comparableProperties.length > 0
          ? "Comparable or recent properties fetched successfully."
          : "No comparable or recent properties found.",
      count: comparableProperties.length,
      data: comparableProperties,
    });
  } catch (error) {
    console.error("❌ Error in comparableListing:", error);
    next(error);
  }
};

module.exports = comparableListing;
