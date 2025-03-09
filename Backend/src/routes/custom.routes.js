import express from "express";
import { authMiddleware, isInstructor } from "../middleware/auth.middleware.js";
import {
  createCustom,
  updateCustom,
  enrollCustom,
  getCustomDetails,
  getCustomStats,
  deleteCustom,
  getInstructorCustoms,
  getAllCustoms,
} from "../controllers/custom.controller.js";
import {
  createCourseValidator,
  updateCourseValidator,
  enrollCourseValidator,
} from "../validators/course.validator.js"; // Reusing course validators
import { upload } from "../utils/cloudinary.js";

const router = express.Router();

// Get all custom courses with filters (must be before /:customId routes)
router.get("/explore", getAllCustoms);

// Get instructor's custom courses
router.get(
  "/instructor/customs",
  authMiddleware,
  isInstructor,
  getInstructorCustoms
);

// Create custom course route with file upload
router.post(
  "/create",
  authMiddleware,
  isInstructor,
  upload.single("poster"),
  createCourseValidator, // Reusing course validator
  createCustom
);

// Get custom course details
router.get("/:customId", authMiddleware, getCustomDetails);

// Get custom course statistics
router.get("/:customId/stats", authMiddleware, isInstructor, getCustomStats);

// Update custom course route with optional file upload
router.put(
  "/update/:customId",
  authMiddleware,
  isInstructor,
  upload.single("poster"),
  updateCourseValidator, // Reusing course validator
  updateCustom
);

// Delete custom course
router.delete("/delete/:customId", authMiddleware, isInstructor, deleteCustom);

// Enroll in custom course route
router.post(
  "/enroll/:customId",
  authMiddleware,
  enrollCourseValidator, // Reusing course validator
  enrollCustom
);

export default router;