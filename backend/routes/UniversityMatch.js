// routes/universityMatch.js
import express from 'express';
import { University } from '../models/University.js';
import { SearchProfile } from '../models/SearchProfile.js';
import { calculateUniversityMatch, rankUniversities } from '../utils/universityMatcher.js';

const router = express.Router();

// POST endpoint to find matching universities
router.post('/find-matches', async (req, res) => {
  try {
    const studentProfile = req.body;
    
    // Validate required fields
    if (!studentProfile.studyLevel || !studentProfile.fieldOfStudy || !studentProfile.gpa) {
      return res.status(400).json({ error: 'Missing required profile information' });
    }

    // Find universities that offer the requested program
    const programQuery = `${studentProfile.studyLevel}Programs.programs.${studentProfile.fieldOfStudy}`;
    let universities = await University.find({
      [programQuery]: { $exists: true },
      [`admissionRequirements.${studentProfile.studyLevel}.GPA`]: { $lte: studentProfile.gpa }
    });

    // Calculate matches and rank universities
    const rankedMatches = rankUniversities(studentProfile, universities);

    // Return top matches with detailed breakdown
    const topMatches = rankedMatches.slice(0, 10).map(match => ({
      rank: match.rank,
      universityName: match.universityName,
      matchPercentage: match.matchPercentage,
      breakdown: match.breakdown,
      annualCost: match.university.feeStructure[studentProfile.studyLevel].tuitionFee,
      programDetails: match.university[`${studentProfile.studyLevel}Programs`].programs[studentProfile.fieldOfStudy],
      requirements: {
        gpa: match.university.admissionRequirements[studentProfile.studyLevel].GPA,
        englishTest: match.university.admissionRequirements[studentProfile.studyLevel][studentProfile.englishTest.type],
      },
      location: match.university.location,
      scores: match.university.scores
    }));

    res.json({
      matches: topMatches,
      totalMatches: rankedMatches.length,
      searchCriteria: studentProfile
    });

  } catch (error) {
    console.error('Error finding university matches:', error);
    res.status(500).json({ error: 'Error processing university matches' });
  }
});

export default router;