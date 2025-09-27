const favouriteModel = require("../../model/favouriteModel/createFavourite_model");
const AppError = require("../../utils/AppError");

// Add property to favourites
const addFavourite = async (req, res, next) => {
  try {
    // if you’re using auth middleware, get user from req.user
    const userId = req.user.id; // from token
    const propertyId = req.params.id; // from URL params

    const favourite = await favouriteModel.findOne({
      propertyId,
      userId,
    });
    if (favourite)
      return next(new AppError("Property already in favourites", 400));

    const newFavourite = await favouriteModel.create({
      propertyId,
      userId,
    });

    res.status(201).json({
      status: "success",
      message: "Property added to favourites",
      data: newFavourite,
    });
  } catch (err) {
    next(err);
  }
};

// Remove property from favourites
const removeFavourite = async (req, res, next) => {
  try {
    const userId = req.user.id; // from token
    const propertyId = req.params.id; // from URL params

    const deleted = await favouriteModel.findOneAndDelete({
      propertyId,
      userId,
    });

    if (!deleted) return next(new AppError("Favourite not found", 404));

    res.status(200).json({
      status: "success",
      message: "Property removed from favourites",
    });
  } catch (err) {
    next(err);
  }
};

// Get all favourites for user
const getFavourites = async (req, res, next) => {
  try {
    const userId = req.user.id; // from auth middleware

    const favourites = await favouriteModel
      .find({ userId }) // since your schema field is userId
      .populate("propertyId"); // populate the propertyId reference

    res.status(200).json({
      status: "success",
      results: favourites.length,
      data: favourites,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { addFavourite, removeFavourite, getFavourites };
