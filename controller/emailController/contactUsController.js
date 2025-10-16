const AppError = require("../../utils/AppError");
const { sendEmail } = require("../../email/email_services");

const contactUs = async (req, res, next) => {
  try {
    const { email, name, phone, subject, message } = req.body;

    const year = new Date().getFullYear();

    const companyEmail = "info@gracerouteltd.com";

    // ✅ Validate required fields
    if (!email || !subject || !message || !name || !phone) {
      return next(new AppError("All fields are required", 400));
    }

    const sentMail = await sendEmail({
      to: companyEmail,
      subject,
      templateName: "contact", // must exist as 'templates/contact.mjml'
      variables: {
        subject,
        name,
        phone,
        email,
        message,
        year,
      },
    });

    if (!sentMail) {
      return next(new AppError("Failed to send email", 400));
    }

    return res.status(200).json({
      message: "Email successfully sent",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = contactUs;
