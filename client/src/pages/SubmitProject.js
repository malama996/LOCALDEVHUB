import React, { useState } from 'react';
import ModalForm from '../components/ModalForm';
import './SubmitProject.css';

const SubmitProject = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submittedProjects, setSubmittedProjects] = useState([]);

  const handleSubmitProject = (projectData) => {
    const newProject = {
      id: Date.now(),
      ...projectData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    setSubmittedProjects(prev => [newProject, ...prev]);
    
    // Here you would typically send the data to your backend API
    console.log('Project submitted:', newProject);
    
    // Show success message
    alert('Project submitted successfully! We\'ll review it and get back to you soon.');
  };

  return (
    <div className="submit-project">
      <div className="submit-header">
        <div className="container">
          <h1 className="page-title">Submit Your Project</h1>
          <p className="page-subtitle">
            Have a software project that needs to be built? Let our community of 
            talented developers help bring your vision to life.
          </p>
        </div>
      </div>

      <div className="submit-content">
        <div className="container">
          <div className="submit-grid">
            {/* Main Content */}
            <div className="submit-main">
              <div className="submit-card">
                <div className="card-header">
                  <h2>Project Submission</h2>
                  <p>
                    Fill out the form below to submit your project requirements. 
                    Our team will review your submission and connect you with 
                    qualified developers.
                  </p>
                </div>
                
                <div className="card-content">
                  <div className="benefits-list">
                    <h3>Why submit through LocalDevHub?</h3>
                    <ul>
                      <li>
                        <i className="fas fa-check-circle"></i>
                        Access to vetted, skilled developers
                      </li>
                      <li>
                        <i className="fas fa-check-circle"></i>
                        Competitive pricing and transparent costs
                      </li>
                      <li>
                        <i className="fas fa-check-circle"></i>
                        Project management and quality assurance
                      </li>
                      <li>
                        <i className="fas fa-check-circle"></i>
                        Support throughout the development process
                      </li>
                      <li>
                        <i className="fas fa-check-circle"></i>
                        Post-launch maintenance and updates
                      </li>
                    </ul>
                  </div>
                  
                  <button 
                    className="submit-btn"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <i className="fas fa-plus"></i>
                    Submit New Project
                  </button>
                </div>
              </div>

              {/* Recent Submissions */}
              {submittedProjects.length > 0 && (
                <div className="submissions-card">
                  <h3>Your Recent Submissions</h3>
                  <div className="submissions-list">
                    {submittedProjects.map(project => (
                      <div key={project.id} className="submission-item">
                        <div className="submission-header">
                          <h4>{project.title}</h4>
                          <span className={`status ${project.status}`}>
                            {project.status}
                          </span>
                        </div>
                        <div className="submission-details">
                          <span className="org">{project.organization}</span>
                          <span className="budget">${project.budget}</span>
                          <span className="timeline">{project.timeline}</span>
                        </div>
                        <div className="submission-skills">
                          {project.skills.map((skill, index) => (
                            <span key={index} className="skill-tag">{skill}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="submit-sidebar">
              <div className="info-card">
                <h3>Project Guidelines</h3>
                <div className="guidelines">
                  <div className="guideline">
                    <i className="fas fa-lightbulb"></i>
                    <div>
                      <h4>Clear Requirements</h4>
                      <p>Provide detailed project specifications and goals</p>
                    </div>
                  </div>
                  <div className="guideline">
                    <i className="fas fa-dollar-sign"></i>
                    <div>
                      <h4>Realistic Budget</h4>
                      <p>Set a budget that reflects the project's complexity</p>
                    </div>
                  </div>
                  <div className="guideline">
                    <i className="fas fa-clock"></i>
                    <div>
                      <h4>Timeline</h4>
                      <p>Allow sufficient time for quality development</p>
                    </div>
                  </div>
                  <div className="guideline">
                    <i className="fas fa-users"></i>
                    <div>
                      <h4>Communication</h4>
                      <p>Be available for regular check-ins and feedback</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pricing-card">
                <h3>Pricing Information</h3>
                <div className="pricing-tiers">
                  <div className="tier">
                    <h4>Small Projects</h4>
                    <div className="price">ZMW1,000 - ZMW5,000</div>
                    <p>Simple websites, basic apps, landing pages</p>
                  </div>
                  <div className="tier">
                    <h4>Medium Projects</h4>
                    <div className="price">ZMW5,000 - ZMW15,000</div>
                    <p>E-commerce sites, mobile apps, web applications</p>
                  </div>
                  <div className="tier">
                    <h4>Large Projects</h4>
                    <div className="price">ZMW20,000+</div>
                    <p>Complex systems, enterprise solutions, custom platforms</p>
                  </div>
                </div>
              </div>

              <div className="contact-card">
                <h3>Need Help?</h3>
                <p>Our team is here to assist you with project planning and developer matching.</p>
                <div className="contact-info">
                  <div className="contact-item">
                    <i className="fas fa-envelope"></i>
                    <span>projects@localdevhub.com</span>
                  </div>
                  <div className="contact-item">
                    <i className="fas fa-phone"></i>
                    <span>(+260) 960500790</span>
                  </div>
                </div>
              </div>
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
      />
    </div>
  );
};

export default SubmitProject;
