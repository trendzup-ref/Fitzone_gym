import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./mongodb/db.js";
import contactRoutes from "./routes/contactRoute.js";
import adminRouter from "./routes/admin.route.js";
import createAdmin from "./config/createAdmin.js";
import memberRouter from "./routes/member.route.js";
import membershipRouter from "./routes/membership.route.js";
import trainerRouter from "./routes/trainer.route.js";
import inquiryRouter from "./routes/inquiry.route.js";
import dashboardRouter from "./routes/dashboard.route.js";

dotenv.config();

await connectDB();
await createAdmin();

const app = express();
const PORT = process.env.PORT || 4000;

// Allowed Frontend Origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
];

// CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRouter);
app.use("/api/member", memberRouter);
app.use("/api/membership", membershipRouter);
app.use("/api/trainer", trainerRouter);
app.use("/api/inquiry", inquiryRouter);
app.use("/api/dashboard", dashboardRouter);

// Error Handling
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    error: "Something went wrong",
  });
});

// Start Server
const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Server startup failed:", err);
    process.exit(1);
  }
};

startServer();