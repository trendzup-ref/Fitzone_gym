import express from "express";

import {
  addTrainer,
  getAllTrainers,
  getTrainerById,
  updateTrainer,
  deleteTrainer,
  searchTrainers,
  filterTrainers,
} from "../controllers/trainer.controller.js";

import adminAuth from "../middleware/adminAuth.middleware.js";
import upload from "../middleware/multer.js";

const trainerRouter = express.Router();

// Protect all trainer routes
trainerRouter.use(adminAuth);

// Search and Filter
trainerRouter.get("/search", searchTrainers);
trainerRouter.get("/filter", filterTrainers);

// Add Trainer (with image)
trainerRouter.post("/add", upload.single("image"), addTrainer);

// Get All Trainers
trainerRouter.get("/list", getAllTrainers);

// Get Trainer By ID
trainerRouter.get("/:id", getTrainerById);

// Update Trainer (with optional new image)
trainerRouter.put("/:id", upload.single("image"), updateTrainer);

// Delete Trainer
trainerRouter.delete("/:id", deleteTrainer);

export default trainerRouter;