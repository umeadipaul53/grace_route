const createPropertyModel = require("../../model/propertyModel/createProperty_model");
const streamifier = require("streamifier");
const cloudinary = require("../../config/cloudinary");

const createProperty = async (req, res, next) => {
  try {
    //validated req.body by the middleware
    const propertyData = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    //handle file upload
    let images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        // Cloudinary upload_stream works with buffers
        const result = await new Promise((resolve, reject) => {
          let cld_upload_stream = cloudinary.uploader.upload_stream(
            { folder: "properties_images" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          streamifier.createReadStream(file.buffer).pipe(cld_upload_stream);
        });

        images.push({
          public_id: result.public_id,
          url: result.secure_url,
          fileType: file.mimetype,
          fileSize: file.size,
        });
      }
    }

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

module.exports = createProperty;
