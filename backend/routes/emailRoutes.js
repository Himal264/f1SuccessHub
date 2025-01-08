import express from 'express';
import nodemailer from 'nodemailer';
import multer from 'multer';
import path from 'path';
import userModel from '../models/userModel.js'; // Import the User model to fetch emails

const router = express.Router();

// Multer setup for file upload (photo)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Directory where files will be stored temporarily
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Unique filename based on timestamp
  },
});

const upload = multer({ storage });

// Create the transporter for sending email using your email service (e.g., Gmail, SendGrid)
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Using Gmail as an example; change it to your service provider
  auth: {
    user: process.env.EMAIL_USER,  // Add your email here
    pass: process.env.EMAIL_PASS,  // Add your email password here (use environment variables for security)
  },
});


router.post('/email/send', upload.single('file'), async (req, res) => {
  const { subject, body } = req.body;  // Email subject and body from the form
  const file = req.file;  // Uploaded file (if any)

  try {
    // Fetch all user emails from the database
    const users = await userModel.find();
    const userEmails = users.map(user => user.email);  // Extract user emails into an array

    // Define the email options (e.g., recipient, subject, body)
    const mailOptions = {
      from: process.env.EMAIL_USER,  
      to: userEmails.join(', '),  
      subject,
      html: `<p>${body}</p>`, 
    };

    // If a file was uploaded, attach it to the email
    if (file) {
      mailOptions.attachments = [
        {
          filename: file.originalname,
          path: file.path,  // Path to the file uploaded
        },
      ];
    }

    // Attempt to send the email
    await transporter.sendMail(mailOptions);

    // Send success response
    res.json({ success: true, message: 'Email sent to all users!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.json({ success: false, message: error.message });
  }
});

export default router;
