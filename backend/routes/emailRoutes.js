import express from "express";
import nodemailer from "nodemailer";
import multer from "multer";
import path from "path";
import userModel from "../models/userModel.js"; // Import the User model to fetch emails

const router = express.Router();

// Multer setup for file upload (photo)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory where files will be stored temporarily
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename based on timestamp
  },
});

const upload = multer({ storage });

// Create the transporter for sending email using your email service (e.g., Gmail, SendGrid)
const transporter = nodemailer.createTransport({
  service: "gmail", // Using Gmail as an example; change it to your service provider
  auth: {
    user: process.env.EMAIL_USER, // Add your email here
    pass: process.env.EMAIL_PASS, // Add your email password here (use environment variables for security)
  },
});

// Test the email configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log("Email configuration error:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

router.post("/broadcast", upload.single("file"), async (req, res) => {
  try {
    console.log("Starting email broadcast...");
    const { subject, body } = req.body;
    const attachment = req.file;

    // Log the request data
    console.log("Subject:", subject);
    console.log("Body:", body);
    console.log("Attachment:", attachment);

    // Get all users
    const users = await userModel.find({}, "email");
    console.log("Found users:", users.length);

    if (!users || users.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No registered users found in database",
      });
    }

    const emails = users.map((user) => user.email);
    console.log("Sending email to:", emails);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      bcc: emails,
      subject: subject,
      text: body,
      attachments: attachment
        ? [
            {
              filename: attachment.originalname,
              path: attachment.path,
            },
          ]
        : [],
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info);

    res.json({
      success: true,
      message: `Email sent successfully to ${emails.length} users`,
      emailInfo: info,
    });
  } catch (error) {
    console.error("Detailed error:", error);

    // Send a more detailed error response
    res.status(500).json({
      success: false,
      message: "Failed to send broadcast email",
      error: {
        message: error.message,
        code: error.code,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
    });
  }
});

export default router;
