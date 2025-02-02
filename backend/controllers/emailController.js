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
  const { subject, body, targetRoles } = req.body;
  const file = req.file;
  let parsedTargetRoles;

  try {
    parsedTargetRoles = JSON.parse(targetRoles);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid target roles format",
    });
  }

  if (!subject || !body || !parsedTargetRoles) {
    return res.status(400).json({
      success: false,
      message: "Subject, body, and target roles are required.",
    });
  }

  try {
    console.log("Fetching targeted users...");

    // Build query based on target roles
    let query = {};
    if (!parsedTargetRoles.includes('all')) {
      query.role = { $in: parsedTargetRoles };
    }

    // Get users based on query
    const users = await userModel.find(query, "email");
    
    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No users found for the selected roles.",
      });
    }

    console.log(`Found ${users.length} targeted users`);

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
      message: `Emails sent successfully to ${emailList.length} ${
        parsedTargetRoles.includes('all') ? 'users' : 
        parsedTargetRoles.map(role => role + 's').join(', ')
      }!`,
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
