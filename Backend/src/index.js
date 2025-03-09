// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import firebaseAdmin from "firebase-admin";
// import helmet from "helmet";
// import rateLimit from "express-rate-limit";
// import mongoSanitize from "express-mongo-sanitize";
// import hpp from "hpp";
// import xssClean from "xss-clean";
// import compression from "compression";
// import csurf from "csurf";
// import { readFileSync } from "fs";
// import { fileURLToPath } from "url";
// import { dirname, join } from "path";

// //utilities imports
// import connectDB from "./utils/connection.util.js";

// //routes imports
// import healthRoutes from "./routes/health.routes.js";
// import authRoutes from "./routes/auth.routes.js";
// import courseRoutes from "./routes/course.routes.js";
// import progressRoutes from "./routes/progress.routes.js";
// import instructorRoutes from "./routes/instructor.routes.js";
// import assessmentRoutes from "./routes/assessment.routes.js";
// import dashboardRoutes from "./routes/dashboard.routes.js";
// import achievementRoutes from "./routes/achievement.routes.js";
// import gamificationRoutes from "./routes/gamification.routes.js";
// import recommendationRoutes from "./routes/recommendation.routes.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// const serviceAccount = JSON.parse(
//   readFileSync(join(__dirname, "../service-account.json"))
// );

// firebaseAdmin.initializeApp({
//   credential: firebaseAdmin.credential.cert(serviceAccount),
// });

// //constants
// const CORS_OPTIONS = {
//   origin: (origin, callback) => {
//     const allowedOrigins = [
//       "http://192.168.0.104:3030",
//       "http://localhost:3030",
//     ];

//     if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
//   optionsSuccessStatus: 200,
// };

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: "Too many requests from this IP, please try again later."
// });

// //server config/initialization
// dotenv.config();
// const PORT = process.env.PORT || 3000;
// connectDB();
// const app = express();

// //middlewares
// app.use(helmet());
// app.use(mongoSanitize());
// app.use(xssClean());
// app.use(hpp());
// app.use(limiter);
// app.use(compression());
// app.use(csurf({ cookie: true }));
// app.use(express.json({ limit: "10kb" }));
// app.use(express.urlencoded({ extended: true, limit: "10kb" }));
// app.use(cookieParser());
// app.use(cors(CORS_OPTIONS));

// //routes
// app.use(healthRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/course", courseRoutes);
// app.use("/api/instructor", instructorRoutes);
// app.use("/api/assessment", assessmentRoutes);
// app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/progress", progressRoutes);
// app.use("/api/achievements", achievementRoutes);
// app.use("/api/gamification", gamificationRoutes);
// app.use("/api/recommendations", recommendationRoutes);

// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`Server running on port ${PORT}`);
// });




// // Helmet: Sets secure HTTP headers to prevent common web vulnerabilities like clickjacking, MIME sniffing, and cross-site scripting.
// // Mongo-Sanitize: Prevents NoSQL injection by filtering out dangerous characters from incoming requests.
// // XSS-Clean: Protects against cross-site scripting (XSS) attacks by sanitizing user input in request bodies, queries, and parameters.
// // Express-Rate-Limit: Limits the number of requests from a single IP to prevent brute force and DDoS attacks.
// // CORS with Strict Options: Ensures only trusted origins can access the server and supports credentialed requests securely.
// // Cookie-Parser: Safely parses cookies, ensuring they are handled properly and securely.