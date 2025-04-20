import mongoose from "mongoose";
import { DB_URI } from "../config/env.js";

const connectDB = async () => {
  if (!DB_URI) {
    console.error(
      "❌ DB_URI is not defined. Please check your environment configuration."
    );
    process.exit(1); // Exit process with failure
  }

  try {
    await mongoose.connect(DB_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
