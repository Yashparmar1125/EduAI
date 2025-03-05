// routes/progressRoutes.js
import express from "express";
import {
  startModule,
  updateModuleProgress,
  completeModule,
  getCourseProgress,
  getCompletedCourses,
} from "../controllers/progress.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Module progress
router.post(
  "/courses/:courseId/modules/:moduleId/start",
  authMiddleware,
  startModule
);
router.patch(
  "/courses/:courseId/modules/:moduleId/progress",
  authMiddleware,
  updateModuleProgress
);
router.post(
  "/courses/:courseId/modules/:moduleId/complete",
  authMiddleware,
  completeModule
);

// Course progress
router.get("/courses/:courseId/progress", authMiddleware, getCourseProgress);

// Completed courses & certificates
router.get(
  "/users/:userId/completed-courses",
  authMiddleware,
  getCompletedCourses
);

export default router;
