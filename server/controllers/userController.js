const { validationResult } = require('express-validator');
const User = require('../models/User');

// Get all users with filters
const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      userType,
      location,
      skills,
      minRating,
      maxHourlyRate,
      availability,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filters = {};
    
    if (userType) {
      filters.userType = userType;
    }
    
    if (location) {
      filters.location = new RegExp(location, 'i');
    }
    
    if (skills) {
      filters.skills = Array.isArray(skills) ? skills : skills.split(',');
    }
    
    if (minRating) {
      filters.rating = { $gte: parseFloat(minRating) };
    }
    
    if (maxHourlyRate) {
      filters.hourlyRate = { $lte: parseFloat(maxHourlyRate) };
    }
    
    if (availability) {
      filters.availability = availability;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const users = await User.find(filters)
      .select('-password') // Exclude password
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filters);

    res.json({
      message: 'Users retrieved successfully',
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalUsers: total,
        hasNext: skip + users.length < total,
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      message: 'Server error retrieving users',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.json({
      message: 'User retrieved successfully',
      user
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      message: 'Server error retrieving user',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const userId = req.user.userId;

    // Users can only update their own profile unless admin
    if (id !== userId) {
      return res.status(403).json({
        message: 'Not authorized to update this user'
      });
    }

    const updateData = req.body;
    
    // Remove sensitive fields
    delete updateData.password;
    delete updateData.email; // Email updates should be separate
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.json({
      message: 'User updated successfully',
      user
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      message: 'Server error updating user',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Users can only delete their own account unless admin
    if (id !== userId) {
      return res.status(403).json({
        message: 'Not authorized to delete this user'
      });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.json({
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      message: 'Server error deleting user',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get developers with filters
const getDevelopers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      location,
      skills,
      minRating,
      maxHourlyRate,
      availability,
      experience,
      sortBy = 'rating',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filters = { userType: 'developer', isActive: true };
    
    if (location) {
      filters.location = new RegExp(location, 'i');
    }
    
    if (skills) {
      filters.skills = Array.isArray(skills) ? skills : skills.split(',');
    }
    
    if (minRating) {
      filters.rating = { $gte: parseFloat(minRating) };
    }
    
    if (maxHourlyRate) {
      filters.hourlyRate = { $lte: parseFloat(maxHourlyRate) };
    }
    
    if (availability) {
      filters.availability = availability;
    }
    
    if (experience) {
      filters.experience = { $gte: parseInt(experience) };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const developers = await User.find(filters)
      .select('-password -email -phone') // Exclude sensitive data
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filters);

    res.json({
      message: 'Developers retrieved successfully',
      developers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalDevelopers: total,
        hasNext: skip + developers.length < total,
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get developers error:', error);
    res.status(500).json({
      message: 'Server error retrieving developers',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get clients
const getClients = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      location,
      organizationType,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filters = { userType: 'client', isActive: true };
    
    if (location) {
      filters.location = new RegExp(location, 'i');
    }
    
    if (organizationType) {
      filters.organizationType = organizationType;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const clients = await User.find(filters)
      .select('-password -email -phone') // Exclude sensitive data
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filters);

    res.json({
      message: 'Clients retrieved successfully',
      clients,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalClients: total,
        hasNext: skip + clients.length < total,
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({
      message: 'Server error retrieving clients',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Update user rating
const updateUserRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const userId = req.user.userId;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: 'Rating must be between 1 and 5'
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Only allow rating developers
    if (user.userType !== 'developer') {
      return res.status(400).json({
        message: 'Only developers can be rated'
      });
    }

    await user.updateRating(rating);

    res.json({
      message: 'Rating updated successfully',
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Update rating error:', error);
    res.status(500).json({
      message: 'Server error updating rating',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getDevelopers,
  getClients,
  updateUserRating
};
