import mongoose from 'mongoose';
import mongooseAutopopulate from 'mongoose-autopopulate';
import User from './userModel.js';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [5000, 'Description cannot be more than 5000 characters'],
    trim: false
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
    enum: ['admin', 'counselor', 'alumni', 'university']
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming'
  },
  webinar: {
    isActive: { type: Boolean, default: false },
    startedAt: { type: Date },
    endedAt: { type: Date },
    participants: [{
      userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        autopopulate: { select: 'name email profilePicture' }
      },
      joinedAt: { type: Date },
      leftAt: { type: Date },
      role: {
        type: String,
        enum: ['host', 'participant', 'moderator'],
        default: 'participant'
      },
      isAudioEnabled: { type: Boolean, default: true },
      isVideoEnabled: { type: Boolean, default: true },
      isScreenSharing: { type: Boolean, default: false }
    }],
    recording: {
      url: String,
      duration: Number,
      startedAt: Date,
      endedAt: Date,
      status: {
        type: String,
        enum: ['processing', 'completed', 'failed'],
        default: 'processing'
      }
    },
    channel: {
      name: { type: String },
      token: { type: String },
      uid: { type: String }
    },
    settings: {
      participantAudioDefault: { type: Boolean, default: true },
      participantVideoDefault: { type: Boolean, default: true },
      allowChat: { type: Boolean, default: true },
      allowRaiseHand: { type: Boolean, default: true },
      allowScreenShare: { type: Boolean, default: true },
      maxDuration: { type: Number, default: 120 }
    }
  }
}, {
  timestamps: true
});

eventSchema.pre('save', function(next) {
  const now = new Date();
  
  if (this.webinar?.isActive) {
    this.status = 'ongoing';
  } else if (this.startDate < now) {
    this.status = 'completed';
  } else {
    this.status = 'upcoming';
  }
  
  if (this.type === 'webinar' && !this.webinar.channel.name) {
    this.webinar.channel.name = `webinar_${this._id}_${Date.now()}`;
  }

  next();
});

eventSchema.methods.canUserJoin = function(userId) {
  if (!this.webinar.isActive) return false;
  
  if (this.createdBy.toString() === userId.toString()) return true;
  
  if (this.maxParticipants && 
      this.webinar.participants.length >= this.maxParticipants) {
    return false;
  }
  
  const existingParticipant = this.webinar.participants.find(
    p => p.userId.toString() === userId.toString() && !p.leftAt
  );
  
  return !existingParticipant;
};

eventSchema.methods.getActiveParticipantsCount = function() {
  return this.webinar.participants.filter(p => p.joinedAt && !p.leftAt).length;
};

eventSchema.plugin(mongooseAutopopulate);

const Event = mongoose.model('Event', eventSchema);
export default Event;
