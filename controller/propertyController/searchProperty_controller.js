const createPropertyModel = require("../../model/propertyModel/createProperty_model");
const AppError = require("../../utils/AppError");

const searchProperty = async (req, res, next) => {
  try {
    const {
      q,
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
    } = req.query;

    if (!q) {
      return next(new AppError("Please provide a search term", 400));
    }

    // Case-insensitive partial match
    const regex = new RegExp(q, "i");

    // Search query
    const query = {
      $or: [
        { property_name: { $regex: regex } },
        { description: { $regex: regex } },
        { property_type: { $regex: regex } },
        { homeType: { $regex: regex } },
        { "location.city": { $regex: regex } },
        { "location.state": { $regex: regex } },
        { "location.postalCode": { $regex: regex } },
      ],
    };

    // Pagination setup
    const skip = (page - 1) * limit;

    // Sorting setup
    const sortOption = { [sort]: order === "asc" ? 1 : -1 };

    // Fetch properties
    const properties = await createPropertyModel
      .find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    // Count total matches
    const total = await createPropertyModel.countDocuments(query);

    if (!properties.length) {
      return next(new AppError(`No properties found matching "${q}"`, 404));
    }

    res.status(200).json({
      status: "success",
      message: `Found ${properties.length} properties matching "${q}"`,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      sortBy: sort,
      order,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = searchProperty;
