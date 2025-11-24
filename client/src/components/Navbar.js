import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [location]); // Re-check when route changes

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Enhanced logout function with loading state
  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    
    try {
      // Add a small delay for better UX
      await Promise.all([
        authAPI.logout(),
        new Promise(resolve => setTimeout(resolve, 800)) // Smooth transition
      ]);
      
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Reset states
      setUser(null);
      setIsLoggingOut(false);
      closeMenu();
      
      // Show success message
      console.log('✅ Logout successful');
      
      // Redirect to home page with smooth transition
      setTimeout(() => {
        navigate('/');
      }, 100);
      
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Still clear local storage even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsLoggingOut(false);
      navigate('/');
    }
  };

  // Get user initials for avatar
  const getUserInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  // Close menu when route changes
  useEffect(() => {
    closeMenu();
  }, [location]);

  // Close menu when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.navbar-container')) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Close menu on escape key press
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMenuOpen]);

  // Close menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 960 && isMenuOpen) {
        closeMenu();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMenuOpen]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          LocalDevHub
        </Link>
        
        <div 
          className="menu-icon" 
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              toggleMenu();
            }
          }}
        >
          <span className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></span>
        </div>
        
        <ul 
          className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}
          role="menu"
        >
          <li className="nav-item" role="none">
            <Link 
              to="/" 
              className="nav-links" 
              onClick={closeMenu}
              role="menuitem"
            >
              <i className="fas fa-home"></i> Home
            </Link>
          </li>
          <li className="nav-item" role="none">
            <Link 
              to="/marketplace" 
              className="nav-links" 
              onClick={closeMenu}
              role="menuitem"
            >
              <i className="fas fa-store"></i> Marketplace
            </Link>
          </li>
          <li className="nav-item" role="none">
            <Link 
              to="/submit-project" 
              className="nav-links" 
              onClick={closeMenu}
              role="menuitem"
            >
              <i className="fas fa-plus-circle"></i> Submit Project
            </Link>
          </li>
          <li className="nav-item" role="none">
            <Link 
              to="/join-developer" 
              className="nav-links" 
              onClick={closeMenu}
              role="menuitem"
            >
              <i className="fas fa-code"></i> Join as Developer
            </Link>
          </li>

          {/* Conditional rendering based on authentication */}
          {user ? (
            // User is logged in - show user-specific links
            <>
              <li className="nav-item" role="none">
                <Link 
                  to="/dashboard" 
                  className="nav-links" 
                  onClick={closeMenu}
                  role="menuitem"
                >
                  <i className="fas fa-tachometer-alt"></i> Dashboard
                </Link>
              </li>
              <li className="nav-item" role="none">
                <Link 
                  to="/profile" 
                  className="nav-links" 
                  onClick={closeMenu}
                  role="menuitem"
                >
                  <i className="fas fa-user"></i> Profile
                </Link>
              </li>
              <li className="nav-item" role="none">
                <button 
                  className={`nav-links nav-logout ${isLoggingOut ? 'loading' : ''}`}
                  onClick={handleLogout}
                  role="menuitem"
                  disabled={isLoggingOut}
                >
                  <span className="user-indicator">
                    <span className="user-avatar">
                      {getUserInitials(user.name)}
                    </span>
                    {isLoggingOut ? 'Logging out...' : `Logout (${user.name})`}
                  </span>
                </button>
              </li>
            </>
          ) : (
            // User is not logged in - show auth links
            <>
              <li className="nav-item" role="none">
                <Link 
                  to="/login" 
                  className="nav-links nav-login" 
                  onClick={closeMenu}
                  role="menuitem"
                >
                  <i className="fas fa-sign-in-alt"></i> Login
                </Link>
              </li>
              <li className="nav-item" role="none">
                <Link 
                  to="/signup" 
                  className="nav-links nav-signup" 
                  onClick={closeMenu}
                  role="menuitem"
                >
                  <i className="fas fa-user-plus"></i> Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Overlay for mobile menu */}
        {isMenuOpen && (
          <div 
            className="menu-overlay" 
            onClick={closeMenu}
            aria-hidden="true"
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;