import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  }, [error]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });
      
      // Store authentication data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Navigate to dashboard
      navigate('/dashboard', { replace: true });
      
    } catch (err) {
      const errorMessage = err.response?.data?.message 
        || err.message 
        || 'Login failed. Please try again.';
      setError(errorMessage);
      
      // Log error for monitoring
      console.error('Login error:', {
        email: formData.email,
        error: err.response?.data || err.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  }, [formData.email, formData.password, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your LocalDevHub account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {error && (
            <div 
              className="error-message" 
              role="alert"
              aria-live="polite"
            >
              <i className="fas fa-exclamation-circle" aria-hidden="true"></i>
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className={error ? 'error' : ''}
              autoComplete="email"
              aria-describedby={error ? "error-message" : undefined}
              aria-invalid={!!error}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className={error ? 'error' : ''}
              autoComplete="current-password"
              aria-describedby={error ? "error-message" : undefined}
              aria-invalid={!!error}
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="auth-button" 
            disabled={loading || !formData.email || !formData.password}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <span className="spinner" aria-hidden="true"></span>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="auth-link"
              tabIndex={loading ? -1 : 0}
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Login);