import eventModel from '../models/eventModel.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import util from 'util';
import userModel from '../models/userModel.js';
const unlinkFile = util.promisify(fs.unlink);

// Create Event
export const createEvent = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      level, 
      startDate,
      location, 
      type,
      maxParticipants 
    } = req.body;

    // Parse level if it's a string
    let parsedLevel = level;
    if (typeof level === 'string') {
      try {
        parsedLevel = JSON.parse(level);
      } catch (e) {
        parsedLevel = [level];
      }
    }

    // Create event
    const event = await eventModel.create({
      title,
      description,
      level: parsedLevel,
      startDate,
      location,
      type,
      maxParticipants: parseInt(maxParticipants) || undefined,
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
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      events
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching events",
      error: error.message
    });
  }
};

// Get Single Event
export const getEventById = async (req, res) => {
  try {
    const event = await eventModel.findById(req.params.id);
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
    console.error('Error fetching event:', error);
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

    // Parse level if it's being updated and is a string
    if (req.body.level && typeof req.body.level === 'string') {
      try {
        req.body.level = JSON.parse(req.body.level);
      } catch (e) {
        req.body.level = [req.body.level];
      }
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

    await event.deleteOne();

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

// Create Event
export const createEventadmin = async (req, res) => {
  try {
    const { title, description, category, startDate, endDate, location, type } = req.body;
    
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

    // For admin routes, set default values
    
    
    // Create event with appropriate creator role
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
      // Set creatorRole to 'admin' for admin routes
      creatorRole: isAdminRoute ? 'admin' : req.user.role
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
