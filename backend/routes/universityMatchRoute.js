import express from 'express';
import University from '../models/universityModel.js';
import { rankUniversities } from '../utils/matchAlgorithm.js';

const router = express.Router();

// POST /api/universities/match - University matching endpoint
router.post('/match', async (req, res) => {
  try {
    const studentProfile = req.body;
    
    // Validate required fields
    if (!studentProfile.studyLevel || !studentProfile.fieldOfStudy) {
      return res.status(400).json({
        success: false,
        error: 'Missing required academic information'
      });
    }

    // Get all universities from database
    const universities = await University.find().lean();

    // Calculate matches using your algorithm
    const matches = rankUniversities(studentProfile, universities);

    res.json({
      success: true,
      count: matches.length,
      matches: matches.slice(0, 50) // Return top 50 matches
    });

  } catch (error) {
    console.error('Matching error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during university matching'
    });
  }
});

export default router;