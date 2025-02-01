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
      return res.json({ success: false, message: "User doesn't exists" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = createToken(user._id);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "invalid credential" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
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

export { loginUser, registerUser, adminLogin };

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
