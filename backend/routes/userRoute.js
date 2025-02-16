import express from "express";
import multer from "multer";
import path from "path";
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {
  loginUser,
  registerUser,
  adminLogin,
  updateProfilePicture,
  updateProfile,
  getUserStats
} from "../controllers/userController.js";
import userModel from "../models/userModel.js";
import sendEmail from "../utils/emailSender.js";
import adminAuth from "../middlewares/adminAuth.js";
import { auth } from '../middlewares/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads/profiles');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const userRouter = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  }
});

// Configure multer for profile pictures
const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profiles/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "profile-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const profileUpload = multer({
  storage: profileStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
});

// Update the fields to match those being sent from the frontend
userRouter.post(
  "/register",
  upload.fields([
    { name: "academic_certificate", maxCount: 1 },
    { name: "student_id_card", maxCount: 1 },
    { name: "transcript", maxCount: 1 },
    { name: "employment_proof", maxCount: 1 },
    { name: "professional_certification", maxCount: 1 },
    { name: "experience_letter", maxCount: 1 },
    { name: "license_document", maxCount: 1 },
    { name: "professional_id", maxCount: 1 },
    { name: "resume", maxCount: 1 },
    { name: "accreditation_certificate", maxCount: 1 },
    { name: "institution_license", maxCount: 1 },
    { name: "registration_document", maxCount: 1 },
    { name: "tax_registration", maxCount: 1 },
    { name: "authorization_letter", maxCount: 1 },
    // Add other fields as necessary
  ]),
  async (req, res) => {
    try {
      await registerUser(req, res);
    } catch (error) {
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: "File is too large. Maximum size is 2MB",
          });
        }
      }
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

userRouter.post("/login", loginUser);
userRouter.post("/adminlogin", adminLogin);

// Get all verification requests
userRouter.get("/verification-requests", adminAuth, async (req, res) => {
  try {
    console.log("Starting to fetch verification requests...");

    // First, check if the model exists
    if (!userModel) {
      console.error("userModel is not defined");
      return res.status(500).json({
        success: false,
        message: "Database model not initialized",
      });
    }

    // Try to find all users with pending verification
    const requests = await userModel
      .find({
        "verificationRequest.status": "pending",
      })
      .lean(); // Use lean() for better performance

    console.log("Database query completed");
    console.log("Number of requests found:", requests ? requests.length : 0);
    console.log("Requests data:", JSON.stringify(requests, null, 2));

    // Send response
    return res.status(200).json({
      success: true,
      data: requests || [],
      count: requests ? requests.length : 0,
    });
  } catch (error) {
    console.error("Detailed error in verification-requests:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching verification requests",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// Update verification status - Add this route for admin
userRouter.put("/verify-role/:userId", adminAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, adminFeedback } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update verification status
    user.verificationRequest.status = status;
    user.verificationRequest.adminFeedback = adminFeedback;

    // If approved, update the user's role
    if (status === "approved") {
      user.role = user.verificationRequest.requestedRole;
    }

    await user.save();

    // Send email notification to user
    const emailSubject = `Role Verification ${
      status.charAt(0).toUpperCase() + status.slice(1)
    }`;
    const emailText = `Dear ${user.name},

Your request to be verified as a ${
      user.verificationRequest.requestedRole
    } has been ${status}.

${
  adminFeedback
    ? `Admin Feedback: ${adminFeedback}

`
    : ""
}Best regards,
The F1 Success Hub Team`;

    await sendEmail({
      to: user.email,
      subject: emailSubject,
      text: emailText,
    });

    res.status(200).json({
      success: true,
      message: "Verification status updated successfully",
    });
  } catch (error) {
    console.error("Error updating verification status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating verification status",
      error: error.message,
    });
  }
});

// Update profile routes
userRouter.put("/update-profile", auth, updateProfile);
userRouter.put("/update-profile-picture", auth, upload.single('profilePicture'), updateProfilePicture);

// Test route
userRouter.get("/test", (req, res) => {
  res.json({ message: "User route is working" });
});

// Add this new route
userRouter.get("/stats", adminAuth, getUserStats);

export default userRouter;
