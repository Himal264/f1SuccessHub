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
import applynowoRuter from "./routes/applynowRoute.js";

import chatRouter from './routes/chatRoutes.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

import mongoose from 'mongoose';
import './models/userModel.js';  // Load User model first
import './models/eventModel.js'; // Then load Event model
import setupWebinarWebSocket from './services/webinarSocket.js';
import webinarRouter from './routes/webinarRoute.js';

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
const httpServer = createServer(app);

// CORS configuration
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Initialize socket after CORS configuration
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Socket.IO middleware for authentication
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication token missing'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('User connected:', socket.userId);

  socket.on('join_room', ({ roomId, userId }) => {
    socket.join(roomId);
    console.log(`User ${userId} joined room ${roomId}`);
  });

  socket.on('send_message', (messageData) => {
    io.to(messageData.roomId).emit('receive_message', messageData);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.userId);
  });
});

const port = process.env.PORT || 9000;
connectDB();
connectCloudinary();

// Middleware order is important
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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



//applynow endpoint
app.use('/api/applications', applynowoRuter);

//advisor inquiry form
app.use("/api/advisor-inquiryform", inquiryRouter);

// Add this line with other routes
app.use('/api/applications', applicationRouter);

// Add chat routes
app.use('/api/chat', chatRouter);

// Add webinar routes
app.use('/api/webinar', webinarRouter);

// Setup WebSocket server
setupWebinarWebSocket(httpServer);

app.get("/", (req, res) => {
  res.send("API Working");
});

httpServer.listen(port, () => console.log("Server started on PORT : " + port));
