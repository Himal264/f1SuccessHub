import mongoose from "mongoose";

const searchProfileSchema = new mongoose.Schema({
  contact: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    country: String
  },
  academic: {
    studyLevel: String,
    fieldOfStudy: String,
    gpa: Number,
    englishTest: {
      type: String,
      score: Number
    },
    admissionTest: {
      type: String,
      score: Number
    }
  },
  preferences: {
    intake: String,
    priorities: [String],
    budgetRange: String,
    citySizePreference: String
  }
}, { timestamps: true });

export default mongoose.model('SearchProfile', searchProfileSchema);