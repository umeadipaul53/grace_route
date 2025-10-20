const createPropertyModel = require("../../model/propertyModel/createProperty_model");
const AppError = require("../../utils/AppError");

const viewAllUserListing = async (req, res, next) => {
  try {
    // ✅ Ensure user is authenticated
    if (!req.user || !req.user.id) {
      return next(new AppError("Unauthorized access", 401));
    }

    const userId = req.user.id;
    const { status, page = 1, limit = 10, sort = "-createdAt" } = req.query;

    const numericLimit = Math.max(Number(limit) || 10, 1);
    const numericPage = Math.max(Number(page) || 1, 1);
    const skip = (numericPage - 1) * numericLimit;

    // ✅ Build filter dynamically
    const filter = { userId };
    if (status) filter.status = status;

    // ✅ Fetch properties & total count concurrently
    const [properties, totalDocuments] = await Promise.all([
      createPropertyModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(numericLimit),
      createPropertyModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalDocuments / numericLimit);

    // ✅ Return a graceful response if empty
    if (!properties.length) {
      return res.status(200).json({
        status: "success",
        message: "No property listings found for this user",
        count: 0,
        pagination: {
          currentPage: numericPage,
          totalPages,
          limit: numericLimit,
          totalResults: 0,
          hasNextPage: false,
          hasPrevPage: numericPage > 1,
        },
        data: [],
      });
    }

    // ✅ Successful response
    res.status(200).json({
      status: "success",
      message: "Property listings retrieved successfully",
      count: properties.length,
      pagination: {
        currentPage: numericPage,
        totalPages,
        limit: numericLimit,
        totalResults: totalDocuments,
        hasNextPage: numericPage < totalPages,
        hasPrevPage: numericPage > 1,
      },
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = viewAllUserListing;
