import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Home.css';

// Custom hooks for data management
const useFeaturedData = () => {
  const featuredProjects = useMemo(() => [
    {
      id: 1,
      title: "Community Food Bank Management System",
      organization: "Local Food Bank",
      budget: 5000,
      timeline: "2 months",
      skills: ["React", "Node.js", "MongoDB"],
      location: "Ndola, Zambia",
      category: "Social Impact",
      urgency: "high",
      applicants: 8
    },
    {
      id: 2,
      title: "Educational Platform for Underprivileged Children",
      organization: "Education Foundation",
      budget: 8000,
      timeline: "3 months",
      skills: ["Vue.js", "Python", "PostgreSQL"],
      location: "Kasama, Zambia",
      category: "Education",
      urgency: "medium",
      applicants: 12
    },
    {
      id: 3,
      title: "Environmental Monitoring Dashboard",
      organization: "Green Initiative",
      budget: 3500,
      timeline: "6 weeks",
      skills: ["React", "D3.js", "Express"],
      location: "Livingstone, Zambia",
      category: "Environment",
      urgency: "high",
      applicants: 5
    }
  ], []);

  const featuredDevelopers = useMemo(() => [
    {
      id: 1,
      name: "Shalowa Bristol",
      title: "Full-Stack Developer",
      skills: ["React", "Node.js", "MongoDB", "AWS"],
      experience: "3 years",
      location: "Lusaka, Zambia",
      hourlyRate: 45,
      rating: 4.8,
      completedProjects: 12,
      availability: "immediate",
      verified: true
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
      completedProjects: 8,
      availability: "1 week",
      verified: true
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
      completedProjects: 15,
      availability: "immediate",
      verified: true
    }
  ], []);

  const missionStats = useMemo(() => [
    { number: "150+", label: "Projects Completed", icon: "fas fa-check-circle" },
    { number: "75+", label: "Active Developers", icon: "fas fa-code" },
    { number: "50+", label: "Partner Organizations", icon: "fas fa-handshake" },
    { number: "95%", label: "Satisfaction Rate", icon: "fas fa-star" }
  ], []);

  return { featuredProjects, featuredDevelopers, missionStats };
};

// Reusable Card Components
const ProjectCard = ({ project }) => (
  <article className="project-card" role="article" aria-labelledby={`project-title-${project.id}`}>
    <div className="project-header">
      <h3 id={`project-title-${project.id}`} className="project-title">
        {project.title}
      </h3>
      {project.urgency === 'high' && (
        <span className="urgency-badge" aria-label="High urgency project">
          <i className="fas fa-exclamation-circle"></i>
          Urgent
        </span>
      )}
    </div>
    
    <div className="project-meta">
      <div className="project-org" aria-label={`Organization: ${project.organization}`}>
        <i className="fas fa-building" aria-hidden="true"></i>
        <span>{project.organization}</span>
      </div>
      <div className="project-location" aria-label={`Location: ${project.location}`}>
        <i className="fas fa-map-marker-alt" aria-hidden="true"></i>
        <span>{project.location}</span>
      </div>
    </div>

    <div className="project-category">
      <span className="category-tag">{project.category}</span>
    </div>

    <div className="project-skills" aria-label="Required skills">
      {project.skills.map((skill, index) => (
        <span key={index} className="skill-tag">{skill}</span>
      ))}
    </div>

    <div className="project-details">
      <div className="project-budget" aria-label={`Budget: ZMW ${project.budget}`}>
        <i className="fas fa-dollar-sign" aria-hidden="true"></i>
        <span>ZMW {project.budget.toLocaleString()}</span>
      </div>
      <div className="project-timeline" aria-label={`Timeline: ${project.timeline}`}>
        <i className="fas fa-clock" aria-hidden="true"></i>
        <span>{project.timeline}</span>
      </div>
      <div className="project-applicants" aria-label={`${project.applicants} applicants`}>
        <i className="fas fa-users" aria-hidden="true"></i>
        <span>{project.applicants}</span>
      </div>
    </div>

    <Link 
      to={`/projects/${project.id}`} 
      className="project-link"
      aria-label={`View details for ${project.title}`}
    >
      View Details
    </Link>
  </article>
);

ProjectCard.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    organization: PropTypes.string.isRequired,
    budget: PropTypes.number.isRequired,
    timeline: PropTypes.string.isRequired,
    skills: PropTypes.arrayOf(PropTypes.string).isRequired,
    location: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    urgency: PropTypes.string,
    applicants: PropTypes.number
  }).isRequired
};

const DeveloperCard = ({ developer }) => (
  <article className="developer-card" role="article" aria-labelledby={`developer-name-${developer.id}`}>
    <div className="developer-header">
      <div className="developer-avatar">
        <div className="avatar-placeholder" aria-hidden="true">
          <i className="fas fa-user"></i>
        </div>
        {developer.verified && (
          <span className="verified-badge" aria-label="Verified developer">
            <i className="fas fa-check-circle"></i>
          </span>
        )}
      </div>
      <div className="developer-info">
        <h3 id={`developer-name-${developer.id}`} className="developer-name">
          {developer.name}
        </h3>
        <p className="developer-title">{developer.title}</p>
      </div>
    </div>

    <div className="developer-meta">
      <div className="developer-location" aria-label={`Location: ${developer.location}`}>
        <i className="fas fa-map-marker-alt" aria-hidden="true"></i>
        <span>{developer.location}</span>
      </div>
      <div className="developer-availability" aria-label={`Available in ${developer.availability}`}>
        <i className="fas fa-calendar-check" aria-hidden="true"></i>
        <span>{developer.availability}</span>
      </div>
    </div>

    <div className="developer-skills" aria-label="Developer skills">
      {developer.skills.slice(0, 3).map((skill, index) => (
        <span key={index} className="skill-tag">{skill}</span>
      ))}
      {developer.skills.length > 3 && (
        <span className="skill-more">+{developer.skills.length - 3} more</span>
      )}
    </div>

    <div className="developer-stats">
      <div className="stat">
        <span className="stat-value">ZMW {developer.hourlyRate}</span>
        <span className="stat-label">/hour</span>
      </div>
      <div className="stat">
        <span className="stat-value">
          <i className="fas fa-star" aria-hidden="true"></i>
          {developer.rating}
        </span>
        <span className="stat-label">rating</span>
      </div>
      <div className="stat">
        <span className="stat-value">{developer.completedProjects}</span>
        <span className="stat-label">projects</span>
      </div>
    </div>

    <Link 
      to={`/developers/${developer.id}`} 
      className="developer-link"
      aria-label={`View ${developer.name}'s profile`}
    >
      View Profile
    </Link>
  </article>
);

DeveloperCard.propTypes = {
  developer: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    skills: PropTypes.arrayOf(PropTypes.string).isRequired,
    experience: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    hourlyRate: PropTypes.number.isRequired,
    rating: PropTypes.number.isRequired,
    completedProjects: PropTypes.number.isRequired,
    availability: PropTypes.string.isRequired,
    verified: PropTypes.bool
  }).isRequired
};

const StatItem = ({ stat }) => (
  <div className="stat-item" role="listitem">
    <div className="stat-icon" aria-hidden="true">
      <i className={stat.icon}></i>
    </div>
    <div className="stat-content">
      <div className="stat-number">{stat.number}</div>
      <div className="stat-label">{stat.label}</div>
    </div>
  </div>
);

StatItem.propTypes = {
  stat: PropTypes.shape({
    number: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired
  }).isRequired
};

// Section Components
const HeroSection = () => (
  <section className="hero" aria-labelledby="hero-title">
    <div className="hero-container">
      <div className="hero-content">
        <h1 id="hero-title" className="hero-title">
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
            <i className="fas fa-arrow-right" aria-hidden="true"></i>
          </Link>
          <Link to="/join-developer" className="btn btn-secondary">
            Join as Developer
            <i className="fas fa-user-plus" aria-hidden="true"></i>
          </Link>
        </div>
        <div className="hero-features">
          <div className="feature">
            <i className="fas fa-shield-alt" aria-hidden="true"></i>
            <span>Secure Platform</span>
          </div>
          <div className="feature">
            <i className="fas fa-clock" aria-hidden="true"></i>
            <span>Quick Matching</span>
          </div>
          <div className="feature">
            <i className="fas fa-hand-holding-heart" aria-hidden="true"></i>
            <span>Social Impact</span>
          </div>
        </div>
      </div>
      <div className="hero-image">
        <div className="hero-graphic" aria-hidden="true">
          <div className="graphic-circle circle-1"></div>
          <div className="graphic-circle circle-2"></div>
          <div className="graphic-circle circle-3"></div>
          <div className="graphic-element element-1">
            <i className="fas fa-code"></i>
          </div>
          <div className="graphic-element element-2">
            <i className="fas fa-users"></i>
          </div>
          <div className="graphic-element element-3">
            <i className="fas fa-rocket"></i>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const MissionSection = ({ stats }) => (
  <section className="mission" aria-labelledby="mission-title">
    <div className="container">
      <div className="mission-content">
        <h2 id="mission-title" className="section-title">Our Mission</h2>
        <p className="mission-text">
          We believe that technology should serve communities and create positive change. 
          LocalDevHub connects passionate developers with organizations that need software 
          solutions, fostering local innovation and social impact across Zambia.
        </p>
        <div className="mission-stats" role="list">
          {stats.map((stat, index) => (
            <StatItem key={index} stat={stat} />
          ))}
        </div>
      </div>
    </div>
  </section>
);

MissionSection.propTypes = {
  stats: PropTypes.arrayOf(PropTypes.object).isRequired
};

const FeaturedSection = ({ title, subtitle, items, renderItem, viewAllLink, viewAllText }) => (
  <section className={`featured-${title.toLowerCase()}`} aria-labelledby={`${title.toLowerCase()}-title`}>
    <div className="container">
      <div className="section-header">
        <h2 id={`${title.toLowerCase()}-title`} className="section-title">{title}</h2>
        <p className="section-subtitle">{subtitle}</p>
      </div>
      <div className={`${title.toLowerCase()}-grid`} role="list" aria-label={`List of ${title.toLowerCase()}`}>
        {items.map(item => renderItem(item))}
      </div>
      <div className="section-actions">
        <Link to={viewAllLink} className="btn btn-outline">
          {viewAllText}
          <i className="fas fa-arrow-right" aria-hidden="true"></i>
        </Link>
      </div>
    </div>
  </section>
);

FeaturedSection.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired,
  viewAllLink: PropTypes.string.isRequired,
  viewAllText: PropTypes.string.isRequired
};

const CTASection = () => (
  <section className="cta" aria-labelledby="cta-title">
    <div className="container">
      <div className="cta-content">
        <h2 id="cta-title" className="cta-title">Ready to Get Started?</h2>
        <p className="cta-description">
          Whether you're a developer looking for meaningful projects or an organization 
          in need of software solutions, LocalDevHub is here to connect you with the right opportunities.
        </p>
        <div className="cta-actions">
          <Link to="/submit-project" className="btn btn-primary">
            Submit Your Project
            <i className="fas fa-paper-plane" aria-hidden="true"></i>
          </Link>
          <Link to="/join-developer" className="btn btn-secondary">
            Join as Developer
            <i className="fas fa-code" aria-hidden="true"></i>
          </Link>
        </div>
        <div className="cta-features">
          <div className="feature">
            <i className="fas fa-check-circle" aria-hidden="true"></i>
            <span>No hidden fees</span>
          </div>
          <div className="feature">
            <i className="fas fa-check-circle" aria-hidden="true"></i>
            <span>Secure payments</span>
          </div>
          <div className="feature">
            <i className="fas fa-check-circle" aria-hidden="true"></i>
            <span>24/7 support</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Main Home Component
const Home = () => {
  const { featuredProjects, featuredDevelopers, missionStats } = useFeaturedData();

  return (
    <div className="home">
      <HeroSection />
      
      <MissionSection stats={missionStats} />
      
      <FeaturedSection
        title="Featured Projects"
        subtitle="Discover exciting opportunities to make a difference"
        items={featuredProjects}
        renderItem={(project) => <ProjectCard key={project.id} project={project} />}
        viewAllLink="/marketplace"
        viewAllText="View All Projects"
      />
      
      <FeaturedSection
        title="Featured Developers"
        subtitle="Meet talented developers ready to bring your ideas to life"
        items={featuredDevelopers}
        renderItem={(developer) => <DeveloperCard key={developer.id} developer={developer} />}
        viewAllLink="/developers"
        viewAllText="Browse All Developers"
      />
      
      <CTASection />
    </div>
  );
};

export default React.memo(Home);