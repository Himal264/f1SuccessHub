import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Ensure dotenv is configured
dotenv.config();

const connectCloudinary = () => {
  try {
    // Log environment variables to verify they're loaded
    console.log("Checking Cloudinary Environment Variables:");
    console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
    console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
    console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET);

    if (!process.env.CLOUDINARY_API_SECRET) {
      throw new Error("Cloudinary API Secret is missing");
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Test the configuration
    console.log("Cloudinary Configuration:", cloudinary.config());
    console.log("Cloudinary Connected Successfully");
  } catch (error) {
    console.error("Cloudinary Connection Error:", error);
    throw error; // Re-throw to handle it in the server
  }
};

export { cloudinary as default, connectCloudinary };
