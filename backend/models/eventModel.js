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
  categories: {
    type: [String],
    required: [true, 'At least one category is required'],
    validate: {
      validator: function(array) {
        const validCategories = ['undergraduate', 'graduate', 'phd', 'research', 'workshop', 'seminar'];
        return array.every(category => validCategories.includes(category));
      },
      message: 'Invalid category selected'
    }
  },
  type: {
    type: String,
    required: [true, 'Event type is required'],
    enum: ['in-person', 'online', 'hybrid']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  images: [{
    url: String,
    public_id: String
  }],
  tags: [{
    type: String,
    trim: true
  }],
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
    required: true
  },
  creatorRole: {
    type: String,
    required: true,
    enum: ['admin', 'counselor', 'alumni', 'university']
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming'
  }
}, {
  timestamps: true
});

// Add a pre-save hook to calculate status
eventSchema.pre('save', function(next) {
  const now = new Date();
  if (this.endDate < now) {
    this.status = 'completed';
  } else if (this.startDate <= now && this.endDate >= now) {
    this.status = 'ongoing';
  } else {
    this.status = 'upcoming';
  }
  next();
});

const eventModel = mongoose.model('Event', eventSchema);
export default eventModel;
