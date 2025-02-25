import express from 'express';
import { auth, checkRole } from '../middlewares/auth.js';
import { upload } from '../middlewares/multer.js';
import {
  createStory,
  getStories,
  getStoryById,
  updateStory,
  deleteStory,
  getStoriesByAuthor,
  getStoriesByUniversityTag
} from '../controllers/storyController.js';

const router = express.Router();

// Create story - only authenticated counselors, university reps, alumni, and admins
router.post(
  '/',
  auth,
  checkRole(['counselor', 'university', 'alumni', 'admin']),
  upload.single('photo'),
  createStory
);

// Get all stories - public access
router.get('/', getStories);

// Get single story - public access
router.get('/:id', getStoryById);

// Update story - authenticated and authorized users only
router.put(
  '/:id',
  auth,
  checkRole(['counselor', 'university', 'alumni', 'admin']),
  upload.single('photo'),
  updateStory
);

// Delete story - authenticated and authorized users only
router.delete(
  '/:id',
  auth,
  checkRole(['counselor', 'university', 'alumni', 'admin']),
  deleteStory
);

router.get('/author/:authorId', getStoriesByAuthor);

router.get('/university/:universityName', getStoriesByUniversityTag);

export default router;

