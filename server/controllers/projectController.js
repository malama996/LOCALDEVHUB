const { validationResult } = require('express-validator');
const Project = require('../models/Project');
const User = require('../models/User');

// Get all projects with filters
const getAllProjects = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      skills,
      location,
      budget,
      status,
      category,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filters = {};
    
    if (skills) {
      filters.skills = Array.isArray(skills) ? skills : skills.split(',');
    }
    
    if (location) {
      filters.location = new RegExp(location, 'i');
    }
    
    if (budget) {
      filters.budget = { $lte: parseInt(budget) };
    }
    
    if (status) {
      filters.status = status;
    }
    
    if (category) {
      filters.category = category;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const projects = await Project.find(filters)
      .populate('client', 'name organization avatar location')
      .populate('assignedDeveloper', 'name avatar rating')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Project.countDocuments(filters);

    res.json({
      message: 'Projects retrieved successfully',
      projects,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProjects: total,
        hasNext: skip + projects.length < total,
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      message: 'Server error retrieving projects',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get project by ID
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id)
      .populate('client', 'name organization avatar location phone email')
      .populate('assignedDeveloper', 'name avatar rating skills hourlyRate')
      .populate('applications.developer', 'name avatar rating skills hourlyRate');

    if (!project) {
      return res.status(404).json({
        message: 'Project not found'
      });
    }

    // Increment view count
    project.views += 1;
    await project.save();

    res.json({
      message: 'Project retrieved successfully',
      project
    });

  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      message: 'Server error retrieving project',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Create new project
const createProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const projectData = {
      ...req.body,
      client: req.user.userId
    };

    const project = new Project(projectData);
    await project.save();

    // Populate client data
    await project.populate('client', 'name organization avatar');

    res.status(201).json({
      message: 'Project created successfully',
      project
    });

  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      message: 'Server error creating project',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Update project
const updateProject = async (req, res) => {
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

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        message: 'Project not found'
      });
    }

    // Check if user is the client or admin
    if (project.client.toString() !== userId) {
      return res.status(403).json({
        message: 'Not authorized to update this project'
      });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('client', 'name organization avatar');

    res.json({
      message: 'Project updated successfully',
      project: updatedProject
    });

  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      message: 'Server error updating project',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        message: 'Project not found'
      });
    }

    // Check if user is the client or admin
    if (project.client.toString() !== userId) {
      return res.status(403).json({
        message: 'Not authorized to delete this project'
      });
    }

    await Project.findByIdAndDelete(id);

    res.json({
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      message: 'Server error deleting project',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Apply to project
const applyToProject = async (req, res) => {
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

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        message: 'Project not found'
      });
    }

    // Check if user is a developer
    const user = await User.findById(userId);
    if (user.userType !== 'developer') {
      return res.status(400).json({
        message: 'Only developers can apply to projects'
      });
    }

    // Check if already applied
    const existingApplication = project.applications.find(
      app => app.developer.toString() === userId
    );
    if (existingApplication) {
      return res.status(400).json({
        message: 'You have already applied to this project'
      });
    }

    // Add application
    const applicationData = {
      developer: userId,
      proposal: req.body.proposal,
      proposedBudget: req.body.proposedBudget,
      proposedTimeline: req.body.proposedTimeline
    };

    await project.addApplication(userId, applicationData);

    res.status(201).json({
      message: 'Application submitted successfully'
    });

  } catch (error) {
    console.error('Apply to project error:', error);
    res.status(500).json({
      message: 'Server error submitting application',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get project applications
const getProjectApplications = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const project = await Project.findById(id)
      .populate('applications.developer', 'name avatar rating skills hourlyRate experience');

    if (!project) {
      return res.status(404).json({
        message: 'Project not found'
      });
    }

    // Check if user is the client
    if (project.client.toString() !== userId) {
      return res.status(403).json({
        message: 'Not authorized to view applications'
      });
    }

    res.json({
      message: 'Applications retrieved successfully',
      applications: project.applications
    });

  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      message: 'Server error retrieving applications',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Update application status
const updateApplicationStatus = async (req, res) => {
  try {
    const { id, applicationId } = req.params;
    const { status } = req.body;
    const userId = req.user.userId;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        message: 'Project not found'
      });
    }

    // Check if user is the client
    if (project.client.toString() !== userId) {
      return res.status(403).json({
        message: 'Not authorized to update application status'
      });
    }

    await project.updateApplicationStatus(applicationId, status);

    res.json({
      message: 'Application status updated successfully'
    });

  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      message: 'Server error updating application status',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  applyToProject,
  getProjectApplications,
  updateApplicationStatus
};
