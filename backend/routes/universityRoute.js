import express from 'express';
import University from '../models/universityModel.js';
import { rankUniversities } from '../utils/matchAlgorithm.js';

const router = express.Router();

// University matching endpoint
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

// Get single university details
router.get('/details/:id', async (req, res) => {
  try {
    const university = await University.findById(req.params.id)
      .select('-__v -createdAt -updatedAt')
      .lean();

    if (!university) {
      return res.status(404).json({
        success: false,
        error: 'University not found'
      });
    }

    res.json({
      success: true,
      data: university
    });

  } catch (error) {
    console.error('University details error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching university details'
    });
  }
});

// Search universities
router.get('/search', async (req, res) => {
  try {
    const { name, location, program } = req.query;
    
    const query = {};
    
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }
    
    if (location) {
      query['location.region'] = { $regex: location, $options: 'i' };
    }
    
    if (program) {
      query['$or'] = [
        { 'undergraduatePrograms.programs': { $regex: program, $options: 'i' } },
        { 'graduatePrograms.programs': { $regex: program, $options: 'i' } }
      ];
    }

    const universities = await University.find(query)
      .select('name location rankings logoUrl')
      .limit(20)
      .lean();

    res.json({
      success: true,
      count: universities.length,
      data: universities
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during university search'
    });
  }
});

export default router;