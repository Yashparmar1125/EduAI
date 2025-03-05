import { body, validationResult } from "express-validator";

export const validateRegistration = [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
  body("name").trim().notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateLogin = [
  body("email").isEmail().normalizeEmail(),
  body("password").exists(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateUpdateProfile = [
  // Validate 'name' (optional, but if provided, must be a non-empty string or null)
  body("name")
    .optional()
    .custom(
      (value) =>
        value === null || (typeof value === "string" && value.trim().length > 0)
    )
    .withMessage("Name must be a non-empty string or null"),

  body("email")
    .optional()
    .custom((value) => value === null || /^\S+@\S+\.\S+$/.test(value)),

  // Validate 'profile.profilePhoto' (optional, but if provided, must be a valid URL or null)
  body("profilePicture")
    .optional()
    .custom(
      (value) =>
        value === null ||
        (typeof value === "string" &&
          /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(value))
    )
    .withMessage("Profile photo should be a valid URL or null"),

  // Handle validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
