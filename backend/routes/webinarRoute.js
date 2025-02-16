import express from 'express';
import { auth } from '../middlewares/auth.js';
import { startWebinar, joinWebinar, endWebinar, getWebinarStatus } from '../controllers/webinarController.js';

const webinarRouter = express.Router();

webinarRouter.post('/start/:eventId', auth, startWebinar);
webinarRouter.post('/join/:eventId', auth, joinWebinar);
webinarRouter.post('/end/:eventId', auth, endWebinar);
webinarRouter.get('/status/:eventId', auth, getWebinarStatus);

export default webinarRouter; 