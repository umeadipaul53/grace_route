const sanitize = require("mongo-sanitize");
const crypto = require("crypto");
const AppError = require("../../utils/AppError");
const { generateRegistrationAccessToken } = require("../../middleware/tokens");
const {
  userModel,
  emailValidationSchema,
} = require("../../model/userModel/user_model");
const { sendEmail } = require("../../email/email_services");
const {
  generateTokenModel,
} = require("../../model/tokenModel/generate_token_model");

const resendUserRegistrationToken = async (req, res, next) => {
  try {
    const sanitizedData = sanitize(req.body.email);

    const { error, value } = emailValidationSchema.validate(sanitizedData);

    if (error) return next(new AppError(error.details[0].message, 400));

    const user = await userModel.findOne({ email: value });

    if (!user) return next(new AppError("Email address not found", 400));

    if (user.verified)
      return next(
        new AppError(
          "Your account has been verified already, proceed to login with your details",
          400
        )
      );

    const token = generateRegistrationAccessToken(user);

    const hashed = crypto.createHash("sha256").update(token).digest("hex");

    await generateTokenModel.create({
      tokenId: user._id,
      hash: hashed,
    });

    const verifyURL = `https://grace-route-real-estate-company.onrender.com/verify-user-account?token=${token}`;

    const name = `${user.firstname} ${user.lastname}`;

    const sentMail = await sendEmail({
      to: value,
      subject: "Welcome to Grace Route real estate company",
      templateName: "welcome",
      variables: {
        name,
        verifyURL,
      },
    });

    console.log("Email sent?", sentMail);

    if (!sentMail)
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
