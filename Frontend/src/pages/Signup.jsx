import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signupUser } from '../services/api';

/**
 * Signup Page Component
 * 
 * User registration page with form validation.
 * Includes password strength requirements and confirmation matching.
 * Redirects to login page upon successful registration.
 * 
 * @component
 */
export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await signupUser(email, password);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ minHeight: '100vh' }}>
      <div className="login-right" style={{ width: '100%' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          {/* Title */}
          <div className="login-title" style={{ display: 'block' }}>
            <h1>📋 Job Tracker</h1>
            <p>Start tracking your job search</p>
          </div>

          {/* Signup Card */}
          <div className="login-card">
            <h2 className="card-title">Create Account</h2>
            <p className="card-subtitle">Join hundreds tracking their job search</p>

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
                  minLength="6"
                  className="form-input"
                />
                <p style={{ fontSize: '0.75rem', color: '#505050', marginTop: '0.25rem' }}>At least 6 characters</p>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength="6"
                  className="form-input"
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            {/* Divider */}
            <div className="divider">
              <span className="divider-text">or</span>
            </div>

            {/* Sign In Link */}
            <p className="form-link">
              Already have an account?{' '}
              <Link to="/login">Sign in</Link>
            </p>
          </div>

          {/* Footer */}
          <p style={{ textAlign: 'center', color: '#505050', fontSize: '0.75rem', marginTop: '2rem' }}>
            By signing up, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
}
