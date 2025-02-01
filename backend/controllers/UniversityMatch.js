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
    console.log('Received payload:', req.body);

    // Validate request body
    if (!req.body.academic) {
      return res.status(400).json({
        success: false,
        error: 'Missing academic data in request'
      });
    }

    // Create search profile
    try {
      const searchProfile = new SearchProfile({
        contact: req.body.contact,
        academic: {
          ...req.body.academic,
          // Ensure test objects are properly structured
          englishTest: {
            type: req.body.academic.englishTest.type || '',
            score: Number(req.body.academic.englishTest.score) || 0
          },
          admissionTest: {
            type: req.body.academic.admissionTest.type || '',
            score: Number(req.body.academic.admissionTest.score) || 0
          },
          // Ensure GPA is a number
          gpa: Number(req.body.academic.gpa)
        },
        preferences: {
          intake: req.body.academic.intake || '',
          priorities: req.body.academic.priorities || [],
          budgetRange: req.body.academic.budgetRange || '',
          citySizePreference: req.body.academic.citySizePreference || ''
        }
      });

      await searchProfile.save();
      console.log('Search profile saved:', searchProfile._id);

      // Get universities and calculate matches
      const universities = await University.find().lean();
      
      if (!universities || universities.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'No universities found in database'
        });
      }

      const matches = universities
        .map(university => {
          try {
            const matchScore = calculateUniversityMatch(searchProfile.academic, university);
            return {
              ...matchScore,
              university: {
                _id: university._id,
                name: university.name,
                location: university.location,
                rankings: university.rankings,
                feeStructure: university.feeStructure,
                logoUrl: university.logoUrl,
                totalEnrollment: university.totalEnrollment
              }
            };
          } catch (error) {
            console.error('Error calculating match for university:', university._id, error);
            return null;
          }
        })
        .filter(match => match && !match.error && match.matchPercentage >= 40)
        .sort((a, b) => b.matchPercentage - a.matchPercentage)
        .slice(0, 10);

      return res.status(200).json({
        success: true,
        searchProfileId: searchProfile._id,
        count: matches.length,
        matches
      });

    } catch (dbError) {
      console.error('Database operation error:', dbError);
      return res.status(500).json({
        success: false,
        error: 'Database operation failed',
        details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      });
    }

  } catch (error) {
    console.error('Error in university matching:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Add a new endpoint to get matches by search profile ID
export const getMatchesBySearchProfile = async (req, res) => {
  try {
    const { searchProfileId } = req.params;
    const searchProfile = await SearchProfile.findById(searchProfileId);
    
    if (!searchProfile) {
      return res.status(404).json({
        success: false,
        error: 'Search profile not found'
      });
    }

    const universities = await University.find().lean();
    const matches = universities
      .map(university => {
        const matchScore = calculateUniversityMatch(searchProfile.academic, university);
        return {
          ...matchScore,
          university: {
            _id: university._id,
            name: university.name,
            location: university.location,
            rankings: university.rankings,
            feeStructure: university.feeStructure,
            logoUrl: university.logoUrl,
            totalEnrollment: university.totalEnrollment
          }
        };
      })
      .filter(match => !match.error && match.matchPercentage >= 40)
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 10);

    res.status(200).json({
      success: true,
      searchProfile,
      count: matches.length,
      matches
    });

  } catch (error) {
    console.error('Error fetching matches by search profile:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};