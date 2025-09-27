const mongoose = require("mongoose");

const favouriteSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "property_listing",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can’t favourite the same property twice
favouriteSchema.index({ propertyId: 1, userId: 1 }, { unique: true });

const favouriteModel = mongoose.model("myFavouriteProperties", favouriteSchema);

module.exports = favouriteModel;
