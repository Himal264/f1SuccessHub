import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "counselor", "alumni", "university"],
      default: "user",
    },

    // Role-based additional fields
    counselorInfo: {
      certifiedCompany: { type: String, default: "" },
      associatedCompany: { type: String, default: "" },
      startDate: { type: Date, default: null },
      documents: {
        professionalCertification: {
          url: { type: String },
          public_id: { type: String },
        },
        experienceLetter: {
          url: { type: String },
          public_id: { type: String },
        },
        licenseDocument: {
          url: { type: String },
          public_id: { type: String },
        },
        professionalId: {
          url: { type: String },
          public_id: { type: String },
        },
        resume: {
          url: { type: String },
          public_id: { type: String },
        },
        otherDocuments: [
          {
            url: { type: String },
            public_id: { type: String },
          },
        ],
      },
    },

    alumniInfo: {
      universityName: { type: String, default: "" },
      startStudy: { type: Date, default: null },
      endStudy: { type: Date, default: null },
      degree: { type: String, default: "" },
      certifiedCompany: { type: String, default: "" },
      currentCompany: { type: String, default: "" },
      documents: {
        academicCertificate: {
          url: { type: String },
          public_id: { type: String },
        },
        studentIdCard: {
          url: { type: String },
          public_id: { type: String },
        },
        transcript: {
          url: { type: String },
          public_id: { type: String },
        },
        employmentProof: {
          url: { type: String },
          public_id: { type: String },
        },
        otherDocuments: [
          {
            url: { type: String },
            public_id: { type: String },
          },
        ],
      },
    },

    universityInfo: {
      universityName: { type: String, default: "" },
      establishedYear: { type: Number, default: null },
      location: { type: String, default: "" },
      accreditation: { type: String, default: "" },
      programsOffered: [{ type: String }],
      website: { type: String, default: "" },
      contactEmail: { type: String, default: "" },
      contactPhone: { type: String, default: "" },
      documents: {
        accreditationCertificate: {
          url: { type: String },
          public_id: { type: String },
        },
        institutionLicense: {
          url: { type: String },
          public_id: { type: String },
        },
        registrationDocument: {
          url: { type: String },
          public_id: { type: String },
        },
        taxRegistration: {
          url: { type: String },
          public_id: { type: String },
        },
        authorizationLetter: {
          url: { type: String },
          public_id: { type: String },
        },
        otherDocuments: [
          {
            url: { type: String },
            public_id: { type: String },
          },
        ],
      },
    },

    verificationRequest: {
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
      requestedRole: { type: String },
      adminFeedback: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
