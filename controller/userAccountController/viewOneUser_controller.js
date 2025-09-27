const mongoose = require("mongoose");
const userModel = require("../../model/userModel/user_model");
const AppError = require("../../utils/AppError");

const viewOneUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid user ID format", 400));
    }

    const user = await userModel.findById(id).select("-password").lean();

    res.status(200).json({
      status: "success",
      message: user ? "User found" : "User not found",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = viewOneUser;
