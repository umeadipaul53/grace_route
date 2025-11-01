const newsModel = require("../../model/newsModel/createNews");

const viewAllNews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = "-createdAt" } = req.query;

    const numericLimit = Math.max(Number(limit) || 10, 1);
    const numericPage = Math.max(Number(page) || 1, 1);
    const skip = (numericPage - 1) * numericLimit;

    const [news, totalDocuments] = await Promise.all([
      newsModel.find().sort(sort).skip(skip).limit(numericLimit).lean(),
      newsModel.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalDocuments / numericLimit);

    res.status(200).json({
      status: "success",
      message: news.length > 0 ? "All News" : "No news found",
      count: news.length,
      pagination: {
        currentPage: numericPage,
        totalPages,
        limit: numericLimit,
        totalResults: totalDocuments,
        hasNextPage: numericPage < totalPages,
        hasPrevPage: numericPage > 1,
      },
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = viewAllNews;
