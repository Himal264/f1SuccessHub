import express from 'express';
import { auth } from '../middlewares/auth.js';
import { startWebinar, joinWebinar, endWebinar, getWebinarStatus, trackParticipant, generateToken } from '../controllers/webinarController.js';

const webinarRouter = express.Router();

webinarRouter.post('/start/:eventId', auth, startWebinar);
webinarRouter.post('/join/:eventId', auth, joinWebinar);
webinarRouter.post('/end/:eventId', auth, endWebinar);
webinarRouter.get('/status/:eventId', auth, getWebinarStatus);
webinarRouter.post('/participant/:eventId', auth, trackParticipant);
webinarRouter.post('/token', auth, generateToken);

export default webinarRouter; 