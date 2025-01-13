import University from "../models/universityModel.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

// Add this to your backend route temporarily
export const getUniversities = async (req, res) => {
  try {
    const universities = await University.find();
    console.log("Found universities:", universities); // Debug log
    res.status(200).json({ universities: universities });
  } catch (error) {
    console.error("Database error:", error); // Debug log
    res.status(500).json({ message: error.message });
  }
};

// In your university controller
// In your universityController.js
// In your universityController.js
// In your universityControllers.js
export const getUniversityById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id) {
      return res.status(400).json({ message: "University ID is required" });
    }

    // Check if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid university ID format" });
    }

    console.log("Searching for university with ID:", id);

    const university = await University.findById(id);

    if (!university) {
      console.log("No university found for ID:", id);
      return res.status(404).json({ message: "University not found" });
    }

    // Return the university data in a consistent structure
    res.status(200).json({ university });
  } catch (error) {
    console.error("Error in getUniversityById:", error);
    res.status(500).json({
      message: "Error fetching university",
      error: error.message,
    });
  }
};

export const addUniversity = async (req, res) => {
  try {
    const {
      name,
      applicationFee,
      intake,
      graduationrate,
      acceptancerate,
      undergraduatePrograms,
      graduatePrograms,
      scholarships,
      rankings,
      totalEnrollment,
      internationalStudentPercentage,
      feeStructure,
      location,
      contact,
      description,
      scores,
      admissionRequirements,
    } = req.body;

    const parsedData = {
      undergraduatePrograms: JSON.parse(undergraduatePrograms),
      graduatePrograms: JSON.parse(graduatePrograms),
      scholarships: JSON.parse(scholarships),
      rankings: JSON.parse(rankings),

      feeStructure: JSON.parse(feeStructure),
      location: JSON.parse(location),
      contact: JSON.parse(contact),
      internationalStudentPercentage,
      description,
      totalEnrollment,
      scores: JSON.parse(scores),
      admissionRequirements: JSON.parse(admissionRequirements),
    };

    const parsedIntake = JSON.parse(intake).map((entry) => ({
      month: entry.month,  // Month (e.g., January, Summer, etc.)
      year: entry.year,    // Year for the intake
      deadline: new Date(entry.deadline),  // Ensure deadline is a Date object
    }));

    // parse location for state and region
    const parsedLocation = JSON.parse(location);
    const {name: locationName, state, region, citysize, ...otherLocationDetails} = parsedLocation;

    let logoUrl = "";
    if (req.files && req.files.logo) {
      const result = await cloudinary.uploader.upload(req.files.logo[0].path, {
        folder: "university-logos",
      });
      logoUrl = result.secure_url;
    }

    const mediaUrls = [];
    if (req.files) {
      for (let i = 1; i <= 5; i++) {
        const mediaField = `media${i}`;
        if (req.files[mediaField]) {
          const result = await cloudinary.uploader.upload(
            req.files[mediaField][0].path,
            {
              folder: "university-media",
            }
          );
          mediaUrls.push(result.secure_url);
        }
      }
    }

    // Handle location photo upload (new)
    let locationPhoto = "";
    if (req.files && req.files.locationPhoto) {
      const result = await cloudinary.uploader.upload(
        req.files.locationPhoto[0].path,
        {
          folder: "university-location-photos",
        }
      );
      locationPhoto = result.secure_url;
    }


 
    const university = new University({
      name,
      logoUrl,
      media: mediaUrls,
      applicationFee,
      intake: parsedIntake,  // Store the intake with deadlines
      graduationrate,
      acceptancerate,
      locationPhoto,
      location: {
        name: locationName,
        state,
        region,
        citysize,
        ...otherLocationDetails,
      },
      ...parsedData,
    });

    const createdUniversity = await university.save();
    res.status(201).json(createdUniversity);
  } catch (error) {
    console.error("Error adding university:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateUniversity = async (req, res) => {
  const { id } = req.params; // Extract university ID from request parameters
  const updateData = req.body; // Extract data to be updated from request body

  try {
    // Find the university by ID and update it with the provided data
    const updatedUniversity = await University.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true, // Return the updated document
        runValidators: true, // Ensure validation rules in schema are applied
      }
    );

    // If the university is found and updated, send it in the response
    if (updatedUniversity) {
      return res.status(200).json({
        success: true,
        message: "University updated successfully",
        data: updatedUniversity,
      });
    }

    // If no university is found, respond with a 404 status
    return res.status(404).json({
      success: false,
      message: "University not found",
    });
  } catch (error) {
    // Handle server errors
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the university",
      error: error.message,
    });
  }
};

export const deleteUniversity = async (req, res) => {
  const { id } = req.params;

  try {
    const university = await University.findById(id);
    if (university) {
      await university.remove();
      res.status(200).json({ message: "University removed" });
    } else {
      res.status(404).json({ message: "University not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
