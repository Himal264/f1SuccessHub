import express from "express";
import {
  getUniversities,
  getUniversityById,
  addUniversity,
  updateUniversity,
  deleteUniversity,
} from "../controllers/universityControllers.js";
import  { upload }  from "../middlewares/multer.js";
import adminAuth from "../middlewares/adminAuth.js";
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
]);
// Public routes
universityRouter.get("/list", getUniversities);
universityRouter.get("/:id", getUniversityById);

// Admin-protected routes (add middleware for authentication/authorization)
universityRouter.post("/add", uploadFields, adminAuth, addUniversity);
universityRouter.put("/:id", uploadFields, adminAuth, updateUniversity);
universityRouter.delete("/:id", adminAuth, deleteUniversity);

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

export default universityRouter;
