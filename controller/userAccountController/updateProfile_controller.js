const userModel = require("../../model/userModel/user_model");
const AppError = require("../../utils/AppError");

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id; //authenticateToken middleware attaches user
    const updates = req.body;

    const user = await userModel.findById(userId);
    if (!user) return next(new AppError("User not found", 404));

    if (updates.address) {
      user.address = { ...(user.address || {}), ...updates.address };
      delete updates.address;
    }

    //update other fields
    Object.assign(user, updates);

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = updateProfile;
