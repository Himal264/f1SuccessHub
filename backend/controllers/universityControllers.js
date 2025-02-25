import University from "../models/universityModel.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

export const getUniversities = async (req, res) => {
  try {
    const universities = await University.find();
    console.log("Found universities:", universities);
    res.status(200).json({ universities: universities });
  } catch (error) {
    console.error("Database error:", error); 
    res.status(500).json({ message: error.message });
  }
};

export const getUniversityById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "University ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid university ID format" });
    }

    console.log("Searching for university with ID:", id);

    const university = await University.findById(id);

    if (!university) {
      console.log("No university found for ID:", id);
      return res.status(404).json({ message: "University not found" });
    }

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
      month: entry.month,
      year: entry.year,
      deadline: new Date(entry.deadline),
    }));

    const parsedLocation = JSON.parse(location);
    const {
      name: locationName,
      state,
      region,
      citysize,
      ...otherLocationDetails
    } = parsedLocation;

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
      intake: parsedIntake,
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
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedUniversity = await University.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (updatedUniversity) {
      return res.status(200).json({
        success: true,
        message: "University updated successfully",
        data: updatedUniversity,
      });
    }

    return res.status(404).json({
      success: false,
      message: "University not found",
    });
  } catch (error) {
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

export const getUniversityByName = async (req, res) => {
  try {
    const { name } = req.params;

    if (!name) {
      return res.status(400).json({ message: "University name is required" });
    }

    console.log("Searching for university with name:", name);

    const university = await University.findOne({ name: name });

    if (!university) {
      console.log("No university found for name:", name);
      return res.status(404).json({ message: "University not found" });
    }

    res.status(200).json({ university });
  } catch (error) {
    console.error("Error in getUniversityByName:", error);
    res.status(500).json({
      message: "Error fetching university",
      error: error.message,
    });
  }
};
