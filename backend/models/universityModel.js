import mongoose from "mongoose";

// Validation for media array limit
function arrayLimit(val) {
  return val.length <= 5;
}

const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    logoUrl: {
      type: String,
      required: true,
    },
    media: {
      type: [String],
      validate: [arrayLimit, "{PATH} exceeds the limit of 5"],
    },
    applicationFee: {
      type: Number,
      required: true,
    },
    intake: {
      type: [
        {
          month: {
            type: String,
            required: true,
            enum: [
              'January', 'February', 'March', 'April', 'May', 'June', 
              'July', 'August', 'September', 'October', 'November', 'December',
              'Summer', 'Fall', 'Winter', 'Spring'
            ], // We allow month names as well as seasons like Summer, Fall, etc.
          },
          year: {
            type: Number,
            required: true,
          },
          deadline: {
            type: Date,
            required: true, // Ensure deadline is provided
          },
        },
      ],
      required: true,
    },
    graduationrate: {
      type: Number,
      required: true,
    },
    acceptancerate: {
      type: Number,
      required: true,
    },
    undergraduatePrograms: {
      description: { type: String, required: true },
      programs: {
        Engineering: { type: [String], required: true },
        Humanities: { type: [String], required: true },
        MedicalandHealthSciences: { type: [String], required: true },
        NaturalSciences: { type: [String], required: true },
        Business: { type: [String], required: true },
        ComputerScience: { type: [String], required: true },
        SocialScience: { type: [String], required: true },
        Education: { type: [String], required: true },
      },
    },
    graduatePrograms: {
      description: { type: String, required: true },
      programs: {
        Engineering: { type: [String], required: true },
        Humanities: { type: [String], required: true },
        MedicalandHealthSciences: { type: [String], required: true },
        NaturalSciences: { type: [String], required: true },
        Business: { type: [String], required: true },
        ComputerScience: { type: [String], required: true },
        SocialScience: { type: [String], required: true },
        Education: { type: [String], required: true },
      },
    },
    scholarships: [
      {
        name: { type: String, required: true },
        type: { type: String, required: true },
        eligibility: { type: String, required: true },
        amount: { type: Number, required: true },
        duration: { type: String, required: true },
      },
    ],
    rankings: {
      world: { type: Number, default: null },
      usa: { type: Number, default: null },
      state: { type: Number, default: null },
    },
    totalEnrollment: {
      type: Number,
      required: true,
    },
    internationalStudentPercentage: {
      type: Number,
      required: true,
    },
    feeStructure: {
      undergraduate: {
        tuitionFee: { type: Number, required: true },
        livingFee: { type: Number, required: true },
        otherFees: { type: Number, required: true },
      },
      graduate: {
        tuitionFee: { type: Number, required: true },
        livingFee: { type: Number, required: true },
        otherFees: { type: Number, required: true },
      },
    },
    location: {
      name: { type: String, required: true },
      state: {
        type: String,
        required: true,
        enum: [
          "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
          "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
          "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine",
          "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
          "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
          "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
          "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee",
          "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
        ],
      },
      region: {
        type: String,
        required: true,
        enum: ["US - Midwest", "US - Northeast", "US - South", "US - West"], // Predefined regions
      },
      totalPopulation: { type: Number, required: true },
      citysize: {
        type: String,
        required: true,
        enum: ["Small", "Medium", "Large", "Metropolitan"], // Predefined city sizes (without Megacity)
      },
    
      nearbyCities: { type: [String], required: true },
      keyIndustries: { type: [String], required: true },
      landmarks: { type: [String], required: true },
      locationPhoto: { type: String, required: true },

      weather: {
        summer: { type: String, required: true },
        winter: { type: String, required: true },
      },
      travelTime: [
        {
          city: { type: String, required: true },
          time: { type: String, required: true },
        },
      ],
    },
    contact: {
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      website: { type: String, required: true },
    },
    description: {
      type: String,
      required: true,
    },
    scores: {
      safety: { type: Number, min: 0, max: 100, required: true },
      employment: { type: Number, min: 0, max: 100, required: true },
      diversity: { type: Number, min: 0, max: 100, required: true },
      qualityOfTeaching: { type: Number, min: 0, max: 100, required: true },
    },
    admissionRequirements: {
      undergraduate: {
        SAT: { type: Number, min: 1, max: 1600, required: false },
        GPA: { type: Number, min: 1, max: 4.0, required: true },
        Duolingo: { type: Number, min: 1, max: 160, required: false },
        IELTS: { type: Number, min: 1, max: 9.0, required: false },
        PTE: { type: Number, min: 1, max: 90, required: false },
       TOEFL: { type: Number, min: 1, max: 120, required: false },
        ACT: { type: Number, min: 1, max: 36, required: false },
        
      },
      graduate: {
        GPA: { type: Number, min: 1, max: 4.0, required: true },
        IELTS: { type: Number, min: 1, max: 9.0, required: false },
        PTE: { type: Number, min: 1, max: 90, required: false },
        Duolingo: { type: Number, min: 1, max: 160, required: false },
        TOEFL: { type: Number, min: 1, max: 120, required: false },
        GRE: { type: Number, min: 1, max: 340, required: false },
        MCAT: { type: Number, min: 1, max: 528, required: false },
        LSAT: { type: Number, min: 1, max: 180, required: false },
        GMAT: { type: Number, min: 1, max: 1600, required: false },
      },
    },
  },
  {
    timestamps: true,
  }
);

const University = mongoose.model("University", universitySchema);

export default University;
