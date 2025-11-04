const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// Validate JWT secret on startup
const validateJWTConfig = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('❌ JWT_SECRET environment variable is required');
  }
  
  if (process.env.JWT_SECRET.length < 32) {
    throw new Error('❌ JWT_SECRET must be at least 32 characters long');
  }
  
  console.log('✅ JWT configuration validated');
};

// Call this when your app starts
validateJWTConfig();

// Enhanced token generation with proper security
const generateToken = (userId, userType = 'user') => {
  const payload = {
    userId,
    userType,
    iss: 'localdevhub-api',
    aud: 'localdevhub-web',
    iat: Math.floor(Date.now() / 1000)
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    algorithm: 'HS256'
  });
};

// Verify token with enhanced security
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, {
    algorithms: ['HS256'],
    issuer: 'localdevhub-api',
    audience: 'localdevhub-web'
  });
};

// Token blacklist (use Redis in production)
const tokenBlacklist = new Set();

// Your existing auth functions with production improvements...
const register = async (req, res) => {
  try {
    // Validate JWT secret is available
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: 'Server configuration error'
      });
    }

    // ... rest of your register function
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password, userType, location, ...otherData } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      email: email.toLowerCase().trim() 
    });
    
    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists with this email'
      });
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      userType,
      location: location?.trim(),
      ...otherData
    };

    // Add type-specific fields
    if (userType === 'developer') {
      userData.skills = otherData.skills || [];
      userData.experience = otherData.experience || 0;
      userData.hourlyRate = otherData.hourlyRate || 0;
      userData.availability = otherData.availability || 'available';
    } else if (userType === 'client') {
      userData.organization = otherData.organization;
      userData.organizationType = otherData.organizationType || 'other';
    }

    const user = new User(userData);
    await user.save();

    // Generate token
    const token = generateToken(user._id, userType);

    const userResponse = user.getPublicProfile();

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Server error during registration',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

// Enhanced middleware for token verification
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        message: 'No token provided, authorization denied'
      });
    }

    // Check if token is blacklisted
    if (tokenBlacklist.has(token)) {
      return res.status(401).json({
        message: 'Token has been invalidated'
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
    
  } catch (error) {
    console.error('Token verification error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token has expired'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Invalid token'
      });
    }

    res.status(500).json({
      message: 'Token verification failed'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
  changePassword,
  authenticateToken,
  validateJWTConfig
};