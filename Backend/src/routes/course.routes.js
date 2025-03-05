import express from "express";
import { authMiddleware, isInstructor } from "../middleware/auth.middleware.js";
import {
  createCourse,
  updateCourse,
  enrollCourse,
  
} from "../controllers/course.controller.js";
import {
  createCourseValidator,
  updateCourseValidator,
  enrollCourseValidator,
  
} from "../validators/course.validator.js";

const router = express.Router();

//routes
router.post(
  "/create",
  authMiddleware,
  isInstructor,
  createCourseValidator,
  createCourse
);
router.put(
  "/:courseId",
  authMiddleware,
  isInstructor,
  updateCourseValidator,
  updateCourse
);
router.post(
  "/enroll/:courseId",
  authMiddleware,
  enrollCourseValidator,
  enrollCourse
);


export default router;
