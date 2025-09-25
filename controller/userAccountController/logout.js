const jwt = require("jsonwebtoken");
const {
  authTokenModel,
} = require("../../model/tokenModel/generate_token_model");
const isProduction = process.env.NODE_ENV === "production";
const AppError = require("../../utils/AppError");

const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return next(new AppError("No refresh token", 400));
    }

    try {
      // 1. Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const userId = decoded.id;

      // 2. Delete ALL refresh tokens for this user
      await authTokenModel.deleteMany({ userId });

      // 3. Clear the cookie
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
        path: "/", // ✅ must match what was used when setting the cookie
      });

      return res.json({ message: "Logged out from all devices" });
    } catch (err) {
      console.error("Logout token verify failed:", err.message);

      // Still clear cookie even if token is invalid
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
        path: "/",
      });

      return next(new AppError("Invalid refresh token", 400));
    }
  } catch (err) {
    next(err);
  }
};

module.exports = logout;
