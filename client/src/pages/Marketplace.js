import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import DeveloperCard from '../components/DeveloperCard';
import './Marketplace.css';

// Custom hooks for data management
const useMarketplaceData = () => {
  const [data, setData] = useState({ projects: [], developers: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockData = {
          projects: [
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
              status: "open",
              category: "Social Impact",
              urgency: "high",
              applicants: 8,
              views: 124
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
              status: "open",
              category: "Education",
              urgency: "medium",
              applicants: 12,
              views: 89
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
              status: "in-progress",
              category: "Environment",
              urgency: "high",
              applicants: 5,
              views: 67
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
              status: "open",
              category: "Healthcare",
              urgency: "medium",
              applicants: 7,
              views: 156
            }
          ],
          developers: [
            {
              id: 1,
              name: "Sarah Chileshe",
              title: "Full-Stack Developer",
              skills: ["React", "Node.js", "MongoDB", "AWS", "TypeScript"],
              experience: "3 years",
              location: "Muchinga, Zambia",
              hourlyRate: 45,
              availability: "Available",
              portfolio: "https://sarahchileshe.com",
              rating: 4.8,
              completedProjects: 12,
              responseTime: "1 hour",
              verified: true,
              specialization: ["Web Development", "API Development"]
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
              completedProjects: 8,
              responseTime: "2 hours",
              verified: true,
              specialization: ["Frontend Development", "UI/UX Design"]
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
              completedProjects: 15,
              responseTime: "4 hours",
              verified: true,
              specialization: ["Backend Development", "DevOps"]
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
              completedProjects: 10,
              responseTime: "1 hour",
              verified: false,
              specialization: ["Mobile Development", "Cross-platform Apps"]
            }
          ]
        };

        setData(mockData);
      } catch (err) {
        setError('Failed to load marketplace data. Please try again.');
        console.error('Marketplace data loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

const useMarketplaceFilters = (initialTab = 'projects') => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || initialTab);
  const [filters, setFilters] = useState({
    skills: searchParams.get('skills') || '',
    location: searchParams.get('location') || '',
    budget: searchParams.get('budget') || '',
    experience: searchParams.get('experience') || '',
    category: searchParams.get('category') || '',
    availability: searchParams.get('availability') || ''
  });

  // Sync URL with filters and active tab
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (activeTab) params.set('tab', activeTab);
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    
    setSearchParams(params, { replace: true });
  }, [activeTab, filters, setSearchParams]);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const handleFilterChange = useCallback((name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      skills: '',
      location: '',
      budget: '',
      experience: '',
      category: '',
      availability: ''
    });
  }, []);

  return {
    activeTab,
    filters,
    handleTabChange,
    handleFilterChange,
    clearFilters
  };
};

// Filtering logic
const useFilteredData = (data, filters, activeTab) => {
  return useMemo(() => {
    if (activeTab === 'projects') {
      return data.projects.filter(project => {
        const matchesSkills = !filters.skills || 
          project.skills.some(skill => 
            skill.toLowerCase().includes(filters.skills.toLowerCase())
          );
        
        const matchesLocation = !filters.location || 
          project.location.toLowerCase().includes(filters.location.toLowerCase());
        
        const matchesBudget = !filters.budget || 
          project.budget <= parseInt(filters.budget);
        
        const matchesCategory = !filters.category || 
          project.category === filters.category;

        return matchesSkills && matchesLocation && matchesBudget && matchesCategory;
      });
    } else {
      return data.developers.filter(developer => {
        const matchesSkills = !filters.skills || 
          developer.skills.some(skill => 
            skill.toLowerCase().includes(filters.skills.toLowerCase())
          );
        
        const matchesLocation = !filters.location || 
          developer.location.toLowerCase().includes(filters.location.toLowerCase());
        
        const matchesExperience = !filters.experience || 
          parseInt(developer.experience) >= parseInt(filters.experience);
        
        const matchesAvailability = !filters.availability || 
          developer.availability.toLowerCase() === filters.availability.toLowerCase();

        return matchesSkills && matchesLocation && matchesExperience && matchesAvailability;
      });
    }
  }, [data, filters, activeTab]);
};

// Inline component implementations
const SearchFilters = ({ activeTab, filters, onFilterChange, onClearFilters }) => {
  return (
    <div className="filters-section">
      <div className="filters-grid">
        <div className="filter-group">
          <label htmlFor="skills">Skills</label>
          <input
            type="text"
            id="skills"
            name="skills"
            value={filters.skills}
            onChange={(e) => onFilterChange('skills', e.target.value)}
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
            onChange={(e) => onFilterChange('location', e.target.value)}
            placeholder="e.g., Ndola, Zambia"
          />
        </div>
        {activeTab === 'projects' && (
          <div className="filter-group">
            <label htmlFor="budget">Max Budget</label>
            <select
              id="budget"
              name="budget"
              value={filters.budget}
              onChange={(e) => onFilterChange('budget', e.target.value)}
            >
              <option value="">Any Budget</option>
              <option value="1000">Under ZMW 1,000</option>
              <option value="5000">Under ZMW 5,000</option>
              <option value="10000">Under ZMW 10,000</option>
              <option value="20000">Under ZMW 20,000</option>
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
              onChange={(e) => onFilterChange('experience', e.target.value)}
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
      <div className="filter-actions">
        <button 
          className="clear-filters"
          onClick={onClearFilters}
        >
          <i className="fas fa-times"></i>
          Clear Filters
        </button>
      </div>
    </div>
  );
};

const LoadingSpinner = ({ message = "Loading...", overlay = false }) => {
  if (overlay) {
    return (
      <div className="loading-overlay">
        <div className="loading-content">
          <div className="spinner"></div>
          {message && <p>{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="loading">
      <div className="spinner"></div>
      {message && <p>{message}</p>}
    </div>
  );
};

const EmptyState = ({ 
  icon = "fas fa-search", 
  title = "No results found", 
  message = "Try adjusting your search or filters.",
  actionLabel,
  onAction 
}) => {
  return (
    <div className="empty-state">
      <i className={icon}></i>
      <h3>{title}</h3>
      <p>{message}</p>
      {actionLabel && onAction && (
        <button className="btn btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

// Main Marketplace Component
const Marketplace = () => {
  const { data, loading, error } = useMarketplaceData();
  const {
    activeTab,
    filters,
    handleTabChange,
    handleFilterChange,
    clearFilters
  } = useMarketplaceFilters();

  const filteredItems = useFilteredData(data, filters, activeTab);

  const handleRetry = () => {
    window.location.reload();
  };

  if (error) {
    return (
      <div className="marketplace">
        <div className="container">
          <div className="error-state">
            <i className="fas fa-exclamation-triangle" aria-hidden="true"></i>
            <h2>Unable to Load Marketplace</h2>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={handleRetry}>
              <i className="fas fa-redo" aria-hidden="true"></i>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="marketplace">
      <MarketplaceHeader 
        activeTab={activeTab}
        itemCount={filteredItems.length}
      />
      
      <div className="marketplace-content">
        <div className="container">
          <MarketplaceTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            projectsCount={filteredItems.length}
            developersCount={filteredItems.length}
          />
          
          <SearchFilters
            activeTab={activeTab}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
          />
          
          <ResultsSection
            loading={loading}
            activeTab={activeTab}
            items={filteredItems}
          />
        </div>
      </div>
    </div>
  );
};

// Sub-components
const MarketplaceHeader = ({ activeTab, itemCount }) => (
  <header className="marketplace-header">
    <div className="container">
      <div className="header-content">
        <div>
          <h1 className="page-title">Marketplace</h1>
          <p className="page-subtitle">
            Discover {activeTab === 'projects' ? 'projects' : 'talented developers'} and make meaningful connections
          </p>
        </div>
        <div className="header-stats">
          <div className="stat">
            <span className="stat-number">{itemCount}</span>
            <span className="stat-label">
              {activeTab === 'projects' ? 'Projects' : 'Developers'} Available
            </span>
          </div>
        </div>
      </div>
    </div>
  </header>
);

const MarketplaceTabs = ({ activeTab, onTabChange, projectsCount, developersCount }) => (
  <div className="marketplace-tabs" role="tablist" aria-label="Marketplace categories">
    <button
      className={`tab ${activeTab === 'projects' ? 'active' : ''}`}
      onClick={() => onTabChange('projects')}
      role="tab"
      aria-selected={activeTab === 'projects'}
      aria-controls="projects-panel"
      id="projects-tab"
    >
      <i className="fas fa-project-diagram" aria-hidden="true"></i>
      Projects
      <span className="tab-count" aria-label={`${projectsCount} projects available`}>
        {projectsCount}
      </span>
    </button>
    <button
      className={`tab ${activeTab === 'developers' ? 'active' : ''}`}
      onClick={() => onTabChange('developers')}
      role="tab"
      aria-selected={activeTab === 'developers'}
      aria-controls="developers-panel"
      id="developers-tab"
    >
      <i className="fas fa-users" aria-hidden="true"></i>
      Developers
      <span className="tab-count" aria-label={`${developersCount} developers available`}>
        {developersCount}
      </span>
    </button>
  </div>
);

const ResultsSection = ({ loading, activeTab, items }) => {
  if (loading) {
    return <LoadingSpinner message="Loading marketplace..." />;
  }

  const isEmpty = items.length === 0;
  const isProjects = activeTab === 'projects';

  if (isEmpty) {
    return (
      <EmptyState
        icon={isProjects ? "fas fa-project-diagram" : "fas fa-users"}
        title={`No ${isProjects ? 'projects' : 'developers'} found`}
        message="Try adjusting your filters or check back later for new opportunities."
        actionLabel="Clear Filters"
        onAction={() => window.location.search = ''}
      />
    );
  }

  return (
    <section 
      className="results-section"
      role="tabpanel"
      aria-labelledby={`${activeTab}-tab`}
      id={`${activeTab}-panel`}
    >
      {isProjects ? (
        <div className="projects-grid">
          {items.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="developers-grid">
          {items.map(developer => (
            <DeveloperCard key={developer.id} developer={developer} />
          ))}
        </div>
      )}
    </section>
  );
};

export default React.memo(Marketplace);