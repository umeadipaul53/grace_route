const userModel = require("../../model/userModel/user_model");
const AppError = require("../../utils/AppError");

const User = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const user = await userModel
      .findById(user_id)
      .select("id email firstname lastname phone_number role");

    if (!user) return next(new AppError("user not found", 404));

    res.json({
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      phone_number: user.phone_number,
      role: user.role,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = User;
