import eventModel from '../models/eventModel.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import util from 'util';
const unlinkFile = util.promisify(fs.unlink);

// Create Event
export const createEvent = async (req, res) => {
  try {
    const { title, description, category, startDate, endDate, location, type } = req.body;
    
    // Check if user has permission to create events
    const allowedRoles = ['admin', 'counselor', 'alumni', 'university'];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to create events"
      });
    }

    // Upload images to cloudinary
    const imageUploadPromises = req.files.map(file => 
      cloudinary.uploader.upload(file.path, {
        folder: 'events',
        width: 1200,
        height: 800,
        crop: "fill"
      })
    );

    const uploadedImages = await Promise.all(imageUploadPromises);

    // Clean up local files
    await Promise.all(req.files.map(file => unlinkFile(file.path)));

    // Create event
    const event = await eventModel.create({
      title,
      description,
      category,
      startDate,
      endDate,
      location,
      type,
      images: uploadedImages.map(img => ({
        url: img.secure_url,
        public_id: img.public_id
      })),
      createdBy: req.user._id,
      creatorRole: req.user.role
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({
      success: false,
      message: "Error creating event",
      error: error.message
    });
  }
};

// Get All Events
export const getAllEvents = async (req, res) => {
  try {
    const events = await eventModel.find()
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching events",
      error: error.message
    });
  }
};

// Get Event by ID
export const getEventById = async (req, res) => {
  try {
    const event = await eventModel.findById(req.params.id)
      .populate('createdBy', 'name email role');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    res.json({
      success: true,
      event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching event",
      error: error.message
    });
  }
};

// Update Event
export const updateEvent = async (req, res) => {
  try {
    const event = await eventModel.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    // Check if user has permission to update
    if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this event"
      });
    }

    // Handle new images if any
    if (req.files?.length > 0) {
      // Delete old images from cloudinary
      await Promise.all(event.images.map(img => 
        cloudinary.uploader.destroy(img.public_id)
      ));

      // Upload new images
      const imageUploadPromises = req.files.map(file => 
        cloudinary.uploader.upload(file.path, {
          folder: 'events',
          width: 1200,
          height: 800,
          crop: "fill"
        })
      );

      const uploadedImages = await Promise.all(imageUploadPromises);
      
      // Clean up local files
      await Promise.all(req.files.map(file => unlinkFile(file.path)));

      req.body.images = uploadedImages.map(img => ({
        url: img.secure_url,
        public_id: img.public_id
      }));
    }

    const updatedEvent = await eventModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      message: "Event updated successfully",
      event: updatedEvent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating event",
      error: error.message
    });
  }
};

// Delete Event
export const deleteEvent = async (req, res) => {
  try {
    const event = await eventModel.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    // Check if user has permission to delete
    if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this event"
      });
    }

    // Delete images from cloudinary
    await Promise.all(event.images.map(img => 
      cloudinary.uploader.destroy(img.public_id)
    ));

    await event.remove();

    res.json({
      success: true,
      message: "Event deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting event",
      error: error.message
    });
  }
};
