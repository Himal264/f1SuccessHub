import pkg from 'agora-access-token';
const { RtcTokenBuilder, RtcRole } = pkg;
import Event from '../models/eventModel.js';
import jwt from 'jsonwebtoken';

const generateAgoraToken = (channelName, uid) => {
  const appID = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;
  const role = RtcRole.PUBLISHER;
  
  const expirationTimeInSeconds = 3600; // 1 hour
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
  
  const token = RtcTokenBuilder.buildTokenWithUid(
    appID, 
    appCertificate, 
    channelName, 
    uid, 
    role, 
    privilegeExpiredTs
  );
  
  return token;
};

export const startWebinar = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if webinar is already active
    if (event.webinar?.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Webinar is already active'
      });
    }

    const channelName = `webinar_${eventId}`;
    const uid = parseInt(req.user._id.toString().slice(-8), 16);
    const token = generateAgoraToken(channelName, uid);

    // Update event with webinar start and channel info
    await Event.findByIdAndUpdate(eventId, {
      'webinar.isActive': true,
      'webinar.startedAt': new Date(),
      'webinar.channel.name': channelName,
      'webinar.channel.token': token,
    });

    // Check if user is the event creator
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the event creator can start the webinar',
      });
    }

    res.json({
      success: true,
      data: {
        token,
        channel: channelName,
        uid,
        appId: process.env.AGORA_APP_ID
      }
    });

  } catch (error) {
    console.error('Error starting webinar:', error);
    res.status(500).json({
      success: false,
      message: 'Error starting webinar',
    });
  }
};

export const joinWebinar = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    if (!event.webinar?.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Webinar is not active',
      });
    }

    const channelName = event.webinar.channel.name;
    const uid = parseInt(req.user._id.toString().slice(-8), 16);
    const token = generateAgoraToken(channelName, uid);

    // Add participant to webinar
    await Event.findByIdAndUpdate(eventId, {
      $push: {
        'webinar.participants': {
          userId: req.user._id,
          joinedAt: new Date(),
          role: 'participant'
        }
      }
    });

    res.json({
      success: true,
      data: {
        token,
        channel: channelName,
        uid,
        appId: process.env.AGORA_APP_ID
      }
    });

  } catch (error) {
    console.error('Error joining webinar:', error);
    res.status(500).json({
      success: false,
      message: 'Error joining webinar',
    });
  }
};

export const endWebinar = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if user is the event creator
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the event creator can end the webinar',
      });
    }

    // Update event with webinar end
    await Event.findByIdAndUpdate(eventId, {
      'webinar.isActive': false,
      'webinar.endedAt': new Date(),
      // Update all active participants' leftAt time
      'webinar.participants.$[elem].leftAt': new Date()
    }, {
      arrayFilters: [{ 'elem.leftAt': { $exists: false } }],
      multi: true
    });

    res.json({
      success: true,
      message: 'Webinar ended successfully',
    });

  } catch (error) {
    console.error('Error ending webinar:', error);
    res.status(500).json({
      success: false,
      message: 'Error ending webinar',
    });
  }
};

export const getWebinarStatus = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const activeParticipants = event.webinar?.participants?.filter(
      p => p.joinedAt && !p.leftAt
    ) || [];

    res.json({
      success: true,
      data: {
        isActive: event.webinar?.isActive || false,
        participantCount: activeParticipants.length,
        startedAt: event.webinar?.startedAt,
        channel: event.webinar?.channel?.name
      }
    });

  } catch (error) {
    console.error('Error getting webinar status:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting webinar status',
    });
  }
};

// New endpoint to track participant activity
export const trackParticipant = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { action } = req.body; // 'join' or 'leave'

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const participantData = {
      userId: req.user._id,
      [action === 'join' ? 'joinedAt' : 'leftAt']: new Date()
    };

    await Event.findByIdAndUpdate(eventId, {
      $push: {
        'webinar.participants': participantData
      }
    });

    res.json({
      success: true,
      message: `Participant ${action} recorded successfully`
    });
  } catch (error) {
    console.error('Error tracking participant:', error);
    res.status(500).json({
      success: false,
      message: 'Error tracking participant'
    });
  }
};

export const generateToken = async (req, res) => {
  try {
    const { channelName } = req.body;
    const uid = parseInt(req.user._id.toString().slice(-8), 16);
    
    const token = generateAgoraToken(channelName, uid);
    
    res.json({
      success: true,
      token,
      uid
    });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating token'
    });
  }
}; 