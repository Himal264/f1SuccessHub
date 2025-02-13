import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:5174"],
      credentials: true
    }
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);
    
    // Join a personal room for private messages
    socket.join(socket.userId);

    // Join chat room
    socket.on('join_chat', (chatId) => {
      socket.join(chatId);
    });

    // Leave chat room
    socket.on('leave_chat', (chatId) => {
      socket.leave(chatId);
    });

    // Handle new message
    socket.on('new_message', (data) => {
      io.to(data.chatId).emit('receive_message', {
        chatId: data.chatId,
        message: data.message,
        sender: {
          _id: socket.userId,
          role: socket.userRole
        }
      });
    });

    // Handle typing status
    socket.on('typing', (data) => {
      socket.to(data.chatId).emit('user_typing', {
        chatId: data.chatId,
        userId: socket.userId
      });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}; 