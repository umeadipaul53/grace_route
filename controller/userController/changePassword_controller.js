const userModel = require("../../model/userModel/user_model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const AppError = require("../../utils/AppError");
const {
  registerTokenModel,
} = require("../../model/tokenModel/generate_token_model");

const verifyChangePasswordToken = async (req, res, next) => {
  try {
    const { token } = req.query;

    let verifyToken;

    try {
      verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return next(new AppError("Token Expired", 403));
      }

      if (err.name === "jsonWebTokenError") {
        next(new AppError("Invalid Token", 403));
      }

      return next(err);
    }

    res.status(200).json({ message: "Token valid" });
  } catch (err) {
    next(err);
  }
};

const handleChangePassword = async (req, res, next) => {
  try {
    const { token, newPassword, confirmPass } = req.body;

    let verifyToken;
    try {
      verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return next(err);
    }

    if (newPassword !== confirmPass)
      return next(new AppError("Password does not match", 400));

    const user = await userModel.findById(verifyToken.id);

    if (!user) return next(new AppError("User account not found", 403));

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(newPassword, salt);

    user.password = hashedPass;
    await user.save();

    await registerTokenModel.deleteMany({
      tokenId: verifyToken.id,
    });

    res.status(200).json({
      message:
        "Password updated successfully, you can now login with your new password",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { verifyChangePasswordToken, handleChangePassword };
