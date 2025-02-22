import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true
  },
  subtitle: { 
    type: String, 
    required: [true, 'Subtitle is required'],
    trim: true
  },
  content: { 
    type: String, 
    required: [true, 'Content is required'],
    trim: false
  },
  storyType: {
    type: String,
    enum: {
      values: ['student', 'university', 'study in usa', 'news'],
      message: '{VALUE} is not a valid story type'
    },
    required: [true, 'Story type is required']
  },
  photo: {
    url: { type: String, required: [true, 'Photo URL is required'] },
    public_id: { type: String, required: [true, 'Photo public ID is required'] }
  },
  tags: [{
    type: String,
    required: [true, 'At least one tag is required'],
    trim: true
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  autoLinks: [{
    word: String,
    link: String
  }],
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Pre-save middleware to process auto-linking words
storySchema.pre('save', function(next) {
  const autoLinkWords = [
    'undergraduate',
    'graduate',
    'stem',
    'engineering',
    'f1question',
    'event'
    // Add more words as needed
  ];

  // Create autoLinks array based on content
  this.autoLinks = autoLinkWords
    .filter(word => this.content.toLowerCase().includes(word.toLowerCase()))
    .map(word => ({
      word: word,
      link: `/topics/${word.toLowerCase()}`
    }));

  next();
});

const Story = mongoose.models.Story || mongoose.model('Story', storySchema);
export default Story;
