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

    // Initialize empty articles
    const emptyArticle = {
      title: "",
      subtitle: "",
      content: "",
      photo: { url: "", public_id: "" },
      tags: [],
      autoLinks: [],
      publishedAt: new Date()
    };

    // Add empty articles to all sections that should have them
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
        ...parsedLocation,
        name: locationName,
        state,
        region,
        citysize,
        article: emptyArticle
      },
      undergraduatePrograms: {
        ...parsedData.undergraduatePrograms,
        article: emptyArticle
      },
      graduatePrograms: {
        ...parsedData.graduatePrograms,
        article: emptyArticle
      },
      feeStructure: {
        undergraduate: {
          ...parsedData.feeStructure.undergraduate,
          article: emptyArticle
        },
        graduate: {
          ...parsedData.feeStructure.graduate,
          article: emptyArticle
        }
      },
      scholarshipsArticle: emptyArticle,
      descriptionArticle: emptyArticle,
      admissionRequirementsArticle: emptyArticle,
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

// New controller to handle article updates for specific sections
export const updateUniversityArticle = async (req, res) => {
  try {
    const { id, section } = req.params;
    const { title, subtitle, content, tags } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid university ID format" });
    }

    // Find the university
    const university = await University.findById(id);
    if (!university) {
      return res.status(404).json({ message: "University not found" });
    }

    // Upload article photo if present
    let photoData = null;
    if (req.files && req.files.articlePhoto) {
      const result = await cloudinary.uploader.upload(req.files.articlePhoto[0].path, {
        folder: "university-articles",
      });
      photoData = {
        url: result.secure_url,
        public_id: result.public_id
      };
    }

    // Create the update object based on the section
    const updateObj = {};
    let updatePath = '';
    
    // Define the valid article sections and their paths in the database
    const validSections = {
      'undergraduatePrograms': 'undergraduatePrograms.article',
      'graduatePrograms': 'graduatePrograms.article',
      'scholarships': 'scholarshipsArticle',
      'description': 'descriptionArticle',
      'admissionRequirements': 'admissionRequirementsArticle',
      'location': 'location.article',
      'feeStructureUndergraduate': 'feeStructure.undergraduate.article',
      'feeStructureGraduate': 'feeStructure.graduate.article',
      'intake': 'intake.article'
    };

    // Check if the section is valid
    if (!validSections[section]) {
      return res.status(400).json({ message: "Invalid article section" });
    }

    updatePath = validSections[section];
    
    // Create the article update object
    const articleUpdate = {
      title: title || '',
      subtitle: subtitle || '',
      content: content || '',
      tags: tags ? JSON.parse(tags) : [],
      publishedAt: new Date()
    };

    // Add photo if uploaded
    if (photoData) {
      articleUpdate.photo = photoData;
    }

    // Set the path for the update
    updateObj[updatePath] = articleUpdate;

    // Perform the update
    const updatedUniversity = await University.findByIdAndUpdate(
      id,
      { $set: updateObj },
      { new: true, runValidators: true }
    );

    if (!updatedUniversity) {
      return res.status(500).json({ message: "Failed to update university article" });
    }

    res.status(200).json({
      success: true,
      message: `${section} article updated successfully`,
      data: updatedUniversity
    });
    
  } catch (error) {
    console.error("Error updating university article:", error);
    res.status(500).json({ 
      message: "An error occurred while updating the university article",
      error: error.message 
    });
  }
};

export const deleteUniversity = async (req, res) => {
  const { id } = req.params;

  try {
    const university = await University.findById(id);
    if (university) {
      await university.deleteOne(); // Using deleteOne instead of remove which is deprecated
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
