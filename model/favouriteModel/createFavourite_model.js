const mongoose = require("mongoose");

const favouriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true, // one document per user
    },
    propertyIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "property_listing",
      },
    ],
  },
  { timestamps: true }
);

const favouriteModel = mongoose.model("FavouriteProperty", favouriteSchema);

module.exports = favouriteModel;
