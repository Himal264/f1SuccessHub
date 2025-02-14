import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  level: [{
    type: String,
    enum: ['undergraduate', 'graduate', 'master', 'phd', 'language'],
    message: 'Invalid level selected'
  }],
  language: {
    type: String,
    required: [true, 'Language is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Event type is required'],
    enum: ['physical', 'webinar', 'hybrid']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date and time is required']
  },
  location: {
    type: String,
    required: [function() {
      return this.type === 'physical' || this.type === 'hybrid';
    }, 'Location is required for physical and hybrid events'],
    trim: true
  },
  maxParticipants: {
    type: Number,
    min: [1, 'Maximum participants must be at least 1']
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    autopopulate: {
      select: 'name email profilePicture role'
    }
  },
  creatorRole: {
    type: String,
    required: true,
    enum: ['admin', 'counselor', 'university']
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming'
  }
}, {
  timestamps: true
});

// Modify the pre-save hook to work without endDate
eventSchema.pre('save', function(next) {
  const now = new Date();
  if (this.startDate < now) {
    this.status = 'completed';
  } else {
    this.status = 'upcoming';
  }
  next();
});

// Add plugin for autopopulate
eventSchema.plugin(require('mongoose-autopopulate'));

const eventModel = mongoose.model('Event', eventSchema);
export default eventModel;
