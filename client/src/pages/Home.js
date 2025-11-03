import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const featuredProjects = [
    {
      id: 1,
      title: "Community Food Bank Management System",
      organization: "Local Food Bank",
      budget: 5000,
      timeline: "2 months",
      skills: ["React", "Node.js", "MongoDB"],
      location: "Ndola, Zambia"
    },
    {
      id: 2,
      title: "Educational Platform for Underprivileged Children",
      organization: "Education Foundation",
      budget: 8000,
      timeline: "3 months",
      skills: ["Vue.js", "Python", "PostgreSQL"],
      location: "kasama, Zambia"
    },
    {
      id: 3,
      title: "Environmental Monitoring Dashboard",
      organization: "Green Initiative",
      budget: 3500,
      timeline: "6 weeks",
      skills: ["React", "D3.js", "Express"],
      location: "livingstone, Zambia"
    }
  ];

  const featuredDevelopers = [
    {
      id: 1,
      name: "Shalowa Bristol",
      title: "Full-Stack Developer",
      skills: ["React", "Node.js", "MongoDB", "AWS"],
      experience: "3 years",
      location: "Lusaka, Zambia",
      hourlyRate: 45,
      rating: 4.8,
      completedProjects: 12
    },
    {
      id: 2,
      name: "Michael Chileshe",
      title: "Frontend Specialist",
      skills: ["React", "Vue.js", "TypeScript", "UI/UX"],
      experience: "2 years",
      location: "Kitwe, Zambia",
      hourlyRate: 50,
      rating: 4.9,
      completedProjects: 8
    },
    {
      id: 3,
      name: "Emily Mwamba",
      title: "Backend Developer",
      skills: ["Python", "Django", "PostgreSQL", "Docker"],
      experience: "4 years",
      location: "Ndola, Zambia",
      hourlyRate: 55,
      rating: 4.7,
      completedProjects: 15
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Connect Local Developers with 
              <span className="highlight"> Meaningful Projects</span>
            </h1>
            <p className="hero-description">
              LocalDevHub bridges the gap between talented developers and NGOs/SMEs 
              seeking software solutions. Build impactful projects while growing your skills 
              and making a difference in your community.
            </p>
            <div className="hero-actions">
              <Link to="/marketplace" className="btn btn-primary">
                Browse Projects
              </Link>
              <Link to="/join-developer" className="btn btn-secondary">
                Join as Developer
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-graphic">
              <div className="graphic-circle circle-1"></div>
              <div className="graphic-circle circle-2"></div>
              <div className="graphic-circle circle-3"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission">
        <div className="container">
          <div className="mission-content">
            <h2 className="section-title">Our Mission</h2>
            <p className="mission-text">
              We believe that technology should serve communities and create positive change. 
              LocalDevHub connects passionate developers with organizations that need software 
              solutions, fostering local innovation and social impact.
            </p>
            <div className="mission-stats">
              <div className="stat">
                <div className="stat-number">150+</div>
                <div className="stat-label">Projects Completed</div>
              </div>
              <div className="stat">
                <div className="stat-number">75+</div>
                <div className="stat-label">Active Developers</div>
              </div>
              <div className="stat">
                <div className="stat-number">50+</div>
                <div className="stat-label">Partner Organizations</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="featured-projects">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Projects</h2>
            <p className="section-subtitle">
              Discover exciting opportunities to make a difference
            </p>
          </div>
          <div className="projects-grid">
            {featuredProjects.map(project => (
              <div key={project.id} className="project-card">
                <h3 className="project-title">{project.title}</h3>
                <div className="project-org">
                  <i className="fas fa-building"></i>
                  <span>{project.organization}</span>
                </div>
                <div className="project-location">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{project.location}</span>
                </div>
                <div className="project-skills">
                  {project.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
                <div className="project-details">
                  <div className="project-budget">
                    <i className="fas fa-dollar-sign"></i>
                    <span>ZMW{project.budget}</span>
                  </div>
                  <div className="project-timeline">
                    <i className="fas fa-clock"></i>
                    <span>{project.timeline}</span>
                  </div>
                </div>
                <Link to="/marketplace" className="project-link">
                  View Details
                </Link>
              </div>
            ))}
          </div>
          <div className="section-actions">
            <Link to="/marketplace" className="btn btn-outline">
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Developers */}
      <section className="featured-developers">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Developers</h2>
            <p className="section-subtitle">
              Meet talented developers ready to bring your ideas to life
            </p>
          </div>
          <div className="developers-grid">
            {featuredDevelopers.map(developer => (
              <div key={developer.id} className="developer-card">
                <div className="developer-avatar">
                  <div className="avatar-placeholder">
                    <i className="fas fa-user"></i>
                  </div>
                </div>
                <h3 className="developer-name">{developer.name}</h3>
                <p className="developer-title">{developer.title}</p>
                <div className="developer-location">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{developer.location}</span>
                </div>
                <div className="developer-skills">
                  {developer.skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
                <div className="developer-stats">
                  <div className="stat">
                    <span className="stat-value">ZMW{developer.hourlyRate}</span>
                    <span className="stat-label">/hour</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{developer.rating}</span>
                    <span className="stat-label">rating</span>
                  </div>
                </div>
                <Link to="/marketplace" className="developer-link">
                  View Profile
                </Link>
              </div>
            ))}
          </div>
          <div className="section-actions">
            <Link to="/marketplace" className="btn btn-outline">
              Browse All Developers
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Get Started?</h2>
            <p className="cta-description">
              Whether you're a developer looking for meaningful projects or an organization 
              in need of software solutions, LocalDevHub is here to connect you.
            </p>
            <div className="cta-actions">
              <Link to="/submit-project" className="btn btn-primary">
                Submit Your Project
              </Link>
              <Link to="/join-developer" className="btn btn-secondary">
                Join as Developer
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
