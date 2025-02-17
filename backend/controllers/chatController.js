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
    const { participantId } = req.body;
    const userId = req.user._id;

    // Verify participant exists
    const participant = await User.findById(participantId);
    if (!participant) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid participant' 
      });
    }

    // Check if chat already exists
    const existingChat = await Chat.findOne({
      'participants.user': { $all: [userId, participantId] }
    }).populate('participants.user', 'name role profilePicture');

    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    // Create new chat
    const newChat = await Chat.create({
      participants: [
        { user: userId, role: req.user.role },
        { user: participantId, role: participant.role }
      ]
    });

    // Populate the new chat
    const populatedChat = await Chat.findById(newChat._id)
      .populate('participants.user', 'name role profilePicture');

    // Notify participant about new chat
    const io = getIO();
    io.to(participantId.toString()).emit('new_chat', populatedChat);

    res.status(201).json(populatedChat);
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;
    const senderId = req.user._id; // Get sender from authenticated user
    
    const chat = await Chat.findById(chatId)
      .populate('participants.user', 'name role profilePicture');
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Verify sender is a participant
    const isParticipant = chat.participants.some(
      p => p.user._id.toString() === senderId.toString()
    );
    
    if (!isParticipant) {
      return res.status(403).json({ 
        message: 'Unauthorized to send message in this chat' 
      });
    }

    const newMessage = {
      sender: senderId,
      content,
      timestamp: new Date(),
      read: false
    };

    chat.messages.push(newMessage);
    chat.lastMessage = new Date();
    await chat.save();

    // Get the populated message
    const populatedChat = await Chat.findOne(
      { 'messages._id': chat.messages[chat.messages.length - 1]._id }
    ).populate('messages.sender', 'name role profilePicture');

    const populatedMessage = populatedChat.messages[populatedChat.messages.length - 1];

    // Emit to all participants except sender
    const io = getIO();
    chat.participants.forEach(participant => {
      if (participant.user._id.toString() !== senderId.toString()) {
        io.to(participant.user._id.toString()).emit('new_message', {
          chatId,
          message: populatedMessage
        });
      }
    });

    res.status(200).json(populatedMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getChats = async (req, res) => {
  try {
    const { userId } = req.query;
    
    // Verify the requesting user exists and has permission
    if (userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized to access these chats' 
      });
    }

    // Find all chats where the user is a participant
    const chats = await Chat.find({
      'participants.user': userId
    })
    .populate({
      path: 'participants.user',
      select: 'name email profilePicture role counselorInfo alumniInfo universityInfo online'
    })
    .populate({
      path: 'messages.sender',
      select: 'name role profilePicture'
    })
    .sort({ lastMessage: -1 });

    // Enhance chat data with role-specific information
    const enhancedChats = chats.map(chat => {
      const otherParticipant = chat.participants.find(
        p => p.user._id.toString() !== userId
      );

      if (!otherParticipant || !otherParticipant.user) {
        return chat;
      }

      const user = otherParticipant.user;
      let additionalInfo = {};

      // Add role-specific information
      switch (user.role) {
        case 'counselor':
          additionalInfo = {
            specialization: user.counselorInfo?.certifiedCompany || 'Career Guidance',
            experience: user.counselorInfo?.startDate ? 
              `${new Date().getFullYear() - new Date(user.counselorInfo.startDate).getFullYear()}+ years experience` : 
              '5+ years experience'
          };
          break;
        case 'alumni':
          additionalInfo = {
            university: user.alumniInfo?.universityName,
            graduationYear: user.alumniInfo?.endStudy ? 
              new Date(user.alumniInfo.endStudy).getFullYear() : 
              'Recent Graduate'
          };
          break;
        case 'university':
          additionalInfo = {
            universityName: user.universityInfo?.universityName,
            department: 'Admissions Department',
            location: user.universityInfo?.location
          };
          break;
        case 'user':
          additionalInfo = {
            status: 'Student'
          };
          break;
      }

      // Merge additional info with user data
      otherParticipant.user = {
        ...otherParticipant.user.toObject(),
        ...additionalInfo
      };

      return chat;
    });
    
    res.status(200).json(enhancedChats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;
    
    const chat = await Chat.findById(chatId)
      .populate({
        path: 'messages.sender',
        select: 'name email profilePicture role counselorInfo alumniInfo universityInfo'
      })
      .populate({
        path: 'participants.user',
        select: 'name email profilePicture role counselorInfo alumniInfo universityInfo online'
      });
    
    if (!chat) {
      return res.status(404).json({ 
        success: false,
        message: 'Chat not found' 
      });
    }

    // Verify the requester is part of this chat
    const isParticipant = chat.participants.some(
      p => p.user._id.toString() === userId.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({ 
        success: false,
        message: 'Unauthorized to access these messages' 
      });
    }

    // Ensure messages is always an array
    const chatData = chat.toObject();
    chatData.messages = chatData.messages || [];

    res.status(200).json(chatData);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
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
    .select('name email profilePicture role counselorInfo alumniInfo universityInfo online')
    .lean();

    // Enhance user data with role-specific information
    const enhancedUsers = users.map(user => {
      let additionalInfo = {};

      switch (user.role) {
        case 'counselor':
          additionalInfo = {
            specialization: user.counselorInfo?.certifiedCompany || 'Career Guidance',
            experience: user.counselorInfo?.startDate ? 
              `${new Date().getFullYear() - new Date(user.counselorInfo.startDate).getFullYear()}+ years experience` : 
              '5+ years experience'
          };
          break;
        case 'alumni':
          additionalInfo = {
            university: user.alumniInfo?.universityName,
            graduationYear: user.alumniInfo?.endStudy ? 
              new Date(user.alumniInfo.endStudy).getFullYear() : 
              'Recent Graduate'
          };
          break;
        case 'university':
          additionalInfo = {
            universityName: user.universityInfo?.universityName,
            department: 'Admissions Department',
            location: user.universityInfo?.location
          };
          break;
      }

      return {
        ...user,
        ...additionalInfo
      };
    });

    res.status(200).json(enhancedUsers);
  } catch (error) {
    console.error('Error fetching available users:', error);
    res.status(500).json({ message: error.message });
  }
};

export const markMessagesAsRead = async (req, res) => {
  try {
    const { chatId, messageIds } = req.body;
    const userId = req.user._id;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Update messages
    chat.messages = chat.messages.map(msg => 
      messageIds.includes(msg._id.toString()) ? { ...msg, read: true } : msg
    );

    await chat.save();

    // Notify sender that messages were read
    const io = getIO();
    chat.participants.forEach(participant => {
      if (participant.user.toString() !== userId) {
        io.to(participant.user.toString()).emit('message_read', {
          chatId,
          messageIds
        });
      }
    });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 