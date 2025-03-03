import express from "express";

//validators imports
import {
  validateRegistration,
  validateLogin,
  validateUpdateProfile,
} from "../validators/auth.validator.js";
// import { singleUpload } from "../middlewares/multer.middleware.js";

//controllers imports
import {
  register,
  googleLogin,
  login,
  logout,
  updateProfile,
  profile,
} from "../controllers/auth.controller.js";
const router = express.Router();

//middlewares imports
import authMiddleware from "../middlewares/auth.middleware.js";

//routes
router.post("/register", singleUpload, validateRegistration, register);
router.post("/google/login", googleLogin);
router.post("/login", validateLogin, login);
router.get("/logout", logout);
router.get("/profile", authMiddleware, profile);
router.post(
  "/updateProfile",
  authMiddleware,
  validateUpdateProfile,
  updateProfile
);

export default router;
