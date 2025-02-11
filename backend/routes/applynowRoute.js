import express from 'express';
import { submitApplication, getApplication } from '../controllers/applynowController.js';
import upload from '../middlewares/multer.js';

const applynowoRuter = express.Router();

// Use multer middleware for handling file uploads
// 'documents' should match the field name used in the frontend FormData
applynowoRuter.post('/submit', upload.array('documents', 5), submitApplication);
applynowoRuter.get('/:id', getApplication);

export default applynowoRuter;