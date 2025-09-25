const userModel = require("../../model/userModel/user_model");
const AppError = require("../../utils/AppError");

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // ✅ Delete in one step
    const user = await userModel.findByIdAndDelete(id);
    if (!user) {
      return next(new AppError("This user does not exist", 404));
    }

    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
      data: user, // returning deleted user for confirmation
    });
  } catch (error) {
    next(error);
  }
};

module.exports = deleteUser;
