const tourRequestModel = require("../../model/tourModel/tourRequest_model");
const userModel = require("../../model/userModel/user_model");
const AppError = require("../../utils/AppError");
const createPropertyModel = require("../../model/propertyModel/createProperty_model");

const createTourRequest = async (req, res, next) => {
  try {
    let { propertyId, date, name, email, phone } = req.body;

    if (req.user) {
      const user = await userModel.findById(req.user.id);
      if (!user) {
        return next(new AppError("User not found", 404));
      }

      name = `${user.firstname} ${user.lastname}`;
      email = user.email;
      phone = user.phone_number;
    }

    const property_details = await createPropertyModel.findById(propertyId);

    if (!property_details) return next(new AppError("Property not found", 404));

    const tour = await tourRequestModel.create({
      property: propertyId,
      user: req.user ? req.user.id : null,
      property_name: property_details.property_name,
      property_type: property_details.property_type,
      price: property_details.price,
      homeType: property_details.homeType,
      name,
      email,
      phone,
      date,
    });

    res.status(201).json({
      status: "success",
      message: "Tour request submitted successfully",
      data: tour,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = createTourRequest;
