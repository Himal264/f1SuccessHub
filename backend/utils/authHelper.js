import jwt from 'jsonwebtoken';

// Function to generate an admin token
export const generateAdminToken = () => {
  const adminPayload = {
    email: process.env.ADMIN_EMAIL,
    isAdmin: true,
  };

  // Token valid for 1 hour
  return jwt.sign(adminPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
};
