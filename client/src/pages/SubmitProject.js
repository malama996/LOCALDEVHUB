import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalForm from '../components/ModalForm';
import './SubmitProject.css';

// Custom hook for project management
const useProjectSubmission = () => {
  const [submittedProjects, setSubmittedProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type, id: Date.now() });
  }, []);

  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const submitProject = useCallback(async (projectData) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newProject = {
        id: `project_${Date.now()}`,
        ...projectData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reference: `PROJ-${Date.now().toString().slice(-6)}`
      };
      
      setSubmittedProjects(prev => [newProject, ...prev]);
      
      // In production, this would be an actual API call
      console.log('Project submitted to API:', newProject);
      
      showNotification(
        `Project "${newProject.title}" submitted successfully! We'll review it and get back to you within 24 hours.`,
        'success'
      );
      
      return { success: true, project: newProject };
    } catch (error) {
      console.error('Project submission error:', error);
      showNotification(
        'Failed to submit project. Please try again or contact support.',
        'error'
      );
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const updateProjectStatus = useCallback((projectId, status) => {
    setSubmittedProjects(prev => 
      prev.map(project => 
        project.id === projectId 
          ? { ...project, status, updatedAt: new Date().toISOString() }
          : project
      )
    );
  }, []);

  return {
    submittedProjects,
    loading,
    notification,
    submitProject,
    updateProjectStatus,
    clearNotification
  };
};

// Inline component implementations
const ToastNotification = ({ message, type = 'info', onClose, duration = 5000 }) => {
  React.useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={`toast-notification toast-${type}`}>
      <div className="toast-content">
        <i className={`fas ${
          type === 'success' ? 'fa-check-circle' :
          type === 'error' ? 'fa-exclamation-circle' :
          type === 'warning' ? 'fa-exclamation-triangle' :
          'fa-info-circle'
        }`}></i>
        <span>{message}</span>
      </div>
      <button className="toast-close" onClick={onClose}>
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};

const LoadingSpinner = ({ message = "Loading...", small = false, overlay = false }) => {
  if (overlay) {
    return (
      <div className="loading-overlay">
        <div className="loading-content">
          <div className={`spinner ${small ? 'spinner-small' : ''}`}></div>
          {message && <p>{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="loading">
      <div className={`spinner ${small ? 'spinner-small' : ''}`}></div>
      {message && <p>{message}</p>}
    </div>
  );
};

// Main Component
const SubmitProject = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const {
    submittedProjects,
    loading,
    notification,
    submitProject,
    clearNotification
  } = useProjectSubmission();

  const handleSubmitProject = useCallback(async (projectData) => {
    const result = await submitProject(projectData);
    if (result.success) {
      setIsModalOpen(false);
    }
  }, [submitProject]);

  const handleViewMarketplace = useCallback(() => {
    navigate('/marketplace');
  }, [navigate]);

  const recentSubmissions = useMemo(() => 
    submittedProjects.slice(0, 3), [submittedProjects]
  );

  return (
    <div className="submit-project">
      {/* Notification System */}
      {notification && (
        <ToastNotification
          message={notification.message}
          type={notification.type}
          onClose={clearNotification}
          duration={5000}
        />
      )}

      {/* Loading Overlay */}
      {loading && <LoadingSpinner overlay />}

      <div className="submit-header">
        <div className="container">
          <div className="header-content">
            <div>
              <h1 className="page-title">Submit Your Project</h1>
              <p className="page-subtitle">
                Have a software project that needs to be built? Let our community of 
                talented Zambian developers help bring your vision to life.
              </p>
            </div>
            <div className="header-actions">
              <button 
                className="btn btn-outline"
                onClick={handleViewMarketplace}
              >
                <i className="fas fa-search"></i>
                Browse Developers
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="submit-content">
        <div className="container">
          <div className="submit-grid">
            {/* Main Content */}
            <div className="submit-main">
              <SubmissionCard 
                onOpenModal={() => setIsModalOpen(true)}
                hasSubmissions={submittedProjects.length > 0}
              />
              
              {/* Recent Submissions */}
              {recentSubmissions.length > 0 && (
                <RecentSubmissions 
                  projects={recentSubmissions}
                  onViewAll={() => navigate('/my-projects')}
                />
              )}
            </div>

            {/* Sidebar */}
            <div className="submit-sidebar">
              <GuidelinesCard />
              <PricingCard />
              <ContactCard />
            </div>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="project"
        onSubmit={handleSubmitProject}
        loading={loading}
      />
    </div>
  );
};

// Sub-components
const SubmissionCard = ({ onOpenModal, hasSubmissions }) => (
  <div className="submit-card">
    <div className="card-header">
      <h2>Project Submission</h2>
      <p>
        Fill out the form below to submit your project requirements. 
        Our team will review your submission and connect you with 
        qualified developers within 24 hours.
      </p>
    </div>
    
    <div className="card-content">
      <div className="benefits-list">
        <h3>Why submit through LocalDevHub?</h3>
        <ul aria-label="Benefits of using LocalDevHub">
          <li>
            <i className="fas fa-check-circle" aria-hidden="true"></i>
            <span>Access to vetted, skilled Zambian developers</span>
          </li>
          <li>
            <i className="fas fa-check-circle" aria-hidden="true"></i>
            <span>Competitive pricing and transparent costs</span>
          </li>
          <li>
            <i className="fas fa-check-circle" aria-hidden="true"></i>
            <span>Project management and quality assurance</span>
          </li>
          <li>
            <i className="fas fa-check-circle" aria-hidden="true"></i>
            <span>Support throughout the development process</span>
          </li>
          <li>
            <i className="fas fa-check-circle" aria-hidden="true"></i>
            <span>Post-launch maintenance and updates</span>
          </li>
        </ul>
      </div>
      
      <div className="action-section">
        <button 
          className="submit-btn btn-primary"
          onClick={onOpenModal}
          aria-label="Submit new project"
        >
          <i className="fas fa-plus" aria-hidden="true"></i>
          Submit New Project
        </button>
        
        {hasSubmissions && (
          <p className="action-hint">
            <i className="fas fa-info-circle" aria-hidden="true"></i>
            You can track your submissions in the "Recent Submissions" section below.
          </p>
        )}
      </div>
    </div>
  </div>
);

const RecentSubmissions = ({ projects, onViewAll }) => (
  <div className="submissions-card">
    <div className="card-header">
      <h3>Your Recent Submissions</h3>
      <button 
        className="view-all-btn"
        onClick={onViewAll}
        aria-label="View all submissions"
      >
        View All
        <i className="fas fa-arrow-right" aria-hidden="true"></i>
      </button>
    </div>
    
    <div className="submissions-list" aria-label="Recent project submissions">
      {projects.map(project => (
        <SubmissionItem key={project.id} project={project} />
      ))}
    </div>
  </div>
);

const SubmissionItem = ({ project }) => (
  <div className="submission-item">
    <div className="submission-header">
      <h4>{project.title}</h4>
      <div className="submission-meta">
        <span className="reference">Ref: {project.reference}</span>
        <span className={`status status-${project.status}`}>
          <span className="status-dot"></span>
          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
        </span>
      </div>
    </div>
    
    <div className="submission-details">
      <span className="org">
        <i className="fas fa-building" aria-hidden="true"></i>
        {project.organization}
      </span>
      <span className="budget">
        <i className="fas fa-dollar-sign" aria-hidden="true"></i>
        ZMW {project.budget.toLocaleString()}
      </span>
      <span className="timeline">
        <i className="fas fa-clock" aria-hidden="true"></i>
        {project.timeline}
      </span>
    </div>
    
    <div className="submission-skills">
      {project.skills.slice(0, 3).map((skill, index) => (
        <span key={index} className="skill-tag">{skill}</span>
      ))}
      {project.skills.length > 3 && (
        <span className="skill-more">+{project.skills.length - 3} more</span>
      )}
    </div>
    
    <div className="submission-footer">
      <span className="submission-date">
        Submitted: {new Date(project.createdAt).toLocaleDateString()}
      </span>
    </div>
  </div>
);

const GuidelinesCard = () => (
  <div className="info-card">
    <h3>Project Guidelines</h3>
    <div className="guidelines" aria-label="Project submission guidelines">
      <GuidelineItem
        icon="fas fa-lightbulb"
        title="Clear Requirements"
        description="Provide detailed project specifications and goals"
      />
      <GuidelineItem
        icon="fas fa-dollar-sign"
        title="Realistic Budget"
        description="Set a budget that reflects the project's complexity"
      />
      <GuidelineItem
        icon="fas fa-clock"
        title="Timeline"
        description="Allow sufficient time for quality development"
      />
      <GuidelineItem
        icon="fas fa-users"
        title="Communication"
        description="Be available for regular check-ins and feedback"
      />
    </div>
  </div>
);

const GuidelineItem = ({ icon, title, description }) => (
  <div className="guideline">
    <i className={icon} aria-hidden="true"></i>
    <div>
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  </div>
);

const PricingCard = () => (
  <div className="pricing-card">
    <h3>Pricing Information</h3>
    <div className="pricing-tiers" aria-label="Project pricing tiers">
      <PricingTier
        title="Small Projects"
        price="ZMW 1,000 - 5,000"
        description="Simple websites, basic apps, landing pages"
      />
      <PricingTier
        title="Medium Projects"
        price="ZMW 5,000 - 15,000"
        description="E-commerce sites, mobile apps, web applications"
      />
      <PricingTier
        title="Large Projects"
        price="ZMW 20,000+"
        description="Complex systems, enterprise solutions, custom platforms"
      />
    </div>
  </div>
);

const PricingTier = ({ title, price, description }) => (
  <div className="tier">
    <h4>{title}</h4>
    <div className="price">{price}</div>
    <p>{description}</p>
  </div>
);

const ContactCard = () => (
  <div className="contact-card">
    <h3>Need Help?</h3>
    <p>Our team is here to assist you with project planning and developer matching.</p>
    <div className="contact-info">
      <ContactItem
        icon="fas fa-envelope"
        label="Email"
        value="projects@localdevhub.com"
        href="mailto:projects@localdevhub.com"
      />
      <ContactItem
        icon="fas fa-phone"
        label="Phone"
        value="(+260) 960 500 790"
        href="tel:+260960500790"
      />
      <ContactItem
        icon="fas fa-comments"
        label="Live Chat"
        value="Available 9AM-5PM"
        href="/support"
      />
    </div>
  </div>
);

const ContactItem = ({ icon, label, value, href }) => (
  <div className="contact-item">
    <i className={icon} aria-hidden="true"></i>
    <div>
      <span className="contact-label">{label}:</span>
      {href ? (
        <a href={href} className="contact-value">
          {value}
        </a>
      ) : (
        <span className="contact-value">{value}</span>
      )}
    </div>
  </div>
);

export default React.memo(SubmitProject);