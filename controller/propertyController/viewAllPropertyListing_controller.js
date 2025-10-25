const createPropertyModel = require("../../model/propertyModel/createProperty_model");
const AppError = require("../../utils/AppError");

const viewAllPropertyListing = async (req, res, next) => {
  try {
    const {
      status,
      page = 1,
      limit = 10,
      sort = "-createdAt",
      search,
      minPrice,
      maxPrice,
      city,
      homeType,
      propertyType,
    } = req.query;

    const numericLimit = Number(limit);
    const numericPage = Number(page);
    const skip = (numericPage - 1) * numericLimit;

    const filter = {};

    // Filter by property status
    if (status) filter.status = status;

    // Filter by city (from frontend)
    if (city) filter["location.city"] = { $regex: city, $options: "i" };

    // Filter by home type
    if (homeType) filter.homeType = { $regex: homeType, $options: "i" };

    // Filter by property type
    if (propertyType)
      filter.property_type = { $regex: propertyType, $options: "i" };

    // Keyword search (matches name, description, city, or state)
    if (search) {
      filter.$or = [
        { property_name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "location.city": { $regex: search, $options: "i" } },
        { "location.state": { $regex: search, $options: "i" } },
      ];
    }

    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Fetch properties
    const properties = await createPropertyModel
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(numericLimit)
      .populate("userId", "firstname lastname email phone_number");

    const totalDocuments = await createPropertyModel.countDocuments(filter);
    const totalPages = Math.ceil(totalDocuments / numericLimit);

    if (!properties || properties.length === 0) {
      return res.status(200).json({
        status: status || "all",
        message: "No properties found matching your filters.",
        pagination: {
          currentPage: numericPage,
          totalPages: 0,
          limit: numericLimit,
          totalResults: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
        count: 0,
        data: [],
      });
    }

    res.status(200).json({
      status: status,
      message: "Property listings fetched successfully",
      pagination: {
        currentPage: numericPage,
        totalPages,
        limit: numericLimit,
        totalResults: totalDocuments,
        hasNextPage: numericPage < totalPages,
        hasPrevPage: numericPage > 1,
      },
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = viewAllPropertyListing;
