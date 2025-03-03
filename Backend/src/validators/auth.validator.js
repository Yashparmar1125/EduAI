import { body, validationResult } from "express-validator";

export const validateRegistration = [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
  body("name").trim().notEmpty(),
  body("phone").isLength({ min: 10 }),
  body("role").notEmpty(),
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

  body("bio")
    .optional()
    .custom(
      (value) =>
        value === null || (typeof value === "string" && value.trim().length > 0)
    ),

  body("email")
    .optional()
    .custom((value) => value === null || /^\S+@\S+\.\S+$/.test(value)),

  // Validate 'phone' (optional, but if provided, must be a valid phone number or null)
  body("phone")
    .optional()
    .custom((value) => value === null || /^[0-9]{10}$/.test(value)) // Custom regex for 10-digit phone number
    .withMessage("Please provide a valid phone number or null"),

  // Validate 'profile.skills' (optional, but if provided, must be an array or null)
  body("profile.skills")
    .optional()
    .custom((value) => value === null || Array.isArray(value))
    .withMessage("Skills should be an array or null"),

  // Validate 'profile.profilePhoto' (optional, but if provided, must be a valid URL or null)
  body("profile.profilePhoto")
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
