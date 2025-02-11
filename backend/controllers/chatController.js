import Chat from '../models/chatModel.js';
import User from '../models/userModel.js';
import Application from '../models/applynowModel.js';

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
    const { userId, counselorId } = req.body;
    
    // Verify counselor is approved
    const isCounselorValid = await verifyCounselor(counselorId);
    if (!isCounselorValid) {
      return res.status(403).json({ 
        message: 'Selected counselor is not approved or not found' 
      });
    }

    // Verify user has submitted an application
    const applicationId = await verifyUserApplication(userId);
    if (!applicationId) {
      return res.status(403).json({ 
        message: 'You must submit an application before starting a chat with a counselor' 
      });
    }

    // Check if chat already exists
    const existingChat = await Chat.findOne({
      user: userId,
      counselor: counselorId,
      applicationId
    });

    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    const newChat = await Chat.create({
      user: userId,
      counselor: counselorId,
      applicationId
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

    // Verify sender is either the user or counselor of this chat
    if (senderId.toString() !== chat.user.toString() && 
        senderId.toString() !== chat.counselor.toString()) {
      return res.status(403).json({ message: 'Unauthorized to send message in this chat' });
    }

    chat.messages.push({
      sender: senderId,
      content,
    });
    chat.lastMessage = Date.now();
    
    await chat.save();
    
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChats = async (req, res) => {
  try {
    const { userId, role } = req.query;
    
    // For counselors, verify they are approved
    if (role === 'counselor') {
      const isApproved = await verifyCounselor(userId);
      if (!isApproved) {
        return res.status(403).json({ 
          message: 'Counselor is not approved to access chats' 
        });
      }
    }

    const query = role === 'counselor' 
      ? { counselor: userId }
      : { user: userId };
    
    const chats = await Chat.find(query)
      .populate('user', 'name email profilePicture')
      .populate('counselor', 'name email profilePicture')
      .populate('applicationId')
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
    if (userId.toString() !== chat.user.toString() && 
        userId.toString() !== chat.counselor.toString()) {
      return res.status(403).json({ message: 'Unauthorized to access these messages' });
    }
    
    res.status(200).json(chat.messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 