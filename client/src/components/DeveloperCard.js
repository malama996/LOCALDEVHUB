import React, { useState } from 'react';
import './DeveloperCard.css';

const DeveloperCard = ({ developer, onContact, onHire }) => {
  const [isContacting, setIsContacting] = useState(false);
  const [isHiring, setIsHiring] = useState(false);
  
  const {
    id,
    name,
    title,
    skills,
    experience,
    location,
    hourlyRate,
    availability,
    portfolio,
    rating,
    completedProjects,
    avatar,
    isVerified = false,
    responseTime = 'Within 24 hours',
    languages = ['English'],
    lastActive
  } = developer;

  // Safe rating calculation
  const safeRating = Math.min(Math.max(rating || 0, 0), 5);
  const safeCompletedProjects = Math.max(completedProjects || 0, 0);
  const safeExperience = Math.max(experience || 0, 0);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <i 
          key={i} 
          className="fas fa-star" 
          aria-hidden="true"
        />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <i 
          key="half" 
          className="fas fa-star-half-alt" 
          aria-hidden="true"
        />
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <i 
          key={`empty-${i}`} 
          className="far fa-star" 
          aria-hidden="true"
        />
      );
    }
    
    return stars;
  };

  const handleContact = async () => {
    if (isContacting) return;
    
    setIsContacting(true);
    try {
      if (onContact) {
        await onContact(developer);
      }
      // Analytics tracking
      console.log('Contact developer:', id);
    } catch (error) {
      console.error('Contact error:', error);
    } finally {
      setIsContacting(false);
    }
  };

  const handleHire = async () => {
    if (isHiring) return;
    
    setIsHiring(true);
    try {
      if (onHire) {
        await onHire(developer);
      }
      // Analytics tracking
      console.log('Hire developer:', id);
    } catch (error) {
      console.error('Hire error:', error);
    } finally {
      setIsHiring(false);
    }
  };

  const getLastActiveText = () => {
    if (!lastActive) return 'Recently active';
    
    const lastActiveDate = new Date(lastActive);
    const now = new Date();
    const diffHours = Math.floor((now - lastActiveDate) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Active now';
    if (diffHours < 24) return `Active ${diffHours}h ago`;
    if (diffHours < 168) return `Active ${Math.floor(diffHours / 24)}d ago`;
    return 'Recently active';
  };

  return (
    <div className="developer-card" role="article" aria-label={`Developer profile: ${name}`}>
      {/* Header Section */}
      <div className="developer-header">
        <div className="developer-avatar">
          {avatar ? (
            <img 
              src={avatar} 
              alt={`${name}'s profile picture`}
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={`avatar-placeholder ${avatar ? 'avatar-fallback' : ''}`}>
            <i className="fas fa-user" aria-hidden="true"></i>
          </div>
          
          {/* Verification Badge */}
          {isVerified && (
            <div className="verification-badge" title="Verified developer">
              <i className="fas fa-check-circle"></i>
            </div>
          )}
        </div>
        
        <div className="developer-info">
          <div className="name-section">
            <h3 className="developer-name">{name}</h3>
            {isVerified && (
              <span className="verified-tag" aria-label="Verified">
                Verified
              </span>
            )}
          </div>
          <p className="developer-title">{title}</p>
          
          <div className="developer-rating">
            <div className="stars" aria-label={`Rating: ${safeRating} out of 5 stars`}>
              {renderStars(safeRating)}
              <span className="sr-only">Rating: {safeRating} out of 5 stars</span>
            </div>
            <span className="rating-text">({safeRating.toFixed(1)})</span>
          </div>
        </div>
      </div>
      
      {/* Location & Activity */}
      <div className="developer-meta">
        <div className="developer-location">
          <i className="fas fa-map-marker-alt" aria-hidden="true"></i>
          <span>{location || 'Location not specified'}</span>
        </div>
        
        <div className="last-active">
          <i className="fas fa-circle" aria-hidden="true"></i>
          <span>{getLastActiveText()}</span>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="developer-stats">
        <div className="stat">
          <i className="fas fa-briefcase" aria-hidden="true"></i>
          <span>{safeCompletedProjects} project{safeCompletedProjects !== 1 ? 's' : ''} completed</span>
        </div>
        <div className="stat">
          <i className="fas fa-clock" aria-hidden="true"></i>
          <span>{safeExperience} year{safeExperience !== 1 ? 's' : ''} experience</span>
        </div>
        <div className="stat">
          <i className="fas fa-comment" aria-hidden="true"></i>
          <span>{responseTime}</span>
        </div>
      </div>
      
      {/* Skills Section */}
      <div className="developer-skills">
        <div className="skills-header">
          <span className="skills-label">Skills</span>
          <span className="skills-count">{skills.length} skills</span>
        </div>
        <div className="skills-list">
          {skills.slice(0, 6).map((skill, index) => (
            <span 
              key={`${skill}-${index}`} 
              className="skill-tag"
              title={skill}
            >
              {skill}
            </span>
          ))}
          {skills.length > 6 && (
            <span 
              className="skill-more" 
              title={`${skills.slice(6).join(', ')}`}
            >
              +{skills.length - 6} more
            </span>
          )}
        </div>
      </div>
      
      {/* Details Section */}
      <div className="developer-details">
        <div className="rate-info">
          <i className="fas fa-dollar-sign" aria-hidden="true"></i>
          <span>${hourlyRate}/hour</span>
        </div>
        <div className="availability-info">
          <i className="fas fa-calendar-check" aria-hidden="true"></i>
          <span 
            className={`availability ${availability?.toLowerCase() || 'unknown'}`}
            title={`Availability: ${availability}`}
          >
            {availability || 'Not specified'}
          </span>
        </div>
      </div>
      
      {/* Languages */}
      {languages && languages.length > 0 && (
        <div className="developer-languages">
          <i className="fas fa-language" aria-hidden="true"></i>
          <span>{languages.join(', ')}</span>
        </div>
      )}
      
      {/* Portfolio Link */}
      {portfolio && (
        <div className="portfolio-link">
          <i className="fas fa-external-link-alt" aria-hidden="true"></i>
          <a 
            href={portfolio} 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label={`View ${name}'s portfolio (opens in new tab)`}
          >
            View Portfolio
          </a>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="developer-actions">
        <button 
          className={`contact-btn ${isContacting ? 'loading' : ''}`}
          onClick={handleContact}
          disabled={isContacting}
          aria-label={`Contact ${name}`}
        >
          {isContacting ? (
            <>
              <i className="fas fa-spinner fa-spin" aria-hidden="true"></i>
              Contacting...
            </>
          ) : (
            <>
              <i className="fas fa-envelope" aria-hidden="true"></i>
              Contact
            </>
          )}
        </button>
        
        <button 
          className={`hire-btn ${isHiring ? 'loading' : ''}`}
          onClick={handleHire}
          disabled={isHiring}
          aria-label={`Hire ${name}`}
        >
          {isHiring ? (
            <>
              <i className="fas fa-spinner fa-spin" aria-hidden="true"></i>
              Processing...
            </>
          ) : (
            <>
              <i className="fas fa-handshake" aria-hidden="true"></i>
              Hire Now
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Default props for safety
DeveloperCard.defaultProps = {
  developer: {
    name: 'Unknown Developer',
    title: 'Developer',
    skills: [],
    experience: 0,
    location: 'Location not specified',
    hourlyRate: 0,
    availability: 'Not specified',
    rating: 0,
    completedProjects: 0,
    languages: ['English']
  },
  onContact: () => {},
  onHire: () => {}
};

export default DeveloperCard;