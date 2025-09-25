const AppError = require("../../utils/AppError");
const { sendEmail } = require("../../email/email_services");

const sendSingleEmail = async (req, res, next) => {
  try {
    const { email, subject, message } = req.body;

    // ✅ Validate required fields
    if (!email || !subject || !message) {
      return next(new AppError("Email, subject and message are required", 400));
    }

    const year = new Date().getFullYear();

    // ✅ Send email
    await sendEmail({
      to: email,
      subject,
      templateName: "genericMessage", // 📨 you can reuse or create a general template
      variables: {
        name: "Valued User", // fallback if no real name
        message,
        year,
      },
    });

    res.status(200).json({
      status: "success",
      message: `Email sent successfully to ${email}`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = sendSingleEmail;
