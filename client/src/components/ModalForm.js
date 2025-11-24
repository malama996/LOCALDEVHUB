import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import './ModalForm.css';

// Validation schema
const validationSchema = {
  title: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  description: {
    required: true,
    minLength: 10,
    maxLength: 1000
  },
  budget: {
    required: true,
    min: 0,
    type: 'number'
  },
  timeline: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  organization: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  location: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  contactEmail: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  contactPhone: {
    required: false,
    pattern: /^[\+]?[(]?[\d\s\-\(\)]{10,}$/
  }
};

// Field configurations
const getFieldConfig = (type) => ({
  title: {
    label: type === 'project' ? 'Project Title' : 'Your Name',
    placeholder: type === 'project' ? 'e.g., E-commerce Website Development' : 'Your full name'
  },
  description: {
    label: type === 'project' ? 'Project Description' : 'Professional Summary',
    placeholder: type === 'project' 
      ? 'Describe your project requirements, goals, and any specific features needed...' 
      : 'Tell us about your experience, skills, and what makes you unique...'
  },
  budget: {
    label: type === 'project' ? 'Budget (ZMW)' : 'Hourly Rate (ZMW)',
    placeholder: type === 'project' ? '5000' : '50'
  },
  timeline: {
    label: type === 'project' ? 'Timeline' : 'Availability',
    placeholder: type === 'project' ? 'e.g., 3 months' : 'e.g., Available'
  },
  skills: {
    label: type === 'project' ? 'Required Skills' : 'Your Skills',
    placeholder: 'e.g., React, Node.js, MongoDB (comma separated)'
  },
  organization: {
    label: type === 'project' ? 'Organization' : 'Current Role',
    placeholder: type === 'project' ? 'Your organization name' : 'e.g., Software Developer'
  }
});

const ModalForm = ({ isOpen, onClose, type, onSubmit }) => {
  const initialFormState = useMemo(() => ({
    title: '',
    description: '',
    budget: '',
    timeline: '',
    skills: '',
    organization: '',
    location: '',
    contactEmail: '',
    contactPhone: ''
  }), []);

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fieldConfig = useMemo(() => getFieldConfig(type), [type]);

  // Reset form when modal opens/closes or type changes
  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormState);
      setErrors({});
      setTouched({});
      setIsSubmitting(false);
    }
  }, [isOpen, type, initialFormState]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const validateField = useCallback((name, value) => {
    const rules = validationSchema[name];
    if (!rules) return '';

    if (rules.required && !value.trim()) {
      return `${fieldConfig[name]?.label || name} is required`;
    }

    if (value.trim()) {
      if (rules.minLength && value.length < rules.minLength) {
        return `Must be at least ${rules.minLength} characters`;
      }

      if (rules.maxLength && value.length > rules.maxLength) {
        return `Must be less than ${rules.maxLength} characters`;
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        if (name === 'contactEmail') return 'Please enter a valid email address';
        if (name === 'contactPhone') return 'Please enter a valid phone number';
        return 'Invalid format';
      }

      if (rules.type === 'number') {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return 'Must be a valid number';
        if (rules.min !== undefined && numValue < rules.min) {
          return `Must be at least ${rules.min}`;
        }
      }
    }

    return '';
  }, [fieldConfig]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    Object.keys(validationSchema).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, formData[name]);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, [formData, validateField]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Real-time validation for touched fields
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  }, [touched, validateField]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    if (!validateForm()) {
      // Focus first error field
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        element?.focus();
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const submissionData = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
        budget: parseFloat(formData.budget),
        type: type,
        submittedAt: new Date().toISOString()
      };
      
      await onSubmit(submissionData);
      
      // Reset form on successful submission
      setFormData(initialFormState);
      setTouched({});
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to submit form. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay" 
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 id="modal-title">
            {type === 'project' ? 'Submit Project Request' : 'Join as Developer'}
          </h2>
          <button 
            className="close-btn" 
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            <i className="fas fa-times" aria-hidden="true"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          {errors.submit && (
            <div className="error-banner" role="alert">
              {errors.submit}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="title">
              {fieldConfig.title.label} *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.title ? 'error' : ''}
              placeholder={fieldConfig.title.placeholder}
              aria-describedby={errors.title ? 'title-error' : undefined}
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <span id="title-error" className="error-message" role="alert">
                {errors.title}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">
              {fieldConfig.description.label} *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.description ? 'error' : ''}
              rows="4"
              placeholder={fieldConfig.description.placeholder}
              aria-describedby={errors.description ? 'description-error' : undefined}
              aria-invalid={!!errors.description}
            />
            {errors.description && (
              <span id="description-error" className="error-message" role="alert">
                {errors.description}
              </span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="budget">
                {fieldConfig.budget.label} *
              </label>
              <input
                type="number"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.budget ? 'error' : ''}
                placeholder={fieldConfig.budget.placeholder}
                min="0"
                step="0.01"
                aria-describedby={errors.budget ? 'budget-error' : undefined}
                aria-invalid={!!errors.budget}
              />
              {errors.budget && (
                <span id="budget-error" className="error-message" role="alert">
                  {errors.budget}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="timeline">
                {fieldConfig.timeline.label} *
              </label>
              <input
                type="text"
                id="timeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.timeline ? 'error' : ''}
                placeholder={fieldConfig.timeline.placeholder}
                aria-describedby={errors.timeline ? 'timeline-error' : undefined}
                aria-invalid={!!errors.timeline}
              />
              {errors.timeline && (
                <span id="timeline-error" className="error-message" role="alert">
                  {errors.timeline}
                </span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="skills">
              {fieldConfig.skills.label}
            </label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={fieldConfig.skills.placeholder}
            />
            <small className="form-hint">Separate skills with commas</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="organization">
                {fieldConfig.organization.label} *
              </label>
              <input
                type="text"
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.organization ? 'error' : ''}
                placeholder={fieldConfig.organization.placeholder}
                aria-describedby={errors.organization ? 'organization-error' : undefined}
                aria-invalid={!!errors.organization}
              />
              {errors.organization && (
                <span id="organization-error" className="error-message" role="alert">
                  {errors.organization}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.location ? 'error' : ''}
                placeholder="e.g., Ndola, Zambia"
                aria-describedby={errors.location ? 'location-error' : undefined}
                aria-invalid={!!errors.location}
              />
              {errors.location && (
                <span id="location-error" className="error-message" role="alert">
                  {errors.location}
                </span>
              )}
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
                onBlur={handleBlur}
                className={errors.contactEmail ? 'error' : ''}
                placeholder="your.email@example.com"
                aria-describedby={errors.contactEmail ? 'contactEmail-error' : undefined}
                aria-invalid={!!errors.contactEmail}
              />
              {errors.contactEmail && (
                <span id="contactEmail-error" className="error-message" role="alert">
                  {errors.contactEmail}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="contactPhone">Phone</label>
              <input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.contactPhone ? 'error' : ''}
                placeholder="(+260) 960500790"
                aria-describedby={errors.contactPhone ? 'contactPhone-error' : undefined}
                aria-invalid={!!errors.contactPhone}
              />
              {errors.contactPhone && (
                <span id="contactPhone-error" className="error-message" role="alert">
                  {errors.contactPhone}
                </span>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : (
                type === 'project' ? 'Submit Project' : 'Join Platform'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ModalForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['project', 'developer']).isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default React.memo(ModalForm);