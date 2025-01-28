const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new story (Protected Route)
router.post('/', authMiddleware.authenticate, storyController.createStory);

// Get all stories (Public Route)
router.get('/', storyController.getAllStories);

// Search stories (Public Route)
router.get('/search', storyController.searchStories);

// Get story by ID (Public Route)
router.get('/:id', storyController.getStoryByIdDetailed);

// Update a story (Protected Route)
router.put('/:id', authMiddleware.authenticate, storyController.updateStory);

// Delete a story (Protected Route with Role Authorization)
router.delete('/:id', 
  authMiddleware.authenticate, 
  authMiddleware.authorizeRoles('F1SuccessHub Team', 'Admin'), 
  storyController.deleteStory
);

module.exports = router;