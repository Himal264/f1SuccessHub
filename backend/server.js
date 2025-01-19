import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
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
import applicationRouter from "./routes/applicationRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// App Config
const app = express();
const port = process.env.PORT || 9000;
connectDB();
connectCloudinary();

// Define allowed origins
const allowedOrigins = [
  "http://localhost:5174", // Frontend
  "http://localhost:5173", // Admin
  // Add any other origins you need
];

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Check if origin is in allowedOrigins
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Add error handling middleware
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    res.status(403).json({
      error: "CORS not allowed for this origin",
    });
  } else {
    next(err);
  }
});

app.use(express.json());
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:3000"], // add any additional frontend URLs
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// api endpoints
app.use("/api/user", userRouter);
app.use("/api/question", questionRouter);
app.use("/api/email", emailRoutes);

//university api endpoints
app.use("/api/university", universityRouter);
app.use("/api/university/:id", universityRouter);

//email broadcast
app.use("/api/email", emailRouter);

//application api endpoints 
app.use("/api/application", applicationRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => console.log("Server started on PORT : " + port));
