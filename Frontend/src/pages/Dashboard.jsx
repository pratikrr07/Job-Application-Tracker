import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JobForm from '../components/JobForm';
import JobCard from '../components/JobCard';
import JobStats from '../components/JobStats';
import { getJobs } from '../services/api';

/**
 * Dashboard Page Component
 * 
 * Main application hub displaying job application statistics,
 * form to add new applications, and grid of all job cards.
 * Includes filtering by status and automatic token validation.
 * 
 * @component
 */
export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const data = await getJobs(token);
      setJobs(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleJobCreated = () => {
    fetchJobs();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const filteredJobs = filter === 'All' 
    ? jobs 
    : jobs.filter(job => job.status === filter);

  const statuses = ['All', 'Applied', 'Interview', 'Offer', 'Rejected', 'Accepted'];

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <h1 className="dashboard-title">📋 Job Tracker</h1>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {/* Stats Section */}
        <section className="section">
          <JobStats />
        </section>

        {/* Form Section */}
        <section className="card" style={{ marginBottom: '2rem' }}>
          <h2 className="section-title">Add New Application</h2>
          <JobForm onJobCreated={handleJobCreated} />
        </section>

        {/* Jobs List Section */}
        <section className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Applications</h2>
            <span className="count-badge">{filteredJobs.length}</span>
          </div>

          {/* Filter Buttons */}
          <div className="filter-buttons">
            {statuses.map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`filter-btn ${filter === status ? 'active' : ''}`}
              >
                {status}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="loading">Loading...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : filteredJobs.length === 0 ? (
            <p className="empty">No applications yet. Add one to get started!</p>
          ) : (
            <div className="jobs-grid">
              {filteredJobs.map(job => (
                <JobCard 
                  key={job._id} 
                  job={job} 
                  onJobUpdated={handleJobCreated} 
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
