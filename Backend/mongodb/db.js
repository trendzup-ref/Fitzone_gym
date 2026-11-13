import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const cached = globalThis.mongoose || {
  conn: null,
  promise: null,
};

globalThis.mongoose = cached;

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI);
  }

  try {
    cached.conn = await cached.promise;

    console.log("MongoDB Connected Successfully");

    return cached.conn;

  } catch (error) {
    cached.promise = null;

    console.error("MongoDB Connection Failed:", error.message);

    throw error;
  }
}