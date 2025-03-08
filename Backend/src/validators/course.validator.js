import { body, param } from "express-validator";

// Validator for creating a course
export const createCourseValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Course title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Course description is required")
    .isLength({ min: 20, max: 2000 })
    .withMessage("Description must be between 20 and 2000 characters"),

  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isIn([
      "Web Development",
      "Mobile Development",
      "Data Science",
      "UI/UX Design",
      "Digital Marketing",
      "Cloud Computing",
      "Cybersecurity",
      "Artificial Intelligence",
      "DevOps",
      "Blockchain",
    ])
    .withMessage("Invalid category"),

  body("level")
    .trim()
    .notEmpty()
    .withMessage("Level is required")
    .isIn(["beginner", "intermediate", "advanced"])
    .withMessage("Invalid level"),

  body("modules")
    .isString()
    .custom((value) => {
      try {
        const modules = JSON.parse(value);
        if (!Array.isArray(modules)) {
          throw new Error("Modules must be an array");
        }
        if (modules.length === 0) {
          throw new Error("At least one module is required");
        }
        modules.forEach((module, index) => {
          if (!module.title || !module.content) {
            throw new Error(
              `Module ${index + 1} must have a title and content`
            );
          }
        });
        return true;
      } catch (error) {
        throw new Error("Invalid modules format: " + error.message);
      }
    }),
];

// Validator for updating a course
export const updateCourseValidator = [
  param("courseId").isMongoId().withMessage("Invalid course ID"),

  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage("Description must be between 20 and 2000 characters"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("category")
    .optional()
    .trim()
    .isIn([
      "Web Development",
      "Mobile Development",
      "Data Science",
      "UI/UX Design",
      "Digital Marketing",
      "Cloud Computing",
      "Cybersecurity",
      "Artificial Intelligence",
      "DevOps",
      "Blockchain",
    ])
    .withMessage("Invalid category"),

  body("level")
    .optional()
    .trim()
    .isIn(["beginner", "intermediate", "advanced"])
    .withMessage("Invalid level"),

  body("modules")
    .optional()
    .isString()
    .custom((value) => {
      try {
        const modules = JSON.parse(value);
        if (!Array.isArray(modules)) {
          throw new Error("Modules must be an array");
        }
        modules.forEach((module, index) => {
          if (!module.title || !module.content) {
            throw new Error(
              `Module ${index + 1} must have a title and content`
            );
          }
        });
        return true;
      } catch (error) {
        throw new Error("Invalid modules format: " + error.message);
      }
    }),
];

// Validator for enrolling in a course
export const enrollCourseValidator = [
  param("courseId").isMongoId().withMessage("Invalid course ID"),
];
