const Story = require('../models/Story');
const mongoose = require('mongoose');

exports.createStory = async (req, res) => {
  try {
    const { postCreateType, additionalDetails, ...storyData } = req.body;
    
    // Validate additional details based on post create type
    const validateAdditionalDetails = (type, details) => {
      const validationRules = {
        'F1SuccessHub Team': () => true,
        'Alumni': () => details.alumni && details.alumni.country && details.alumni.graduationYear,
        'Professor': () => details.professor && details.professor.department && details.professor.university,
        'Counselor': () => details.counselor && details.counselor.specialization && details.counselor.experience,
        'Partner Company': () => details.partnerCompany && details.partnerCompany.companyName && details.partnerCompany.industry,
        'University': () => details.university && details.university.universityName && details.university.location
      };

      return validationRules[type] ? validationRules[type]() : false;
    };

    if (!validateAdditionalDetails(postCreateType, additionalDetails)) {
      return res.status(400).json({ 
        message: `Invalid or missing details for ${postCreateType}` 
      });
    }

    const story = new Story({
      ...storyData,
      postCreateType,
      additionalDetails
    });

    await story.save();
    res.status(201).json({ 
      message: 'Story created successfully', 
      story 
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Error creating story', 
      error: error.message 
    });
  }
};

exports.getAllStories = async (req, res) => {
  try {
    const { 
      storiesType, 
      postCreateType, 
      postCategory,
      page = 1, 
      limit = 10 
    } = req.query;

    const filter = {};
    if (storiesType) filter.storiesType = storiesType;
    if (postCreateType) filter.postCreateType = postCreateType;
    if (postCategory) filter.postCategory = postCategory;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      select: '-__v' // Exclude version key
    };

    const stories = await Story.find(filter)
      .sort(options.sort)
      .skip((options.page - 1) * options.limit)
      .limit(options.limit);

    const total = await Story.countDocuments(filter);

    res.status(200).json({
      stories,
      totalPages: Math.ceil(total / options.limit),
      currentPage: options.page,
      totalStories: total
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching stories', 
      error: error.message 
    });
  }
};

exports.getStoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid story ID' });
    }

    const story = await Story.findById(id);
    
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    
    res.status(200).json(story);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching story', 
      error: error.message 
    });
  }
};

exports.updateStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { postCreateType, additionalDetails, ...updateData } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid story ID' });
    }

    // Optional: Validate additional details
    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Update main story fields
    story.set({
      ...updateData,
      ...(postCreateType && { postCreateType }),
      ...(additionalDetails && { additionalDetails })
    });

    await story.save();
    
    res.status(200).json({ 
      message: 'Story updated successfully', 
      story 
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Error updating story', 
      error: error.message 
    });
  }
};

exports.deleteStory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid story ID' });
    }

    const story = await Story.findByIdAndDelete(id);
    
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    
    res.status(200).json({ 
      message: 'Story deleted successfully',
      deletedStory: story 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting story', 
      error: error.message 
    });
  }
};

// Optional: Search stories with advanced filtering
exports.searchStories = async (req, res) => {
  try {
    const { 
      query, 
      postCreateType, 
      postCategory, 
      minDate, 
      maxDate 
    } = req.query;

    const filter = {};

    // Text search across multiple fields
    if (query) {
      filter.$or = [
        { text: { $regex: query, $options: 'i' } },
        { 'additionalDetails.alumni.country': { $regex: query, $options: 'i' } },
        { 'additionalDetails.professor.department': { $regex: query, $options: 'i' } }
      ];
    }

    if (postCreateType) filter.postCreateType = postCreateType;
    if (postCategory) filter.postCategory = postCategory;

    // Date range filtering
    if (minDate || maxDate) {
      filter.createdAt = {};
      if (minDate) filter.createdAt.$gte = new Date(minDate);
      if (maxDate) filter.createdAt.$lte = new Date(maxDate);
    }

    const stories = await Story.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error searching stories', 
      error: error.message 
    });
  }
};