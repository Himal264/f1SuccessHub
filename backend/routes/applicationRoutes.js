// routes/applicationRoutes.js
import express from 'express';
import ApplicationController from '../controllers/applicationController.js';

const applicationRouter = express.Router();

applicationRouter.post('/', ApplicationController.submitApplication);
applicationRouter.get('/:id', ApplicationController.getApplication);

export default applicationRouter;