import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

export const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided. Please login first."
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from token using email instead of id
        const user = await userModel.findOne({ email: decoded.email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth Error:", error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Invalid token. Please login again.",
            });
        }
        res.status(401).json({
            success: false,
            message: "Authentication failed",
            error: error.message
        });
    }
};

// Optional: Add admin authentication middleware
export const adminAuth = async (req, res, next) => {
    try {
        // First use the regular auth middleware
        await auth(req, res, async () => {
            // Check if user is admin
            if (req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: "Access denied. Admin rights required."
                });
            }
            next();
        });
    } catch (error) {
        console.error('Admin auth middleware error:', error);
        res.status(500).json({
            success: false,
            message: "Authentication error."
        });
    }
}; 