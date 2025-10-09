const crypto = require("crypto");
const AppError = require("../../utils/AppError");
const { generateAccessToken } = require("../../middleware/tokens");
const userModel = require("../../model/userModel/user_model");
const { sendEmail } = require("../../email/email_services");
const {
  registerTokenModel,
} = require("../../model/tokenModel/generate_token_model");

const resendUserRegistrationToken = async (req, res, next) => {
  try {
    const year = new Date().getFullYear();
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) return next(new AppError("Email address not found", 400));

    if (user.verified)
      return next(
        new AppError(
          "Your account has been verified already, proceed to login with your details",
          400
        )
      );

    const token = generateAccessToken(user);

    const hashed = crypto.createHash("sha256").update(token).digest("hex");

    await registerTokenModel.create({
      tokenId: user._id,
      hash: hashed,
    });

    const verifyURL = `https://gracerouteltd.com/verify-user-account?token=${token}`;

    const name = `${user.firstname} ${user.lastname}`;

    const sentMail = await sendEmail({
      to: user.email,
      subject: "Welcome to Grace Route real estate company",
      templateName: "welcome",
      variables: {
        name,
        verifyURL,
        year,
      },
    });

    console.log("Email sent?", sentMail);

    if (!sentMail || sentMail.rejected.length > 0)
      return next(new AppError("failed to send verification Email", 400));

    return res.status(200).json({
      message: "Account verification email resent",
      data: token,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = resendUserRegistrationToken;
