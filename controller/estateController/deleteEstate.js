const mongoose = require("mongoose");
const estateModel = require("../../model/estateModel/createEstate_model");
const AppError = require("../../utils/AppError");

const deleteEstate = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid estate ID format", 400));
    }
    // ✅ Delete in one step
    const estateItem = await estateModel.findByIdAndDelete(id);

    if (!estateItem) {
      return next(new AppError("This estate does not exist", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Estate deleted successfully",
      data: estateItem, // returning deleted estate for confirmation
    });
  } catch (error) {
    next(error);
  }
};

module.exports = deleteEstate;
