const tourRequestModel = require("../../model/tourModel/tourRequest_model");
const AppError = require("../../utils/AppError");

const viewAllTourRequest = async (req, res, next) => {
  try {
    const { status } = req.query;

    const tours = await tourRequestModel.find({ status });

    if (!tours || tours.length === 0)
      return next(
        new AppError(`There are no pending tours request at the moment`, 404)
      );

    res.status(200).json({
      status: "success",
      message: `All pending tour requests`,
      count: tours.length,
      data: tours,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = viewAllTourRequest;
