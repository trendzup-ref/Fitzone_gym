import express from "express";

import {
  adminLogin,
  adminLogout,
} from "../controllers/admin.controller.js";

import adminAuth from "../middleware/adminAuth.middleware.js";

const adminRouter = express.Router();

// Public route - Admin login
adminRouter.post("/login", adminLogin);

// Public route - Admin logout
adminRouter.post("/logout", adminLogout);

// Protected route - Admin dashboard
adminRouter.get("/dashboard", adminAuth, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Admin Dashboard",
    admin: req.admin,
  });
});

export default adminRouter;