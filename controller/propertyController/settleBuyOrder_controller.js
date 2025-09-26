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

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return next(new AppError("Invalid buy order ID format", 400));
    }

    // 🔎 Find the order in the transaction
    const order = await buyPropertyModel.findById(orderId).session(session);
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return next(new AppError("Order not found", 404));
    }

    // ✅ Update the current order’s status
    order.status = status;
    await order.save({ session });

    // ✅ Delete all other buy orders for the same property
    await buyPropertyModel.deleteMany(
      {
        property: order.property,
        _id: { $ne: order._id },
      },
      { session }
    );

    // ✅ If status is "settled", update the property itself
    if (status === "settled") {
      await createPropertyModel.findByIdAndUpdate(
        order.property,
        { status: "sold" },
        { new: true, session }
      );
    }

    // ✅ Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      status: "success",
      message:
        status === "settled"
          ? "Order settled, property updated, and competing orders removed"
          : "Order updated and other competing orders removed",
      data: order,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

module.exports = updateBuyOrderStatus;
