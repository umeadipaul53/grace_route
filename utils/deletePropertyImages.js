const cloudinary = require("cloudinary").v2;

/**
 * Deletes an array of Cloudinary images by their public_id
 * @param {Array} images - Array of objects with { public_id }
 */
async function deleteCloudinaryImages(images = []) {
  if (!Array.isArray(images) || images.length === 0) return;

  for (const img of images) {
    try {
      const result = await cloudinary.uploader.destroy(img.public_id);
      console.log(`☁️ Deleted from Cloudinary: ${img.public_id}`, result);
    } catch (error) {
      console.error(`❌ Failed to delete ${img.public_id}:`, error);
    }
  }
}

module.exports = deleteCloudinaryImages;
