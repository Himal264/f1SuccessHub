import express from "express";
import {
  getUniversities,
  getUniversityById,
  addUniversity,
  updateUniversity,
  deleteUniversity,
  getUniversityByName,
  updateUniversityArticle
} from "../controllers/universityControllers.js";
import { upload } from "../middlewares/multer.js";
import adminAuth from "../middlewares/adminAuth.js";
import { auth, checkRole } from '../middlewares/auth.js';
import University from '../models/universityModel.js';

const universityRouter = express.Router();

const uploadFields = upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "media1", maxCount: 1 },
  { name: "media2", maxCount: 1 },
  { name: "media3", maxCount: 1 },
  { name: "media4", maxCount: 1 },
  { name: "media5", maxCount: 1 },
  { name: "locationPhoto", maxCount: 1 },
  { name: "articlePhoto", maxCount: 1 }, // For article photos
]);

// Public routes
universityRouter.get("/list", getUniversities);
universityRouter.get("/:id", getUniversityById);

// Admin-only can create universities
universityRouter.post("/add", uploadFields, adminAuth, addUniversity);

// University and F1SuccessHub Team can update universities
universityRouter.put("/:id", uploadFields, auth, checkRole(['university', 'F1SuccessHub Team']), updateUniversity);
universityRouter.delete("/:id", auth, checkRole(['university', 'F1SuccessHub Team']), deleteUniversity);

// Article update route - accessible to university roles and F1SuccessHub Team
universityRouter.put(
  "/:id/article/:section", 
  auth,
  checkRole(['university', 'F1SuccessHub Team']),
  uploadFields,
  updateUniversityArticle
);

universityRouter.get("/api/university/:id", async (req, res) => {
  try {
    const university = await University.findById(req.params.id);

    if (!university) {
      console.log("University not found for ID:", req.params.id);
      return res.status(404).json({ message: "University not found" });
    }

    console.log("Found university:", university._id);
    res.json(university);
  } catch (error) {
    console.error("Error in university route:", error);
    res.status(500).json({ message: error.message });
  }
});

universityRouter.get("/name/:name", getUniversityByName);

export default universityRouter;
