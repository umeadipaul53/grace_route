const crypto = require("crypto");
const AppError = require("../../utils/AppError");
const userModel = require("../../model/userModel/user_model");
const { generateAccessToken } = require("../../middleware/tokens");
const {
  registerTokenModel,
} = require("../../model/tokenModel/generate_token_model");
const { sendEmail } = require("../../email/email_services");

const forgotPassword = async (req, res, next) => {
  try {
    const year = new Date().getFullYear();
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) return next(new AppError("Email does not exist", 400));

    const token = generateAccessToken(user);
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    await registerTokenModel.create({
      tokenId: user._id,
      hash: hashedToken,
    });

    const name = `${user.firstname} ${user.lastname}`;
    const resetURL = `https://gracerouteltd.com/change-password?token=${token}`;

    const sentMail = await sendEmail({
      to: user.email,
      subject: "Password Reset",
      templateName: "forgotpassword", // must exist as 'templates/welcome.mjml'
      variables: {
        name,
        resetURL,
        year,
      },
    });

    // Optional: handle success/failure
    if (!sentMail) {
      console.error("❌ Failed to send verification email.");
      return next(new AppError("Failed to send verification email", 400));
    }

    console.log("✅ Verification email sent successfully to:", user.email);

    return res.status(200).json({
      message: "Password reset confirmation email was sent to your email",
      data: {
        email: user.email,
        link: verifyURL,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = forgotPassword;
