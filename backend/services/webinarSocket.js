import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';

const webinarSessions = new Map(); // Store active webinar sessions

const setupWebinarWebSocket = (server) => {
  const wss = new WebSocketServer({ server, path: '/ws/webinar' });

  wss.on('connection', async (ws, req) => {
    try {
      // Get token from query parameters
      const url = new URL(req.url, 'http://localhost');
      const token = url.searchParams.get('token');
      const webinarId = url.searchParams.get('webinarId');
      const role = url.searchParams.get('role');

      if (!token || !webinarId) {
        ws.close(4000, 'Missing token or webinar ID');
        return;
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      ws.userId = decoded.id;
      ws.role = role;
      ws.webinarId = webinarId;

      // Initialize webinar session if it doesn't exist
      if (!webinarSessions.has(webinarId)) {
        webinarSessions.set(webinarId, {
          host: null,
          participants: new Set(),
          messages: [],
        });
      }

      const session = webinarSessions.get(webinarId);

      if (role === 'host') {
        if (session.host) {
          ws.close(4001, 'Webinar already has a host');
          return;
        }
        session.host = ws;
      } else {
        session.participants.add(ws);
      }

      // Handle messages
      ws.on('message', (data) => {
        const message = JSON.parse(data);
        handleWebinarMessage(ws, message, session);
      });

      // Handle disconnection
      ws.on('close', () => {
        if (role === 'host') {
          session.host = null;
          broadcastToParticipants(session, {
            type: 'host-disconnected',
          });
        } else {
          session.participants.delete(ws);
        }

        if (!session.host && session.participants.size === 0) {
          webinarSessions.delete(webinarId);
        }
      });

      // Send initial connection success
      ws.send(JSON.stringify({
        type: 'connected',
        role: role,
      }));

    } catch (error) {
      console.error('WebSocket connection error:', error);
      ws.close(4002, 'Authentication failed');
    }
  });
};

const handleWebinarMessage = (ws, message, session) => {
  switch (message.type) {
    case 'chat':
      broadcastMessage(session, {
        type: 'chat',
        userId: ws.userId,
        content: message.content,
        timestamp: new Date().toISOString(),
      });
      break;

    case 'stream-offer':
      if (ws.role === 'host') {
        broadcastToParticipants(session, {
          type: 'stream-offer',
          sdp: message.sdp,
        });
      }
      break;

    case 'stream-answer':
      if (ws.role === 'participant' && session.host) {
        session.host.send(JSON.stringify({
          type: 'stream-answer',
          userId: ws.userId,
          sdp: message.sdp,
        }));
      }
      break;

    case 'ice-candidate':
      broadcastMessage(session, {
        type: 'ice-candidate',
        candidate: message.candidate,
        userId: ws.userId,
      });
      break;

    case 'raise-hand':
      if (ws.role === 'participant') {
        session.host?.send(JSON.stringify({
          type: 'raise-hand',
          userId: ws.userId
        }));
      }
      break;

    case 'mute-participant':
      if (ws.role === 'host') {
        const targetParticipant = Array.from(session.participants)
          .find(p => p.userId === message.targetUserId);
        if (targetParticipant) {
          targetParticipant.send(JSON.stringify({
            type: 'mute-request'
          }));
        }
      }
      break;

    case 'screen-share-start':
      if (ws.role === 'host') {
        broadcastToParticipants(session, {
          type: 'screen-share-started',
          sdp: message.sdp
        });
      }
      break;

    case 'webinar-recording':
      if (ws.role === 'host') {
        broadcastMessage(session, {
          type: 'recording-status',
          isRecording: message.isRecording
        });
      }
      break;
  }
};

const broadcastMessage = (session, message) => {
  const messageString = JSON.stringify(message);
  if (session.host) {
    session.host.send(messageString);
  }
  session.participants.forEach((participant) => {
    participant.send(messageString);
  });
};

const broadcastToParticipants = (session, message) => {
  const messageString = JSON.stringify(message);
  session.participants.forEach((participant) => {
    participant.send(messageString);
  });
};

export default setupWebinarWebSocket;