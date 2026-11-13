import express from "express";

import {
  addMember,
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
  searchMembers,
  filterMembers,
} from "../controllers/member.controller.js";

import adminAuth from "../middleware/adminAuth.middleware.js";
import upload from "../middleware/multer.js";


const memberRouter = express.Router();

// All routes are protected
memberRouter.use(adminAuth);

// Search Members
memberRouter.get("/search", searchMembers);

// Filter Members
memberRouter.get("/filter", filterMembers);

// Add Member
memberRouter.post("/add", upload.single("image"), addMember);

// Get All Members
memberRouter.get("/list", getAllMembers);

// Get Single Member
memberRouter.get("/:id", getMemberById);

// Update Member
memberRouter.put("/:id", upload.single("image"), updateMember);

// Delete Member
memberRouter.delete("/:id", deleteMember);

export default memberRouter;