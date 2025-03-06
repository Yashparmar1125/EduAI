import express from "express";
import { authMiddleware, isInstructor } from "../middleware/auth.middleware.js";
import {
  getInstructorStats,
  getInstructorCourses,
  getCourseStats,
} from "../controllers/instructor.controller.js";

const router = express.Router();

// Get instructor's dashboard statistics
router.get("/stats", authMiddleware, isInstructor, getInstructorStats);

// Get instructor's courses
router.get("/courses", authMiddleware, isInstructor, getInstructorCourses);

// Get specific course statistics
router.get(
  "/courses/:courseId/stats",
  authMiddleware,
  isInstructor,
  getCourseStats
);

export default router;
