const userModel = require("../../model/userModel/user_model");
const AppError = require("../../utils/AppError");

const userProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await userModel.findById(userId);

    if (!user) return next(new AppError("Error fetching user", 400));

    res.json({
      id: user._id,
      email: user.email,
      first: user.firstname,
      lastname: user.lastname,
      phone_number: user.phone_number,
      address: {
        label: user.address.label,
        house_number: user.address.house_number,
        street: user.address.street,
        city: user.address.city,
        lga: user.address.lga,
        state: user.address.state,
        country: user.address.country,
        postalcode: user.address.postalCode,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = userProfile;
