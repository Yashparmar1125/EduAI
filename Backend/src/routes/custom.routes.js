import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createCustom,
  getCustomById,
  getUserCustomCourses,
  updateModuleProgress,
  getCourseProgress,
} from "../controllers/custom.controller.js";

const router = express.Router();

// Protect all routes with authentication
router.use(authMiddleware);

// Get all custom courses for the logged-in user
router.get("/user", getUserCustomCourses);

// Create a new custom course
router.post("/create", createCustom);

// Get custom course by ID
router.get("/:id", getCustomById);

router.get("/:courseId/progress", getCourseProgress);
router.post("/:courseId/modules/:moduleId/progress", updateModuleProgress);

export default router;
