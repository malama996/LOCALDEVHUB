import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">LocalDevHub</h3>
            <p className="footer-description">
              Connecting local developers with NGOs and SMEs to build meaningful software solutions 
              that make a difference in our communities.
            </p>
            <div className="social-links">
              <a href="https://github.com/yourusername/localdevhub" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-github"></i>
              </a>
              <a href="https://twitter.com/localdevhub" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://linkedin.com/company/localdevhub" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="mailto:contact@localdevhub.com">
                <i className="fas fa-envelope"></i>
              </a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-heading">Platform</h4>
            <ul className="footer-links">
              <li><a href="/marketplace">Browse Projects</a></li>
              <li><a href="/submit-project">Submit Project</a></li>
              <li><a href="/join-developer">Join as Developer</a></li>
              <li><a href="/dashboard">Dashboard</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-heading">Resources</h4>
            <ul className="footer-links">
              <li><a href="/how-it-works">How It Works</a></li>
              <li><a href="/pricing">Pricing</a></li>
              <li><a href="/success-stories">Success Stories</a></li>
              <li><a href="/blog">Blog</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-links">
              <li><a href="/help">Help Center</a></li>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © 2025 LocalDevHub. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
              <a href="/cookies">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
