import React, { useState, useMemo } from 'react';
import './ProjectCard.css';

const ProjectCard = ({ 
  project, 
  onApply, 
  onSave, 
  onShare,
  currentUser 
}) => {
  const [isApplying, setIsApplying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const {
    id,
    title,
    description,
    budget,
    timeline,
    skills,
    organization,
    location,
    createdAt,
    status = 'open',
    category,
    projectType,
    experienceLevel,
    applicationsCount = 0,
    isRemote = false,
    maxApplicants,
    urgency
  } = project;

  // Memoized calculations
  const formattedDate = useMemo(() => {
    return new Date(createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, [createdAt]);

  const timeAgo = useMemo(() => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  }, [createdAt]);

  const statusConfig = useMemo(() => {
    const configs = {
      'open': { 
        label: 'OPEN', 
        color: '#4CAF50', 
        bgColor: 'rgba(76, 175, 80, 0.1)',
        icon: 'fas fa-circle'
      },
      'in-progress': { 
        label: 'IN PROGRESS', 
        color: '#FF9800', 
        bgColor: 'rgba(255, 152, 0, 0.1)',
        icon: 'fas fa-spinner'
      },
      'completed': { 
        label: 'COMPLETED', 
        color: '#2196F3', 
        bgColor: 'rgba(33, 150, 243, 0.1)',
        icon: 'fas fa-check-circle'
      },
      'closed': { 
        label: 'CLOSED', 
        color: '#757575', 
        bgColor: 'rgba(117, 117, 117, 0.1)',
        icon: 'fas fa-lock'
      }
    };
    return configs[status] || configs.open;
  }, [status]);

  const isApplicationFull = useMemo(() => {
    return maxApplicants && applicationsCount >= maxApplicants;
  }, [maxApplicants, applicationsCount]);

  const canApply = useMemo(() => {
    return status === 'open' && !isApplicationFull;
  }, [status, isApplicationFull]);

  const truncatedDescription = useMemo(() => {
    if (!description) return '';
    const maxLength = 120;
    if (description.length <= maxLength || showFullDescription) {
      return description;
    }
    return `${description.substring(0, maxLength)}...`;
  }, [description, showFullDescription]);

  // Event handlers
  const handleApply = async () => {
    if (!canApply || isApplying) return;
    
    setIsApplying(true);
    try {
      if (onApply) {
        await onApply(project);
      }
      // Analytics tracking
      console.log('Applied to project:', id);
    } catch (error) {
      console.error('Application error:', error);
    } finally {
      setIsApplying(false);
    }
  };

  const handleSave = () => {
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);
    
    if (onSave) {
      onSave(project, newSavedState);
    }
    
    console.log('Project saved:', id, newSavedState);
  };

  const handleShare = () => {
    if (onShare) {
      onShare(project);
    }
    
    // Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: `Project: ${title}`,
        text: description,
        url: window.location.href,
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <div 
      className="project-card"
      role="article"
      aria-label={`Project: ${title} by ${organization}`}
    >
      {/* Header Section */}
      <div className="project-header">
        <div className="project-title-section">
          <h3 className="project-title" title={title}>
            {title}
          </h3>
          {urgency === 'high' && (
            <span 
              className="urgency-badge"
              title="Urgent project"
              aria-label="Urgent project"
            >
              <i className="fas fa-exclamation-circle"></i>
              Urgent
            </span>
          )}
        </div>
        
        <div className="project-meta">
          <span 
            className="project-status"
            style={{ 
              color: statusConfig.color,
              backgroundColor: statusConfig.bgColor,
              border: `1px solid ${statusConfig.color}`
            }}
            aria-label={`Project status: ${status}`}
          >
            <i className={statusConfig.icon}></i>
            {statusConfig.label}
          </span>
          
          {category && (
            <span className="project-category" title={`Category: ${category}`}>
              {category}
            </span>
          )}
        </div>
      </div>
      
      {/* Organization & Location */}
      <div className="project-info">
        <div className="project-organization">
          <i className="fas fa-building" aria-hidden="true"></i>
          <span title={`Organization: ${organization}`}>
            {organization}
          </span>
        </div>
        
        <div className="project-location">
          <i 
            className={isRemote ? "fas fa-laptop-house" : "fas fa-map-marker-alt"} 
            aria-hidden="true"
          ></i>
          <span title={`Location: ${location}`}>
            {isRemote ? 'Remote' : location}
            {isRemote && location && ` • ${location}`}
          </span>
        </div>
      </div>
      
      {/* Description */}
      <div className="project-description-section">
        <p className="project-description">
          {truncatedDescription}
          {description && description.length > 120 && (
            <button 
              className="read-more-btn"
              onClick={toggleDescription}
              aria-expanded={showFullDescription}
              aria-label={showFullDescription ? 'Show less description' : 'Show full description'}
            >
              {showFullDescription ? 'Show less' : 'Read more'}
            </button>
          )}
        </p>
      </div>
      
      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="project-skills-section">
          <div className="skills-header">
            <span className="skills-label">Required Skills</span>
            <span className="skills-count">{skills.length} skills</span>
          </div>
          <div className="project-skills">
            {skills.slice(0, 8).map((skill, index) => (
              <span 
                key={`${skill}-${index}`}
                className="skill-tag"
                title={skill}
              >
                {skill}
              </span>
            ))}
            {skills.length > 8 && (
              <span 
                className="skill-more"
                title={`Additional skills: ${skills.slice(8).join(', ')}`}
              >
                +{skills.length - 8} more
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* Project Details */}
      <div className="project-details">
        <div className="detail-group">
          <div className="project-budget">
            <i className="fas fa-money-bill-wave" aria-hidden="true"></i>
            <div className="budget-info">
              <span className="budget-amount">ZMW {budget?.toLocaleString()}</span>
              <span className="budget-label">Budget</span>
            </div>
          </div>
          
          <div className="project-timeline">
            <i className="fas fa-calendar-alt" aria-hidden="true"></i>
            <div className="timeline-info">
              <span className="timeline-duration">{timeline}</span>
              <span className="timeline-label">Timeline</span>
            </div>
          </div>
        </div>
        
        <div className="detail-group">
          {experienceLevel && (
            <div className="project-level">
              <i className="fas fa-chart-line" aria-hidden="true"></i>
              <div className="level-info">
                <span className="level-text">{experienceLevel}</span>
                <span className="level-label">Experience</span>
              </div>
            </div>
          )}
          
          {projectType && (
            <div className="project-type">
              <i className="fas fa-project-diagram" aria-hidden="true"></i>
              <div className="type-info">
                <span className="type-text">{projectType}</span>
                <span className="type-label">Type</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Applications Info */}
      {(maxApplicants || applicationsCount > 0) && (
        <div className="applications-info">
          <i className="fas fa-users" aria-hidden="true"></i>
          <span>
            {applicationsCount} application{applicationsCount !== 1 ? 's' : ''}
            {maxApplicants && ` • ${maxApplicants} max`}
          </span>
          {isApplicationFull && (
            <span className="applications-full" aria-label="Application limit reached">
              • Full
            </span>
          )}
        </div>
      )}
      
      {/* Footer */}
      <div className="project-footer">
        <div className="project-meta-info">
          <span 
            className="project-date"
            title={`Posted on ${new Date(createdAt).toLocaleDateString()}`}
          >
            <i className="fas fa-clock" aria-hidden="true"></i>
            {timeAgo}
          </span>
          
          <div className="action-buttons">
            <button 
              className="icon-btn save-btn"
              onClick={handleSave}
              aria-label={isSaved ? 'Remove from saved projects' : 'Save project'}
              title={isSaved ? 'Saved' : 'Save project'}
            >
              <i className={isSaved ? "fas fa-bookmark" : "far fa-bookmark"}></i>
            </button>
            
            <button 
              className="icon-btn share-btn"
              onClick={handleShare}
              aria-label="Share project"
              title="Share project"
            >
              <i className="fas fa-share-alt"></i>
            </button>
          </div>
        </div>
        
        <button 
          className={`apply-btn ${!canApply ? 'disabled' : ''} ${isApplying ? 'loading' : ''}`}
          onClick={handleApply}
          disabled={!canApply || isApplying}
          aria-label={
            !canApply 
              ? 'Applications closed' 
              : isApplying 
                ? 'Applying to project...' 
                : `Apply to ${title}`
          }
        >
          {isApplying ? (
            <>
              <i className="fas fa-spinner fa-spin" aria-hidden="true"></i>
              Applying...
            </>
          ) : !canApply ? (
            status === 'closed' ? 'Closed' : 'Full'
          ) : (
            <>
              <i className="fas fa-paper-plane" aria-hidden="true"></i>
              Apply Now
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Default props for safety
ProjectCard.defaultProps = {
  project: {
    title: 'Untitled Project',
    description: 'No description provided',
    budget: 0,
    timeline: 'Not specified',
    skills: [],
    organization: 'Unknown Organization',
    location: 'Location not specified',
    createdAt: new Date().toISOString(),
    status: 'open'
  },
  onApply: () => {},
  onSave: () => {},
  onShare: () => {}
};

export default ProjectCard;