// Backend - emailController.js
import nodemailer from "nodemailer";
import userModel from "../models/userModel.js";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const broadcastEmail = async (req, res) => {
  const { subject, body } = req.body;
  const file = req.file; // Handle file if using multer

  if (!subject || !body) {
    return res.status(400).json({
      success: false,
      message: "Subject and body are required.",
    });
  }

  try {
    console.log("Fetching registered users...");

    // Simple query to get all users
    const users = await userModel.find({}, "email");

    console.log(`Found ${users.length} registered users`);

    // Extract emails
    const emailList = users.map((user) => user.email);

    console.log(`Preparing to send emails to: `, emailList);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      bcc: emailList,
      subject,
      html: `<p>${body}</p>`,
    };

    // Add attachment if present
    if (file) {
      mailOptions.attachments = [
        {
          filename: file.originalname,
          content: file.buffer,
        },
      ];
    }

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: `Emails sent successfully to ${emailList.length} users!`,
    });
  } catch (error) {
    console.error("Error broadcasting email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send emails. Please try again later.",
      error: error.message,
    });
  }
};
