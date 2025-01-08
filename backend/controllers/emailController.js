// emailController.js
import nodemailer from 'nodemailer';
import path from 'path';

// Create the transporter for sending email using your email service (e.g., Gmail, SendGrid)
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Controller function to handle sending the email
export const sendEmail = async (req, res) => {
  const { subject, body } = req.body;
  const file = req.file;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'recipient1@example.com, recipient2@example.com', // Replace with actual user emails or a list of users
    subject,
    html: `<p>${body}</p>`,
  };

  if (file) {
    mailOptions.attachments = [
      {
        filename: file.originalname,
        path: file.path,
      },
    ];
  }

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.json({ success: false, message: error.message });
  }
};
