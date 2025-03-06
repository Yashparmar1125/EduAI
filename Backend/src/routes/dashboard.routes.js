import express from "express";
import { getDashboardData } from "../controllers/dashboard.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get dashboard data
router.get("/", authMiddleware, getDashboardData);

export default router;
