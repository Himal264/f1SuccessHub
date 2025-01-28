const mongoose = require('mongoose');

const AlumniSchema = new mongoose.Schema({
  country: { type: String, required: true },
  graduationYear: { type: Number, required: true },
  university: { type: String, required: true },
  currentWorkplace: { type: String },
  currentRole: { type: String }
});

const CounselorSchema = new mongoose.Schema({
  specialization: { type: String, required: true },
  experience: { type: Number, required: true },
  description: { type: String, required: true },
  certifications: [{ type: String }],
  workDomain: { type: String, required: true }
});

const ProfessorSchema = new mongoose.Schema({
  department: { type: String, required: true },
  university: { type: String, required: true },
  researchInterests: [{ type: String }],
  publications: [{ 
    title: String, 
    year: Number, 
    journal: String 
  }],
  academicBackground: { type: String }
});

const PartnerCompanySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  industry: { type: String, required: true },
  description: { type: String, required: true },
  contactEmail: { type: String },
  websiteUrl: { type: String }
});

const UniversitySchema = new mongoose.Schema({
  universityName: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, enum: ['Public', 'Private'] },
  rankingInfo: {
    nationalRanking: { type: Number },
    internationalRanking: { type: Number }
  },
  programHighlights: [{ type: String }]
});

const StorySchema = new mongoose.Schema({
  storiesType: {
    type: String,
    required: true,
    enum: ['news', 'study in us', 'success stories', 'university', 'students']
  },
  postCreateType: {
    type: String,
    required: true,
    enum: ['F1SuccessHub Team', 'Alumni', 'Professor', 'Counselor', 'Partner Company', 'University']
  },
  postCategory: {
    type: String,
    required: true,
    enum: [
      'cultural shock', 'internships', 'scholarships tips', 'visa experience', 
      'part-time jobs', 'networking', 'research opportunities', 'health and wellness', 
      'announcements', 'financial aid', 'university application', 'career planning', 
      'campus life', 'advice for students', 'state', 'travel tips', 
      'Engineering', 'Humanities', 'Medical and Health Sciences', 'Natural Sciences', 
      'Business', 'Computer Science', 'Social Science', 'Education'
    ]
  },
  text: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return v.length <= 7000;
      },
      message: 'Text must be 7000 characters or less'
    }
  },
  additionalDetails: {
    alumni: AlumniSchema,
    counselor: CounselorSchema,
    professor: ProfessorSchema,
    partnerCompany: PartnerCompanySchema,
    university: UniversitySchema
  }
}, { timestamps: true });

module.exports = mongoose.model('Story', StorySchema);