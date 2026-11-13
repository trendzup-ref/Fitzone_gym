import express from "express";

import {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
  getPublishedAnnouncements,
} from "../controllers/announcement.controller.js";

import adminAuth from "../middleware/adminAuth.middleware.js";
import memberAuth from "../middleware/memberAuth.middleware.js";

const announcementRouter = express.Router();

// Admin routes
announcementRouter.post("/create", adminAuth, createAnnouncement);
announcementRouter.get("/list", adminAuth, getAllAnnouncements);

// IMPORTANT: Keep this route before /:id
announcementRouter.get("/published", memberAuth, getPublishedAnnouncements);

// Dynamic ID routes
announcementRouter.get("/:id", adminAuth, getAnnouncementById);
announcementRouter.put("/:id", adminAuth, updateAnnouncement);
announcementRouter.delete("/:id", adminAuth, deleteAnnouncement);

export default announcementRouter;