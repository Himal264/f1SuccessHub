import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  question : {
    type : String,
    required : true,
maxlength : [300, 'Question cannot exceed 300 words'],

  },
  answer : {
    type : String,
    required : true ,
    maxlength : [1000, 'Answer cannot exceed 500 words'],
  },
  reasoning : { 
    type : String,
    required : true,
    maxlength : [1000, 'Reasoning cannot exceed 500 words'],
  },
  type: {
    type: String,
    required: true,
    enum: [
      'personal background',
      'academic background',
      'course and university selection',
      'financial capability',
      'career goals',
      'ties to home country',
      'knowledge of the U.S. and visa process'
    ],
  },
})

const QuestionModel = mongoose.models.Question || mongoose.model("Question", QuestionSchema);

export default QuestionModel;
