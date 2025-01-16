import SearchProfile from "../models/SearchModel";
import mongoose from "mongoose";

export function calculateUniversityMatch(studentProfile, university) {
  let totalScore = 0;
  let maxPossibleScore = 0;
  const scores = {
    academicMatch: {
      weight: 40,
      criteria: {
        gpaMatch: 15,
        englishScoreMatch: 15,
        programMatch: 10,
      },
    },

    financialFit: {
      weight: 25,
      criteria: {
        tuitionMatch: 15,
        scholarshipOpportunities: 10,
      },
    },

    preferencesMatch: {
      weight: 20,
      criteria: {
        locationMatch: 5,
        universitySize: 5,
        campusLife: 5,
        teachingQuality: 5,
      },
    },

    additionalCriteria: {
      weight: 15,
      criteria: {
        employmentRate: 5,
        internationalSupport: 5,
        researchOpportunities: 5,
      },
    },
  };

  function calculateGPAMatch(studentGPA, universityMinGPA) {
    const gpaScore =
      studentGPA >= universityMinGPA
        ? 15
        : 15 * (studentGPA / universityMinGPA);
    return Math.max(0, Math.min(15, gpaScore));
  }

  function calculateEnglishScoreMatch(
    studentScore,
    universityRequirement,
    testType
  ) {
    const scoreRanges = {
      IELTS: { max: 9, min: 6 },
      TOEFL: { max: 120, min: 80 },
      Duolingo: { max: 160, min: 100 },
      PTE: { max: 90, min: 50 },
      SAT: { max: 1600, min: 1000 },
      ACT: { max: 36, min: 20 },
      GRE: { max: 340, min: 290 },
    };

    const range = scoreRanges[testType];
    if (!range) return 0;

    const normalizedScore =
      (studentScore - range.min) / (range.max - range.min);
    const normalizedRequirement =
      (universityRequirement - range.min) / (range.max - range.min);

    return Math.max(
      0,
      Math.min(15, 15 * (normalizedScore / normalizedRequirement))
    );
  }

  function calculateProgramMatch(studentProgram, universityPrograms) {
    if (universityPrograms[studentProgram]) {
      return 10;
    }

    const relatedPrograms = getRelatedPrograms(studentProgram);
    for (const related of relatedPrograms) {
      if (universityPrograms[related]) {
        return 7;
      }
    }
    return 0;
  }

  function calculateFinancialFit(
    studentBudget,
    universityTuition,
    scholarships
  ) {
    let score = 0;
    const budgetRanges = {
      "Less than $10,000": 10000,
      "up to $20,000": 20000,
      "up to $30,000": 30000,
      "up to $40,000": 40000,
      "$40,000 or higher": 50000,
    };

    const maxBudget = budgetRanges[studentBudget];
    if (universityTuition <= maxBudget) {
      score += 15;
    } else {
      score += Math.max(0, 15 * (maxBudget / universityTuition));
    }

    if (scholarships && scholarships.length > 0) {
      score +=
        10 *
        (scholarships.reduce((acc, s) => acc + s.amount, 0) /
          universityTuition);
    }

    return Math.min(25, score);
  }

  function calculatePreferencesMatch(studentPreferences, university) {
    let score = 0;

    for (const pref of studentPreferences) {
      switch (pref) {
        case "Quality of Teaching":
          score += (university.scores.qualityOfTeaching / 100) * 5;
          break;
        case "Safety":
          score += (university.scores.safety / 100) * 5;
          break;
        case "Employability":
          score += (university.scores.employment / 100) * 5;
          break;
        case "Diversity":
          score += (university.scores.diversity / 100) * 5;
          break;
        case "School Ranking":
          const rankingScore = university.rankings.world
            ? Math.max(0, 5 - university.rankings.world / 200)
            : 0;
          score += rankingScore;
          break;
      }
    }

    return Math.min(20, score);
  }

  let matchScore = {
    total: 0,
    breakdown: {
      academic:
        calculateGPAMatch(
          studentProfile.gpa,
          university.admissionRequirements[studentProfile.studyLevel].GPA
        ) +
        calculateEnglishScoreMatch(
          studentProfile.englishTest.score,
          university.admissionRequirements[studentProfile.studyLevel][
            studentProfile.englishTest.type
          ],
          studentProfile.englishTest.type
        ) +
        calculateProgramMatch(
          studentProfile.fieldOfStudy,
          university[`${studentProfile.studyLevel}Programs`].programs
        ),
      financial: calculateFinancialFit(
        studentProfile.preferences.budgetRange,
        university.feeStructure[studentProfile.studyLevel].tuitionFee,
        university.scholarships
      ),
      preferences: calculatePreferencesMatch(
        studentProfile.preferences.priorities,
        university
      ),
    },
  };

  matchScore.total =
    matchScore.breakdown.academic +
    matchScore.breakdown.financial +
    matchScore.breakdown.preferences;

  return {
    universityId: university._id,
    universityName: university.name,
    totalScore: Math.round(matchScore.total),
    matchPercentage: Math.round((matchScore.total / 100) * 100),
    breakdown: {
      academic: Math.round(matchScore.breakdown.academic),
      financial: Math.round(matchScore.breakdown.financial),
      preferences: Math.round(matchScore.breakdown.preferences),
    },
    requirements: {
      missingRequirements: [],
      recommendations: [],
    },
  };
}

// Function to sort and rank universities based on match scores
export function rankUniversities(studentProfile, universities) {
  const matches = universities.map((university) => ({
    ...calculateUniversityMatch(studentProfile, university),
    university,
  }));

  // Sort by total score in descending order
  return matches
    .sort((a, b) => b.totalScore - a.totalScore)
    .map((match, index) => ({
      ...match,
      rank: index + 1,
    }));
}
