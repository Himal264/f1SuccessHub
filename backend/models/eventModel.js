import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['undergraduate', 'graduate', 'phd', 'research', 'workshop', 'seminar'],
    default: 'undergraduate'
  },
  type: {
    type: String,
    required: true,
    enum: ['in-person', 'online', 'hybrid'],
    default: 'in-person'
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(value) {
        return value >= this.startDate;
      },
      message: 'End date must be after or equal to start date'
    }
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    public_id: {
      type: String,
      required: true
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  creatorRole: {
    type: String,
    enum: ['admin', 'counselor', 'alumni', 'university'],
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['registered', 'attended', 'cancelled'],
      default: 'registered'
    }
  }],
  maxParticipants: {
    type: Number,
    min: [1, 'Maximum participants must be at least 1']
  },
  registrationDeadline: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true
  }],
  additionalInfo: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

// Add index for better query performance
eventSchema.index({ startDate: 1, status: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ createdBy: 1 });

// Pre-save middleware to update status based on dates
eventSchema.pre('save', function(next) {
  const now = new Date();
  
  if (this.endDate < now) {
    this.status = 'completed';
  } else if (this.startDate <= now && this.endDate >= now) {
    this.status = 'ongoing';
  } else if (this.startDate > now) {
    this.status = 'upcoming';
  }
  
  next();
});

// Virtual for checking if registration is open
eventSchema.virtual('isRegistrationOpen').get(function() {
  const now = new Date();
  return (!this.registrationDeadline || this.registrationDeadline > now) 
         && this.status === 'upcoming'
         && (!this.maxParticipants || this.participants.length < this.maxParticipants);
});

// Method to check if event is full
eventSchema.methods.isFull = function() {
  return this.maxParticipants && this.participants.length >= this.maxParticipants;
};

// Static method to find upcoming events
eventSchema.statics.findUpcoming = function() {
  return this.find({
    startDate: { $gt: new Date() },
    status: 'upcoming'
  }).sort('startDate');
};

// Static method to find events by category
eventSchema.statics.findByCategory = function(category) {
  return this.find({ category }).sort('-startDate');
};

const eventModel = mongoose.models.event || mongoose.model('event', eventSchema);
export default eventModel;
