import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "counselor", "alumni", "university" ],
      default: "user",
    },
    profilePicture: {
      url: { 
        type: String,
        default: function() {
          const name = encodeURIComponent(this.name);
          const randomColor = Math.floor(Math.random()*16777215).toString(16);
          return `https://ui-avatars.com/api/?name=${name}&background=${randomColor}&color=ffffff`;
        }
      },
      public_id: { 
        type: String,
        default: '' 
      }
    },

    // Role-based additional fields
    counselorInfo: {
      certifiedCompany: { type: String, default: "" },
      associatedCompany: { type: String, default: "" },
      startDate: { type: Date, default: null },
      country: { type: String, required: function() {
        return this.role === 'counselor';
      }},
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
      bio: { type: String, default: "" },
      socialLinks: {
        website: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        twitter: { type: String, default: "" },
        instagram: { type: String, default: "" }
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
      bio: { type: String, default: "" },
      socialLinks: {
        website: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        twitter: { type: String, default: "" },
        instagram: { type: String, default: "" }
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
      bio: { type: String, default: "" },
      socialLinks: {
        website: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        twitter: { type: String, default: "" },
        instagram: { type: String, default: "" }
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

// Add any pre-save hooks if needed
userSchema.pre('save', function(next) {
  // If profile picture is not set, set default
  if (!this.profilePicture.url) {
    const name = encodeURIComponent(this.name);
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    this.profilePicture.url = `https://ui-avatars.com/api/?name=${name}&background=${randomColor}&color=ffffff`;
  }
  next();
});

const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;
