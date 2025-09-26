const buyPropertyModel = require("../../model/propertyModel/buyProperty_model");
const AppError = require("../../utils/AppError");

const viewBuyOrder = async (req, res, next) => {
  try {
    // ✅ Allow dynamic filtering via query ?status=pending or ?status=settled
    const { status } = req.query;
    const filter = status ? { status } : {};

    const orders = await buyPropertyModel
      .find(filter)
      .populate(
        "property_listing",
        "property_name property_type price homeType plotArea location"
      ) // populate specific fields
      .populate("user", "firstname lastname email phone_number"); // populate buyer info

    if (!orders || orders.length === 0) {
      return next(
        new AppError(
          status
            ? `There are no ${status} buy orders at the moment`
            : "There are no buy orders at the moment",
          404
        )
      );
    }

    res.status(200).json({
      status: "success",
      message: status
        ? `All ${status} buy orders at the moment`
        : "All buy orders at the moment",
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = viewBuyOrder;
