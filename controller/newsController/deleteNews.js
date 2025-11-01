const mongoose = require("mongoose");
const newsModel = require("../../model/newsModel/createNews");
const AppError = require("../../utils/AppError");

const deleteNews = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid news ID format", 400));
    }
    // ✅ Delete in one step
    const newsItem = await newsModel.findByIdAndDelete(id);
    if (!newsItem) {
      return next(new AppError("This news does not exist", 404));
    }

    res.status(200).json({
      status: "success",
      message: "News deleted successfully",
      data: newsItem, // returning deleted news for confirmation
    });
  } catch (error) {
    next(error);
  }
};

module.exports = deleteNews;
