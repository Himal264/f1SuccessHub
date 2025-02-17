import express from 'express';
import { 
  createChat, 
  sendMessage, 
  getChats, 
  getChatMessages, 
  getAvailableUsers,
  markMessagesAsRead
} from '../controllers/chatController.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

router.use(auth);

router.post('/create', createChat);
router.post('/message', sendMessage);
router.get('/list', getChats);
router.get('/:chatId/messages', getChatMessages);
router.get('/available-users', getAvailableUsers);
router.post('/messages/read', markMessagesAsRead);

export default router; 