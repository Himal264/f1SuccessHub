import Event from '../models/eventModel.js';
import jwt from 'jsonwebtoken';

export const startWebinar = async (req, res) => {
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
        message: 'Only the event creator can start the webinar',
      });
    }

    // Generate webinar token
    const webinarToken = jwt.sign(
      {
        id: req.user._id,
        eventId: eventId,
        role: 'host',
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token: webinarToken,
      wsUrl: `${process.env.WS_URL}/ws/webinar?token=${webinarToken}&webinarId=${eventId}&role=host`,
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

    // Generate participant token
    const webinarToken = jwt.sign(
      {
        id: req.user._id,
        eventId: eventId,
        role: 'participant',
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token: webinarToken,
      wsUrl: `${process.env.WS_URL}/ws/webinar?token=${webinarToken}&webinarId=${eventId}&role=participant`,
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

    res.json({
      success: true,
      isActive: true, // You'll need to implement logic to track active webinars
      participantCount: 0, // Implement participant counting logic
    });

  } catch (error) {
    console.error('Error getting webinar status:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting webinar status',
    });
  }
}; 