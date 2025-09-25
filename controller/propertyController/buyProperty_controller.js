const createPropertyModel = require("../../model/propertyModel/createProperty_model");

const buyProperty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    let status;
    if (userRole === "admin") {
      status = "available";
    } else {
      status = "pending";
    }

    // ✅ Create property in MongoDB
    const newProperty = await createPropertyModel.create({
      ...propertyData, // validated body data
      images,
      userId,
    });

    res.status(201).json({
      message: "Property created successfully",
      data: newProperty,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = buyProperty;
