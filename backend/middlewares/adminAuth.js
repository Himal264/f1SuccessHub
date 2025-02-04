import jwt from 'jsonwebtoken';


const adminAuth = (req, res, next) => {
  // Extract token from the Authorization header
  const token = req.headers['authorization']?.split(' ')[1]; // Splitting "Bearer <token>"

  if (!token) {
    return res.status(403).json({ message: "Authorization token is missing. Please log in." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Attach the decoded user info to the request
    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export default adminAuth;