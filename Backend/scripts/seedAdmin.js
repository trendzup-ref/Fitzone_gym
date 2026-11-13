import dotenv from "dotenv";
import mongoose from "mongoose";

import { connectDB } from "../mongodb/db.js";
import createAdmin from "../config/createAdmin.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    await createAdmin();

    console.log("Admin seeding completed");
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin();