import React from 'react';
import './ProjectCard.css';

const ProjectCard = ({ project }) => {
  const {
    title,
    description,
    budget,
    timeline,
    skills,
    organization,
    location,
    createdAt,
    status
  } = project;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return '#4CAF50';
      case 'in-progress': return '#FF9800';
      case 'completed': return '#2196F3';
      default: return '#757575';
    }
  };

  return (
    <div className="project-card">
      <div className="project-header">
        <h3 className="project-title">{title}</h3>
        <span 
          className="project-status" 
          style={{ backgroundColor: getStatusColor(status) }}
        >
          {status.replace('-', ' ').toUpperCase()}
        </span>
      </div>
      
      <div className="project-organization">
        <i className="fas fa-building"></i>
        <span>{organization}</span>
      </div>
      
      <div className="project-location">
        <i className="fas fa-map-marker-alt"></i>
        <span>{location}</span>
      </div>
      
      <p className="project-description">{description}</p>
      
      <div className="project-skills">
        {skills.map((skill, index) => (
          <span key={index} className="skill-tag">
            {skill}
          </span>
        ))}
      </div>
      
      <div className="project-details">
        <div className="project-budget">
          <i className="fas fa-Zambian Kwacha-sign"></i>
          <span>Budget: ZMW{budget}</span>
        </div>
        <div className="project-timeline">
          <i className="fas fa-clock"></i>
          <span>Timeline: {timeline}</span>
        </div>
      </div>
      
      <div className="project-footer">
        <span className="project-date">
          Posted: {formatDate(createdAt)}
        </span>
        <button className="apply-btn">
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
