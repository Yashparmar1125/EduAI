import express from "express";
import { getRecommendedCourses } from "../controllers/recommendation.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get recommended courses for the user
router.get("/courses", authMiddleware, getRecommendedCourses);

export default router;
