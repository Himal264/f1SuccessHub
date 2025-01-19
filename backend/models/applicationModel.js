// Application Schema for storing user submissions
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  studentInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    country: { type: String, required: true },
    countryCode: { type: String, required: true },
    phoneNumber: { type: String, required: true }
  },
  academicInfo: {
    studyLevel: { type: String, required: true, enum: ['undergraduate', 'graduate'] },
    fieldOfStudy: { type: String, required: true },
    gpa: { type: Number, required: true },
    englishTest: {
      type: { type: String, required: true },
      score: { type: Number, required: true }
    },
    admissionTest: {
      type: { type: String, required: false },
      score: { type: Number, required: false }
    }
  },
  preferences: {
    intake: String,
    priorities: [String],
    budget: { 
      type: String,
      required: true,
      enum: [
        "Less than $10,000",
        "up to $20,000",
        "up to $30,000",
        "up to $40,000",
        "$40,000 or higher"
      ]
    }
  },
  recommendedUniversities: [{
    university: { type: mongoose.Schema.Types.ObjectId, ref: 'University' },
    matchScore: Number,
    reasons: [String]
  }],
  createdAt: { type: Date, default: Date.now }
});

const Application = mongoose.model('Application', applicationSchema);

export default Application;