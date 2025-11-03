import React, { useState, useEffect } from 'react';
import ProjectCard from '../components/ProjectCard';
import DeveloperCard from '../components/DeveloperCard';
import './Marketplace.css';

const Marketplace = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [filters, setFilters] = useState({
    skills: '',
    location: '',
    budget: '',
    experience: ''
  });
  const [loading, setLoading] = useState(true);

  // Mock data - replace with API calls
  useEffect(() => {
    const mockProjects = [
      {
        id: 1,
        title: "Community Food Bank Management System",
        description: "We need a comprehensive system to manage food donations, inventory, and distribution for our local food bank. The system should include donor management, volunteer scheduling, and reporting features.",
        organization: "Local Food Bank",
        budget: 5000,
        timeline: "2 months",
        skills: ["React", "Node.js", "MongoDB", "Express"],
        location: "Ndola, Zambia",
        createdAt: "2024-01-15",
        status: "open"
      },
      {
        id: 2,
        title: "Educational Platform for Underprivileged Children",
        description: "Creating an online learning platform with interactive content, progress tracking, and gamification elements to help underprivileged children access quality education.",
        organization: "Education Foundation",
        budget: 8000,
        timeline: "3 months",
        skills: ["Vue.js", "Python", "PostgreSQL", "Django"],
        location: "Kasama, Zambia",
        createdAt: "2024-01-10",
        status: "open"
      },
      {
        id: 3,
        title: "Environmental Monitoring Dashboard",
        description: "A real-time dashboard to monitor environmental data including air quality, water levels, and pollution metrics with data visualization and alerting capabilities.",
        organization: "Green Initiative",
        budget: 3500,
        timeline: "6 weeks",
        skills: ["React", "D3.js", "Express", "Socket.io"],
        location: "Southern Province, Zambia",
        createdAt: "2024-01-08",
        status: "in-progress"
      },
      {
        id: 4,
        title: "Senior Care Mobile App",
        description: "A mobile application to help seniors manage medications, schedule appointments, and connect with caregivers and family members.",
        organization: "Senior Care Center",
        budget: 6000,
        timeline: "4 months",
        skills: ["React Native", "Node.js", "MongoDB", "Firebase"],
        location: "Ndola, Zambia",
        createdAt: "2024-01-05",
        status: "open"
      }
    ];

    const mockDevelopers = [
      {
        id: 1,
        name: "Sarah chileshe",
        title: "Full-Stack Developer",
        skills: ["React", "Node.js", "MongoDB", "AWS", "TypeScript"],
        experience: "3 years",
        location: "Muchinga, Zambia",
        hourlyRate: 45,
        availability: "Available",
        portfolio: "https://sarahchileshe.com",
        rating: 4.8,
        completedProjects: 12
      },
      {
        id: 2,
        name: "Michael Chileshe",
        title: "Frontend Specialist",
        skills: ["React", "Vue.js", "TypeScript", "UI/UX", "Figma"],
        experience: "2 years",
        location: "Kitwe, Zambia",
        hourlyRate: 50,
        availability: "Available",
        portfolio: "https://michaelchile.com",
        rating: 4.9,
        completedProjects: 8
      },
      {
        id: 3,
        name: "Emily Musonda",
        title: "Backend Developer",
        skills: ["Python", "Django", "PostgreSQL", "Docker", "AWS"],
        experience: "4 years",
        location: "Livingstone, Zambia",
        hourlyRate: 55,
        availability: "Busy",
        portfolio: "https://emilyMusonda.com",
        rating: 4.7,
        completedProjects: 15
      },
      {
        id: 4,
        name: "David Kangwa",
        title: "Mobile Developer",
        skills: ["React Native", "Flutter", "iOS", "Android", "Firebase"],
        experience: "3 years",
        location: "Ndola, Zambia",
        hourlyRate: 48,
        availability: "Available",
        portfolio: "https://DavidDEv.com",
        rating: 4.6,
        completedProjects: 10
      }
    ];

    setProjects(mockProjects);
    setDevelopers(mockDevelopers);
    setLoading(false);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredProjects = projects.filter(project => {
    return (
      (!filters.skills || project.skills.some(skill => 
        skill.toLowerCase().includes(filters.skills.toLowerCase())
      )) &&
      (!filters.location || project.location.toLowerCase().includes(filters.location.toLowerCase())) &&
      (!filters.budget || project.budget <= parseInt(filters.budget))
    );
  });

  const filteredDevelopers = developers.filter(developer => {
    return (
      (!filters.skills || developer.skills.some(skill => 
        skill.toLowerCase().includes(filters.skills.toLowerCase())
      )) &&
      (!filters.location || developer.location.toLowerCase().includes(filters.location.toLowerCase())) &&
      (!filters.experience || parseInt(developer.experience) >= parseInt(filters.experience))
    );
  });

  if (loading) {
    return (
      <div className="marketplace">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="marketplace">
      <div className="marketplace-header">
        <div className="container">
          <h1 className="page-title">Marketplace</h1>
          <p className="page-subtitle">
            Discover projects and connect with talented developers
          </p>
        </div>
      </div>

      <div className="marketplace-content">
        <div className="container">
          {/* Tabs */}
          <div className="marketplace-tabs">
            <button 
              className={`tab ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              <i className="fas fa-project-diagram"></i>
              Projects ({filteredProjects.length})
            </button>
            <button 
              className={`tab ${activeTab === 'developers' ? 'active' : ''}`}
              onClick={() => setActiveTab('developers')}
            >
              <i className="fas fa-users"></i>
              Developers ({filteredDevelopers.length})
            </button>
          </div>

          {/* Filters */}
          <div className="filters-section">
            <div className="filters-grid">
              <div className="filter-group">
                <label htmlFor="skills">Skills</label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={filters.skills}
                  onChange={handleFilterChange}
                  placeholder="e.g., React, Python"
                />
              </div>
              <div className="filter-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="e.g., Ndola,Zambia"
                />
              </div>
              {activeTab === 'projects' && (
                <div className="filter-group">
                  <label htmlFor="budget">Max Budget</label>
                  <select
                    id="budget"
                    name="budget"
                    value={filters.budget}
                    onChange={handleFilterChange}
                  >
                    <option value="">Any Budget</option>
                    <option value="1000">Under ZMW1,000</option>
                    <option value="5000">Under ZMW5,000</option>
                    <option value="10000">Under ZMW10,000</option>
                    <option value="20000">Under ZMW20,000</option>
                  </select>
                </div>
              )}
              {activeTab === 'developers' && (
                <div className="filter-group">
                  <label htmlFor="experience">Min Experience</label>
                  <select
                    id="experience"
                    name="experience"
                    value={filters.experience}
                    onChange={handleFilterChange}
                  >
                    <option value="">Any Experience</option>
                    <option value="1">1+ years</option>
                    <option value="2">2+ years</option>
                    <option value="3">3+ years</option>
                    <option value="5">5+ years</option>
                  </select>
                </div>
              )}
            </div>
            <button 
              className="clear-filters"
              onClick={() => setFilters({ skills: '', location: '', budget: '', experience: '' })}
            >
              Clear Filters
            </button>
          </div>

          {/* Results */}
          <div className="results-section">
            {activeTab === 'projects' ? (
              <div className="projects-list">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map(project => (
                    <ProjectCard key={project.id} project={project} />
                  ))
                ) : (
                  <div className="no-results">
                    <i className="fas fa-search"></i>
                    <h3>No projects found</h3>
                    <p>Try adjusting your filters or check back later for new projects.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="developers-list">
                {filteredDevelopers.length > 0 ? (
                  filteredDevelopers.map(developer => (
                    <DeveloperCard key={developer.id} developer={developer} />
                  ))
                ) : (
                  <div className="no-results">
                    <i className="fas fa-users"></i>
                    <h3>No developers found</h3>
                    <p>Try adjusting your filters or check back later for new developers.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
