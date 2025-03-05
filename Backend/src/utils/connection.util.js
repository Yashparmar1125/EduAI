import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Ensure the MONGODB_URL exists
const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  console.error("MONGODB_URL is not defined in the environment variables");
  process.exit(1); // Exit if the environment variable is not set
}

const connectDB = async () => {
  try {
    // Connect to MongoDB Atlas without deprecated options
    await mongoose.connect(MONGODB_URL);
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

export default connectDB;
