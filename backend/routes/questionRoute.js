import express from 'express';
import { addQuestions, listQuestions, singleQuestion, removeQuestion, updateQuestion } from '../controllers/questionControllers.js';
import adminAuth from '../middlewares/adminAuth.js';


const questionRouter = express.Router();

questionRouter.post('/add',adminAuth,  addQuestions);
questionRouter.get('/list', listQuestions);
questionRouter.post('/single', adminAuth, singleQuestion);
questionRouter.post('/remove',removeQuestion);
questionRouter.put('/update', updateQuestion);


export default questionRouter;