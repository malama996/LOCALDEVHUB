import React, { useState } from 'react';
import ModalForm from '../components/ModalForm';
import './JoinAsDeveloper.css';

const JoinAsDeveloper = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [developerProfiles, setDeveloperProfiles] = useState([]);

  const handleSubmitProfile = (profileData) => {
    const newProfile = {
      id: Date.now(),
      ...profileData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      rating: 0,
      completedProjects: 0
    };
    
    setDeveloperProfiles(prev => [newProfile, ...prev]);
    
    // Here you would typically send the data to your backend API
    console.log('Developer profile submitted:', newProfile);
    
    // Show success message
    alert('Profile submitted successfully! We\'ll review it and activate your account soon.');
  };

  return (
    <div className="join-developer">
      <div className="join-header">
        <div className="container">
          <h1 className="page-title">Join as Developer</h1>
          <p className="page-subtitle">
            Showcase your skills and connect with meaningful projects. 
            Join our community of talented developers making a difference.
          </p>
        </div>
      </div>

      <div className="join-content">
        <div className="container">
          <div className="join-grid">
            {/* Main Content */}
            <div className="join-main">
              <div className="join-card">
                <div className="card-header">
                  <h2>Developer Registration</h2>
                  <p>
                    Create your developer profile to start receiving project opportunities. 
                    Our platform connects you with NGOs and SMEs looking for skilled developers.
                  </p>
                </div>
                
                <div className="card-content">
                  <div className="benefits-list">
                    <h3>Why join LocalDevHub?</h3>
                    <ul>
                      <li>
                        <i className="fas fa-project-diagram"></i>
                        Access to meaningful projects that make a difference
                      </li>
                      <li>
                        <i className="fas fa-dollar-sign"></i>
                        Competitive rates and flexible payment options
                      </li>
                      <li>
                        <i className="fas fa-users"></i>
                        Connect with like-minded developers and organizations
                      </li>
                      <li>
                        <i className="fas fa-chart-line"></i>
                        Build your portfolio with diverse project experiences
                      </li>
                      <li>
                        <i className="fas fa-handshake"></i>
                        Long-term relationships with repeat clients
                      </li>
                    </ul>
                  </div>
                  
                  <button 
                    className="join-btn"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <i className="fas fa-user-plus"></i>
                    Create Developer Profile
                  </button>
                </div>
              </div>

              {/* Recent Profiles */}
              {developerProfiles.length > 0 && (
                <div className="profiles-card">
                  <h3>Your Developer Profiles</h3>
                  <div className="profiles-list">
                    {developerProfiles.map(profile => (
                      <div key={profile.id} className="profile-item">
                        <div className="profile-header">
                          <h4>{profile.title}</h4>
                          <span className={`status ${profile.status}`}>
                            {profile.status}
                          </span>
                        </div>
                        <div className="profile-details">
                          <span className="role">{profile.organization}</span>
                          <span className="rate">${profile.budget}/hour</span>
                          <span className="availability">{profile.timeline}</span>
                        </div>
                        <div className="profile-skills">
                          {profile.skills.map((skill, index) => (
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
            <div className="join-sidebar">
              <div className="requirements-card">
                <h3>Developer Requirements</h3>
                <div className="requirements">
                  <div className="requirement">
                    <i className="fas fa-code"></i>
                    <div>
                      <h4>Technical Skills</h4>
                      <p>Proficiency in relevant programming languages and frameworks</p>
                    </div>
                  </div>
                  <div className="requirement">
                    <i className="fas fa-graduation-cap"></i>
                    <div>
                      <h4>Portfolio</h4>
                      <p>Demonstrate your work through projects and code samples</p>
                    </div>
                  </div>
                  <div className="requirement">
                    <i className="fas fa-comments"></i>
                    <div>
                      <h4>Communication</h4>
                      <p>Clear communication skills for client collaboration</p>
                    </div>
                  </div>
                  <div className="requirement">
                    <i className="fas fa-clock"></i>
                    <div>
                      <h4>Availability</h4>
                      <p>Commitment to project timelines and deliverables</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="earnings-card">
                <h3>Earning Potential</h3>
                <div className="earning-tiers">
                  <div className="tier">
                    <h4>Junior Developer</h4>
                    <div className="rate">ZMW 25 - ZMW 45/hour</div>
                    <p>0-2 years experience, basic projects</p>
                  </div>
                  <div className="tier">
                    <h4>Mid-Level Developer</h4>
                    <div className="rate">ZMW 45 - ZMW 75/hour</div>
                    <p>2-5 years experience, complex projects</p>
                  </div>
                  <div className="tier">
                    <h4>Senior Developer</h4>
                    <div className="rate">ZMW 75+/hour</div>
                    <p>5+ years experience, leadership roles</p>
                  </div>
                </div>
              </div>

              <div className="success-card">
                <h3>Success Stories</h3>
                <div className="stories">
                  <div className="story">
                    <div className="story-quote">
                      "LocalDevHub helped me find projects that align with my values. 
                      I've built meaningful software for local nonprofits while growing my skills."
                    </div>
                    <div className="story-author">- Sarah M., Full-Stack Developer</div>
                  </div>
                  <div className="story">
                    <div className="story-quote">
                      "The platform connected me with amazing clients who became long-term partners. 
                      The community is supportive and professional."
                    </div>
                    <div className="story-author">- Michael K., Mobile Developer</div>
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
        type="developer"
        onSubmit={handleSubmitProfile}
      />
    </div>
  );
};

export default JoinAsDeveloper;
