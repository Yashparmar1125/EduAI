import { body, param, check } from "express-validator";

// Validator for creating a course
export const createCourseValidator = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("category").notEmpty().withMessage("Category is required"),
  body("price")
    .isNumeric()
    .withMessage("Price must be a number")
    .optional(),
  body("level")
    .isIn(["beginner", "intermediate", "advanced"])
    .withMessage("Invalid level")
    .optional(),
  body("modules")
    .isArray()
    .withMessage("Modules must be an array")
    .custom((modules) => {
      if (modules.length === 0) {
        throw new Error("At least one module is required");
      }
      modules.forEach((module, index) => {
        if (!module.title || !module.content) {
          throw new Error(`Module at index ${index} must have both a title and content`);
        }
        if (module.quiz && !Array.isArray(module.quiz)) {
          throw new Error(`Quiz in module at index ${index} must be an array`);
        }
        module.quiz?.forEach((question, qIndex) => {
          if (!question.question || !question.options || !question.correctAnswer) {
            throw new Error(`Quiz question at index ${qIndex} in module ${index} is invalid`);
          }
        });
      });
      return true;
    }),
];

// Validator for updating a course
export const updateCourseValidator = [
  param("courseId").isMongoId().withMessage("Invalid course ID"),
  body("title").optional().notEmpty().withMessage("Title cannot be empty"),
  body("description").optional().notEmpty().withMessage("Description cannot be empty"),
  body("category").optional().notEmpty().withMessage("Category cannot be empty"),
  body("price")
    .optional()
    .isNumeric()
    .withMessage("Price must be a number"),
  body("level")
    .optional()
    .isIn(["beginner", "intermediate", "advanced"])
    .withMessage("Invalid level"),
  body("modules")
    .optional()
    .isArray()
    .withMessage("Modules must be an array")
    .custom((modules) => {
      if (modules && modules.length === 0) {
        throw new Error("At least one module is required");
      }
      modules?.forEach((module, index) => {
        if (!module.title || !module.content) {
          throw new Error(`Module at index ${index} must have both a title and content`);
        }
        if (module.quiz && !Array.isArray(module.quiz)) {
          throw new Error(`Quiz in module at index ${index} must be an array`);
        }
        module.quiz?.forEach((question, qIndex) => {
          if (!question.question || !question.options || !question.correctAnswer) {
            throw new Error(`Quiz question at index ${qIndex} in module ${index} is invalid`);
          }
        });
      });
      return true;
    }),
];

// Validator for enrolling in a course
export const enrollCourseValidator = [
  param("courseId").isMongoId().withMessage("Invalid course ID"),
];

