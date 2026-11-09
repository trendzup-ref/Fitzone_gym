import express from "express";

import {
  addInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiry,
  deleteInquiry,
  searchInquiries,
  filterInquiries,
} from "../controllers/inquiry.controller.js";

import adminAuth from "../middleware/adminAuth.middleware.js";

const inquiryRouter = express.Router();

// Public Route - Contact Form
inquiryRouter.post("/add", addInquiry);

// Admin Protected Routes
inquiryRouter.get("/list", adminAuth, getAllInquiries);

inquiryRouter.get("/search", adminAuth, searchInquiries);

inquiryRouter.get("/filter", adminAuth, filterInquiries);

inquiryRouter.get("/:id", adminAuth, getInquiryById);

inquiryRouter.put("/:id", adminAuth, updateInquiry);

inquiryRouter.delete("/:id", adminAuth, deleteInquiry);

export default inquiryRouter;