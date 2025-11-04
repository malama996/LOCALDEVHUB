const jwt = require('jsonwebtoken');
const User = require('../models/User');

// In-memory token blacklist (use Redis in production)
const tokenBlacklist = new Set();

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        message: 'No token provided, authorization denied' 
      });
    }

    // Check if token is blacklisted
    if (tokenBlacklist.has(token)) {
      return res.status(401).json({ 
        message: 'Token has been invalidated. Please login again.' 
      });
    }

    // Remove the fallback secret - force environment variable
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET environment variable is missing');
      return res.status(500).json({ 
        message: 'Server configuration error' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ 
        message: 'Token is not valid - user not found' 
      });
    }

    if (!user.isActive) {
      return res.status(401).json({ 
        message: 'Account is deactivated. Please contact support.' 
      });
    }

    req.user = {
      userId: user._id,
      userType: user.userType,
      email: user.email,
      name: user.name
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    // Specific error messages for better client handling
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token has expired. Please login again.' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token format' 
      });
    }

    res.status(401).json({ 
      message: 'Token is not valid' 
    });
  }
};

// Helper function to blacklist tokens (for logout)
auth.blacklistToken = (token) => {
  tokenBlacklist.add(token);
  
  // Auto-remove from blacklist after token expiry (cleanup)
  setTimeout(() => {
    tokenBlacklist.delete(token);
  }, 7 * 24 * 60 * 60 * 1000); // 7 days
};

module.exports = auth;