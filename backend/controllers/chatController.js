import Chat from '../models/chatModel.js';
import User from '../models/userModel.js';
import Application from '../models/applynowModel.js';
import { getIO } from '../services/socket.js';

// Helper function to verify counselor
const verifyCounselor = async (counselorId) => {
  const counselor = await User.findById(counselorId);
  return counselor && 
         counselor.role === 'counselor' && 
         counselor.verificationRequest.status === 'approved';
};

// Helper function to verify user has application
const verifyUserApplication = async (userId) => {
  const application = await Application.findOne({ 'personalInfo.userId': userId });
  return application ? application._id : null;
};

export const createChat = async (req, res) => {
  try {
    const { participants } = req.body;
    
    // Validate participants
    if (!participants || participants.length < 2) {
      return res.status(400).json({ 
        message: 'At least two participants are required' 
      });
    }

    // Check if chat already exists with these participants
    const existingChat = await Chat.findOne({
      'participants.user': { $all: participants.map(p => p.user) }
    });

    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    const newChat = await Chat.create({
      participants,
      applicationId: req.body.applicationId || null
    });

    // Notify all participants about new chat
    const io = getIO();
    participants.forEach(participant => {
      io.to(participant.user.toString()).emit('new_chat', newChat);
    });

    res.status(201).json(newChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { chatId, senderId, content } = req.body;
    
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Verify sender is a participant
    if (!chat.participants.some(p => p.user.toString() === senderId)) {
      return res.status(403).json({ message: 'Unauthorized to send message in this chat' });
    }

    const newMessage = {
      sender: senderId,
      content,
      timestamp: new Date()
    };

    chat.messages.push(newMessage);
    chat.lastMessage = new Date();
    
    await chat.save();

    // Emit message to all participants in real-time
    const io = getIO();
    io.to(chatId).emit('new_message', {
      chatId,
      message: newMessage
    });
    
    res.status(200).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChats = async (req, res) => {
  try {
    const { userId } = req.query;
    
    const chats = await Chat.find({
      'participants.user': userId
    })
    .populate('participants.user', 'name email profilePicture role universityName department')
    .sort({ lastMessage: -1 });
    
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.query;
    
    const chat = await Chat.findById(chatId)
      .populate('messages.sender', 'name email profilePicture');
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Verify the requester is part of this chat
    if (!chat.participants.some(p => p.user.toString() === userId)) {
      return res.status(403).json({ message: 'Unauthorized to access these messages' });
    }
    
    res.status(200).json(chat.messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAvailableUsers = async (req, res) => {
  try {
    const { type } = req.query;
    const userId = req.user._id;

    // Find users of the specified type who are verified
    const users = await User.find({
      _id: { $ne: userId },
      role: type,
      'verificationRequest.status': 'approved'
    })
    .select('name email profilePicture role universityName department')
    .lean();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 