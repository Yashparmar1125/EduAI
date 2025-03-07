import express from "express";
import {
  getAchievements,
  checkUserAchievements,
  getAchievementDetails,
} from "../controllers/achievement.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get user's achievements
router.get("/", authMiddleware, getAchievements);

// Check for new achievements
router.post("/check", authMiddleware, checkUserAchievements);

// Get achievement details
router.get("/:achievementId", authMiddleware, getAchievementDetails);

export default router;
