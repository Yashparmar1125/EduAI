import express from "express";
import {
  createAssessment,
  getInstructorAssessments,
  getAssessment,
  updateAssessment,
  deleteAssessment,
  getAssessmentStats,
  getNextQuestions,
  submitAssessment,
} from "../controllers/assessment.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Protected routes (require authentication)
router.use(authMiddleware);

// Route to get next questions based on initial responses
router.post("/next-questions", getNextQuestions);

// Create a new assessment
router.post("/", createAssessment);

// Get all assessments for an instructor
router.get("/instructor", getInstructorAssessments);

// Get a single assessment
router.get("/:assessmentId", getAssessment);

// Update an assessment
router.put("/:assessmentId", updateAssessment);

// Delete an assessment
router.delete("/:assessmentId", deleteAssessment);

// Get assessment statistics
router.get("/:assessmentId/stats", getAssessmentStats);

router.post("/submit", submitAssessment);

export default router;
