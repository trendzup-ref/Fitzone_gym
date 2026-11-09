import express from "express";

import { getDashboardStats } from "../controllers/dashboard.controller.js";

import adminAuth from "../middleware/adminAuth.middleware.js";

const dashboardRouter = express.Router();

// Admin Authentication
dashboardRouter.use(adminAuth);

// Get Dashboard Statistics
dashboardRouter.get("/stats", getDashboardStats);

export default dashboardRouter;