import express from 'express';
import {
  getUniversities,
  getUniversityById,
  singleUniversity,
  addUniversity,
  updateUniversity,
  deleteUniversity,
} from '../controllers/universityControllers.js';
import upload from '../middlewares/multer.js';
import adminAuth from '../middlewares/adminAuth.js';


const universityRouter = express.Router();



const uploadFields = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'media1', maxCount: 1 },
  { name: 'media2', maxCount: 1 },
  { name: 'media3', maxCount: 1 },
  { name: 'media4', maxCount: 1 },
  { name: 'media5', maxCount: 1 },
  { name: 'locationPhoto', maxCount: 1 },
]);
// Public routes
universityRouter.get('/list', getUniversities);
universityRouter.get('/:id', getUniversityById);
universityRouter.post("/single", singleUniversity);

// Admin-protected routes (add middleware for authentication/authorization)
universityRouter.post('/add', uploadFields, adminAuth, addUniversity); 
universityRouter.put('/:id',uploadFields,adminAuth, updateUniversity);
universityRouter.delete('/:id', adminAuth, deleteUniversity); 

export default universityRouter;
