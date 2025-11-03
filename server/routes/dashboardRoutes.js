const express = require('express');
const {
  getStats,
  getRecentActivity,
  getMyProjects,
  getMyApplications
} = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

const router = express.Router();

// All dashboard routes are protected
router.get('/stats', auth, getStats);
router.get('/activity', auth, getRecentActivity);
router.get('/my-projects', auth, getMyProjects);
router.get('/my-applications', auth, getMyApplications);

module.exports = router;
