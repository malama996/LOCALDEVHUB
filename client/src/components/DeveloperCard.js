import React from 'react';
import './DeveloperCard.css';

const DeveloperCard = ({ developer }) => {
  const {
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
    avatar
  } = developer;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star"></i>);
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }
    
    return stars;
  };

  return (
    <div className="developer-card">
      <div className="developer-header">
        <div className="developer-avatar">
          {avatar ? (
            <img src={avatar} alt={name} />
          ) : (
            <div className="avatar-placeholder">
              <i className="fas fa-user"></i>
            </div>
          )}
        </div>
        <div className="developer-info">
          <h3 className="developer-name">{name}</h3>
          <p className="developer-title">{title}</p>
          <div className="developer-rating">
            <div className="stars">
              {renderStars(rating)}
            </div>
            <span className="rating-text">({rating}/5)</span>
          </div>
        </div>
      </div>
      
      <div className="developer-location">
        <i className="fas fa-map-marker-alt"></i>
        <span>{location}</span>
      </div>
      
      <div className="developer-stats">
        <div className="stat">
          <i className="fas fa-briefcase"></i>
          <span>{completedProjects} projects completed</span>
        </div>
        <div className="stat">
          <i className="fas fa-clock"></i>
          <span>{experience} years experience</span>
        </div>
      </div>
      
      <div className="developer-skills">
        {skills.slice(0, 6).map((skill, index) => (
          <span key={index} className="skill-tag">
            {skill}
          </span>
        ))}
        {skills.length > 6 && (
          <span className="skill-more">+{skills.length - 6} more</span>
        )}
      </div>
      
      <div className="developer-details">
        <div className="rate-info">
          <i className="fas fa-dollar-sign"></i>
          <span>${hourlyRate}/hour</span>
        </div>
        <div className="availability-info">
          <i className="fas fa-calendar-check"></i>
          <span className={`availability ${availability.toLowerCase()}`}>
            {availability}
          </span>
        </div>
      </div>
      
      {portfolio && (
        <div className="portfolio-link">
          <i className="fas fa-external-link-alt"></i>
          <a href={portfolio} target="_blank" rel="noopener noreferrer">
            View Portfolio
          </a>
        </div>
      )}
      
      <div className="developer-actions">
        <button className="contact-btn">
          <i className="fas fa-envelope"></i>
          Contact
        </button>
        <button className="hire-btn">
          <i className="fas fa-handshake"></i>
          Hire Now
        </button>
      </div>
    </div>
  );
};

export default DeveloperCard;
