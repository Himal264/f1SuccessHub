// Backend - routes/emailRouter.js
import express from 'express';
import multer from 'multer';
import { broadcastEmail } from '../controllers/emailController.js';
import adminAuth from '../middlewares/adminAuth.js';

const upload = multer({ storage: multer.memoryStorage() });
const emailRouter = express.Router();

emailRouter.post('/broadcast', adminAuth, upload.single('file'), broadcastEmail);

export default emailRouter;