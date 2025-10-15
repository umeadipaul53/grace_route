const mongoose = require("mongoose");
const createPropertyModel = require("../../model/propertyModel/createProperty_model");
const userModel = require("../../model/userModel/user_model");
const buyPropertyModel = require("../../model/propertyModel/buyProperty_model");
const AppError = require("../../utils/AppError");

const buyProperty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid Property ID format", 400));
    }
    // ✅ Create property in MongoDB
    const checkProperty = await createPropertyModel.findById(id);

    if (!checkProperty)
      return next(new AppError("this property does not exist", 404));

    const checkUser = await userModel.findById(userId);

    if (!checkUser)
      return next(new AppError("could not find this user at the moment", 404));

    if (checkProperty.status !== "available")
      return next(
        new AppError("You cant buy this property at the moment", 400)
      );

    const existingOrder = await buyPropertyModel.findOne({
      property: checkProperty._id,
      buyer: checkUser._id,
    });

    if (existingOrder) {
      return next(
        new AppError("You have already placed an order for this property", 400)
      );
    }

    const newPurchase = await buyPropertyModel.create({
      property: checkProperty._id,
      buyer: checkUser._id,
    });

    res.status(201).json({
      status: "success",
      message:
        "Thank you for making a purchasing order on this property, our sales team will contact you shortly.",
      data: newPurchase,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = buyProperty;
