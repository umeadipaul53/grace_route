const mongoose = require("mongoose");
const buyPropertyModel = require("../../model/propertyModel/buyProperty_model");
const createPropertyModel = require("../../model/propertyModel/createProperty_model");
const AppError = require("../../utils/AppError");

const updateBuyOrderStatus = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderId } = req.params;
    const status = "settled";

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      await session.abortTransaction();
      session.endSession();
      return next(new AppError("Invalid buy order ID format", 400));
    }

    // 🔎 Find the order in transaction
    const order = await buyPropertyModel.findById(orderId).session(session);
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return next(new AppError("Order not found", 404));
    }

    // ✅ Update this order’s status
    order.status = status;
    const updatedOrder = await order.save({ session });

    // ✅ Mark all other buy orders for same property as "soldout"
    await buyPropertyModel.updateMany(
      {
        property: order.property,
        _id: { $ne: order._id },
      },
      { status: "rejected" },
      { session }
    );

    // ✅ If settled, mark the property as sold
    if (status === "settled") {
      await createPropertyModel.findByIdAndUpdate(
        order.property,
        { status: "sold" },
        { new: true, session }
      );
    }

    // ✅ Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      status: "success",
      message:
        "Order settled successfully, property marked as sold, and other orders marked as rejected.",
      data: updatedOrder,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

module.exports = updateBuyOrderStatus;
