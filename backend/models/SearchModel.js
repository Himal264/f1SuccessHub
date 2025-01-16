import mongoose from "mongoose";

const searchProfileSchema = new mongoose.Schema({
  user: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      countryCode: {
        type: String,
        required: true
      },
      number: {
        type: String,
        required: true
      }
    },
    nationality: {
      type: String,
      required: true
    }
  },
  academicProfile: {
    studyLevel: {
      type: String,
      enum: ['undergraduate', 'graduate'],
      required: true
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
        enum: ['SAT', 'IELTS', 'Duolingo', 'PTE', 'ACT', 'GRE', 'GMAT']
      },
      score: Number
    }
  },
  preferences: {
    intake: {
      type: String,
      required: true
    },
    priorities: [{
      type: String,
      enum: ['School Ranking', 'Quality of Teaching', 'Safety', 'Employability', 'Diversity', 'Student Loan']
    }],
    budgetRange: {
      type: String,
      required: true,
      enum: [
        'Less than $10,000',
        'up to $20,000',
        'up to $30,000',
        'up to $40,000',
        '$40,000 or higher'
      ]
    }
  },
  termsAccepted: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true
});

const SearchProfile = mongoose.model('SearchProfile', searchProfileSchema);

export default SearchProfile;