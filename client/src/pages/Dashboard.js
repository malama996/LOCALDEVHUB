import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [user] = useState({
    name: 'Malama Arnold',
    email: 'arnoldmalamaZ@gmail.com',
    type: 'developer', // or 'client'
    avatar: null
  });

  const mockProjects = [
    {
      id: 1,
      title: "Community Food Bank Management System",
      status: "in-progress",
      budget: 5000,
      timeline: "2 months",
      progress: 65,
      client: "Local Food Bank",
      startDate: "2025-01-15"
    },
    {
      id: 2,
      title: "Educational Platform Development",
      status: "completed",
      budget: 8000,
      timeline: "3 months",
      progress: 100,
      client: "Education Foundation",
      startDate: "2024-10-01"
    }
  ];

  const mockApplications = [
    {
      id: 1,
      projectTitle: "Environmental Monitoring Dashboard",
      client: "Green Initiative",
      appliedDate: "2025-01-20",
      status: "pending",
      budget: 3500
    },
    {
      id: 2,
      projectTitle: "Senior Care Mobile App",
      client: "Senior Care Center",
      appliedDate: "2025-01-18",
      status: "accepted",
      budget: 6000
    }
  ];

  const mockMessages = [
    {
      id: 1,
      from: "Local Food Bank",
      subject: "Project Update Request",
      preview: "Hi Malama, could you provide an update on the current progress...",
      timestamp: "2 hours ago",
      unread: true
    },
    {
      id: 2,
      from: "Education Foundation",
      subject: "Final Deliverables",
      preview: "Thank you for the excellent work on the educational platform...",
      timestamp: "1 day ago",
      unread: false
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'in-progress': return '#FF9800';
      case 'pending': return '#2196F3';
      case 'accepted': return '#4CAF50';
      case 'rejected': return '#f44336';
      default: return '#42b5f8ff';
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div className="user-info">
              <div className="user-avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <div className="avatar-placeholder">
                    <i className="fas fa-user"></i>
                  </div>
                )}
              </div>
              <div className="user-details">
                <h1 className="user-name">{user.name}</h1>
                <p className="user-email">{user.email}</p>
                <span className="user-type">{user.type}</span>
              </div>
            </div>
            <div className="header-actions">
              <button className="btn btn-primary">
                <i className="fas fa-plus"></i>
                {user.type === 'developer' ? 'Find Projects' : 'Submit Project'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="container">
          <div className="dashboard-grid">
            {/* Sidebar */}
            <div className="dashboard-sidebar">
              <nav className="sidebar-nav">
                <button 
                  className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  <i className="fas fa-chart-pie"></i>
                  Overview
                </button>
                <button 
                  className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`}
                  onClick={() => setActiveTab('projects')}
                >
                  <i className="fas fa-project-diagram"></i>
                  {user.type === 'developer' ? 'My Projects' : 'My Projects'}
                </button>
                <button 
                  className={`nav-item ${activeTab === 'applications' ? 'active' : ''}`}
                  onClick={() => setActiveTab('applications')}
                >
                  <i className="fas fa-file-alt"></i>
                  Applications
                </button>
                <button 
                  className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`}
                  onClick={() => setActiveTab('messages')}
                >
                  <i className="fas fa-envelope"></i>
                  Messages
                  {mockMessages.filter(m => m.unread).length > 0 && (
                    <span className="unread-badge">
                      {mockMessages.filter(m => m.unread).length}
                    </span>
                  )}
                </button>
                <button 
                  className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <i className="fas fa-user-cog"></i>
                  Profile Settings
                </button>
              </nav>
            </div>

            {/* Main Content */}
            <div className="dashboard-main">
              {activeTab === 'overview' && (
                <div className="overview-tab">
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-icon">
                        <i className="fas fa-project-diagram"></i>
                      </div>
                      <div className="stat-content">
                        <div className="stat-number">{mockProjects.length}</div>
                        <div className="stat-label">Active Projects</div>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">
                        <i className="fas fa-dollar-sign"></i>
                      </div>
                      <div className="stat-content">
                        <div className="stat-number">
                          ${mockProjects.reduce((sum, p) => sum + p.budget, 0).toLocaleString()}
                        </div>
                        <div className="stat-label">Total Earnings</div>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">
                        <i className="fas fa-clock"></i>
                      </div>
                      <div className="stat-content">
                        <div className="stat-number">{mockApplications.length}</div>
                        <div className="stat-label">Pending Applications</div>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">
                        <i className="fas fa-envelope"></i>
                      </div>
                      <div className="stat-content">
                        <div className="stat-number">
                          {mockMessages.filter(m => m.unread).length}
                        </div>
                        <div className="stat-label">Unread Messages</div>
                      </div>
                    </div>
                  </div>

                  <div className="recent-activity">
                    <h3>Recent Activity</h3>
                    <div className="activity-list">
                      <div className="activity-item">
                        <div className="activity-icon">
                          <i className="fas fa-check-circle"></i>
                        </div>
                        <div className="activity-content">
                          <div className="activity-title">Project completed: Educational Platform Development</div>
                          <div className="activity-time">2 days ago</div>
                        </div>
                      </div>
                      <div className="activity-item">
                        <div className="activity-icon">
                          <i className="fas fa-envelope"></i>
                        </div>
                        <div className="activity-content">
                          <div className="activity-title">New message from Local Food Bank</div>
                          <div className="activity-time">2 hours ago</div>
                        </div>
                      </div>
                      <div className="activity-item">
                        <div className="activity-icon">
                          <i className="fas fa-file-alt"></i>
                        </div>
                        <div className="activity-content">
                          <div className="activity-title">Application accepted: Senior Care Mobile App</div>
                          <div className="activity-time">1 week ago</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="projects-tab">
                  <div className="tab-header">
                    <h3>My Projects</h3>
                    <button className="btn btn-primary">
                      <i className="fas fa-plus"></i>
                      New Project
                    </button>
                  </div>
                  <div className="projects-list">
                    {mockProjects.map(project => (
                      <div key={project.id} className="project-item">
                        <div className="project-info">
                          <h4 className="project-title">{project.title}</h4>
                          <p className="project-client">{project.client}</p>
                          <div className="project-details">
                            <span className="project-budget">${project.budget}</span>
                            <span className="project-timeline">{project.timeline}</span>
                            <span className="project-start">Started: {project.startDate}</span>
                          </div>
                        </div>
                        <div className="project-status">
                          <div className="status-info">
                            <span 
                              className="status-badge"
                              style={{ backgroundColor: getStatusColor(project.status) }}
                            >
                              {project.status.replace('-', ' ')}
                            </span>
                            <div className="progress-bar">
                              <div 
                                className="progress-fill"
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                            <span className="progress-text">{project.progress}% complete</span>
                          </div>
                          <button className="btn btn-outline">View Details</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'applications' && (
                <div className="applications-tab">
                  <div className="tab-header">
                    <h3>Applications</h3>
                  </div>
                  <div className="applications-list">
                    {mockApplications.map(application => (
                      <div key={application.id} className="application-item">
                        <div className="application-info">
                          <h4 className="application-title">{application.projectTitle}</h4>
                          <p className="application-client">{application.client}</p>
                          <div className="application-details">
                            <span className="application-budget">${application.budget}</span>
                            <span className="application-date">Applied: {application.appliedDate}</span>
                          </div>
                        </div>
                        <div className="application-status">
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(application.status) }}
                          >
                            {application.status}
                          </span>
                          <button className="btn btn-outline">View Details</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'messages' && (
                <div className="messages-tab">
                  <div className="tab-header">
                    <h3>Messages</h3>
                    <button className="btn btn-primary">
                      <i className="fas fa-plus"></i>
                      New Message
                    </button>
                  </div>
                  <div className="messages-list">
                    {mockMessages.map(message => (
                      <div key={message.id} className={`message-item ${message.unread ? 'unread' : ''}`}>
                        <div className="message-avatar">
                          <div className="avatar-placeholder">
                            <i className="fas fa-user"></i>
                          </div>
                        </div>
                        <div className="message-content">
                          <div className="message-header">
                            <h4 className="message-from">{message.from}</h4>
                            <span className="message-time">{message.timestamp}</span>
                          </div>
                          <h5 className="message-subject">{message.subject}</h5>
                          <p className="message-preview">{message.preview}</p>
                        </div>
                        {message.unread && <div className="unread-indicator"></div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="profile-tab">
                  <div className="tab-header">
                    <h3>Profile Settings</h3>
                  </div>
                  <div className="profile-form">
                    <div className="form-group">
                      <label htmlFor="name">Full Name</label>
                      <input type="text" id="name" defaultValue={user.name} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input type="email" id="email" defaultValue={user.email} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="bio">Bio</label>
                      <textarea id="bio" rows="4" placeholder="Tell us about yourself..."></textarea>
                    </div>
                    <div className="form-group">
                      <label htmlFor="skills">Skills</label>
                      <input type="text" id="skills" placeholder="React, Node.js, MongoDB..." />
                    </div>
                    <div className="form-actions">
                      <button className="btn btn-primary">Save Changes</button>
                      <button className="btn btn-outline">Cancel</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
