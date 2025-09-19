const sanitize = require("mongo-sanitize");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middleware/tokens");
const {
  userModel,
  userValidationSchema,
} = require("../model/userModel/user_model");
const { sendEmail } = require("../email/email_services");
const generateTokenModel = require("../model/tokenModel/generate_token_model");
const jwt = require("jsonwebtoken");

const userReg = async (req, res) => {
  try {
    const sanitizedData = {
      email: sanitize(req.body.email),
      password: sanitize(req.body.password),
      firstname: sanitize(req.body.firstname),
      lastname: sanitize(req.body.lastname),
      phone_number: sanitize(req.body.phone_number),
      role: sanitize(req.body.role),
    };

    const { error, value } = userValidationSchema.validate(sanitizedData);

    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const existingUser = await userModel.findOne({ email: value.email });

    if (existingUser)
      return res.status(400).json({
        message:
          "E-mail address you entered is already used by another user. Please enter a different E-mail address.",
      });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(value.password, salt);

    const newUser = await userModel.create({
      email: value.email,
      password: hashedPassword,
      firstname: value.firstname,
      lastname: value.lastname,
      phone_number: value.phone_number,
      role: value.role,
    });

    const name = `${firstname} ${lastname}`;
    const token = generateAccessToken(newUser);

    //hash the token generated
    const hashed = crypto.createHash(sha256).update(token).digest("hex");

    //register the token in database to last 7 days
    await generateTokenModel.create({
      tokenId: newUser.id,
      hash: hashed,
    });

    const verifyURL = `https://exam-project-frontend.vercel.app/verify-user-account?token=${token}`;

    const sentMail = await sendEmail({
      to: value.email,
      subject: "Welcome to Grace Route real estate company",
      templateName: "welcome",
      variables: {
        name,
        verifyURL,
      },
    });

    console.log("Email sent?", sentMail);

    if (!sentMail)
      return res
        .status(400)
        .json({ message: "failed to send verification Email" });

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
  } catch (error) {
    res
      .status(403)
      .json({ message: "failed to create account try again later" });
  }
};

module.exports = userReg;
