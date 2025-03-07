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
  getLangflowRoadmap,
} from "../controllers/assessment.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/langflow", getLangflowRoadmap);
// Protected routes (require authentication)
router.use(authMiddleware);

// Route to get next questions based on initial responses
router.post("/next-questions", getNextQuestions);

// Create a new assessment
router.post("/create", createAssessment);

// Get all assessments for an instructor
router.get("/get", getInstructorAssessments);

// Get a single assessment
router.get("/get/:assessmentId", getAssessment);

// Update an assessment
router.put("/update/:assessmentId", updateAssessment);

// Delete an assessment
router.delete("/delete/:assessmentId", deleteAssessment);

// Get assessment statistics
router.get("/get/:assessmentId/stats", getAssessmentStats);

router.post("/submit", submitAssessment);



export default router;
