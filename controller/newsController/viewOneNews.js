const mongoose = require("mongoose");
const newsModel = require("../../model/newsModel/createNews");
const AppError = require("../../utils/AppError");

const viewOneNews = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid property ID format", 400));
    }

    const news = await newsModel.findById(id);

    if (!news) return next(new AppError(`This news does not exist`, 404));

    res.status(200).json({
      status: "success",
      message: `News Details`,
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = viewOneNews;
