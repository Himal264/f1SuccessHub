import QuestionModel from "../models/questionModel.js"


// function for add questions
const addQuestions = async (req, res) => {
  try {
    const { question, answer, reasoning, type} = req.body;
    
    const newQuestion = await QuestionModel.create({
      question,
      answer,
      reasoning,
      type
    });

    res.status(201).json({
      success: true,
      data: newQuestion
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// function for list questions
const listQuestions = async (req, res) => {
  try {
    const questions = await QuestionModel.find().sort({ _id: -1 });
    return res.status(200).json({
      success: true, 
      count: questions.length,
      questions
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching questions',
      error: error.message
    });
  }
 };



// Remove a question by ID
const removeQuestion = async (req, res) => {
  try {

    await QuestionModel.findByIdAndDelete(req.body.id);
    res.json({success:true, message:"Question Removed successfully"});

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};


// function for single question info
const singleQuestion = async (req, res) => {
  try {
    const {questionId} = req.body;
    if (!questionId) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }
    res.json({ success: true, data: await QuestionModel.findById(questionId) });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// function for update question
const updateQuestion = async (req, res) => {
  try {
    const { questionId, updates } = req.body; // Extract questionId and updates from the request body

    if (!questionId || !updates) {
      return res.status(400).json({
        success: false,
        message: 'questionId and updates are required',
      });
    }

    const updatedQuestion = await QuestionModel.findByIdAndUpdate(
      questionId,     // The ID of the question to update
      updates,        // The fields to update
      { new: true }   // Return the updated document
    );

    if (!updatedQuestion) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    res.json({ success: true, updatedQuestion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};





export { addQuestions, listQuestions, removeQuestion, singleQuestion, updateQuestion };
