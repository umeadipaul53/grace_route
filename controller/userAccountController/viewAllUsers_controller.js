const userModel = require("../../model/userModel/user_model");
const AppError = require("../../utils/AppError");

const viewAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = "-createdAt" } = req.query;

    const numericLimit = Math.max(Number(limit) || 10, 1);
    const numericPage = Math.max(Number(page) || 1, 1);
    const skip = (numericPage - 1) * numericLimit;

    // ✅ Only fetch users with role "user"
    const filter = { role: "user" };

    const [users, totalDocuments] = await Promise.all([
      userModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(numericLimit)
        .select("-password")
        .lean(),
      userModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalDocuments / numericLimit);

    res.status(200).json({
      status: "success",
      message: users.length > 0 ? "All users" : "No users found",
      count: users.length,
      pagination: {
        currentPage: numericPage,
        totalPages,
        limit: numericLimit,
        totalResults: totalDocuments,
        hasNextPage: numericPage < totalPages,
        hasPrevPage: numericPage > 1,
      },
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = viewAllUsers;
