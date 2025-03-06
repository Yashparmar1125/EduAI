import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "eduai/courses",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1280, height: 720, crop: "fill" }],
  },
});

export const upload = multer({ storage: storage });

export const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw error;
  }
};

export default cloudinary;
