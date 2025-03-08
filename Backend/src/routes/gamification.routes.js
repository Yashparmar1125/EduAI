import express from "express";
import { updatexp } from "../controllers/gamification.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Update XP
router.post("/updateXP", authMiddleware, updatexp);

export default router;
