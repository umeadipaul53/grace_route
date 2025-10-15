const createPropertyModel = require("../../model/propertyModel/createProperty_model");

const searchProperty = async (req, res, next) => {
  try {
    const properties = await createPropertyModel.find(
      {},
      { "location.city": 1, _id: 0 }
    );

    if (!properties.length) {
      return res.status(200).json({ status: "success", data: [] });
    }

    const cities = [
      ...new Set(
        properties
          .map((p) => (p.location?.city || "").trim())
          .filter((city) => city)
      ),
    ];

    res.status(200).json({
      status: "success",
      message: "Unique property cities fetched successfully",
      data: cities,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = searchProperty;
