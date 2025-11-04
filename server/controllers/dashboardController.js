const Project = require('../models/Project');
const User = require('../models/User');
const Message = require('../models/Message');

// Get dashboard stats
const getStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userType = req.user.userType;

    let stats = {};

    if (userType === 'developer') {
      // Developer stats
      const activeProjects = await Project.countDocuments({
        assignedDeveloper: userId,
        status: { $in: ['in-progress', 'on-hold'] }
      });

      const completedProjects = await Project.countDocuments({
        assignedDeveloper: userId,
        status: 'completed'
      });

      const pendingApplications = await Project.countDocuments({
        'applications.developer': userId,
        'applications.status': 'pending'
      });

      const totalEarnings = await Project.aggregate([
        {
          $match: {
            assignedDeveloper: userId,
            status: 'completed'
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$budget' }
          }
        }
      ]);

      const unreadMessages = await Message.getUnreadCount(userId);

      stats = {
        activeProjects,
        completedProjects,
        pendingApplications,
        totalEarnings: totalEarnings[0]?.total || 0,
        unreadMessages
      };

    } else if (userType === 'client') {
      // Client stats
      const activeProjects = await Project.countDocuments({
        client: userId,
        status: { $in: ['open', 'in-progress', 'on-hold'] }
      });

      const completedProjects = await Project.countDocuments({
        client: userId,
        status: 'completed'
      });

      const totalSpent = await Project.aggregate([
        {
          $match: {
            client: userId,
            status: 'completed'
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$budget' }
          }
        }
      ]);

      const pendingApplications = await Project.aggregate([
        {
          $match: {
            client: userId,
            status: 'open'
          }
        },
        {
          $unwind: '$applications'
        },
        {
          $match: {
            'applications.status': 'pending'
          }
        },
        {
          $count: 'count'
        }
      ]);

      const unreadMessages = await Message.getUnreadCount(userId);

      stats = {
        activeProjects,
        completedProjects,
        totalSpent: totalSpent[0]?.total || 0,
        pendingApplications: pendingApplications[0]?.count || 0,
        unreadMessages
      };
    }

    res.json({
      message: 'Stats retrieved successfully',
      stats
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      message: 'Server error retrieving stats',
      error: process.env.NODE_ENV === 'production' ? error.message : {}
    });
  }
};

// Get recent activity
const getRecentActivity = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userType = req.user.userType;

    let activities = [];

    if (userType === 'developer') {
      // Get recent project activities
      const recentProjects = await Project.find({
        assignedDeveloper: userId
      })
      .populate('client', 'name organization')
      .sort({ updatedAt: -1 })
      .limit(5);

      activities = recentProjects.map(project => ({
        type: 'project',
        action: project.status === 'completed' ? 'completed' : 'updated',
        title: project.title,
        client: project.client.name,
        timestamp: project.updatedAt,
        status: project.status
      }));

      // Get recent applications
      const recentApplications = await Project.find({
        'applications.developer': userId
      })
      .populate('client', 'name organization')
      .sort({ 'applications.appliedAt': -1 })
      .limit(5);

      const applicationActivities = recentApplications.map(project => {
        const application = project.applications.find(app => 
          app.developer.toString() === userId
        );
        return {
          type: 'application',
          action: 'applied',
          title: project.title,
          client: project.client.name,
          timestamp: application.appliedAt,
          status: application.status
        };
      });

      activities = [...activities, ...applicationActivities]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10);

    } else if (userType === 'client') {
      // Get recent project activities
      const recentProjects = await Project.find({
        client: userId
      })
      .populate('assignedDeveloper', 'name')
      .sort({ updatedAt: -1 })
      .limit(10);

      activities = recentProjects.map(project => ({
        type: 'project',
        action: project.status === 'completed' ? 'completed' : 
               project.status === 'in-progress' ? 'started' : 'updated',
        title: project.title,
        developer: project.assignedDeveloper?.name,
        timestamp: project.updatedAt,
        status: project.status
      }));
    }

    res.json({
      message: 'Recent activity retrieved successfully',
      activities
    });

  } catch (error) {
    console.error('Get recent activity error:', error);
    res.status(500).json({
      message: 'Server error retrieving recent activity',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get user's projects
const getMyProjects = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userType = req.user.userType;

    let projects = [];

    if (userType === 'developer') {
      projects = await Project.find({
        assignedDeveloper: userId
      })
      .populate('client', 'name organization avatar')
      .sort({ updatedAt: -1 });
    } else if (userType === 'client') {
      projects = await Project.find({
        client: userId
      })
      .populate('assignedDeveloper', 'name avatar rating')
      .sort({ updatedAt: -1 });
    }

    res.json({
      message: 'My projects retrieved successfully',
      projects
    });

  } catch (error) {
    console.error('Get my projects error:', error);
    res.status(500).json({
      message: 'Server error retrieving my projects',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get user's applications
const getMyApplications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userType = req.user.userType;

    let applications = [];

    if (userType === 'developer') {
      const projects = await Project.find({
        'applications.developer': userId
      })
      .populate('client', 'name organization avatar')
      .sort({ 'applications.appliedAt': -1 });

      applications = projects.map(project => {
        const application = project.applications.find(app => 
          app.developer.toString() === userId
        );
        return {
          _id: application._id,
          project: {
            _id: project._id,
            title: project.title,
            budget: project.budget,
            timeline: project.timeline,
            status: project.status
          },
          client: project.client,
          proposal: application.proposal,
          proposedBudget: application.proposedBudget,
          proposedTimeline: application.proposedTimeline,
          status: application.status,
          appliedAt: application.appliedAt
        };
      });

    } else if (userType === 'client') {
      const projects = await Project.find({
        client: userId,
        'applications.0': { $exists: true }
      })
      .populate('applications.developer', 'name avatar rating skills hourlyRate')
      .sort({ updatedAt: -1 });

      applications = projects.flatMap(project => 
        project.applications.map(application => ({
          _id: application._id,
          project: {
            _id: project._id,
            title: project.title,
            budget: project.budget,
            timeline: project.timeline,
            status: project.status
          },
          developer: application.developer,
          proposal: application.proposal,
          proposedBudget: application.proposedBudget,
          proposedTimeline: application.proposedTimeline,
          status: application.status,
          appliedAt: application.appliedAt
        }))
      );
    }

    res.json({
      message: 'My applications retrieved successfully',
      applications
    });

  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({
      message: 'Server error retrieving my applications',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

module.exports = {
  getStats,
  getRecentActivity,
  getMyProjects,
  getMyApplications
};
