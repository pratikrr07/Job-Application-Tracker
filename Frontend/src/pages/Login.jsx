import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';

/**
 * Login Page Component
 * 
 * Combines landing page content with login functionality.
 * Features a two-column layout on desktop (landing left, form right)
 * and single column on mobile (form only, centered).
 * 
 * @component
 */
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await loginUser(email, password);
      localStorage.setItem('token', response.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Side - Landing Content */}
      <div className="login-left">
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>📋</div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold' }}>Job Application Tracker</h1>
          <p style={{ fontSize: '1.25rem', color: '#a0a0a0', marginTop: '1rem' }}>Track your job search journey and monitor your progress</p>
        </div>

        <div className="login-features">
          <div className="login-feature">
            <div className="login-feature-icon">📝</div>
            <div>
              <h3>Track Applications</h3>
              <p>Log every job application with company, role, and status</p>
            </div>
          </div>

          <div className="login-feature">
            <div className="login-feature-icon">📊</div>
            <div>
              <h3>View Statistics</h3>
              <p>Get real-time insights on conversion rates and progress</p>
            </div>
          </div>

          <div className="login-feature">
            <div className="login-feature-icon">✏️</div>
            <div>
              <h3>Manage Easily</h3>
              <p>Edit and delete applications without page reloads</p>
            </div>
          </div>

          <div className="login-feature">
            <div className="login-feature-icon">🔐</div>
            <div>
              <h3>Secure & Private</h3>
              <p>Your data is encrypted and protected at all times</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(75, 85, 99, 0.5)' }}>
          <p style={{ color: '#a0a0a0' }}>Join hundreds tracking their job search</p>
          <p style={{ color: '#06b6d4', fontSize: '0.875rem', marginTop: '0.5rem' }}>✓ Free • ✓ Secure • ✓ No Credit Card Required</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-right">
        <div style={{ width: '100%', maxWidth: '420px' }}>
          {/* Mobile Title */}
          <div className="login-title">
            <h1>📋 Job Tracker</h1>
            <p>Track your job search journey</p>
          </div>

          {/* Login Card */}
          <div className="login-card">
            <h2 className="card-title">Welcome Back</h2>
            <p className="card-subtitle">Sign in to your account</p>

            <form onSubmit={handleSubmit} className="job-form">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div className="divider">
              <span className="divider-text">or</span>
            </div>

            {/* Sign Up Link */}
            <p className="form-link">
              Don't have an account?{' '}
              <Link to="/signup">Create one</Link>
            </p>
          </div>

          {/* Footer */}
          <p style={{ textAlign: 'center', color: '#505050', fontSize: '0.75rem', marginTop: '2rem' }}>
            By signing in, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
}
