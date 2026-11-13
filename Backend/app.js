import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./mongodb/db.js";

import contactRoutes from "./routes/contactRoute.js";
import adminRouter from "./routes/admin.route.js";
import memberRouter from "./routes/member.route.js";
import membershipRouter from "./routes/membership.route.js";
import trainerRouter from "./routes/trainer.route.js";
import inquiryRouter from "./routes/inquiry.route.js";
import dashboardRouter from "./routes/dashboard.route.js";
import memberAuthRouter from "./routes/memberAuth.route.js";
import memberDashboardRouter from "./routes/memberDashboard.route.js";
import announcementRouter from "./routes/announcement.route.js";

dotenv.config();

const app = express();

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://YOUR-ADMIN-DOMAIN.vercel.app",
  "https://YOUR-USER-DOMAIN.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

// Database middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// Routes
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRouter);
app.use("/api/member", memberRouter);
app.use("/api/membership", membershipRouter);
app.use("/api/trainer", trainerRouter);
app.use("/api/inquiry", inquiryRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/member-auth", memberAuthRouter);
app.use("/api/member-dashboard", memberDashboardRouter);
app.use("/api/announcements", announcementRouter);

// Test API
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Fitzone Gym API is running",
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    error: "Something went wrong",
  });
});

export default app;

// Local development
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}