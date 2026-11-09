import express from "express";

import {
  addMembership,
  getAllMemberships,
  getMembershipById,
  updateMembership,
  deleteMembership,
} from "../controllers/membership.controller.js";

import adminAuth from "../middleware/adminAuth.middleware.js";

const membershipRouter = express.Router();

// Protect all membership routes
membershipRouter.use(adminAuth);

// Add Membership
membershipRouter.post("/add", addMembership);

// Get All Memberships
membershipRouter.get("/list", getAllMemberships);

// Get Single Membership
membershipRouter.get("/:id", getMembershipById);

// Update Membership
membershipRouter.put("/:id", updateMembership);

// Delete Membership
membershipRouter.delete("/:id", deleteMembership);

export default membershipRouter;