import express from "express";

import {
  updateMemberProfile,
} from "../controllers/memberAuth.controller.js";

import memberAuth from "../middleware/memberAuth.middleware.js";
import upload from "../middleware/multer.js";

const memberDashboardRouter = express.Router();

// =====================================
// GET LOGGED-IN MEMBER PROFILE
// =====================================

memberDashboardRouter.get("/profile", memberAuth, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Member profile fetched successfully",
    member: req.member,
  });
});

// =====================================
// UPDATE MEMBER PROFILE
// =====================================

memberDashboardRouter.put(
  "/profile",
  memberAuth,
  upload.single("image"),
  updateMemberProfile
);

export default memberDashboardRouter;