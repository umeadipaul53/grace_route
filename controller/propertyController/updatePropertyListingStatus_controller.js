const mongoose = require("mongoose");
const createPropertyModel = require("../../model/propertyModel/createProperty_model");
const AppError = require("../../utils/AppError");
const userModel = require("../../model/userModel/user_model");
const { sendEmail } = require("../../email/email_services");

const updatePropertyListingStatus = async (req, res, next) => {
  try {
    const year = new Date().getFullYear();
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid property ID format", 400));
    }

    const allowedStatus = ["available", "sold", "pending", "rejected"];
    if (!allowedStatus.includes(status)) {
      return next(new AppError("Invalid status provided", 400));
    }

    const property = await createPropertyModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!property) {
      return next(new AppError("This property does not exist", 404));
    }

    const user = await userModel.findById(property.userId);
    if (!user) {
      return next(new AppError("This user doesn't exist anymore", 404));
    }

    const name = `${user.firstname} ${user.lastname}`;
    const { property_name, property_type } = property;

    let message;
    if (status === "available") {
      message =
        "✅ Congratulations! Your property listing has been successfully approved and is now visible to potential buyers on our platform.";
    } else if (status === "rejected") {
      message =
        "❌ Unfortunately, your property listing has been rejected due to insufficient analysis on the property posted. Please review your submission and make the necessary adjustments before resubmitting.";
    }

    if (message) {
      try {
        await sendEmail({
          to: user.email,
          subject: "Property Listing Update",
          templateName: "sellProperty",
          variables: { name, message, property_name, property_type, year },
        });
      } catch (emailError) {
        console.error("Failed to send email:", emailError.message);
        // don't stop the process — still update property status
      }
    }

    res.status(200).json({
      status: "success",
      message: `Property status updated to ${status}`,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = updatePropertyListingStatus;
