const bcrypt = require("bcrypt");
const crypto = require("crypto");
const AppError = require("../../utils/AppError");
const { generateAccessToken } = require("../../middleware/tokens");
const userModel = require("../../model/userModel/user_model");
const { sendEmail } = require("../../email/email_services");
const {
  registerTokenModel,
} = require("../../model/tokenModel/generate_token_model");

const userReg = async (req, res, next) => {
  try {
    const year = new Date().getFullYear();
    const { email, password, firstname, lastname, phone_number, role } =
      req.body;

    const existingUser = await userModel.findOne({ email });

    if (existingUser)
      return next(
        new AppError(
          "E-mail address you entered is already used by another user. Please enter a different E-mail address.",
          409
        )
      );

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      email,
      password: hashedPassword,
      firstname,
      lastname,
      phone_number,
      role,
    });

    const name = `${newUser.firstname} ${newUser.lastname}`;
    const token = generateAccessToken(newUser);

    //hash the token generated
    const hashed = crypto.createHash("sha256").update(token).digest("hex");

    //register the token in database to last 7 days
    const tokenUpload = await registerTokenModel.create({
      tokenId: newUser._id,
      hash: hashed,
    });

    if (!tokenUpload) return next(new AppError("Token did not register", 400));

    const verifyURL = `https://grace-route-real-estate-company.onrender.com/verify-user-account?token=${token}`;

    const sentMail = await sendEmail({
      to: newUser.email,
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
      message:
        "Account created, kindly click on the link in your email to verify your account",
      data: {
        email: newUser.email,
        name: name,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        phone_number: newUser.phone_number,
        role: newUser.role,
        link: verifyURL,
        token: token,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = userReg;
