import Story from '../models/storyModel.js';
import cloudinary from '../config/cloudinary.js';
import { deleteFile } from '../middlewares/multer.js';

export const createStory = async (req, res) => {
  try {
    const { title, subtitle, content, storyType, tags } = req.body;
    
    // Validate that content is proper HTML
    if (!content || typeof content !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: 'Content must be valid HTML' 
      });
    }

    const photo = req.file;

    if (!photo) {
      return res.status(400).json({ success: false, message: 'Photo is required' });
    }

    // Upload photo to cloudinary
    const result = await cloudinary.uploader.upload(photo.path, {
      folder: 'stories',
    });

    // Delete the local file after upload
    await deleteFile(photo.path);

    const story = await Story.create({
      title,
      subtitle,
      content,
      storyType,
      tags,
      photo: {
        url: result.secure_url,
        public_id: result.public_id
      },
      author: req.user._id
    });

    res.status(201).json({ success: true, story });
  } catch (error) {
    console.error('Create story error:', error); // Log the error for debugging
    if (req.file) {
      await deleteFile(req.file.path);
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStories = async (req, res) => {
  try {
    const stories = await Story.find()
      .populate('author', 'name profilePicture')
      .sort('-createdAt');
    res.status(200).json({ success: true, stories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id)
      .populate('author', 'name role profilePicture');
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }
    res.status(200).json({ success: true, story });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }

    // Check if user is authorized to update
    if (story.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updates = { ...req.body };
    if (req.file) {
      // Delete old photo from cloudinary
      await cloudinary.uploader.destroy(story.photo.public_id);
      
      // Upload new photo
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'stories',
      });
      
      // Delete the local file after upload
      await deleteFile(req.file.path);
      
      updates.photo = {
        url: result.secure_url,
        public_id: result.public_id
      };
    }

    const updatedStory = await Story.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('author', 'name role profilePicture');

    res.status(200).json({ success: true, story: updatedStory });
  } catch (error) {
    if (req.file) {
      await deleteFile(req.file.path);
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }

    // Check if user is authorized to delete
    if (story.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Delete photo from cloudinary
    await cloudinary.uploader.destroy(story.photo.public_id);
    
    // Delete the story
    await story.deleteOne();

    res.status(200).json({ success: true, message: 'Story deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStoriesByAuthor = async (req, res) => {
  try {
    const stories = await Story.find({ author: req.params.authorId })
      .populate('author', 'name profilePicture')
      .sort('-createdAt');

    res.json({ success: true, stories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
