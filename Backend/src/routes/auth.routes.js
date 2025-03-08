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
  googleRegister,
  githubRegister,
  githubLogin,
} from "../controllers/auth.controller.js";
const router = express.Router();

//middlewares imports
import { authMiddleware } from "../middleware/auth.middleware.js";

//routes
router.post("/register", validateRegistration, register);
router.post("/google/login", googleLogin);
router.post("/google/register", googleRegister);
router.post("/github/register", githubRegister);
router.post("/github/login", githubLogin);
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
