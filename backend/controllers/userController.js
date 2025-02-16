import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import util from "util";
const unlinkFile = util.promisify(fs.unlink);

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: "User doesn't exist" 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    const token = createToken(user._id);
    
    // Send user data with profile picture
    res.status(200).json({ 
      success: true, 
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture || {
          url: '',
          public_id: ''
        },
        verificationRequest: user.verificationRequest
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      success: false, 
      message: "An error occurred during login" 
    });
  }
};

// Route for user register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, requestedRole, additionalInfo } = req.body;
    const documents = req.files;

    // Check if user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Validate email format & password strength
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upload documents to Cloudinary and store URLs
    let uploadedDocuments = {};
    if (documents) {
      for (const [fieldName, files] of Object.entries(documents)) {
        try {
          const result = await cloudinary.uploader.upload(files[0].path, {
            folder: `verification-documents/${requestedRole}`,
            resource_type: "auto",
          });
          uploadedDocuments[fieldName] = {
            url: result.secure_url,
            public_id: result.public_id,
          };
          // Delete local file after upload
          await unlinkFile(files[0].path);
        } catch (error) {
          console.error("Cloudinary upload error:", error);
        }
      }
    }

    // Parse additionalInfo
    let parsedAdditionalInfo = {};
    try {
      parsedAdditionalInfo = JSON.parse(additionalInfo);
    } catch (error) {
      console.error("Error parsing additionalInfo:", error);
    }

    // Create user with role-specific info and documents
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role: "user",
      verificationRequest: {
        status: "pending",
        requestedRole,
        adminFeedback: "",
      },
    });

    // Add role-specific info and documents
    if (requestedRole === "alumni") {
      newUser.alumniInfo = {
        ...parsedAdditionalInfo,
        documents: {
          academicCertificate: uploadedDocuments.academic_certificate,
          studentIdCard: uploadedDocuments.student_id_card,
          transcript: uploadedDocuments.transcript,
          employmentProof: uploadedDocuments.employment_proof,
        },
      };
    } else if (requestedRole === "counselor") {
      newUser.counselorInfo = {
        ...parsedAdditionalInfo,
        documents: {
          professionalCertification: uploadedDocuments.professional_certification,
          experienceLetter: uploadedDocuments.experience_letter,
          licenseDocument: uploadedDocuments.license_document,
          professionalId: uploadedDocuments.professional_id,
          resume: uploadedDocuments.resume,
        },
      };
    } else if (requestedRole === "university") {
      newUser.universityInfo = {
        ...parsedAdditionalInfo,
        documents: {
          accreditationCertificate: uploadedDocuments.accreditation_certificate,
          institutionLicense: uploadedDocuments.institution_license,
          registrationDocument: uploadedDocuments.registration_document,
          taxRegistration: uploadedDocuments.tax_registration,
          authorizationLetter: uploadedDocuments.authorization_letter,
        },
      };
    }

    // Save user
    const user = await newUser.save();
    const token = createToken(user._id);

    // Send role-specific verification email
    try {
      let emailText = `Dear ${name},\n\nThank you for registering with F1 Success Hub! Your account has been created as a standard user.\n\n`;

      if (requestedRole !== "user") {
        emailText += `We have received your request to be registered as a ${requestedRole}. Our team will review your submitted documents and verify the information.\n\nOnce verified, your role will be updated accordingly.\n\n`;
      }

      emailText += `For any queries, feel free to contact us.\n\nBest regards,\nThe F1 Success Hub Team\nEmail: f1successhub@gmail.com\nPhone: +977-9764558713`;

      await sendEmail({
        to: email,
        subject: "Your Registration is Pending Verification",
        text: emailText,
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      // Continue with registration even if email fails
    }

    res.status(201).json({
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      },
      message: requestedRole !== "user"
        ? "Registration successful! Your verification is pending."
        : "Registration successful!",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error during registration",
    });
  }
};

// Add this controller for profile picture update
const updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    const user = await userModel.findById(req.user._id);
    if (!user) {
      // Clean up uploaded file
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      }
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    try {
      // Delete old profile picture from Cloudinary if it exists
      if (user.profilePicture?.public_id) {
        await cloudinary.uploader.destroy(user.profilePicture.public_id);
      }

      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile-pictures",
        width: 300,
        height: 300,
        crop: "fill",
        gravity: "face"
      });

      // Update user profile picture
      user.profilePicture = {
        url: result.secure_url,
        public_id: result.public_id
      };

      await user.save();

      // Clean up uploaded file
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });

      res.status(200).json({
        success: true,
        message: "Profile picture updated successfully",
        profilePicture: user.profilePicture
      });
    } catch (error) {
      // Clean up uploaded file on error
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile picture",
      error: error.message
    });
  }
};

// Add this to your existing controller file
const updateProfile = async (req, res) => {
  try {
    const { name, currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Update name if provided
    if (name && name !== user.name) {
      user.name = name;
    }

    // Update password if provided
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect"
        });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message
    });
  }
};

// Add this new controller function
const getUserStats = async (req, res) => {
  try {
    const stats = {
      totalUsers: await userModel.countDocuments({}),
      standardUsers: await userModel.countDocuments({ role: 'user' }),
      universities: await userModel.countDocuments({ role: 'university' }),
      alumni: await userModel.countDocuments({ role: 'alumni' }),
      counselors: await userModel.countDocuments({ role: 'counselor' })
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics'
    });
  }
};

export { loginUser, registerUser, adminLogin, updateProfilePicture, updateProfile, getUserStats };

// Route for admin login
const adminLogin = (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = createToken(email);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
