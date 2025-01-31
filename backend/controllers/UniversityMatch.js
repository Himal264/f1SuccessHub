// controllers/universityMatch.js
import University from '../models/universityModel.js';
import SearchProfile from '../models/SearchModel.js';

// Helper function to get related programs
function getRelatedPrograms(mainProgram) {
  const programRelations = {
    'NaturalSciences': ['Environmental Science', 'Physics', 'Chemistry'],
    'Engineering': ['Computer Science', 'Mechanical Engineering'],
    'Business': ['Economics', 'Finance'],
    'ComputerScience': ['Information Technology', 'Software Engineering']
  };
  return programRelations[mainProgram] || [];
}

export const calculateUniversityMatch = (studentProfile, university) => {
  // Convert budget ranges to numerical values
  const budgetRanges = {
    "Less than $10,000": 10000,
    "up to $20,000": 20000,
    "up to $30,000": 30000,
    "up to $40,000": 40000,
    "$40,000 or higher": 50000
  };

  // Calculate GPA Match
  const calculateGPAMatch = (studentGPA, universityMinGPA) => {
    return studentGPA >= universityMinGPA ? 15 : 15 * (studentGPA / universityMinGPA);
  };

  // Calculate English Test Match
  const calculateEnglishScoreMatch = (studentScore, universityRequirement, testType) => {
    const scoreRanges = {
      IELTS: { max: 9, min: 6 },
      TOEFL: { max: 120, min: 80 },
      Duolingo: { max: 160, min: 100 },
      PTE: { max: 90, min: 50 }
    };
    
    const range = scoreRanges[testType] || { max: 1, min: 0 };
    const normalizedScore = (studentScore - range.min) / (range.max - range.min);
    const normalizedRequirement = (universityRequirement - range.min) / (range.max - range.min);
    
    return 15 * Math.min(normalizedScore / normalizedRequirement, 1);
  };

  // Calculate Program Match
  const calculateProgramMatch = (studentProgram, universityPrograms) => {
    if (universityPrograms[studentProgram]) return 10;
    return getRelatedPrograms(studentProgram).some(p => universityPrograms[p]) ? 7 : 0;
  };

  // Calculate Financial Fit
  const calculateFinancialFit = (studentBudget, universityTuition, scholarships) => {
    const maxBudget = budgetRanges[studentBudget] || 0;
    let score = Math.min(15, 15 * (maxBudget / universityTuition));
    
    if (scholarships?.length > 0) {
      const totalScholarships = scholarships.reduce((sum, s) => sum + s.amount, 0);
      score += 10 * (totalScholarships / universityTuition);
    }
    
    return Math.min(25, score);
  };

  // Calculate Preferences Match
  const calculatePreferencesMatch = (studentPreferences, university) => {
    return studentPreferences.reduce((score, pref) => {
      switch(pref) {
        case 'School Ranking':
          return score + (university.rankings?.world ? 5 - (university.rankings.world / 200) : 0);
        case 'Quality of Teaching':
          return score + (university.scores.qualityOfTeaching / 20);
        case 'Diversity':
          return score + (university.scores.diversity / 20);
        case 'Safety':
          return score + (university.scores.safety / 20);
        case 'City Size':
          return score + (university.location.citysize === studentProfile.citySizePreference ? 5 : 0);
        default:
          return score;
      }
    }, 0);
  };

  // Main calculation
  try {
    const studyLevel = studentProfile.studyLevel;
    const admissionReqs = university.admissionRequirements[studyLevel];
    const programs = university[`${studyLevel}Programs`].programs;

    const academicScore = 
      calculateGPAMatch(studentProfile.gpa, admissionReqs.GPA) +
      calculateEnglishScoreMatch(
        studentProfile.englishTest.score,
        admissionReqs[studentProfile.englishTest.type],
        studentProfile.englishTest.type
      ) +
      calculateProgramMatch(studentProfile.fieldOfStudy, programs);

    const financialScore = calculateFinancialFit(
      studentProfile.budgetRange,
      university.feeStructure[studyLevel].tuitionFee,
      university.scholarships
    );

    const preferenceScore = calculatePreferencesMatch(
      studentProfile.priorities,
      university
    );

    const totalScore = academicScore + financialScore + preferenceScore;

    return {
      universityId: university._id,
      universityName: university.name,
      totalScore: Math.round(totalScore),
      matchPercentage: Math.round((totalScore / 100) * 100),
      breakdown: {
        academic: Math.round(academicScore),
        financial: Math.round(financialScore),
        preferences: Math.round(preferenceScore)
      },
      requirements: {
        missingRequirements: [],
        recommendations: []
      }
    };
  } catch (error) {
    console.error('Error calculating match:', error);
    return {
      universityId: university._id,
      error: 'Error calculating match score'
    };
  }
};

export const getUniversityMatches = async (req, res) => {
  try {
    // Validate request body
    const requiredFields = ['studyLevel', 'fieldOfStudy', 'gpa', 'englishTest', 'priorities', 'budgetRange'];
    const missingFields = requiredFields.filter(field => !req.body.academic[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Save search profile
    const searchProfile = new SearchProfile({
      academic: req.body.academic,
      contact: req.body.contact
    });
    await searchProfile.save();

    // Get all universities
    const universities = await University.find().lean();

    // Calculate matches
    const matches = universities
      .map(university => ({
        ...calculateUniversityMatch(req.body.academic, university),
        university
      }))
      .filter(match => !match.error)
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 50); // Return top 50 matches

    res.status(200).json({
      success: true,
      count: matches.length,
      matches
    });

  } catch (error) {
    console.error('Error in university matching:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};