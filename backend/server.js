import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import { connectCloudinary } from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import questionRouter from "./routes/questionRoute.js";
import emailRoutes from "./routes/emailRoutes.js";
import universityRouter from "./routes/universityRoutes.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import fs from "fs";
import emailRouter from "./routes/emailRoutes.js";
import cookieParser from "cookie-parser";

import inquiryRouter from "./routes/advisorinquiriesRoutes.js";

import MatchRouter from "./routes/universityRoute.js";
import eventRouter from "./routes/eventRoute.js";

import applicationRouter from './routes/applynowRoute.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create required directories
const uploadsDir = path.join(__dirname, "uploads");
const verificationDocsDir = path.join(uploadsDir, "verification-documents");

// Create directories if they don't exist
[uploadsDir, verificationDocsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// App Config
const app = express();
const port = process.env.PORT || 9000;
connectDB();
connectCloudinary();

// Middleware order is important
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cookieParser());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});


// api endpoints
app.use("/api/user", userRouter);
app.use("/api/question", questionRouter);
app.use("/api/email", emailRoutes);

//university api endpoints
app.use("/api/university", universityRouter);
app.use("/api/match", MatchRouter);



//email broadcast
app.use("/api/email", emailRouter);

//event api endpoints
app.use("/api/event", eventRouter);





//advisor inquiry form
app.use("/api/advisor-inquiryform", inquiryRouter);

// Add this line with other routes
app.use('/api/applications', applicationRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => console.log("Server started on PORT : " + port));
