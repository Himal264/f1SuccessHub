import express from 'express';
import { submitApplication, getApplication } from '../controllers/applynowController.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

// Use multer middleware for handling file uploads
// 'documents' should match the field name used in the frontend FormData
router.post('/submit', upload.array('documents', 5), submitApplication);
router.get('/:id', getApplication);

export default router;