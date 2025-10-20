const buyPropertyModel = require("../../model/propertyModel/buyProperty_model");
const AppError = require("../../utils/AppError");

const viewUserBuyOrder = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return next(new AppError("Unauthorized access", 401));
    }

    const userId = req.user.id;
    const { status, page = 1, limit = 10, sort = "-createdAt" } = req.query;

    const numericLimit = Math.max(Number(limit) || 10, 1);
    const numericPage = Math.max(Number(page) || 1, 1);
    const skip = (numericPage - 1) * numericLimit;

    const filter = {
      buyer: userId,
      ...(status && { status }),
    };

    const [orders, totalDocuments] = await Promise.all([
      buyPropertyModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(numericLimit)
        .populate(
          "property",
          "property_name property_type price homeType plotArea location images status bedrooms"
        )
        .populate("buyer", "firstname lastname email phone_number"),
      buyPropertyModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalDocuments / numericLimit);

    res.status(200).json({
      status: "success",
      message: orders.length
        ? "Buy orders retrieved successfully"
        : "No buy orders found",
      count: orders.length,
      pagination: {
        currentPage: numericPage,
        totalPages,
        limit: numericLimit,
        totalResults: totalDocuments,
        hasNextPage: numericPage < totalPages,
        hasPrevPage: numericPage > 1,
      },
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = viewUserBuyOrder;
