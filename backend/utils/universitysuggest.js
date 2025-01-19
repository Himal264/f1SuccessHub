
// Utility functions for matching logic
const calculateBudgetScore = (university, studyLevel, budgetPreference) => {
  const budgetRanges = {
    "Less than $10,000": 10000,
    "up to $20,000": 20000,
    "up to $30,000": 30000,
    "up to $40,000": 40000,
    "$40,000 or higher": Infinity
  };

  const totalCost = 
    university.feeStructure[studyLevel].tuitionFee + 
    university.feeStructure[studyLevel].livingFee + 
    university.feeStructure[studyLevel].otherFees;

  return totalCost <= budgetRanges[budgetPreference] ? 1 : 0;
};

const calculateTestScore = (university, application) => {
  const requirements = university.admissionRequirements[application.academicInfo.studyLevel];
  const { englishTest, admissionTest } = application.academicInfo;

  let score = 0;

  // Check English test requirements
  if (requirements[englishTest.type] && englishTest.score >= requirements[englishTest.type]) {
    score += 0.5;
  }

  // Check admission test if provided
  if (admissionTest && admissionTest.type && requirements[admissionTest.type] && 
      admissionTest.score >= requirements[admissionTest.type]) {
    score += 0.5;
  } else if (!admissionTest || !admissionTest.type) {
    score += 0.5; // Don't penalize if test not provided
  }

  return score;
};

const calculateMatchScore = (university, application) => {
  let score = 0;
  const weights = {
    academicMatch: 0.3,
    testScores: 0.2,
    budget: 0.2,
    preferences: 0.3
  };

  // Academic Match (30%)
  const gpaRequirement = university.admissionRequirements[application.academicInfo.studyLevel].GPA;
  if (application.academicInfo.gpa >= gpaRequirement) {
    score += weights.academicMatch;
  }

  // Test Scores (20%)
  score += calculateTestScore(university, application) * weights.testScores;

  // Budget Match (20%)
  score += calculateBudgetScore(university, application.academicInfo.studyLevel, application.preferences.budget) * weights.budget;

  // Preferences Match (30%)
  let preferenceScore = 0;
  application.preferences.priorities.forEach(priority => {
    switch(priority) {
      case 'Safety':
        preferenceScore += university.scores.safety / 100;
        break;
      case 'Employment':
        preferenceScore += university.scores.employment / 100;
        break;
      case 'Diversity':
        preferenceScore += university.scores.diversity / 100;
        break;
      case 'Quality of Teaching':
        preferenceScore += university.scores.qualityOfTeaching / 100;
        break;
      case 'University Ranking':
        preferenceScore += (1000 - (university.rankings.world || 1000)) / 1000;
        break;
    }
  });
  score += (preferenceScore / application.preferences.priorities.length) * weights.preferences;

  return Math.round(score * 100);
};

const generateRecommendationReasons = (university, application) => {
  const reasons = [];
  const { studyLevel } = application.academicInfo;

  // Ranking-based reasons
  if (university.rankings.world && university.rankings.world <= 100) {
    reasons.push(`Ranked #${university.rankings.world} globally`);
  }

  // Program-specific reasons
  const programCategory = application.academicInfo.fieldOfStudy.replace(/\s+/g, '');
  const availablePrograms = university[`${studyLevel}Programs`].programs[programCategory];
  if (availablePrograms && availablePrograms.length > 0) {
    reasons.push(`Offers ${availablePrograms.length} programs in ${application.academicInfo.fieldOfStudy}`);
  }

  // Cost-effectiveness
  const totalCost = university.feeStructure[studyLevel].tuitionFee + 
                   university.feeStructure[studyLevel].livingFee;
  if (totalCost < 20000) {
    reasons.push('Competitive total cost of attendance');
  }

  // Location benefits
  if (university.location.keyIndustries.length > 0) {
    reasons.push(`Located in hub for: ${university.location.keyIndustries.slice(0, 2).join(', ')}`);
  }

  // Scholarships
  if (university.scholarships && university.scholarships.length > 0) {
    reasons.push(`Offers ${university.scholarships.length} scholarship opportunities`);
  }

  // Match with preferences
  application.preferences.priorities.forEach(priority => {
    switch(priority) {
      case 'Safety':
        if (university.scores.safety >= 80) {
          reasons.push(`High safety score: ${university.scores.safety}/100`);
        }
        break;
      case 'Employment':
        if (university.scores.employment >= 80) {
          reasons.push(`Strong employment outcomes: ${university.scores.employment}%`);
        }
        break;
      case 'Diversity':
        if (university.scores.diversity >= 80) {
          reasons.push(`Excellent diversity score: ${university.scores.diversity}/100`);
        }
        break;
      case 'Quality of Teaching':
        if (university.scores.qualityOfTeaching >= 80) {
          reasons.push(`Outstanding teaching quality: ${university.scores.qualityOfTeaching}/100`);
        }
        break;
    }
  });

  return reasons.slice(0, 5); // Return top 5 reasons
};