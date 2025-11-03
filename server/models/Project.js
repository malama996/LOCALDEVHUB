const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  budget: {
    type: Number,
    required: true,
    min: 0
  },
  timeline: {
    type: String,
    required: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'completed', 'cancelled', 'on-hold'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['web-development', 'mobile-app', 'desktop-app', 'data-analysis', 'ai-ml', 'blockchain', 'other'],
    default: 'other'
  },
  // Project details
  requirements: {
    type: String,
    maxlength: 1000
  },
  deliverables: [{
    type: String,
    trim: true
  }],
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  // Developer assignment
  assignedDeveloper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  applications: [{
    developer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    proposal: {
      type: String,
      maxlength: 1000
    },
    proposedBudget: {
      type: Number,
      min: 0
    },
    proposedTimeline: {
      type: String
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Project progress
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  milestones: [{
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    dueDate: {
      type: Date
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date
    }
  }],
  // Communication
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }],
  // Files and documents
  attachments: [{
    filename: String,
    originalName: String,
    fileSize: Number,
    mimeType: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Visibility and settings
  isPublic: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  // Payment and billing
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'completed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['hourly', 'fixed', 'milestone']
  }
}, {
  timestamps: true
});

// Indexes for better query performance
projectSchema.index({ client: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ skills: 1 });
projectSchema.index({ location: 1 });
projectSchema.index({ budget: 1 });
projectSchema.index({ createdAt: -1 });
projectSchema.index({ isPublic: 1, status: 1 });

// Virtual for project duration
projectSchema.virtual('duration').get(function() {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  return null;
});

// Method to add application
projectSchema.methods.addApplication = function(developerId, applicationData) {
  const application = {
    developer: developerId,
    ...applicationData,
    appliedAt: new Date()
  };
  this.applications.push(application);
  return this.save();
};

// Method to update application status
projectSchema.methods.updateApplicationStatus = function(applicationId, status) {
  const application = this.applications.id(applicationId);
  if (application) {
    application.status = status;
    if (status === 'accepted') {
      this.assignedDeveloper = application.developer;
      this.status = 'in-progress';
    }
    return this.save();
  }
  throw new Error('Application not found');
};

// Method to update progress
projectSchema.methods.updateProgress = function(progress) {
  this.progress = Math.max(0, Math.min(100, progress));
  if (this.progress === 100) {
    this.status = 'completed';
    this.endDate = new Date();
  }
  return this.save();
};

// Static method to find projects by filters
projectSchema.statics.findByFilters = function(filters) {
  const query = { isPublic: true };
  
  if (filters.skills && filters.skills.length > 0) {
    query.skills = { $in: filters.skills };
  }
  
  if (filters.location) {
    query.location = new RegExp(filters.location, 'i');
  }
  
  if (filters.budget) {
    query.budget = { $lte: filters.budget };
  }
  
  if (filters.status) {
    query.status = filters.status;
  }
  
  if (filters.category) {
    query.category = filters.category;
  }
  
  return this.find(query).populate('client', 'name organization avatar');
};

module.exports = mongoose.model('Project', projectSchema);
