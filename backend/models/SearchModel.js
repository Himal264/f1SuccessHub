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
    studyLevel: {
      type: String,
      required: true,
      enum: ['undergraduate', 'graduate']
    },
    fieldOfStudy: {
      type: String,
      required: true
    },
    gpa: {
      type: Number,
      required: true,
      min: 0,
      max: 4.0
    },
    englishTest: {
      type: {
        type: String,
        enum: ['IELTS', 'TOEFL', 'PTE', 'Duolingo']
      },
      score: {
        type: Number
      }
    },
    admissionTest: {
      type: {
        type: String,
        enum: ['SAT', 'ACT', 'GRE', 'GMAT', 'LSAT', 'MCAT']
      },
      score: {
        type: Number
      }
    },
    intake: String,
    priorities: [String],
    budgetRange: {
      type: String,
      enum: [
        'Less than $10,000',
        'up to $20,000',
        'up to $30,000',
        'up to $40,000',
        '$40,000 or higher'
      ]
    },
    citySizePreference: {
      type: String,
      enum: ['Small', 'Medium', 'Large', 'Metropolitan']
    },
    termsAccepted: Boolean
  },
  preferences: {
    intake: String,
    priorities: [String],
    budgetRange: String,
    citySizePreference: String
  }
}, { timestamps: true });

// Remove the pre-save middleware since we're now handling objects directly
// No need to parse strings anymore

const SearchProfile = mongoose.model('SearchProfile', searchProfileSchema);

export default SearchProfile;