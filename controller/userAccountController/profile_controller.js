const userModel = require("../../model/userModel/user_model");
const profileImage = require("../../model/userModel/profileImage_model");
const AppError = require("../../utils/AppError");

const userProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await userModel.findById(userId);

    if (!user) return next(new AppError("Error fetching user", 400));

    // find user's profile image
    const dp = await profileImage.findOne({ userId }, "imageUrl");

    res.json({
      id: user._id,
      data: {
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        phone_number: user.phone_number,
        profileImage: dp ? dp.imageUrl : null, // ✅ only send imageUrl or null
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
  } catch (error) {
    next(error);
  }
};

module.exports = userProfile;
