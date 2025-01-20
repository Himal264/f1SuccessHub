// routes/applicationRoutes.js
import express from 'express';
import ApplicationController from '../controllers/applicationController.js';

const applicationRouter = express.Router();

// Main application submission route
applicationRouter.post('/send', ApplicationController.submitApplication);

// Future expansion routes (commented until needed)
// applicationRouter.get('/:id', ApplicationController.getApplication);
// applicationRouter.patch('/:id', ApplicationController.updateApplication);
// applicationRouter.delete('/:id', ApplicationController.deleteApplication);

export default applicationRouter;