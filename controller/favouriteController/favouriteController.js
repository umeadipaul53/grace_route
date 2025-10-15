const favouriteModel = require("../../model/favouriteModel/createFavourite_model");
const AppError = require("../../utils/AppError");

/**
 * ✅ Toggle Favourite (Add or Remove)
 * If property exists in user's favourites → remove it
 * If not → add it
 */
const toggleFavourite = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { propertyId } = req.body;

    if (!propertyId) {
      return next(new AppError("Property ID is required", 400));
    }

    let favourite = await favouriteModel.findOne({ userId });

    if (favourite) {
      let action = "";

      if (favourite.propertyIds.includes(propertyId)) {
        // Remove it
        favourite.propertyIds = favourite.propertyIds.filter(
          (id) => id.toString() !== propertyId
        );
        action = "removed";
      } else {
        // Add it
        favourite.propertyIds.push(propertyId);
        action = "added";
      }

      await favourite.save();

      // repopulate updated favourites
      const updatedFavourite = await favouriteModel
        .findOne({ userId })
        .populate({
          path: "propertyIds",
          populate: { path: "location", select: "city state" },
        });

      return res.status(200).json({
        status: "success",
        action,
        message:
          action === "added"
            ? "Property added to favourites"
            : "Property removed from favourites",
        data: updatedFavourite.propertyIds, // ✅ send only the array
      });
    }

    // if new
    const newFavourite = await favouriteModel.create({
      userId,
      propertyIds: [propertyId],
    });

    const populatedNewFavourite = await favouriteModel
      .findOne({ userId })
      .populate({
        path: "propertyIds",
        populate: { path: "location", select: "city state" },
      });

    return res.status(201).json({
      status: "success",
      action: "added",
      message: "Property added to favourites",
      data: populatedNewFavourite.propertyIds, // ✅ send only the array
    });
  } catch (err) {
    next(err);
  }
};

/**
 * ✅ Get all favourites for the authenticated user
 */
const getFavourites = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Find the user's favourites document
    const favourite = await favouriteModel.findOne({ userId }).populate({
      path: "propertyIds", // ✅ match your schema field
      populate: {
        path: "location", // ✅ optional nested populate if your property has location ref
        select: "city state",
      },
    });

    if (!favourite || favourite.propertyIds.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No favourite properties found",
        results: 0,
        data: [],
      });
    }

    res.status(200).json({
      status: "success",
      message: "Fetched favourites successfully",
      results: favourite.propertyIds.length,
      data: favourite.propertyIds,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { toggleFavourite, getFavourites };
