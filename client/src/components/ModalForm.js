import React, { useState } from 'react';
import './ModalForm.css';

const ModalForm = ({ isOpen, onClose, type, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    timeline: '',
    skills: '',
    organization: '',
    location: '',
    contactEmail: '',
    contactPhone: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.budget.trim()) newErrors.budget = 'Budget is required';
    if (!formData.timeline.trim()) newErrors.timeline = 'Timeline is required';
    if (!formData.organization.trim()) newErrors.organization = 'Organization is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Email is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.contactEmail && !emailRegex.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const skillsArray = formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
      
      const submissionData = {
        ...formData,
        skills: skillsArray,
        budget: parseFloat(formData.budget),
        type: type
      };
      
      onSubmit(submissionData);
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        budget: '',
        timeline: '',
        skills: '',
        organization: '',
        location: '',
        contactEmail: '',
        contactPhone: ''
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{type === 'project' ? 'Submit Project Request' : 'Join as Developer'}</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="title">
              {type === 'project' ? 'Project Title' : 'Your Name'} *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? 'error' : ''}
              placeholder={type === 'project' ? 'e.g., E-commerce Website Development' : 'Your full name'}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">
              {type === 'project' ? 'Project Description' : 'Professional Summary'} *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? 'error' : ''}
              rows="4"
              placeholder={type === 'project' ? 'Describe your project requirements, goals, and any specific features needed...' : 'Tell us about your experience, skills, and what makes you unique...'}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="budget">
                {type === 'project' ? 'Budget (ZMW)' : 'Hourly Rate (ZMW)'} *
              </label>
              <input
                type="number"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className={errors.budget ? 'error' : ''}
                placeholder={type === 'project' ? '5000' : '50'}
                min="0"
                step="0.01"
              />
              {errors.budget && <span className="error-message">{errors.budget}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="timeline">
                {type === 'project' ? 'Timeline' : 'Availability'} *
              </label>
              <input
                type="text"
                id="timeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                className={errors.timeline ? 'error' : ''}
                placeholder={type === 'project' ? 'e.g., 3 months' : 'e.g., Available'}
              />
              {errors.timeline && <span className="error-message">{errors.timeline}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="skills">
              {type === 'project' ? 'Required Skills' : 'Your Skills'} *
            </label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g., React, Node.js, MongoDB (comma separated)"
            />
            <small className="form-hint">Separate skills with commas</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="organization">
                {type === 'project' ? 'Organization' : 'Current Role'} *
              </label>
              <input
                type="text"
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                className={errors.organization ? 'error' : ''}
                placeholder={type === 'project' ? 'Your organization name' : 'e.g., Software Developer'}
              />
              {errors.organization && <span className="error-message">{errors.organization}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={errors.location ? 'error' : ''}
                placeholder="e.g., Ndola , Zambia"
              />
              {errors.location && <span className="error-message">{errors.location}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contactEmail">Email *</label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className={errors.contactEmail ? 'error' : ''}
                placeholder="your.email@example.com"
              />
              {errors.contactEmail && <span className="error-message">{errors.contactEmail}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="contactPhone">Phone</label>
              <input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="(+260) 960500790"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {type === 'project' ? 'Submit Project' : 'Join Platform'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalForm;
