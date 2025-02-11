import express from 'express';
import { 
  createChat, 
  sendMessage, 
  getChats, 
  getChatMessages 
} from '../controllers/chatController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(verifyToken); // Protect all chat routes

router.post('/create', createChat);
router.post('/message', sendMessage);
router.get('/list', getChats);
router.get('/:chatId/messages', getChatMessages);

export default router; 