import express from 'express';
import { auth } from '../middlewares/auth.js';
import adminAuth from '../middlewares/adminAuth.js';
import { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent } from '../controllers/eventController.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads/events');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const eventRouter = express.Router();

// Configure multer for event images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'event-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    files: 6, // Maximum 6 files
    fileSize: 25 * 1024 * 1024 // 5MB limit per file
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed!'));
    }
  }
});

// Middleware to check if user has required role
const checkRole = (allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (allowedRoles.includes(req.user.role)) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "You don't have permission to perform this action"
    });
  }
};

// Public routes
eventRouter.get('/all', getAllEvents);
eventRouter.get('/:id', getEventById);

// Protected routes for event creation/management
eventRouter.post('/create', auth, checkRole(['admin', 'counselor', 'university']), createEvent);
eventRouter.put('/update/:id', auth, checkRole(['admin', 'counselor', 'university']), updateEvent);
eventRouter.delete('/delete/:id', auth, checkRole(['admin', 'counselor', 'university']), deleteEvent);

export default eventRouter;
