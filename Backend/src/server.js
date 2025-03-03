import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import firebaseAdmin from "firebase-admin"; // Import Firebase Admin SDK

//utilities imports
import connectDB from "./utils/connection.util.js";

//routes imports
import healthRoutes from "./routes/health.routes.js";

import serviceAccount from "../service-account.json" assert { type: "json" };

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount), // Initialize using the service account key
});

//constants
const CORS_OPTIONS = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://192.168.0.104:5173", // Your React app's IP and port
      "http://localhost:5173",
    ];

    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // Accept the request
    } else {
      callback(new Error("Not allowed by CORS")); // Reject the request
    }
  },
  credentials: true, // Allow cookies or other credentials to be sent
};

//server config/initialization
dotenv.config();
const PORT = process.env.PORT || 3000;
connectDB();
const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(CORS_OPTIONS));

//routes
app.use(healthRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
