const estateModel = require("../../model/estateModel/createEstate_model");

const viewAllEstates = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = "-createdAt" } = req.query;

    const numericLimit = Math.max(Number(limit) || 10, 1);
    const numericPage = Math.max(Number(page) || 1, 1);
    const skip = (numericPage - 1) * numericLimit;

    const [estates, totalDocuments] = await Promise.all([
      estateModel.find().sort(sort).skip(skip).limit(numericLimit).lean(),
      estateModel.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalDocuments / numericLimit);

    res.status(200).json({
      status: "success",
      message: estates.length > 0 ? "All estates" : "No estates found",
      count: estates.length,
      pagination: {
        currentPage: numericPage,
        totalPages,
        limit: numericLimit,
        totalResults: totalDocuments,
        hasNextPage: numericPage < totalPages,
        hasPrevPage: numericPage > 1,
      },
      data: estates,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = viewAllEstates;
