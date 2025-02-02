import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const adminAuth = async (req, res, next) => {
  try {
    // Check if user has permission to create events
    const allowedRoles = ['admin', 'counselor', 'alumni', 'university'];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to perform this action"
      });
    }
    next();
  } catch (error) {
    console.error("Admin Auth Error:", error);
    res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export default adminAuth;
