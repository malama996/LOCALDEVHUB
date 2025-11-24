import React, { useState, useMemo, useCallback, useEffect } from 'react';
import './Dashboard.css';

// Custom hooks for better separation of concerns
const useUser = () => {
  return useMemo(() => ({
    name: 'Malama Arnold',
    email: 'arnoldmalamaZ@gmail.com',
    type: 'developer',
    avatar: null,
    joinDate: '2024-01-01'
  }), []);
};

const useDashboardData = (userType) => {
  const [loading] = useState(false);
  
  const mockProjects = useMemo(() => [
    {
      id: 1,
      title: "Community Food Bank Management System",
      status: "in-progress",
      budget: 5000,
      timeline: "2 months",
      progress: 65,
      client: "Local Food Bank",
      startDate: "2025-01-15",
      deadline: "2025-03-15"
    },
    {
      id: 2,
      title: "Educational Platform Development",
      status: "completed",
      budget: 8000,
      timeline: "3 months",
      progress: 100,
      client: "Education Foundation",
      startDate: "2024-10-01",
      completionDate: "2024-12-30"
    }
  ], []);

  const mockApplications = useMemo(() => [
    {
      id: 1,
      projectTitle: "Environmental Monitoring Dashboard",
      client: "Green Initiative",
      appliedDate: "2025-01-20",
      status: "pending",
      budget: 3500,
      matchScore: 85
    },
    {
      id: 2,
      projectTitle: "Senior Care Mobile App",
      client: "Senior Care Center",
      appliedDate: "2025-01-18",
      status: "accepted",
      budget: 6000,
      matchScore: 92
    }
  ], []);

  const mockMessages = useMemo(() => [
    {
      id: 1,
      from: "Local Food Bank",
      subject: "Project Update Request",
      preview: "Hi Malama, could you provide an update on the current progress...",
      timestamp: "2 hours ago",
      unread: true,
      priority: "high"
    },
    {
      id: 2,
      from: "Education Foundation",
      subject: "Final Deliverables",
      preview: "Thank you for the excellent work on the educational platform...",
      timestamp: "1 day ago",
      unread: false,
      priority: "normal"
    }
  ], []);

  const stats = useMemo(() => ({
    activeProjects: mockProjects.filter(p => p.status === 'in-progress').length,
    totalEarnings: mockProjects.reduce((sum, p) => sum + p.budget, 0),
    pendingApplications: mockApplications.filter(a => a.status === 'pending').length,
    unreadMessages: mockMessages.filter(m => m.unread).length
  }), [mockProjects, mockApplications, mockMessages]);

  return {
    loading,
    projects: mockProjects,
    applications: mockApplications,
    messages: mockMessages,
    stats
  };
};

// Status badge component
const StatusBadge = ({ status, children }) => {
  const statusConfig = {
    completed: { color: '#4CAF50', label: 'Completed' },
    'in-progress': { color: '#FF9800', label: 'In Progress' },
    pending: { color: '#2196F3', label: 'Pending' },
    accepted: { color: '#4CAF50', label: 'Accepted' },
    rejected: { color: '#f44336', label: 'Rejected' }
  };

  const config = statusConfig[status] || { color: '#42b5f8ff', label: status };

  return (
    <span 
      className="status-badge"
      style={{ 
        backgroundColor: config.color,
        color: '#ffffff'
      }}
      role="status"
      aria-label={`Status: ${config.label}`}
    >
      {children || config.label}
    </span>
  );
};

// Progress bar component
const ProgressBar = ({ progress, label }) => (
  <div className="progress-container">
    <div className="progress-bar" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
      <div 
        className="progress-fill"
        style={{ width: `${progress}%` }}
      />
    </div>
    {label && <span className="progress-text">{label}</span>}
  </div>
);

// Recent Activity Component
const RecentActivity = () => {
  const activities = useMemo(() => [
    {
      id: 1,
      type: 'project_update',
      title: 'Project milestone completed',
      description: 'Completed user authentication module for Food Bank System',
      timestamp: '2 hours ago',
      icon: 'fas fa-check-circle',
      color: '#4CAF50'
    },
    {
      id: 2,
      type: 'application_submitted',
      title: 'New application submitted',
      description: 'Applied for Environmental Monitoring Dashboard project',
      timestamp: '1 day ago',
      icon: 'fas fa-file-alt',
      color: '#2196F3'
    },
    {
      id: 3,
      type: 'message_received',
      title: 'New message from client',
      description: 'Local Food Bank sent a project update request',
      timestamp: '3 hours ago',
      icon: 'fas fa-envelope',
      color: '#FF9800'
    }
  ], []);

  return (
    <div className="recent-activity">
      <h3>Recent Activity</h3>
      <div className="activity-list">
        {activities.map(activity => (
          <div key={activity.id} className="activity-item">
            <div className="activity-icon" style={{ color: activity.color }}>
              <i className={activity.icon}></i>
            </div>
            <div className="activity-content">
              <h4 className="activity-title">{activity.title}</h4>
              <p className="activity-description">{activity.description}</p>
              <span className="activity-timestamp">{activity.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Application Card Component
const ApplicationCard = ({ application }) => (
  <div className="application-item" role="article">
    <div className="application-info">
      <h3 className="application-title">{application.projectTitle}</h3>
      <p className="application-client">{application.client}</p>
      <div className="application-details">
        <span className="application-budget">${application.budget.toLocaleString()}</span>
        <span className="application-date">Applied: {application.appliedDate}</span>
        <span className="application-match">Match: {application.matchScore}%</span>
      </div>
    </div>
    <div className="application-status">
      <StatusBadge status={application.status} />
      <button className="btn btn-outline">View Details</button>
    </div>
  </div>
);

// Message Card Component
const MessageCard = ({ message }) => (
  <div className={`message-item ${message.unread ? 'unread' : ''}`} role="article">
    <div className="message-header">
      <h3 className="message-sender">{message.from}</h3>
      <span className="message-timestamp">{message.timestamp}</span>
    </div>
    <div className="message-subject">{message.subject}</div>
    <p className="message-preview">{message.preview}</p>
    {message.priority === 'high' && (
      <StatusBadge status="pending">High Priority</StatusBadge>
    )}
  </div>
);

// Profile Form Component
const ProfileForm = ({ user }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    bio: '',
    skills: '',
    website: ''
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    console.log('Profile updated:', formData);
  }, [formData]);

  return (
    <div className="profile-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
          />
        </div>
        <div className="form-group">
          <label htmlFor="skills">Skills</label>
          <input
            type="text"
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="React, Node.js, MongoDB..."
          />
        </div>
        <div className="form-group">
          <label htmlFor="website">Website</label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Update Profile</button>
      </form>
    </div>
  );
};

// Project Card Component
const ProjectCard = ({ project }) => (
  <div className="project-item" role="article">
    <div className="project-info">
      <h3 className="project-title">{project.title}</h3>
      <p className="project-client">{project.client}</p>
      <div className="project-details">
        <span className="project-budget">${project.budget.toLocaleString()}</span>
        <span className="project-timeline">{project.timeline}</span>
        <span className="project-start">Started: {project.startDate}</span>
      </div>
    </div>
    <div className="project-status">
      <div className="status-info">
        <StatusBadge status={project.status} />
        <ProgressBar progress={project.progress} label={`${project.progress}% complete`} />
      </div>
      <button className="btn btn-outline">View Details</button>
    </div>
  </div>
);

// Main dashboard component
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const user = useUser();
  const { loading, projects, applications, messages, stats } = useDashboardData(user.type);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey) {
        switch (event.key) {
          case '1':
            event.preventDefault();
            setActiveTab('overview');
            break;
          case '2':
            event.preventDefault();
            setActiveTab('projects');
            break;
          case '3':
            event.preventDefault();
            setActiveTab('applications');
            break;
          case '4':
            event.preventDefault();
            setActiveTab('messages');
            break;
          case '5':
            event.preventDefault();
            setActiveTab('profile');
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    // Track analytics in production - safely check for gtag
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'dashboard_tab_switch', {
        event_category: 'Navigation',
        event_label: tab
      });
    }
    // Alternative: Use console.log for development
    console.log(`Tab switched to: ${tab}`);
  }, []);

  const renderOverview = useCallback(() => (
    <div className="overview-tab" role="tabpanel" aria-labelledby="overview-tab">
      <div className="stats-grid">
        <StatCard
          icon="fas fa-project-diagram"
          value={stats.activeProjects}
          label="Active Projects"
          trend="+2 this month"
        />
        <StatCard
          icon="fas fa-dollar-sign"
          value={`$${stats.totalEarnings.toLocaleString()}`}
          label="Total Earnings"
          trend="+15% from last month"
        />
        <StatCard
          icon="fas fa-clock"
          value={stats.pendingApplications}
          label="Pending Applications"
          trend="3 new this week"
        />
        <StatCard
          icon="fas fa-envelope"
          value={stats.unreadMessages}
          label="Unread Messages"
          trend="2 urgent"
        />
      </div>

      <RecentActivity />
    </div>
  ), [stats]);

  const renderProjects = useCallback(() => (
    <div className="projects-tab" role="tabpanel" aria-labelledby="projects-tab">
      <TabHeader
        title="My Projects"
        action={{
          label: 'New Project',
          icon: 'fas fa-plus',
          onClick: () => console.log('Create new project')
        }}
      />
      <div className="projects-list">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  ), [projects]);

  const renderApplications = useCallback(() => (
    <div className="applications-tab" role="tabpanel" aria-labelledby="applications-tab">
      <TabHeader title="Applications" />
      <div className="applications-list">
        {applications.map(application => (
          <ApplicationCard key={application.id} application={application} />
        ))}
      </div>
    </div>
  ), [applications]);

  const renderMessages = useCallback(() => (
    <div className="messages-tab" role="tabpanel" aria-labelledby="messages-tab">
      <TabHeader
        title="Messages"
        action={{
          label: 'New Message',
          icon: 'fas fa-plus',
          onClick: () => console.log('Compose new message')
        }}
      />
      <div className="messages-list">
        {messages.map(message => (
          <MessageCard key={message.id} message={message} />
        ))}
      </div>
    </div>
  ), [messages]);

  const renderProfile = useCallback(() => (
    <div className="profile-tab" role="tabpanel" aria-labelledby="profile-tab">
      <TabHeader title="Profile Settings" />
      <ProfileForm user={user} />
    </div>
  ), [user]);

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className={`dashboard ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <DashboardHeader 
        user={user} 
        userType={user.type}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className="dashboard-content">
        <div className="container">
          <div className="dashboard-grid">
            <DashboardSidebar
              activeTab={activeTab}
              onTabChange={handleTabChange}
              unreadCount={stats.unreadMessages}
              userType={user.type}
              collapsed={sidebarCollapsed}
            />
            
            <main className="dashboard-main">
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'projects' && renderProjects()}
              {activeTab === 'applications' && renderApplications()}
              {activeTab === 'messages' && renderMessages()}
              {activeTab === 'profile' && renderProfile()}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components for better maintainability
const DashboardHeader = ({ user, userType, onToggleSidebar }) => (
  <header className="dashboard-header">
    <div className="container">
      <div className="header-content">
        <button 
          className="sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <i className="fas fa-bars"></i>
        </button>
        
        <div className="user-info">
          <div className="user-avatar" aria-hidden="true">
            {user.avatar ? (
              <img src={user.avatar} alt="" />
            ) : (
              <div className="avatar-placeholder">
                <i className="fas fa-user"></i>
              </div>
            )}
          </div>
          <div className="user-details">
            <h1 className="user-name">{user.name}</h1>
            <p className="user-email">{user.email}</p>
            <span className="user-type">{userType}</span>
          </div>
        </div>
        
        <div className="header-actions">
          <button className="btn btn-primary">
            <i className="fas fa-plus"></i>
            {userType === 'developer' ? 'Find Projects' : 'Submit Project'}
          </button>
        </div>
      </div>
    </div>
  </header>
);

const DashboardSidebar = ({ activeTab, onTabChange, unreadCount, userType, collapsed }) => {
  const navItems = [
    { id: 'overview', icon: 'fas fa-chart-pie', label: 'Overview', shortcut: 'Alt+1' },
    { id: 'projects', icon: 'fas fa-project-diagram', label: userType === 'developer' ? 'My Projects' : 'My Projects', shortcut: 'Alt+2' },
    { id: 'applications', icon: 'fas fa-file-alt', label: 'Applications', shortcut: 'Alt+3' },
    { id: 'messages', icon: 'fas fa-envelope', label: 'Messages', shortcut: 'Alt+4', badge: unreadCount },
    { id: 'profile', icon: 'fas fa-user-cog', label: 'Profile Settings', shortcut: 'Alt+5' }
  ];

  return (
    <aside className={`dashboard-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <nav className="sidebar-nav" aria-label="Dashboard navigation">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => onTabChange(item.id)}
            aria-current={activeTab === item.id ? 'page' : undefined}
            title={item.shortcut}
          >
            <i className={item.icon} aria-hidden="true"></i>
            {!collapsed && (
              <>
                <span className="nav-label">{item.label}</span>
                {item.badge > 0 && (
                  <span className="unread-badge" aria-label={`${item.badge} unread items`}>
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
};

const StatCard = ({ icon, value, label, trend }) => (
  <div className="stat-card">
    <div className="stat-icon" aria-hidden="true">
      <i className={icon}></i>
    </div>
    <div className="stat-content">
      <div className="stat-number">{value}</div>
      <div className="stat-label">{label}</div>
      {trend && <div className="stat-trend">{trend}</div>}
    </div>
  </div>
);

const TabHeader = ({ title, action }) => (
  <div className="tab-header">
    <h2>{title}</h2>
    {action && (
      <button className="btn btn-primary" onClick={action.onClick}>
        <i className={action.icon}></i>
        {action.label}
      </button>
    )}
  </div>
);

export default React.memo(Dashboard);