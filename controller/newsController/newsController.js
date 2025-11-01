const newsModel = require("../../model/newsModel/createNews");
const streamifier = require("streamifier");
const cloudinary = require("../../config/cloudinary");

const createNews = async (req, res, next) => {
  try {
    //validated req.body by the middleware
    const newsData = req.body;
    const userId = req.user.id;

    //handle file upload
    let images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        // Cloudinary upload_stream works with buffers
        const result = await new Promise((resolve, reject) => {
          let cld_upload_stream = cloudinary.uploader.upload_stream(
            { folder: "news_images" },
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

    // ✅ Create estate in MongoDB
    const newNews = await newsModel.create({
      ...newsData, // validated body data
      images,
      userId,
    });

    res.status(201).json({
      message: "News created successfully",
      data: newNews,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = createNews;
