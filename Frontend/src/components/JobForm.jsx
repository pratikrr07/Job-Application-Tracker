import { useState } from 'react';
import { createJob } from '../services/api';

/**
 * JobForm Component
 * 
 * Form for creating new job applications.
 * Includes validation and automatic form reset after submission.
 * Status defaults to 'Applied' for new entries.
 * 
 * @component
 * @param {Function} onJobCreated - Callback function triggered after successful job creation
 */
export default function JobForm({ onJobCreated }) {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    status: 'Applied',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const statuses = ['Applied', 'Interview', 'Offer', 'Rejected', 'Accepted'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await createJob(formData, token);
      setFormData({ company: '', role: '', status: 'Applied', notes: '' });
      onJobCreated();
    } catch (err) {
      setError(err.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="job-form">
      <div className="form-row">
        <div className="form-group">
          <input
            type="text"
            name="company"
            placeholder="Company Name"
            value={formData.company}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="role"
            placeholder="Job Role"
            value={formData.role}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
      </div>

      <div className="form-group">
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="form-select"
        >
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <textarea
          name="notes"
          placeholder="Notes (optional)"
          value={formData.notes}
          onChange={handleChange}
          rows="2"
          className="form-textarea"
        />
      </div>

      {error && <p className="error-message">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? 'Creating...' : 'Add Application'}
      </button>
    </form>
  );
}
