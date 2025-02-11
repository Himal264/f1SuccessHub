import express from 'express';
import { 
  createChat, 
  sendMessage, 
  getChats, 
  getChatMessages 
} from '../controllers/chatController.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

router.use(auth); // Use the auth middleware instead of verifyToken

router.post('/create', createChat);
router.post('/message', sendMessage);
router.get('/list', getChats);
router.get('/:chatId/messages', getChatMessages);

export default router; 