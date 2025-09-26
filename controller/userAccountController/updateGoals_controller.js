const userModel = require("../../model/userModel/user_model");
const AppError = require("../../utils/AppError");

const updateGoals = async (req, res, next) => {
  try {
    const userId = req.user.id; //authenticateToken middleware attaches user
    const updates = req.body;

    const user = await userModel.findById(userId);
    if (!user) return next(new AppError("User not found", 404));

    if (updates.goals) {
      user.goals = { ...(user.goals || {}), ...updates.goals };
      delete updates.goals;
    }

    //update other fields
    Object.assign(user, updates);

    await user.save();

    res.status(200).json({
      message: "Goals updated successfully",
      data: {
        buying_goals: user.goals.buying_goals,
        timeline: user.goals.timeline,
        selling_goals: user.goals.selling_goals,
        educational_goals: user.goals.educational_goals,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = updateGoals;
