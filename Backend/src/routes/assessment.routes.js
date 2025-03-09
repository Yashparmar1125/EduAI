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
  createLangflowRoadmap,
  getLangflowQuestions,
} from "../controllers/assessment.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes (no auth required)
router.post("/next-questions", getNextQuestions);
router.post("/langflow", getLangflowRoadmap);
router.post("/questions/langflow", getLangflowQuestions);

// Protected routes (require authentication)
router.use(authMiddleware);

// Assessment management routes
router.post("/create", createAssessment);
router.get("/get", getInstructorAssessments);
router.get("/get/:assessmentId", getAssessment);
router.put("/update/:assessmentId", updateAssessment);
router.delete("/delete/:assessmentId", deleteAssessment);
router.get("/get/:assessmentId/stats", getAssessmentStats);
router.post("/langflow/roadmap/create", authMiddleware, createLangflowRoadmap);

// Assessment submission route (no auth required)
router.post("/submit", submitAssessment);

export default router;
