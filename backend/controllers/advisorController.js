import AdvisorInquiry from "../models/advisorModel.js";
import nodemailer from "nodemailer";

// Handle form submission


export const submitInquiry = async (req, res) => {
  try {
    const formData = req.body;

    // Save inquiry to database
    const newInquiry = new AdvisorInquiry(formData);
    await newInquiry.save();

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      service: "gmail", // Change this based on your email service
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app password
      },
    });

   const mailOptions = {
    from: process.env.EMAIL_USER, // Sender email
    to: formData.email, // Recipient's email from form data
    subject: "Thank You for Contacting Us!",
    html: `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://res.cloudinary.com/dq7due8fx/image/upload/v1737351703/university-media/q5ygoo2sh71lpgsrgjm2.png" alt="F1 Success Hub Logo" style="max-width: 150px; border-radius: 8px;"/>
        </div>
        <h2 style="text-align: center; color: #0056b3;">Thank You for Reaching Out!</h2>
        <p>Dear <strong>${formData.firstName} ${formData.lastName}</strong>,</p>
        <p>We appreciate you contacting us and want to assure you that your inquiry is our priority. Our dedicated team is currently reviewing your message and will provide a detailed response shortly.</p>
        <p>In the meantime, feel free to explore our <a href="https://example.com/resources" style="color: #0056b3; text-decoration: none;">resources page</a> for helpful articles and guides.</p>
        <div style="background-color: #f4f4f4; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <p style="margin: 0; text-align: center;">If your request is urgent, don’t hesitate to reach out to us directly at <a href="mailto:support@example.com" style="color: #0056b3; text-decoration: none;">support@example.com</a>.</p>
        </div>
        <p>Thank you for choosing us. We look forward to assisting you!</p>
        <p style="margin-top: 20px;">Best regards,<br/><strong>The Advisor Team</strong></p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
        <p style="font-size: 12px; color: #888; text-align: center;">This is an automated email. Please do not reply directly to this email. If you need assistance, contact us at <a href="mailto:support@example.com" style="color: #0056b3; text-decoration: none;">support@example.com</a>.</p>
    </div>
    `,
};

  

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "Inquiry submitted successfully. Confirmation email sent.",
    });
  } catch (error) {
    console.error("Error processing inquiry:", error);
    res.status(500).json({ message: "Failed to submit inquiry." });
  }
};

// Retrieve all inquiries
export const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await AdvisorInquiry.find();
    res.status(200).json(inquiries);
  } catch (error) {
    console.error("Error retrieving inquiries:", error);
    res.status(500).json({ message: "Failed to retrieve inquiries" });
  }
};
