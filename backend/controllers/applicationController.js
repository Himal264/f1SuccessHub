// controllers/applicationController.js
import University from "../models/universityModel.js";
import Application from '../models/applicationModel.js';

export default class ApplicationController {
  static calculateBudgetScore(university, studyLevel, budgetPreference) {
    const budgetRanges = {
      "Less than $10,000": 10000,
      "up to $20,000": 20000,
      "up to $30,000": 30000,
      "up to $40,000": 40000,
      "$40,000 or higher": Infinity
    };

    const totalCost = 
      (university.feeStructure?.[studyLevel]?.tuitionFee || 0) + 
      (university.feeStructure?.[studyLevel]?.livingFee || 0) + 
      (university.feeStructure?.[studyLevel]?.otherFees || 0);

    return totalCost <= budgetRanges[budgetPreference] ? 1 : 0;
  }

  static calculateTestScore(university, application) {
    const requirements = university.admissionRequirements?.[application.academicInfo.studyLevel];
    if (!requirements) return 0;

    const { englishTest, admissionTest } = application.academicInfo;
    let score = 0;

    if (requirements[englishTest.type] && englishTest.score >= requirements[englishTest.type]) {
      score += 0.5;
    }

    if (admissionTest?.type && requirements[admissionTest.type] && 
        admissionTest.score >= requirements[admissionTest.type]) {
      score += 0.5;
    } else if (!admissionTest?.type) {
      score += 0.5;
    }

    return score;
  }

  static generateRecommendationReasons(university, application) {
    const reasons = [];
    
    const budgetScore = this.calculateBudgetScore(
      university,
      application.academicInfo.studyLevel,
      application.preferences.budget
    );
    if (budgetScore > 0) {
      reasons.push("Matches your budget requirements");
    }

    const gpaRequirement = university.admissionRequirements?.[application.academicInfo.studyLevel]?.GPA || 0;
    if (application.academicInfo.gpa >= gpaRequirement) {
      reasons.push("Meets academic requirements");
    }

    if (this.calculateTestScore(university, application) > 0) {
      reasons.push("Test scores meet requirements");
    }

    return reasons;
  }

  static calculateMatchScore(university, application) {
    try {
      let score = 0;
      const weights = {
        academicMatch: 0.3,
        testScores: 0.2,
        budget: 0.2,
        preferences: 0.3
      };

      // Academic Match (30%)
      const gpaRequirement = university.admissionRequirements?.[application.academicInfo.studyLevel]?.GPA || 0;
      if (application.academicInfo.gpa >= gpaRequirement) {
        score += weights.academicMatch;
      }

      // Test Scores (20%)
      score += ApplicationController.calculateTestScore(university, application) * weights.testScores;

      // Budget Match (20%)
      score += ApplicationController.calculateBudgetScore(
        university, 
        application.academicInfo.studyLevel, 
        application.preferences.budget
      ) * weights.budget;

      // Preferences Match (30%)
      let preferenceScore = 0;
      // Ensure priorities is an array and handle null/undefined case
      const priorities = Array.isArray(application.preferences?.priorities) 
        ? application.preferences.priorities 
        : [];

      for (const priority of priorities) {
        switch(priority) {
          case 'Safety':
            preferenceScore += (university.scores?.safety || 0) / 100;
            break;
          case 'Employment':
            preferenceScore += (university.scores?.employment || 0) / 100;
            break;
          case 'Diversity':
            preferenceScore += (university.scores?.diversity || 0) / 100;
            break;
          case 'Quality of Teaching':
            preferenceScore += (university.scores?.qualityOfTeaching || 0) / 100;
            break;
          case 'University Ranking':
            preferenceScore += (1000 - (university.rankings?.world || 1000)) / 1000;
            break;
        }
      }

      score += priorities.length > 0 ? 
        (preferenceScore / priorities.length) * weights.preferences : 
        0;

      return Math.round(score * 100);
    } catch (error) {
      console.error('Error calculating match score:', error);
      return 0;
    }
  }

  static async submitApplication(req, res) {
    try {
      if (!req.body?.academicInfo?.fieldOfStudy || !req.body?.academicInfo?.studyLevel) {
        return res.status(400).json({ 
          error: 'Missing required fields: fieldOfStudy or studyLevel' 
        });
      }

      // Ensure preferences is properly structured
      const applicationData = {
        studentInfo: req.body.studentInfo,
        academicInfo: req.body.academicInfo,
        preferences: {
          intake: req.body.intake,
          priorities: Array.isArray(req.body.preferences) ? req.body.preferences : [],
          budget: req.body.budget
        }
      };

      const programCategory = req.body.academicInfo.fieldOfStudy.replace(/\s+/g, '');
      const programPath = `${req.body.academicInfo.studyLevel}Programs.programs.${programCategory}`;
      
      const matchingUniversities = await University.find({
        [programPath]: { $exists: true, $ne: [] }
      }).lean();

      if (!matchingUniversities.length) {
        return res.status(404).json({
          error: 'No matching universities found for the specified criteria'
        });
      }

      const recommendations = matchingUniversities
        .map(university => ({
          university: university._id,
          matchScore: ApplicationController.calculateMatchScore(university, applicationData),
          reasons: ApplicationController.generateRecommendationReasons(university, applicationData)
        }))
        .filter(rec => rec.matchScore >= 60)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 7);

      if (!recommendations.length) {
        return res.status(404).json({
          error: 'No universities matched your criteria with a sufficient score'
        });
      }

      const application = new Application({
        ...applicationData,
        recommendedUniversities: recommendations
      });

      await application.save();

      const fullRecommendations = await Application.findById(application._id)
        .populate('recommendedUniversities.university')
        .select('recommendedUniversities');

      res.status(201).json({
        message: 'Application submitted successfully',
        applicationId: application._id,
        recommendations: fullRecommendations.recommendedUniversities
      });

    } catch (error) {
      console.error('Application submission error:', error);
      res.status(500).json({ 
        error: 'Failed to process application',
        details: error.message 
      });
    }
  }
}