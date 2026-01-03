import { useState, useEffect } from 'react';
import { getStats } from '../services/api';

/**
 * JobStats Component
 * 
 * Displays job application statistics and conversion metrics.
 * Shows total counts per status and calculates conversion rates
 * for interview, offer, and acceptance percentages.
 * 
 * @component
 */
export default function JobStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await getStats(token);
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="loading">Loading statistics...</p>;
  if (!stats) return <p className="error">Failed to load statistics</p>;

  const interviewRate = stats.total > 0 ? Math.round((stats.interviews / stats.total) * 100) : 0;
  const offerRate = stats.total > 0 ? Math.round((stats.offers / stats.total) * 100) : 0;
  const acceptanceRate = stats.offers > 0 ? Math.round((stats.accepted / stats.offers) * 100) : 0;

  const statCards = [
    { label: 'Total', value: stats.total, icon: '📊' },
    { label: 'Applied', value: stats.applied, icon: '✍️' },
    { label: 'Interview', value: stats.interviews, icon: '🎤' },
    { label: 'Offers', value: stats.offers, icon: '🎁' },
    { label: 'Accepted', value: stats.accepted, icon: '✅' },
    { label: 'Rejected', value: stats.rejected, icon: '❌' }
  ];

  return (
    <div>
      <div className="stats-grid">
        {statCards.map((card, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-icon">{card.icon}</div>
            <div className="stat-value">{card.value}</div>
            <div className="stat-label">{card.label}</div>
          </div>
        ))}
      </div>
      
      {/* Conversion Metrics */}
      <div className="conversion-stats">
        <div className="conversion-card">
          <p className="conversion-label">Interview Conversion</p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${interviewRate}%` }}></div>
          </div>
          <p className="progress-value">{interviewRate}%</p>
        </div>
        
        <div className="conversion-card">
          <p className="conversion-label">Offer Rate</p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${offerRate}%`, background: 'linear-gradient(90deg, #16a34a 0%, #10b981 100%)' }}></div>
          </div>
          <p className="progress-value" style={{ color: '#16a34a' }}>{offerRate}%</p>
        </div>
        
        <div className="conversion-card">
          <p className="conversion-label">Acceptance Rate</p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${acceptanceRate}%`, background: 'linear-gradient(90deg, #10b981 0%, #14b8a6 100%)' }}></div>
          </div>
          <p className="progress-value" style={{ color: '#10b981' }}>{acceptanceRate}%</p>
        </div>
      </div>
    </div>
  );
}
