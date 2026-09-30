const cloudinary = require("cloudinary").v2;

async function uploadImage(imagePath) {
  try {
    const result = await cloudinary.uploader.upload(imagePath);

    return result;
  } catch (error) {
    console.error("Error uploadImage:", error);
    throw error;
  }
}

async function deleteImage(imageId) {
  try {
    const result = await cloudinary.uploader.destroy(imageId);

    return result;
  } catch (error) {
    console.error("Error deleteImage:", error);
    throw error;
  }
}

module.exports = {
  uploadImage,
  deleteImage,
};