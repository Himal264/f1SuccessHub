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
      type: [String],
      required: true,
    },
    graduationrate:{
      type: Number,
      required: true
    },
    acceptancerate: {
      type: Number,
      required: true
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
      tuitionFee: { type: Number, required: true },
      livingFee: { type: Number, required: true },
      otherFees: { type: Number, required: true },
    },
    location: {
      name: { type: String, required: true },
      totalPopulation: { type: Number, required: true },
      citysize: { type: Number, required: true },
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
        ACT: { type: Number, min: 1, max: 36, required: false }, 
      },
      graduate: {
        SAT: { type: Number, min: 1, max: 1600, required: false }, 
        GPA: { type: Number, min: 1, max: 4.0, required: true }, 
        Duolingo: { type: Number, min: 1, max: 160, required: false },
        IELTS: { type: Number, min: 1, max: 9.0, required: false }, 
        PTE: { type: Number, min: 1, max: 90, required: false }, 
        ACT: { type: Number, min: 1, max: 36, required: false }, 
        GRE: { type: Number, min: 1, max: 340, required: false }, 
      },
    },
  },
  {
    timestamps: true,
  }
);

const University = mongoose.model("University", universitySchema);

export default University;
