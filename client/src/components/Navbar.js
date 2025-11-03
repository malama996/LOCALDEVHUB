import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          LocalDevHub
        </Link>
        
        <div className="menu-icon" onClick={toggleMenu}>
          <span className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></span>
        </div>
        
        <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={toggleMenu}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/marketplace" className="nav-links" onClick={toggleMenu}>
              Marketplace
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/submit-project" className="nav-links" onClick={toggleMenu}>
              Submit Project
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/join-developer" className="nav-links" onClick={toggleMenu}>
              Join as Developer
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/dashboard" className="nav-links" onClick={toggleMenu}>
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/login" className="nav-links nav-login" onClick={toggleMenu}>
              Login
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/signup" className="nav-links nav-signup" onClick={toggleMenu}>
              Sign Up
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
