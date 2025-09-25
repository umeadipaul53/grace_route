const userModel = require("../../model/userModel/user_model");
const AppError = require("../../utils/AppError");

const viewAllUsers = async (req, res, next) => {
  try {
    const users = await userModel.find().select("-password").lean();

    res.status(200).json({
      status: "success",
      message: users.length > 0 ? "All users" : "No users found",
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = viewAllUsers;
