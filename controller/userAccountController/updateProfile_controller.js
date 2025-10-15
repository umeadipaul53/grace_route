const userModel = require("../../model/userModel/user_model");
const AppError = require("../../utils/AppError");

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id; //authenticateToken middleware attaches user
    const updates = req.body;

    const user = await userModel.findById(userId);
    if (!user) return next(new AppError("User not found", 404));

    if (updates.address) {
      user.address = { ...(user.address || {}), ...updates.address };
      delete updates.address;
    }

    //update other fields
    Object.assign(user, updates);

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      data: {
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        phone_number: user.phone_number,
        address: {
          house_number: user.address?.house_number,
          street: user.address?.street,
          city: user.address?.city,
          lga: user.address?.lga,
          state: user.address?.state,
          country: user.address?.country,
          postalCode: user.address?.postalCode,
        },
        goals: {
          buying_goals: user.goals?.buying_goals,
          timeline: user.goals?.timeline,
          selling_goals: user.goals?.selling_goals,
          educational_goals: user.goals?.educational_goals,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = updateProfile;
