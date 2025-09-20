const { userModel } = require("../../model/userModel/user_model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const validateRegistrationTokenSchema = require("../../model/tokenModel/token_validation_model");
const sanitize = require("mongo-sanitize");
const AppError = require("../../utils/AppError");
const {
  generateTokenModel,
} = require("../../model/tokenModel/generate_token_model");
const { generateAccessToken } = require("../../middleware/tokens");

const userAccountVerification = async (req, res, next) => {
  try {
    const token = req.query.token;
    const sanitizedData = sanitize(token);

    const { error, value } =
      validateRegistrationTokenSchema.validate(sanitizedData);

    if (error) return next(new AppError(error.details[0].message, 400));

    const useToken = value;

    //hash the token
    const hashed = crypto.createHash("sha256").update(useToken).digest("hex");

    //check if hashed token matches token in DB
    const checkRecord = await generateTokenModel.findOne({ hash: hashed });

    if (!checkRecord) return next(new AppError("Invalid token", 400));

    //verify the token with JWT
    let decodeToken;

    try {
      decodeToken = jwt.verify(useToken, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return next(new AppError("Token expired", 400));
      }

      if (err.name === "JsonWebTokenError") {
        return next(new AppError("Invalid token", 400));
      }

      return next(err);
    }

    //update the field verified once the token has been verified

    await userModel.updateOne(
      {
        _id: decodeToken.id,
      },
      { verified: true }
    );

    //delete the token once its verified and user account has been verified
    await generateTokenModel.deleteMany({
      tokenId: decodeToken.id,
    });

    const newAccount = await userModel.findOne({ _id: decodeToken.id });

    const accessToken = generateAccessToken(newAccount);

    res.status(200).json({
      message:
        "Your account has been verified, you can now login with your login details",
      newToken: accessToken,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = userAccountVerification;
